"use client";
import React, { useState, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const doctors = [
  {
    name: "DR. RAM MILAN\n(Director SMS Hospital)",
    role: "Pediatrics",
    specialty: "MBBS, MD Fellowship in Neontology",
    image: "images/doctors/DR. RAM MILAN.jpeg",
    description:
      "Dr. Ram Milan is a visionary leader with extensive experience in pediatric care and hospital management.",
  },
  {
    name: "Dr. Durgesh Shukla",
    role: "मधुमेह, ब्लड प्रेशर एवं थायराइड रोग विशेषज्ञ",
    specialty: "MBBS, MD Medicine",
    image: "images/doctors/Dr. vishal Singh.jpeg",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Somit Kumar Sinha",
    role: "MCH, Urology",
    specialty: "MBBS, MS",
    image: "images/doctors/Dr. Somit Kumar Sinha.jpeg",
    description:
      "Specializes in bone health, joint replacements, and sports injuries with advanced surgical techniques.",
  },
  {
    name: "Dr. P.K. Satyarthi",
    role: "पैथोलॉजी",
    specialty: "MBBS, MD",
    image: "images/doctors/Dr. P.K Satyarthi.jpeg",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Akhilesh Jaiswal",
    role: "मधुमेह, ब्लड प्रेशर एवं थायराइड रोग विशेषज्ञ",
    specialty: "MBBS, MD Medicine",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Ravikesh Dwivedi",
    role: "Pediatric Surgeon",
    specialty: "MBBS, MS, MCH, Pediatric Surgery",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Tripurari Pandey",
    role: "न्यूरोलॉजी",
    specialty: "MBBS, MS, MCH, Neurology",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Maya Ram",
    role: "स्त्री एवं प्रसूति रोग विशेषज्ञ",
    specialty: "MBBS, DGO, IVF Specialist",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Akil Ahmad",
    role: "जनरल एवं लैप्रोस्कोपिक सर्जन",
    specialty: "MBBS, MS, General Surgery",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. Vishal Singh",
    role: "Orthopedic",
    specialty: "MBBS, MS, Orthopedic",
    image: "images/logo/flaticon.png",
    description:
      "Expert in internal medicine with a focus on holistic patient recovery and chronic disease management.",
  },
  {
    name: "Dr. D Kumar",
    role: "नाक, कान, गला रोग विशेषज्ञ",
    specialty: "MBBS, MS. ENT",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
  {
    name: "Dr. U.S. Kushwaha",
    role: "न्यूरोसाइकिएट्रिक",
    specialty: "MBBS, MD",
    image: "images/logo/flaticon.png",
    description:
      "Dedicated to providing comprehensive primary care and preventive health screenings.",
  },
];

const Experts = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const sectionRef = useRef(null);

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.name} ${doc.role} ${doc.specialty}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const toggleView = () => {
    if (visibleCount >= filteredDoctors.length) {
      setVisibleCount(4);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setVisibleCount(filteredDoctors.length);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="doctors"
      className="py-16 px-4 bg-slate-50 transition-all duration-500"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
            SMS Hospital Specialists
          </span>
          <h2 className="font-black text-4xl lg:text-5xl mt-2 text-slate-900 tracking-tight">
            Our Medical Experts
          </h2>

          <div className="flex justify-center mt-8">
            <div className="w-full max-w-xl flex bg-white hover:shadow-xl shadow-sm rounded-2xl overflow-hidden border border-slate-200 transition-all group focus-within:border-blue-400">
              <input
                type="text"
                placeholder="Search by name, department..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value !== "") setVisibleCount(doctors.length);
                }}
                className="flex-1 p-4 outline-none text-slate-700"
              />
              <span className="flex items-center px-6 text-slate-400 group-focus-within:text-blue-600">
                <BsSearch size={20} />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredDoctors.slice(0, visibleCount).map((doc, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col border border-slate-100 group"
              >
                <div className="overflow-hidden h-72 relative">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-full w-full object-fit transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-center p-6 flex-1 flex flex-col">
                  <h5 className="font-bold text-lg text-slate-800  mb-1">
                    {doc.name}
                  </h5>
                  <p className="text-blue-600 text-[10px] font-black uppercase mb-2">
                    {doc.specialty}
                  </p>
                  <p className="text-slate-400 text-xs mb-6 font-medium">
                    {doc.role}
                  </p>

                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="mt-auto block w-full cursor-pointer py-3 text-sm font-bold border-2 border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 active:scale-95"
                  >
                    View Full Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDoctors.length > 4 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={toggleView}
              className={`group flex items-center gap-3 px-10 py-4 font-bold rounded-2xl shadow-lg transition-all duration-500 active:scale-95 cursor-pointer ${
                visibleCount >= filteredDoctors.length
                  ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                  : "bg-blue-600 text-white hover:bg-slate-900 shadow-blue-100"
              }`}
            >
              <span>
                {visibleCount >= filteredDoctors.length
                  ? "Show Less"
                  : "View All Specialists"}
              </span>

              <span className="transition-transform duration-500 group-hover:scale-110">
                {visibleCount >= filteredDoctors.length ? (
                  <FaChevronUp className="animate-bounce" />
                ) : (
                  <FaChevronDown className="animate-bounce" />
                )}
              </span>
            </button>
          </div>
        )}

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              No specialists found matching "{search}"
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-3xl overflow-hidden bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center cursor-pointer font-bold z-20 bg-white/90 rounded-full hover:bg-red-50 hover:text-red-500 shadow-lg transition-all"
              >
                ✕
              </button>

              <div className="w-full md:w-1/2 h-80 md:h-[500px]">
                <img
                  src={selectedDoc.image}
                  alt={selectedDoc.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="md:p-10 p-8 md:w-1/2 flex flex-col justify-center bg-white">
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] md:mb-2 mb-1 block">
                  {selectedDoc.role}
                </span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight whitespace-pre-line">
                  {selectedDoc.name}
                </h2>
                <p className="text-sm font-bold text-blue-500/80 md:mt-2">
                  {selectedDoc.specialty}
                </p>
                <div className="w-12 h-1 bg-blue-100 md:my-6 my-1"></div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {selectedDoc.description ||
                    "Leading specialist at SMS Hospital providing advanced care."}
                </p>

                <div className="md:mt-8 mt-4">
                  <a
                    href="/login"
                    className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
            </motion.div>
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setSelectedDoc(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experts;
