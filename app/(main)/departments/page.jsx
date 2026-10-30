"use client";

import api from "../../../components/Api/publicApi";
import Header from "../../../components/Header";
import OurSpecialized from "../../../components/OurSpecialized";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaUserMd,
  FaClock,
  FaSpinner,
  FaPhoneAlt,
  FaCalendarCheck,
} from "react-icons/fa";
import Footer from "components/Footer";

export default function PublicDepartmentsPage() {
  const [activeDeptId, setActiveDeptId] = useState(null);

  const IMG_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-doctors"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors/public/all");
      const allDoctors = res.data?.data ?? [];

      const grouped = allDoctors.reduce((acc, doc) => {
        const raw =
          typeof doc.department === "object"
            ? doc.department?.name
            : doc.department;
        const deptName = (raw || "").trim() || "General";

        const existingDept = acc.find(
          (d) => d.name.toLowerCase() === deptName.toLowerCase(),
        );
        if (existingDept) existingDept.doctors.push(doc);
        else acc.push({ id: acc.length + 1, name: deptName, doctors: [doc] });
        return acc;
      }, []);

      return grouped;
    },
    retry: 1,
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
    <div className="bg-[#f8fafc] font-sans min-h-screen">
      <Header />

      <div className="flex flex-col md:flex-row">
        {/* ===== MOBILE DEPARTMENT SELECTOR ===== */}
        <div className="md:hidden w-full px-4 py-6 sticky top-[72px] z-20 bg-[#f8fafc]/90 backdrop-blur-md">
          <select
            value={activeDept?.id || ""}
            onChange={(e) => setActiveDeptId(Number(e.target.value))}
            className="w-full border border-slate-200 bg-white shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.doctors.length})
              </option>
            ))}
          </select>
        </div>

        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="hidden md:flex flex-col w-72 sticky top-0 h-screen border-r border-slate-200 bg-white/70 backdrop-blur-md overflow-hidden shrink-0">
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 tracking-tight">
                  Specialities
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {departments.length} Department
                  {departments.length !== 1 && "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-5 shrink-0" />

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
            {departments.map((dept) => {
              const active = activeDept?.id === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDeptId(dept.id)}
                  className={`group relative w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                      : "text-slate-600 hover:bg-slate-50 hover:translate-x-0.5"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-white/80" />
                  )}
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      active
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-slate-100 group-hover:bg-blue-50"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        active
                          ? "text-white"
                          : "text-slate-500 group-hover:text-blue-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 min-w-0 text-sm font-bold truncate">
                    {dept.name}
                  </span>
                  <span
                    className={`shrink-0 min-w-[26px] h-6 px-2 rounded-full text-[11px] font-black flex items-center justify-center transition-all ${
                      active
                        ? "bg-white text-blue-600"
                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700"
                    }`}
                  >
                    {dept.doctors.length}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ===== DOCTORS LIST SECTION ===== */}
        <main className="w-full">
          {activeDept ? (
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto">
              <div className="mb-6 md:mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Our Specialists
                </h1>
                <p className="text-slate-500 mt-2 text-sm md:text-base">
                  Find the best doctors in{" "}
                  <span className="text-blue-600 font-bold">
                    {activeDept.name}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <motion.div
                  key={activeDept.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {[...activeDept.doctors]
                    .sort((a, b) => {
                      const isARicha = a.name.toLowerCase().includes("richa");
                      const isBRicha = b.name.toLowerCase().includes("richa");

                      if (isARicha && !isBRicha) return -1;
                      if (!isARicha && isBRicha) return 1;
                      return 0;
                    })
                    .map((doc) => (
                      <div
                        key={doc._id}
                        className="group relative shadow-md bg-white border border-slate-200 rounded-[1.5rem] p-5 flex flex-col md:flex-row gap-5 md:gap-6 transition-all duration-300 hover:shadow-xl hover:border-primary-200"
                      >
                        <div className="shrink-0 flex justify-center md:block w-28 md:w-32">
                          <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden ring-4 ring-slate-50 shadow-sm relative">
                            <img
                              src={getImageUrl(doc.photo)}
                              alt={doc.name}
                              className="h-full w-full object-cover object-top"
                            />

                            <div
                              className={`absolute -bottom-0 -right-0 h-7 w-7 rounded-full border-[3px] border-white flex items-center justify-center shadow-md z-10 ${
                                doc.isAvailable
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              }`}
                            >
                              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col text-center md:text-left min-w-0">
                          <div>
                            <h3 className="text-xl font-black text-slate-800 leading-tight">
                              {doc.name}
                            </h3>
                            <p className="text-blue-600 text-xs font-bold uppercase tracking-wide mt-1">
                              {doc.specialization || "Specialist"}
                            </p>

                            <p className="text-slate-500 text-[13px] font-medium mt-2 line-clamp-2 leading-relaxed">
                              {doc.specialty ? `${doc.specialty} • ` : ""}
                              {doc.department}
                              {doc.description ? ` • ${doc.description}` : ""}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                              <FaUserMd className="text-slate-400" />{" "}
                              {doc.experience || "0"} Years Exp.
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                              <FaPhoneAlt className="text-slate-400" />{" "}
                              {doc.phone || "At Hospital"}
                            </div>
                          </div>

                          {/* Timings & Availability Grid */}
                          <div className="mt-4 flex flex-col sm:flex-row gap-4 bg-slate-100 border border-slate-100 rounded-xl p-3">
                            {/* Timings */}
                            <div className="flex-1 sm:border-r border-slate-200 sm:pr-4">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                Timings
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                {doc.availability?.timings?.length > 0 ? (
                                  [...doc.availability.timings]
                                    .sort((a, b) => {
                                      // Time ko minutes me convert karke sort karo
                                      const getMinutes = (timeStr) => {
                                        const [time, period] =
                                          timeStr.split(" ");
                                        let [h, m] = time
                                          .split(":")
                                          .map(Number);
                                        if (period === "PM" && h !== 12)
                                          h += 12;
                                        if (period === "AM" && h === 12) h = 0;
                                        return h * 60 + m;
                                      };
                                      return (
                                        getMinutes(a.startTime) -
                                        getMinutes(b.startTime)
                                      );
                                    })
                                    .map((shift, idx) => {
                                      // Sahi label decide karo (12 PM ke baad Evening, subha Morning)
                                      const hour = parseInt(
                                        shift.startTime.split(":")[0],
                                      );
                                      const isPM =
                                        shift.startTime.includes("PM");
                                      const label =
                                        isPM && hour !== 12
                                          ? "Evening"
                                          : "Morning";

                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-1.5 text-left"
                                        >
                                          <FaClock
                                            className="text-slate-400 mt-0.5 shrink-0"
                                            size={12}
                                          />
                                          <div>
                                            <p className="text-[11px] font-bold text-slate-700">
                                              {label}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                                              {shift.startTime} -{" "}
                                              {shift.endTime}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })
                                ) : (
                                  <p className="text-[11px] font-bold text-slate-500">
                                    On Call
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Availability */}
                            <div className="flex-1 flex flex-col justify-start">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                Availability
                              </p>
                              <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                                {(
                                  doc.availability?.days || [
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                  ]
                                ).map((day) => (
                                  <span
                                    key={day}
                                    className="text-[10px] font-bold bg-white text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 shadow-sm"
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Right: Fee & CTA */}
                        <div className="w-full md:w-[180px] shrink-0 flex flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5">
                          <div className="text-center bg-white border-2 border-slate-800 rounded-xl px-4 py-2 w-full shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                              Consultation Fee
                            </p>
                            <p className="text-2xl font-black text-slate-900">
                              ₹{doc.consultationFee || 500}
                            </p>
                          </div>

                          <a
                            href="/login"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                          >
                            <FaCalendarCheck /> Book Appointment
                          </a>
                        </div>
                      </div>
                    ))}
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <OurSpecialized />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
