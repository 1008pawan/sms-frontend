"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBaby,
  FaHeartbeat,
  FaFemale,
  FaArrowRight,
  FaCalendarCheck,
  FaTimes,
  FaCheckCircle,
  FaUserMd,
} from "react-icons/fa";
import { MdOutlineScience } from "react-icons/md";

const departments = [
  {
    id: 1,
    title: "Neonatology & Pediatrics",
    desc: "Specialized care for newborns, infants, and children with advanced pediatric support and NICU facilities.",
    icon: <FaBaby className="text-2xl" />,
    theme: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20",
    },
  },
  {
    id: 2,
    title: "Gynecology Department",
    desc: "Comprehensive women's healthcare, including pregnancy care, fertility treatments, and reproductive health.",
    icon: <FaFemale className="text-2xl" />,
    theme: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      gradient: "from-purple-500 to-fuchsia-600",
      shadow: "shadow-purple-500/20",
    },
  },
  {
    id: 3,
    title: "General Medicine",
    desc: "Comprehensive diagnosis and treatment for adult health conditions with focus on preventive care.",
    icon: <MdOutlineScience className="text-2xl" />,
    theme: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
    },
  },
];

const modalData = {
  "Neonatology & Pediatrics": {
    title: "Neonatology & Pediatrics",
    subtitle: "Expert care for your little ones",
    icon: <FaBaby className="text-3xl" />,
    gradient: "from-rose-500 to-pink-600",
    badge: "Senior Pediatrician",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    list: [
      "NICU & Newborn Intensive Care",
      "Child Growth & Development Tracking",
      "Vaccination & Preventive Health",
      "Pediatric Emergency Support",
    ],
    doctor: "DR. RAM MILAN",
    role: "Director, SMS Hospital",
  },
  "Gynecology Department": {
    title: "Gynecology Department",
    subtitle: "Dedicated care for women's health",
    icon: <FaFemale className="text-3xl" />,
    gradient: "from-purple-500 to-fuchsia-600",
    badge: "Senior Gynecologist",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    list: [
      "Pregnancy & Prenatal Care",
      "High-Risk Pregnancy Management",
      "Infertility & IVF Treatments",
      "Laparoscopic Gynec Surgery",
    ],
    doctor: "Dr. Vandita Tiwari",
    role: "MBBS, MS (Gynecology)",
  },
  "General Medicine": {
    title: "General Medicine",
    subtitle: "Your first line of care",
    icon: <MdOutlineScience className="text-3xl" />,
    gradient: "from-emerald-500 to-teal-600",
    badge: "Consultant Physician",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    list: [
      "Diabetes & Hypertension Care",
      "Infectious Disease Treatment",
      "Preventive Health Checkups",
      "Comprehensive Adult Care",
    ],
    doctor: "Dr. Durgesh Shukla",
    role: "MBBS, MD medicine",
  },
};

const OurSpecialized = () => {
  const [modal, setModal] = useState(false);
  const [active, setActive] = useState(null);

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-indigo-200/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-5">
            <FaHeartbeat className="text-rose-500" />
            Our Specialities
          </span>

          <h2 className="font-black text-3xl md:text-5xl mb-4 text-slate-900 tracking-tight leading-tight">
            Expert Care Across
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Specialized Departments
            </span>
          </h2>

          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            World-class treatment backed by advanced technology, experienced
            specialists, and a compassionate approach to healing.
          </p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {departments.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              className="group h-full"
            >
              <div className="relative flex flex-col h-full bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Hover gradient glow */}
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${item.theme.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none`}
                />

                {/* Icon */}
                <div
                  className={`relative shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl mb-5 ${item.theme.bg} ${item.theme.text} shadow-lg ${item.theme.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                {/* Content (flex-1 pushes buttons to bottom) */}
                <div className="flex-1">
                  <h4 className="text-xl font-black mb-2.5 text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto w-full">
                  <button
                    onClick={() => {
                      setActive(item.title);
                      setModal(true);
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold ${item.theme.bg} ${item.theme.text} hover:shadow-md transition-all active:scale-95 cursor-pointer`}
                  >
                    Details
                    <FaArrowRight
                      size={10}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>

                  <Link
                    href="/login"
                    className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.theme.gradient} text-white shadow-lg ${item.theme.shadow} hover:scale-110 transition-transform active:scale-95`}
                    title="Book Appointment"
                  >
                    <FaCalendarCheck size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            View All Departments
            <FaArrowRight size={12} />
          </Link>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modal && modalData[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {/* HEADER */}
              <div
                className={`relative shrink-0 p-6 text-white bg-gradient-to-br ${modalData[active].gradient}`}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />

                <button
                  onClick={() => setModal(false)}
                  className="absolute top-4 right-4 w-9 h-9 z-20 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <FaTimes size={14} />
                </button>

                <div className="relative flex items-center gap-4">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    {modalData[active].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black leading-tight">
                      {modalData[active].title}
                    </h3>
                    <p className="text-white/80 text-xs mt-1">
                      {modalData[active].subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="p-6 overflow-y-auto">
                <h6 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Key Services
                </h6>

                <ul className="grid gap-3 mb-6">
                  {modalData[active].list.map((item, i) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      key={i}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                    >
                      <FaCheckCircle className="text-emerald-500 flex-shrink-0 text-sm mt-0.5" />
                      <span className="text-sm text-slate-700 font-semibold">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Doctor Card */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-4 flex items-center gap-3">
                  <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <FaUserMd size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Head of Department
                    </p>
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {modalData[active].doctor}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {modalData[active].role}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${modalData[active].badgeColor} hidden sm:block`}
                  >
                    {modalData[active].badge}
                  </span>
                </div>

                {/* Book CTA */}
                <Link
                  href="/login"
                  onClick={() => setModal(false)}
                  className={`mt-5 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${modalData[active].gradient} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95`}
                >
                  <FaCalendarCheck />
                  Book Appointment
                  <FaArrowRight size={12} />
                </Link>

                <p className="text-center text-[10px] text-slate-400 mt-3">
                  Available Mon - Sat, 9:00 AM - 9:00 PM
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurSpecialized;
