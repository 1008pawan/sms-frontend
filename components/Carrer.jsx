"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BsBriefcase, BsMortarboard, BsShieldCheck } from "react-icons/bs";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaFileAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Header from "components/Header";
import Footer from "components/Footer";
import api from "./Api/publicApi";

const PERKS = [
  {
    title: "Growth Opportunities",
    description:
      "Continuous learning, training programs, and career advancement paths.",
    icon: "📈",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Competitive Salary",
    description:
      "Industry-leading compensation with performance-based incentives.",
    icon: "💰",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Supportive Environment",
    description:
      "A collaborative culture where your contribution truly matters.",
    icon: "🤝",
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Work-Life Balance",
    description: "Flexible schedules and generous leave policies for our team.",
    icon: "⚖️",
    color: "from-amber-500 to-orange-600",
  },
];

const SPECIALIZATIONS = [
  "General Medicine",
  "Surgery",
  "Nursing",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Radiology",
  "Pathology",
  "Administration",
  "Staff",
  "Other",
];

const validateField = (name, value) => {
  switch (name) {
    case "fullName":
      if (!value?.trim()) return "Full name is required";
      if (value.trim().length < 2) return "Name is too short";
      return "";
    case "email":
      if (!value?.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Enter a valid email";
      return "";
    case "phoneNumber":
      if (!value?.trim()) return "Phone number is required";
      if (!/^[0-9]{10}$/.test(value)) return "Enter a valid 10-digit number";
      return "";
    case "specialization":
      if (!value?.trim()) return "Specialization is required";
      return "";
    default:
      return "";
  }
};

export default function CareerPage() {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [resumeUrl, setResumeUrl] = useState(null);
  const [carrerData, setCarrerData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    applicationType: "Full-time Job",
    specialization: "General Medicine",
  });

  const carrer = async (data) => {
    const res = await api.post("/carrer/add", data);
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: carrer,

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        html: `
          <p style="color: #64748b; font-size: 14px;">
            Thank you for applying. Our HR team will review your application and get back to you soon.
          </p>
        `,
        confirmButtonText: "Great!",
        confirmButtonColor: "#059669",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-semibold",
        },
      });

      setCarrerData({
        fullName: "",
        email: "",
        phoneNumber: "",
        applicationType: "Full-time Job",
        specialization: "General Medicine",
      });
      setResumeUrl(null);
      setErrors({});
      setTouched({});

      // Reset file input
      const fileInput = document.getElementById("resume");
      if (fileInput) fileInput.value = "";
    },

    onError: (error) => {
      const errData = error?.response?.data;

      // Field errors from backend
      if (errData?.errors) {
        setErrors(errData.errors);
      }

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          errData?.message ||
          "Something went wrong. Please check the form and try again.",
        confirmButtonColor: "#e11d48",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl font-semibold",
        },
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarrerData((p) => ({ ...p, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const newErrors = {};
    ["fullName", "email", "phoneNumber", "specialization"].forEach((field) => {
      const err = validateField(field, carrerData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phoneNumber: true,
      specialization: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateAll()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", carrerData.fullName);
    formData.append("email", carrerData.email);
    formData.append("phoneNumber", carrerData.phoneNumber);
    formData.append("applicationType", carrerData.applicationType);
    formData.append("specialization", carrerData.specialization);

    if (resumeUrl) {
      formData.append("resume", resumeUrl);
    }

    mutate(formData);
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen">
        {/* ==================== HERO ==================== */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="absolute top-0 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest"
            >
              <BsBriefcase className="text-blue-300" />
              Join Our Team
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl md:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Build Your Career
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                With Purpose.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-2xl mx-auto text-lg text-blue-100"
            >
              Join SMS Hospital — where every role contributes to healing lives
              and serving our community with excellence.
            </motion.p>
          </div>
        </section>

        {/* ==================== PERKS ==================== */}
        <section className="relative -mt-10 z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERKS.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{perk.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {perk.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ==================== FORM ==================== */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-slate-900 to-blue-900 p-6 md:p-8 text-white overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />

                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    Application Form
                  </h2>
                  <p className="text-sm text-blue-100 mt-1">
                    Fill in your details below — our HR team will reach out
                    within 3-5 working days.
                  </p>
                </div>
              </div>

              {/* Form Body */}
              <form
                onSubmit={handleSubmit}
                className="p-6 md:p-8 space-y-6"
                noValidate
              >
                {/* ============ Application Type ============ */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                    Application Type *
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "Full-time Job", Icon: BsBriefcase },
                      { type: "Internship", Icon: BsMortarboard },
                    ].map(({ type, Icon }) => {
                      const isActive = carrerData.applicationType === type;
                      return (
                        <label key={type} className="cursor-pointer">
                          <input
                            type="radio"
                            name="applicationType"
                            checked={isActive}
                            onChange={() =>
                              setCarrerData((p) => ({
                                ...p,
                                applicationType: type,
                              }))
                            }
                            className="hidden peer"
                          />
                          <div
                            className={`rounded-2xl p-4 border-2 text-center transition-all ${
                              isActive
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                                : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                            }`}
                          >
                            <Icon
                              className={`mx-auto text-2xl mb-2 ${
                                isActive ? "text-white" : "text-blue-600"
                              }`}
                            />
                            <span className="text-sm font-bold">{type}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ============ Form Grid ============ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <FieldWrapper
                    label="Full Name *"
                    error={
                      touched.fullName &&
                      (errors.fullName || errors?.errors?.fullName)
                    }
                  >
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        name="fullName"
                        value={carrerData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          touched.fullName && errors.fullName
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Email */}
                  <FieldWrapper
                    label="Email Address *"
                    error={
                      touched.email && (errors.email || errors?.errors?.email)
                    }
                  >
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={carrerData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="abc@example.com"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          touched.email && errors.email
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Phone */}
                  <FieldWrapper
                    label="Phone Number *"
                    error={
                      touched.phoneNumber &&
                      (errors.phoneNumber || errors?.errors?.phoneNumber)
                    }
                  >
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={carrerData.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) {
                            setCarrerData((p) => ({
                              ...p,
                              phoneNumber: value,
                            }));
                            if (touched.phoneNumber) {
                              setErrors((prev) => ({
                                ...prev,
                                phoneNumber: validateField(
                                  "phoneNumber",
                                  value,
                                ),
                              }));
                            }
                          }
                        }}
                        onBlur={handleBlur}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          touched.phoneNumber && errors.phoneNumber
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Specialization */}
                  <FieldWrapper
                    label="Specialization *"
                    error={
                      touched.specialization &&
                      (errors.specialization || errors?.errors?.specialization)
                    }
                  >
                    <select
                      name="specialization"
                      value={carrerData.specialization}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition bg-white cursor-pointer"
                    >
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </FieldWrapper>
                </div>

                {/* ============ Resume Upload ============ */}
                <FieldWrapper
                  label="Upload Resume (PDF) *"
                  error={errors?.errors?.resumeUrl}
                >
                  <label
                    htmlFor="resume"
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      resumeUrl
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30"
                    }`}
                  >
                    {resumeUrl ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <FaCheckCircle className="text-emerald-600 text-xl" />
                        </div>
                        <p className="text-sm font-bold text-emerald-700 truncate max-w-full px-2">
                          {resumeUrl.name}
                        </p>
                        <p className="text-xs text-emerald-600">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaFileAlt className="text-blue-600 text-xl" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          Click to upload your resume
                        </p>
                        <p className="text-xs text-slate-400">
                          PDF only — Max size 5MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (!f) return;
                        if (f.type !== "application/pdf") {
                          toast.error("Only PDF files are allowed");
                          e.target.value = "";
                          return;
                        }
                        if (f.size > 5 * 1024 * 1024) {
                          toast.error("File size must be under 5MB");
                          e.target.value = "";
                          return;
                        }
                        setResumeUrl(f);
                      }}
                      className="hidden"
                    />
                  </label>
                </FieldWrapper>

                {/* ============ Info Box ============ */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <BsShieldCheck className="text-blue-600 text-xl shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Your application and personal details are kept strictly
                    confidential. Our HR team reviews every application
                    carefully.
                  </p>
                </div>

                {/* ============ Submit ============ */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="group w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <FaArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
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
