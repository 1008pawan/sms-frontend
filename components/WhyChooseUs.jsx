"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Siren,
  Stethoscope,
  FlaskConical,
  Droplets,
  CalendarCheck,
  HeartHandshake,
  Phone,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Siren,
    title: "24/7 Emergency Care",
    desc: "Round-the-clock emergency services with a trained team ready at any hour.",
    tint: "bg-rose-50 text-rose-500",
  },
  {
    icon: Stethoscope,
    title: "Expert Specialist Doctors",
    desc: "15+ experienced doctors across Neonatology, Surgery, Medicine, Cardiology and more.",
    tint: "bg-blue-50 text-blue-600",
  },
  {
    icon: FlaskConical,
    title: "Advanced Diagnostics",
    desc: "10+ modern labs for accurate reports, so your diagnosis and treatment start sooner.",
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Droplets,
    title: "Blood Bank",
    desc: "Safe and readily available blood support for patients in critical need.",
    tint: "bg-amber-50 text-amber-600",
  },
  {
    icon: CalendarCheck,
    title: "Easy Appointments",
    desc: "Pick your doctor and book a visit online in a few clicks, with no long queues.",
    tint: "bg-violet-50 text-violet-600",
  },
  {
    icon: HeartHandshake,
    title: "Patient-First Care",
    desc: "Over 25K patients served with a focus on comfort, respect and clear communication.",
    tint: "bg-cyan-50 text-cyan-600",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-white via-blue-50/60 to-white overflow-hidden">
      {/* soft background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-600">
            Why SMS Hospital
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Why Choose <span className="text-blue-600">Us</span>
          </h2>
          <p className="mt-4 text-slate-500">
            Trusted care, experienced doctors and modern facilities, all under
            one roof in Gorakhpur.
          </p>
        </div>

        {/* cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, desc, tint }) => (
            <motion.div
              key={title}
              variants={item}
              className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100"
            >
              <div
                className={`h-14 w-14 rounded-2xl flex items-center justify-center ${tint} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={26} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA strip, same navy as the stats bar */}
        <div className="mt-14 rounded-3xl bg-[#0a1230] px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/20">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Need care <span className="text-sky-400">right now?</span>
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Our emergency team is available 24/7. Call us or book a visit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="tel:011-2345678"
              className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              <Phone size={16} /> +011-2345678
            </a>
            <a
              href="/login"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              Book Appointment <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
