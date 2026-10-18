"use client";
import React, { useState, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import api from "./Api/PrivateApi";

const Experts = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const sectionRef = useRef(null);

  // ================= FETCH DOCTORS =================
  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctors-public"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors/public/all");
      const d = res.data;

      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      return [];
    },
  });

  const doctors = data || [];

  // ================= IMAGE URL HELPER =================
  const getImageUrl = (doc) => {
    if (!doc.photo) return "/images/logo/flaticon.png";
    if (doc.photo.startsWith("http")) return doc.photo;

    const base =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    return `${base}/${doc.photo.replace(/\\/g, "/")}`;
  };

  // ================= FILTER =================
  const filteredDoctors = doctors.filter((doc) =>
    `${doc.name} ${doc.department} ${doc.specialty} ${doc.specialization}`
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

        {/* ================= LOADING STATE ================= */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col border border-slate-100 animate-pulse"
              >
                <div className="h-72 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 mx-auto" />
                  <div className="h-11 bg-slate-200 rounded-2xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= ERROR STATE ================= */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">
              Failed to load doctors. Please try again later.
            </p>
          </div>
        )}

        {/* ================= DOCTOR GRID ================= */}
        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredDoctors.slice(0, visibleCount).map((doc, index) => (
                  <motion.div
                    key={doc._id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col border border-slate-100 group"
                  >
                    <div className="overflow-hidden h-72 relative">
                      <img
                        src={getImageUrl(doc)}
                        alt={doc.name}
                        onError={(e) => {
                          e.target.src = "/images/logo/flaticon.png";
                        }}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="text-center p-6 flex-1 flex flex-col">
                      <h5 className="font-bold text-lg text-slate-800 mb-1">
                        {doc.name}
                      </h5>
                      <p className="text-blue-600 text-[10px] font-black uppercase mb-2">
                        {doc.specialty || doc.specialization || "—"}
                      </p>
                      <p className="text-slate-400 text-xs mb-6 font-medium">
                        {doc.department || doc.role || "—"}
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

            {/* ================= SHOW MORE/LESS ================= */}
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

            {/* ================= EMPTY STATE ================= */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">
                  {search
                    ? `No specialists found matching "${search}"`
                    : "No doctors available yet."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= PROFILE MODAL ================= */}
      <AnimatePresence>
        {selectedDoc && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl my-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center cursor-pointer font-bold z-20 bg-white/90 hover:bg-red-50 hover:text-red-500 rounded-full shadow-lg transition-all text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row max-h-[85vh]">
                {/* ============ IMAGE ============ */}
                <div className="relative w-full md:w-2/5 h-64 md:h-auto shrink-0 bg-slate-100">
                  <img
                    src={getImageUrl(selectedDoc)}
                    alt={selectedDoc.name}
                    onError={(e) => {
                      e.target.src = "/images/logo/flaticon.png";
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Gradient overlay bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/40 to-transparent md:hidden" />
                </div>

                {/* ============ CONTENT ============ */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 md:p-8">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2 block">
                      {selectedDoc.department ||
                        selectedDoc.role ||
                        "Specialist"}
                    </span>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                      {selectedDoc.name}
                    </h2>

                    <p className="text-sm font-bold text-blue-500 mt-2">
                      {selectedDoc.specialty ||
                        selectedDoc.specialization ||
                        "—"}
                    </p>

                    <div className="w-12 h-1 bg-blue-100 my-5"></div>

                    <p className="text-slate-500 text-sm leading-relaxed">
                      {selectedDoc.description ||
                        "Leading specialist at SMS Hospital providing advanced care."}
                    </p>

                    {/* Experience & Fee */}
                    <div className="flex flex-wrap gap-3 mt-5">
                      {selectedDoc.experience && (
                        <div className="px-3 py-1.5 bg-slate-100 rounded-lg font-semibold text-slate-600 text-xs">
                          🕒 {selectedDoc.experience}
                        </div>
                      )}
                      {selectedDoc.consultationFee && (
                        <div className="px-3 py-1.5 bg-emerald-50 rounded-lg font-semibold text-emerald-700 text-xs">
                          ₹{selectedDoc.consultationFee}
                        </div>
                      )}
                      {selectedDoc.phone && (
                        <div className="px-3 py-1.5 bg-blue-50 rounded-lg font-semibold text-blue-700 text-xs">
                          📞 {selectedDoc.phone}
                        </div>
                      )}
                    </div>

                    {/* Book Button */}
                    <div className="mt-8">
                      <a
                        href="/login"
                        className="inline-block w-full md:w-auto text-center px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
                      >
                        Book Appointment
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experts;
