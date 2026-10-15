"use client";
import React from "react";
import Link from "next/link";
import {
  FaHeartbeat,
  FaUserMd,
  FaAward,
  FaHospital,
  FaAmbulance,
  FaMicroscope,
  FaHandHoldingHeart,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { BsShieldCheck, BsClock, BsPeople, BsStar } from "react-icons/bs";
import { motion } from "framer-motion";
import Header from "components/Header";
import Footer from "components/Footer";

const STATS = [
  { value: "10+", label: "Years of Service", icon: FaAward },
  { value: "15+", label: "Expert Doctors", icon: FaUserMd },
  { value: "100K+", label: "Happy Patients", icon: FaHandHoldingHeart },
  { value: "24/7", label: "Emergency Care", icon: FaAmbulance },
];

const VALUES = [
  {
    icon: FaHandHoldingHeart,
    title: "Compassionate Care",
    description:
      "Every patient is treated with dignity, empathy, and respect — because healing begins with kindness.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: FaMicroscope,
    title: "Advanced Technology",
    description:
      "State-of-the-art medical equipment and modern diagnostic tools for accurate and faster treatment.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: BsShieldCheck,
    title: "Trusted & Reliable",
    description:
      "Years of trusted service to the community with a commitment to ethical and transparent healthcare.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: BsClock,
    title: "24/7 Availability",
    description:
      "Round-the-clock emergency services, ICU, and critical care for any medical need, anytime.",
    color: "from-amber-500 to-orange-600",
  },
];

const DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "General Medicine",
  "General Surgery",
  "Urology",
  "ENT",
  "Dental",
  "Psychiatry",
  "Pathology",
];

const WHY_US = [
  "NABH & ISO certified hospital with world-class standards",
  "Experienced team of specialists across 20+ departments",
  "Advanced ICU, NICU, and modern operation theatres",
  "Affordable treatment with transparent billing",
  "Free health check-up camps for the community",
  "Digital patient records & online appointment booking",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* ==================== HERO ==================== */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Blobs */}
          <div className="absolute top-0 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest"
            >
              <FaHeartbeat className="text-rose-400" />
              About SMS Hospital
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl md:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Caring for Gorakhpur,
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                One Life at a Time.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed"
            >
              SMS Hospital is Gorakhpur's most trusted super-speciality
              hospital, committed to delivering world-class medical care with
              compassion, integrity, and innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Book Appointment
                <FaArrowRight size={14} />
              </Link>

              <Link
                href="/departments"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95"
              >
                Our Departments
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ==================== STATS ==================== */}
        <section className="relative -mt-12 z-10 max-w-7xl mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-3">
                    <Icon size={20} />
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-slate-900">
                    {s.value}
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">
                    {s.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ==================== WHO WE ARE ==================== */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="images/img/hospital/hospital.jpeg"
                    alt="Hospital building"
                    className="rounded-3xl shadow-lg w-full h-64 object-cover"
                  />
                  <img
                    src="images/img/26jan/img3.jpeg"
                    alt="Doctors team"
                    className="rounded-3xl shadow-lg w-full h-40 object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="images/img/hospital/WhatsApp Image 2026-01-28 at 5.36.49 PM (1).jpeg"
                    alt="Medical equipment"
                    className="rounded-3xl shadow-lg w-full h-40 object-cover"
                  />
                  <img
                    src="images/img/hospital/WhatsApp Image 2026-01-28 at 6.10.03 PM (1).jpeg"
                    alt="Patient care"
                    className="rounded-3xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-slate-100 px-6 py-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  <BsStar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Trusted by
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    1 Lakh+ Patients
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
                Who We Are
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                A Legacy of Healing
                <br />
                and Hope.
              </h2>

              <p className="mt-6 text-slate-600 leading-relaxed">
                Founded with a vision to serve the community, SMS Hospital has
                grown into one of Gorakhpur's most respected super-speciality
                hospitals. Our team of dedicated doctors, nurses, and support
                staff work around the clock to bring advanced medical care to
                every doorstep.
              </p>

              <p className="mt-4 text-slate-600 leading-relaxed">
                From routine check-ups to complex surgeries, we combine modern
                technology with genuine compassion — because every patient
                deserves the very best.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <FaHospital className="text-blue-600 text-2xl mb-2" />
                  <p className="font-bold text-slate-800">10+ Departments</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comprehensive medical services
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <FaAmbulance className="text-rose-600 text-2xl mb-2" />
                  <p className="font-bold text-slate-800">24/7 Emergency</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Always ready to serve you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== OUR VALUES ==================== */}
        <section className="py-20 md:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
                Our Core Values
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                What Makes Us Different
              </h2>
              <p className="mt-4 text-slate-500">
                Four pillars that define every moment of care we provide.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={i}
                    variants={item}
                    className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      {v.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {v.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ==================== DEPARTMENTS ==================== */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
                Our Specialities
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Departments We Serve
              </h2>
              <p className="mt-4 text-slate-500">
                From routine care to critical treatment — we've got you covered.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {DEPARTMENTS.map((dept, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-slate-100 hover:border-transparent transition-all duration-300 cursor-pointer"
                >
                  <FaCheckCircle className="text-blue-600 group-hover:text-white transition-colors shrink-0" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">
                    {dept}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/departments"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                View All Departments
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== WHY CHOOSE US ==================== */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute top-0 -right-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-300 font-bold uppercase text-xs tracking-[0.3em]">
                Why Choose Us
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Healthcare You Can
                <br />
                Truly Trust.
              </h2>
              <p className="mt-6 text-blue-100 leading-relaxed">
                We are more than just a hospital — we are your partner in
                health. Here's why thousands of families trust us with their
                loved ones.
              </p>

              <div className="mt-8 space-y-3">
                {WHY_US.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 text-white"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheckCircle className="text-emerald-400 text-xs" />
                    </div>
                    <p className="text-sm text-blue-50 leading-relaxed">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BsPeople, label: "Expert Doctors", value: "15+" },
                { icon: FaAward, label: "Years Trusted", value: "10+" },
                { icon: FaAmbulance, label: "Ambulances", value: "10+" },
                { icon: BsClock, label: "Emergency", value: "24/7" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all"
                  >
                    <Icon className="text-blue-300 text-3xl mx-auto mb-3" />
                    <p className="text-3xl font-black text-white">{s.value}</p>
                    <p className="text-xs font-semibold text-blue-200 mt-1 uppercase tracking-wide">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-2xl shadow-rose-500/30 mb-6">
              <FaHeartbeat size={28} />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Your Health, Our Priority.
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">
              Book an appointment with one of our specialists today and
              experience healthcare the way it should be.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Book Appointment
                <FaArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
