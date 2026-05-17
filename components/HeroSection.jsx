"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAward,
  FaCalendarCheck,
  FaPhoneAlt,
  FaPlayCircle,
  FaUsers,
} from "react-icons/fa";

const HeroSection = () => {
  const [modal, setModal] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <div>
      <section
        id="home"
        className="relative overflow-hidden pt-10 pb-10
        bg-[radial-gradient(circle_at_top_right,#e3f2fd,transparent),radial-gradient(circle_at_bottom_left,#e0f7fa,transparent)]"
      >
        <div className="opacity-0 scale-90 animate-[zoomOutFade_2s_ease_forwards]">
          <div className="max-w-7xl mx-auto md:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              {/* <!-- Left Content --> */}
              <div data-aos="fade-up">
                <h6 className="text-blue-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <FaAward />
                  Legacy of Care
                </h6>

                <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Excellence in <br />
                  <span className=" bg-gradient-to-r from-blue-500 to-[#00d0ff] bg-clip-text text-transparent">
                    Healthcare & Medical
                  </span>
                  <br />
                  Innovation
                </h1>

                <p className="text-lg text-gray-500 mb-8">
                  SMS Hospital: Gorakhpur’s most trusted institution, where
                  advanced technology and expert specialists come together to
                  provide you with world-class treatment.
                </p>

                <div className="flex flex-nowrap md:gap-4 gap-2">
                  <a
                    href="/login"
                    className="bg-darkNavy text-white rounded-full md:px-8 px-4 md:py-4 py-2 text-lg font-semibold
                      transition-all duration-300  bg-gray-900 hover:bg-blue-500 text-blue-500 hover:-translate-y-0.5
                      hover:shadow-[0_10px_20px_rgba(13,110,253,0.2)] flex items-center"
                  >
                    <span>
                      <FaCalendarCheck className="mr-2" />
                    </span>
                    <p>Book Appointment</p>
                  </a>

                  <button
                    onClick={() => setModal(true)}
                    className="border-2 border-gray-800 text-gray-800 rounded-full md:px-8 px-4 md:py-4 py-2 text-lg
                      font-semibold transition hover:bg-gray-900 hover:text-white flex items-center cursor-pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#tourModal"
                  >
                    <FaPlayCircle className="mr-2" />
                    Explore Campus
                  </button>
                </div>
              </div>

              {/* <!-- Right Image --> */}
              <div data-aos="zoom-in-left" className="group relative">
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-500">
                  <img
                    src="images/img/hospital/hospital.jpeg"
                    alt="SMS Hospital Main Building"
                    className="w-full h-[600px] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <button
                    onClick={() => setShowEmergency(true)}
                    className="absolute top-6 right-6 cursor-pointer bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-xl animate-pulse hover:animate-none transition-all flex items-center gap-2 ring-4 ring-red-600/30"
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    24/7 EMERGENCY
                  </button>
                </div>

                {/* OUTSIDE CARD */}
                <div className="hidden md:block absolute -bottom-6 -left-30 z-20">
                  <div
                    className="
                  bg-white/90 backdrop-blur-xl
                  px-5 py-4
                  rounded-3xl
                  border border-white/60
                  shadow-2xl
                  transition-all duration-500
                  group-hover:-translate-y-2 group-hover:scale-[1.02]
                "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                        bg-gradient-to-br from-blue-500 to-cyan-400
                        p-4 rounded-2xl
                        shadow-lg
                      "
                      >
                        <FaUsers className="text-white text-2xl" />
                      </div>

                      <div>
                        <h6 className="text-3xl font-extrabold text-slate-800 leading-none">
                          25K+
                        </h6>

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mt-1">
                          Patients Served
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* model */}
      {modal && (
        <div
          onClick={() => setModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          {/* Modal Box */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl mx-4"
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
              <div className="relative w-full aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/sdgjXslG3Xg?si=eINi4WoWTatq5wH-"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* emergency modal */}
      <AnimatePresence>
        {showEmergency && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border-t-8 border-red-600 relative"
            >
              <button
                onClick={() => setShowEmergency(false)}
                className="absolute top-4 cursor-pointer hover:text-red-500 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div className="text-center">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhoneAlt className="text-red-600 text-3xl animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                  Emergency Help
                </h3>
                <p className="text-slate-500 text-sm mt-2 mb-8">
                  Our medical team is available 24/7 for immediate assistance.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-between bg-red-50 p-5 rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 group-hover:text-white">
                      Ambulance
                    </span>
                    <span className="text-xl font-black">+91 98765 43210</span>
                  </div>
                  <div className="bg-red-600 text-white p-3 rounded-xl group-hover:bg-white group-hover:text-red-600 shadow-lg">
                    <FaPhoneAlt />
                  </div>
                </a>

                <a
                  href="tel:0112345678"
                  className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-900 hover:text-white transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 group-hover:text-white">
                      Reception
                    </span>
                    <span className="text-xl font-black">011-2345678</span>
                  </div>
                  <div className="bg-slate-800 text-white p-3 rounded-xl group-hover:bg-white group-hover:text-slate-800 shadow-lg">
                    <FaPhoneAlt />
                  </div>
                </a>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
                Note: Calling charges may apply as per your service provider.
              </p>
            </motion.div>

            <div
              className="absolute inset-0 -z-10"
              onClick={() => setShowEmergency(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
