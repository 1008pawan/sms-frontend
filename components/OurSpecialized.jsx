"use client";
import React, { useState } from "react";
import { BsArrowRight, BsCheckCircleFill } from "react-icons/bs";

import { FaBaby } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { MdOutlineScience } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const departments = [
  {
    id: 1,
    title: "Neonatology & Pediatrics",
    desc: "Specialized care for newborns, infants, and children with advanced pediatric support.",
    icon: <FaBaby className="text-red-500 text-2xl" />,
    bg: "bg-red-50",
    delay: 200,
    color: "red",
  },
  {
    id: 2,
    title: "Pediatric Surgeon",
    desc: "Advanced surgical care for infants and children using minimally invasive techniques.",
    icon: <FaBaby className="text-blue-600 text-2xl" />,
    bg: "bg-blue-50",
    delay: 100,
    color: "blue",
  },
  {
    id: 3,
    title: "General Medicine",
    desc: "Comprehensive diagnosis and treatment for adult health conditions and preventive care.",
    icon: <MdOutlineScience className="text-green-500 text-2xl" />,
    bg: "bg-green-50",
    delay: 300,
    color: "green",
  },
];

const modalData = {
  "Neonatology & Pediatrics": {
    title: "Neonatology & Pediatrics",
    color: "red",
    icon: <FaBaby className="text-white text-2xl" />,
    list: [
      "NICU & Newborn Intensive Care",
      "Child Growth & Development",
      "Vaccination & Preventive Care",
      "Pediatric Emergency Support",
    ],
    doctor: "DR. RAM MILAN (Director SMS Hospital)",
    badge: "Senior Pediatrician",
  },

  "Pediatric Surgeon": {
    title: "Pediatric Surgery",
    color: "blue",
    icon: <FaBaby className="text-white text-2xl" />,
    list: [
      "Neonatal & Infant Surgery",
      "Congenital Anomaly Correction",
      "Minimally Invasive Pediatric Surgery",
      "Pediatric Trauma Management",
    ],
    doctor: "Dr. Ravikesh Dwivedi",
    badge: "Senior Pediatric Surgeon",
  },

  "General Medicine": {
    title: "General Medicine",
    color: "green",
    icon: <MdOutlineScience className="text-white text-2xl" />,
    list: [
      "Diabetes & Hypertension Care",
      "Infectious Disease Treatment",
      "Preventive Health Checkups",
      "Comprehensive Adult Care",
    ],
    doctor: "Dr. Akhilesh Jaiswal",
    badge: "Consultant Physician",
  },
};

const colorClasses = {
  blue: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  red: {
    bg: "bg-red-600",
    text: "text-red-600",
    border: "border-red-600",
  },
  green: {
    bg: "bg-green-600",
    text: "text-green-600",
    border: "border-green-600",
  },
};

const OurSpecialized = () => {
  const [modal, setModal] = useState(false);
  const [active, setActive] = useState(null);

  return (
    <section className="pb-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-extrabold text-3xl md:text-5xl mb-4 text-gray-900 tracking-tight">
            Specialized <span className="text-blue-600">Departments</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Master your craft in our state-of-the-art medical units with
            world-class mentorship.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {departments.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 h-full border border-gray-100 shadow-xl shadow-gray-200/50 transition-all duration-300 group-hover:shadow-2xl group-hover:border-blue-100">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-lg transform transition-transform group-hover:rotate-6 ${item.bg}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                </div>

                <h4 className="text-2xl font-bold mb-3 text-gray-800">
                  {item.title}
                </h4>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {item.desc}
                </p>

                <button
                  onClick={() => {
                    setActive(item.title);
                    setModal(true);
                  }}
                  className="group/btn text-blue-600 font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  View Curriculum
                  <BsArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                </button>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-8">
          <a href="/departments">
            <button className="group flex items-center gap-2 px-6 py-3 bg-white cursor-pointer text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-300 ease-in-out active:scale-95">
              <span>View More</span>
            </button>
          </a>
        </div>
      </div>

      <AnimatePresence>
        {modal && modalData[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            >
              <div
                className={`relative p-8 text-white ${
                  colorClasses[modalData[active].color].bg
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    {modalData[active].icon}
                  </div>
                  <div>
                    <h5 className="text-2xl font-bold leading-tight">
                      {modalData[active].title}
                    </h5>
                    <span className="text-white/80 text-sm italic">
                      Department Module
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setModal(false)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="p-8">
                <h6
                  className={`mb-6 text-xs font-black uppercase tracking-widest ${
                    colorClasses[modalData[active].color].text
                  }`}
                >
                  Learning Path
                </h6>

                <ul className="grid gap-4 mb-8">
                  {modalData[active].list.map((item, i) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className="flex items-center gap-3 text-gray-700 font-medium"
                    >
                      <BsCheckCircleFill className="text-green-500 flex-shrink-0 text-lg" />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 flex items-center justify-between gap-1">
                  <div>
                    {/* <small className="text-gray-400 block mb-1 uppercase text-[10px] font-bold tracking-wider">
                      HOD
                    </small> */}
                    <p className="font-bold text-gray-800 text-lg">
                      {modalData[active].doctor}
                    </p>
                  </div>
                  <div
                    className={`md:px-3 px-2 py-1 text-xs text-nowrap font-bold rounded-full border shadow-sm ${
                      colorClasses[modalData[active].color].border
                    } ${colorClasses[modalData[active].color].text} bg-white`}
                  >
                    {modalData[active].badge}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurSpecialized;
