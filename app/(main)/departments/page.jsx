"use client";

import api from "@/components/Api/publicApi";
import Header from "@/components/Header";
import OurSpecialized from "@/components/OurSpecialized";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaUserMd,
  FaClock,
  FaCalendarAlt,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";

export default function PublicDepartmentsPage() {
  const [activeDeptId, setActiveDeptId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const IMG_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-doctors"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors/public/all");

      const allDoctors = res.data.data;

      const grouped = allDoctors.reduce((acc, doc) => {
        const deptName = doc.department || "General";
        const existingDept = acc.find((d) => d.name === deptName);
        if (existingDept) {
          existingDept.doctors.push(doc);
        } else {
          acc.push({
            id: acc.length + 1,
            name: deptName,
            doctors: [doc],
          });
        }
        return acc;
      }, []);

      return grouped;
    },
    retry: 1,
    onError: (err) => console.log("Fetch Error:", err),
  });

  const activeDept = useMemo(() => {
    if (departments.length === 0 || !activeDeptId) return null;
    return departments.find((d) => d.id === activeDeptId);
  }, [departments, activeDeptId]);

  const getImageUrl = (photo) => {
    if (!photo)
      return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
    return photo.startsWith("http")
      ? photo
      : `${IMG_BASE_URL}/${photo.replace(/^\/+/, "")}`;
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );

  return (
    <div className="bg-[#f8fafc] font-sans">
      <Header />

      <div className="flex flex-col md:flex-row">
        {/* ===== MOBILE DEPARTMENT SELECTOR ===== */}
        <div className="md:hidden w-full px-4 pt-6">
          <select
            value={activeDept?.id || ""}
            onChange={(e) => setActiveDeptId(Number(e.target.value))}
            className="w-full border-0 bg-white shadow-sm rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="hidden md:block w-72 p-4 sticky top-[0px] h-screen overflow-y-auto border-r border-slate-200 bg-white/50 backdrop-blur-sm">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-400">
            Medical Specialities
          </h2>
          <div className="flex flex-col gap-3">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDeptId(dept.id)}
                className={`flex items-center justify-between group text-left px-5 py-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                  activeDept?.id === dept.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]"
                    : "hover:bg-white hover:shadow-md text-slate-600"
                }`}
              >
                <span className="font-bold tracking-tight">{dept.name}</span>
                <FaChevronRight
                  className={`text-xs ${
                    activeDept?.id === dept.id
                      ? "rotate-0"
                      : "-rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </aside>

        {/* ===== DOCTORS LIST SECTION ===== */}
        <main className="w-full">
          {activeDept ? (
            <div className="flex-1 p-4 md:p-10">
              <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  Our Specialists
                </h1>
                <p className="text-slate-500 mt-2">
                  Find the best doctors in{" "}
                  <span className="text-blue-600 font-bold">
                    {activeDept.name}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDept.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-4"
                  >
                    {activeDept.doctors.map((doc) => (
                      <div
                        key={doc._id}
                        className="group relative bg-white border border-slate-100 p-4 md:p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="relative">
                          <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl overflow-hidden ring-4 ring-slate-50">
                            <img
                              src={getImageUrl(doc.photo)}
                              alt={doc.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div
                            className={`absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center ${
                              doc.isAvailable ? "bg-green-500" : "bg-red-500"
                            }`}
                            title={
                              doc.isAvailable ? "Available" : "Not Available"
                            }
                          >
                            <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">
                              {doc.name}
                            </h3>
                            <span className="hidden md:block text-slate-300">
                              |
                            </span>
                            <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">
                              {doc.specialization}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm font-medium">
                            {doc.specialty}
                          </p>

                          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                              <FaUserMd className="text-blue-500" />{" "}
                              {doc.experience} Exp.
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                              <FaClock className="text-blue-500" /> 10:00 AM -
                              04:00 PM
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                              <FaCalendarAlt className="text-blue-500" />
                              Mon - Sat
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-auto">
                          <button
                            onClick={() => setSelectedDoctor(doc)}
                            className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all cursor-pointer"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <OurSpecialized />
            </div>
          )}
        </main>
      </div>

      {/* ===== PROFILE MODAL ===== */}
      <AnimatePresence>
        {selectedDoctor && (
          <div
            onClick={() => setSelectedDoctor(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row min-h-[500px]"
            >
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-50 cursor-pointer font-bold"
              >
                ✕
              </button>

              <div className="w-full md:w-[45%] bg-slate-100 relative overflow-hidden">
                <img
                  src={getImageUrl(selectedDoctor?.photo)}
                  alt={selectedDoctor?.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white/80 text-sm font-bold uppercase tracking-[0.2em] mb-1">
                    {selectedDoctor?.department}
                  </p>
                  <h2 className="text-white text-3xl font-black">
                    {selectedDoctor?.name}
                  </h2>
                </div>
              </div>

              <div className="p-10 md:w-[55%] flex flex-col justify-center bg-white">
                <div className="space-y-6">
                  <div>
                    <p className="text-blue-600 font-bold text-sm">
                      {selectedDoctor.specialization}
                    </p>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {selectedDoctor.description ||
                        "Leading specialist in providing comprehensive patient care and medical excellence."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Experience
                      </p>
                      <p className="text-slate-700 font-bold text-sm">
                        {selectedDoctor.experience}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Contact
                      </p>
                      <p className="text-slate-700 font-bold text-sm">
                        {selectedDoctor.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <a
                      href="/login"
                      className="flex-1 py-4 bg-blue-600 text-white text-center font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100"
                    >
                      Book Appointment
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
