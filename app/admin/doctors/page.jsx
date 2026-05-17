"use client";

import { useState } from "react";
import {
  Plus,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle,
  Award,
  GraduationCap,
  Info,
} from "lucide-react";
import api from "../../../components/Api/PrivateApi";
import ToggleDoctor from "../../../components/admin/ToggleDoctor";
import AddDoctorModal from "../../../components/admin/AddDoctorModal";
import { useQuery } from "@tanstack/react-query";

export default function AdminDoctorsPage() {
  const [showModal, setShowModal] = useState(false);

  const {
    data: doctors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors");
      console.log(res.data.data);

      return res.data.data;
    },
  });

  const IMG_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  return (
    <div className="py-4 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Doctor Panel
          </h1>
          <p className="text-slate-500 text-sm">
            Manage specialists, their profiles, and availability.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center md:gap-2 md:text-base text-xs md:h-13 h-10 bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer text-white md:px-8 px-2 md:py-4 py-2 rounded-[1.5rem] font-bold shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={22} /><p>Add New Specialist</p>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-bold">
            Fetching Medical Records...
          </p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 text-red-600 rounded-[2rem]">
          <AlertCircle size={24} />
          <p className="font-bold">
            Error: {error?.message || "Failed to fetch doctors"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors?.map((doc) => (
            <div
              key={doc._id}
              className={`relative border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white group ${
                !doc.isAvailable ? "opacity-80" : ""
              }`}
            >
              <div
                className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider z-10 shadow-sm ${
                  doc.isAvailable
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {doc.isAvailable ? "● Online" : "○ Offline"}
              </div>

              <div className="flex gap-5 items-start mt-8">
                <div className="h-24 w-24 rounded-[2rem] overflow-hidden bg-slate-50 border-4 border-white shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={
                      doc.photo
                        ? doc.photo.startsWith("http")
                          ? doc.photo
                          : `${IMG_BASE_URL}/${doc.photo.replace(/^\/+/, "")}`
                        : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                    }
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                    }}
                    alt={doc.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 mt-1">
                  <h2 className="font-black text-xl text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {doc.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-blue-500 mt-2">
                    <GraduationCap size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {doc.specialty || "General Medicine"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">
                    {doc.specialization || "Senior Consultant"}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-2xl border border-blue-50">
                  <Briefcase size={18} className="text-blue-500" />
                  <span className="font-bold">{doc.department}</span>
                  <span className="ml-auto text-xs bg-white px-2 py-1 rounded-lg shadow-sm">
                    {doc.experience || "0"} Exp
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500 p-3">
                  <Phone size={18} className="text-slate-400" />
                  <span className="font-medium">
                    {doc.phone || "Not Provided"}
                  </span>
                </div>

                {doc.description && (
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl">
                    <Info size={18} className="text-slate-400 shrink-0" />
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Visibility
                  </span>
                  <span
                    className={`text-sm font-black ${
                      doc.isAvailable ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {doc.isAvailable ? "Active for Booking" : "On Break"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <ToggleDoctor doctor={doc} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && doctors?.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
          <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">
            No Specialists Registered
          </p>
        </div>
      )}

      {showModal && <AddDoctorModal close={() => setShowModal(false)} />}
    </div>
  );
}
