"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaAmbulance,
  FaPaperPlane,
  FaCheckCircle,
  FaUser,
  FaCommentDots,
  FaWhatsapp,
} from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import Header from "components/Header";
import Footer from "components/Footer";

const WHATSAPP_NUMBER = "7905040626";

const CONTACT_INFO = [
  {
    icon: FaMapMarkerAlt,
    label: "Visit Us",
    value:
      "Plot No. 474 Gayatripuram, Near HDFC Bank, Nakaha No.1, Gorakhpur - 273004",
    color: "from-blue-500 to-indigo-600",
    href: "https://maps.google.com/?q=SMS+Hospital+Gorakhpur",
  },
  {
    icon: FaPhoneAlt,
    label: "Call Us",
    value: "+91 630 773 0544",
    extra: "+91 638 672 0220",
    color: "from-emerald-500 to-teal-600",
    href: "tel:+916307730544",
  },
  {
    icon: FaEnvelope,
    label: "Email Us",
    value: "info@smshospital.com",
    color: "from-violet-500 to-purple-600",
    href: "mailto:info@smshospital.com",
  },
  {
    icon: FaClock,
    label: "Working Hours",
    value: "Mon - Sat: 9:00 AM - 9:00 PM",
    extra: "Emergency: 24/7 Available",
    color: "from-amber-500 to-orange-600",
  },
];

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "You can book an appointment online through our website by clicking on 'Book Appointment' or by calling us directly at +91 630 773 0544.",
  },
  {
    q: "Do you provide emergency services?",
    a: "Yes, we have 24/7 emergency services available with fully equipped ambulances and ICU facilities.",
  },
  {
    q: "Is the hospital cashless for insurance?",
    a: "We accept most major insurance providers. Please contact our front desk for the complete list of empanelled insurance companies.",
  },
  {
    q: "What are the OPD timings?",
    a: "Our OPD runs from 9:00 AM to 9:00 PM, Monday through Saturday. Sunday OPD is available on appointment basis.",
  },
];

// ✅ Validation rules
const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!value?.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name is too short";
      return "";
    case "phone":
      if (!value?.trim()) return "Phone is required";
      if (!/^[0-9]{10}$/.test(value)) return "Enter a valid 10-digit number";
      return "";
    case "email":
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Enter a valid email";
      return "";
    case "message":
      if (!value?.trim()) return "Message is required";
      if (value.trim().length < 10) return "Message is too short";
      return "";
    default:
      return "";
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    // Validate on change (if touched)
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const newErrors = {};
    ["name", "phone", "email", "message"].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      email: true,
      message: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!validateAll()) {
      Swal.fire({
        icon: "error",
        title: "Please check the form",
        text: "Some fields need your attention.",
        confirmButtonColor: "#e11d48",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-semibold",
        },
      });
      return;
    }

    try {
      setLoading(true);

      // 📱 WhatsApp message compose
      const waMessage = `🏥 *New Contact Enquiry — SMS Hospital*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
${formData.email ? `✉️ *Email:* ${formData.email}\n` : ""}${
        formData.subject
          ? `📋 *Subject:* ${
              {
                appointment: "Appointment Inquiry",
                emergency: "Emergency",
                billing: "Billing & Insurance",
                feedback: "Feedback",
                other: "Other",
              }[formData.subject] || formData.subject
            }\n`
          : ""
      }
💬 *Message:*
${formData.message}`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        waMessage,
      )}`;

      // 🚀 Open WhatsApp
      window.open(waUrl, "_blank");

      // ✅ Success alert
      await Swal.fire({
        icon: "success",
        title: "Message Ready!",
        html: `
          <p style="color: #64748b; font-size: 14px;">
            Your message has been prepared. Click <b>Send</b> in WhatsApp to deliver it to our team.
          </p>
        `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#059669",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-semibold",
        },
      });

      toast.success("Redirected to WhatsApp!");

      // Reset
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#e11d48",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-semibold",
        },
      });
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* ==================== HERO ==================== */}
        <section className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="absolute top-0 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest"
            >
              <FaCommentDots className="text-blue-300" />
              Get In Touch
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl md:text-6xl font-black text-white tracking-tight leading-tight"
            >
              We're Here to{" "}
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Help You.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-2xl mx-auto text-lg text-blue-100"
            >
              Have a question, feedback, or need medical assistance? Reach out
              to us — our team is available 24/7.
            </motion.p>
          </div>
        </section>

        {/* ==================== QUICK CONTACT CARDS ==================== */}
        <section className="relative -mt-12 z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              const Wrapper = info.href ? "a" : "div";
              const wrapperProps = info.href
                ? {
                    href: info.href,
                    target: info.href.startsWith("http") ? "_blank" : undefined,
                    rel: "noopener noreferrer",
                  }
                : {};

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Wrapper
                    {...wrapperProps}
                    className="block bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={18} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      {info.label}
                    </p>
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {info.value}
                    </p>
                    {info.extra && (
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {info.extra}
                      </p>
                    )}
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ==================== FORM + MAP ==================== */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
            {/* ============ FORM ============ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8"
            >
              <div className="mb-6">
                <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
                  Send a Message
                </span>
                <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Let's Talk
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Fill out the form below — we'll get your message on WhatsApp
                  instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldWrapper
                    label="Full Name *"
                    error={touched.name && errors.name}
                  >
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          touched.name && errors.name
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                  </FieldWrapper>

                  <FieldWrapper
                    label="Phone *"
                    error={touched.phone && errors.phone}
                  >
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={10}
                        placeholder="9876543210"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          touched.phone && errors.phone
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                  </FieldWrapper>
                </div>

                {/* Email */}
                <FieldWrapper
                  label="Email"
                  error={touched.email && errors.email}
                >
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="john@example.com"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                        touched.email && errors.email
                          ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                  </div>
                </FieldWrapper>

                {/* Subject */}
                <FieldWrapper label="Subject">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition bg-white cursor-pointer"
                  >
                    <option value="">Select a topic</option>
                    <option value="appointment">Appointment Inquiry</option>
                    <option value="emergency">Emergency</option>
                    <option value="billing">Billing & Insurance</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </FieldWrapper>

                {/* Message */}
                <FieldWrapper
                  label="Message *"
                  error={touched.message && errors.message}
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition resize-none ${
                      touched.message && errors.message
                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                </FieldWrapper>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaWhatsapp
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                      Send via WhatsApp
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2">
                  <BsShieldCheck className="text-emerald-500" />
                  Your information is safe and confidential
                </p>
              </form>
            </motion.div>

            {/* ============ MAP + INFO ============ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-xl h-80 md:h-130 bg-slate-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.3780971529477!2d83.3715089145963!3d26.79608707029467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399145b0980ccc2d%3A0x832f772d32cada49!2sSuper%20Medical%20Speciality%20Hospital%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1792062853754!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="SMS Hospital Location"
                />
              </div>

              {/* Emergency card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-xl shadow-rose-500/20">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />

                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <FaAmbulance size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-90">
                      24/7 Emergency Helpline
                    </p>
                    <p className="text-2xl font-black mt-1">+91 630 773 0544</p>
                    <p className="text-xs opacity-90 mt-2 leading-relaxed">
                      For any medical emergency, call us immediately. Our
                      ambulance is ready 24/7.
                    </p>

                    <a
                      href="tel:+916307730544"
                      className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-50 transition shadow-lg active:scale-95"
                    >
                      <FaPhoneAlt size={12} />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="py-20 md:py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-slate-500">
                Quick answers to the questions we get asked the most.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;

                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-blue-200 shadow-lg"
                        : "border-slate-100 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 text-sm md:text-base flex-1">
                        {faq.q}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isOpen
                            ? "bg-blue-600 text-white rotate-45"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <p className="px-5 md:px-6 pb-5 text-sm text-slate-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Ready to Book an Appointment?
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Skip the line — book your appointment online in just a few clicks.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Book Appointment
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ==================== SUB COMPONENT ==================== */
const FieldWrapper = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
      {label}
    </label>
    {children}
    {error && (
      <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-rose-500" />
        {error}
      </p>
    )}
  </div>
);
