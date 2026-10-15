"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaAward,
  FaCalendarCheck,
  FaPhoneAlt,
  FaPlayCircle,
  FaUsers,
  FaArrowRight,
  FaHeartbeat,
  FaShieldAlt,
} from "react-icons/fa";
import { BsStarFill, BsClock } from "react-icons/bs";

const HeroSection = () => {
  const [modal, setModal] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <div>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60"
      >
        {/* ============ DECORATIVE BLOBS ============ */}
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
            {/* ============ LEFT CONTENT ============ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
                <FaAward className="text-amber-500" />
                Legacy of Care Since 2000
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
                Excellence in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Healthcare
                </span>{" "}
                & Medical Innovation
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
                SMS Hospital is Gorakhpur's most trusted institution — where
                advanced technology and expert specialists come together to
                provide you with world-class treatment.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <BsStarFill
                          key={s}
                          className="text-amber-400 text-xs"
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      25K+ Happy Patients
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FaShieldAlt className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">
                      NABH Certified
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Trusted Quality
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <FaCalendarCheck />
                  Book Appointment
                  <FaArrowRight
                    size={12}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  onClick={() => setModal(true)}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-600 text-sm sm:text-base font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <FaPlayCircle className="text-lg group-hover:scale-110 transition-transform" />
                  Explore Campus
                </button>
              </div>

              {/* Quick Stats (mobile/tablet) */}
              <div className="flex md:hidden items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">50+</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Doctors
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">20+</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Departments
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800">24/7</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Emergency
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ============ RIGHT IMAGE ============ */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative order-1 lg:order-2"
            >
              {/* Main Image Container */}
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-cyan-400/10 blur-2xl" />

                <div className="group relative overflow-hidden rounded-[2rem] shadow-2xl">
                  <img
                    src="images/img/hospital/hospital.jpeg"
                    alt="SMS Hospital Main Building"
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>

                {/* ============ EMERGENCY BADGE ============ */}
                <button
                  onClick={() => setShowEmergency(true)}
                  className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[11px] font-black rounded-full shadow-xl shadow-rose-500/40 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer ring-4 ring-white/20"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  24/7 EMERGENCY
                </button>

                {/* ============ FLOATING STATS CARD ============ */}
                <div className="hidden md:block absolute -bottom-6 -left-6 lg:-left-12 z-20">
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-5 hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <FaUsers className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-slate-800 leading-none">
                          25K+
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-1">
                          Patients Served
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ============ FLOATING AVAILABILITY CARD ============ */}
                <div className="hidden lg:block absolute -top-4 -left-4 z-20">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl px-4 py-3 flex items-center gap-3 hover:-translate-y-1 transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <BsClock className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-tight">
                        Available Now
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Doctors Online
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ VIDEO MODAL ============ */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setModal(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-95 z-10 cursor-pointer"
                aria-label="Close video"
              >
                ✕
              </button>

              {/* Video Container */}
              <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">
                <div className="relative w-full aspect-video">
                  <video
                    src="/videos/SMS_Hospital_Campus_Tour.mp4"
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ EMERGENCY MODAL ============ */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmergency(false)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl overflow-hidden"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />

              {/* Close Button */}
              <button
                onClick={() => setShowEmergency(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all active:scale-95 cursor-pointer text-sm"
              >
                ✕
              </button>

              {/* Icon */}
              <div className="text-center mb-6">
                <div className="relative inline-flex">
                  <span className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/40">
                    <FaPhoneAlt className="text-white text-2xl animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mt-5">
                  Emergency Help
                </h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                  Our medical team is available{" "}
                  <span className="font-bold text-rose-600">24/7</span> for
                  immediate assistance.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-3">
                <a
                  href="tel:+919876543210"
                  className="group flex items-center justify-between bg-rose-50 border border-rose-100 p-4 rounded-2xl hover:bg-rose-600 hover:border-rose-600 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <FaPhoneAlt />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 group-hover:text-white/80 transition-colors">
                        Ambulance
                      </p>
                      <p className="text-base font-black text-slate-800 group-hover:text-white transition-colors">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>

                  <FaArrowRight className="text-rose-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href="tel:0112345678"
                  className="group flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-slate-900 hover:border-slate-900 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <FaPhoneAlt />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-white/80 transition-colors">
                        Reception
                      </p>
                      <p className="text-base font-black text-slate-800 group-hover:text-white transition-colors">
                        011-2345678
                      </p>
                    </div>
                  </div>

                  <FaArrowRight className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2 mt-5 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <FaHeartbeat className="text-amber-500 text-sm mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  For life-threatening emergencies, call immediately. Calling
                  charges may apply as per your service provider.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
