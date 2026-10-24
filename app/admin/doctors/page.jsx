"use client";

import { useState } from "react";
import {
  Plus,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle,
  Info,
  Pencil,
  Clock,
} from "lucide-react";
import api from "../../../components/Api/PrivateApi";
import ToggleDoctor from "../../../components/admin/ToggleDoctor";
import AddDoctorModal from "../../../components/admin/AddDoctorModal";
import { useQuery } from "@tanstack/react-query";

export default function AdminDoctorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const IMG_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const {
    data: doctors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors");
      return res.data.data;
    },
  });

  const handleAdd = () => {
    setEditingDoctor(null);
    setShowModal(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingDoctor(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Doctor Panel
          </h1>
          <p className="text-slate-500 text-sm">
            Manage specialists, their profiles, and availability.
          </p>
        </div>

        {/* <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 transition-all cursor-pointer text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Specialist</span>
        </button> */}
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="animate-spin text-primary-600" size={40} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h2 className="font-black text-xl text-slate-800 leading-tight group-hover:text-primary-600 transition-colors">
                    {doc.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-primary-500 mt-1">
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {doc.specialty || "General Medicine"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-tighter">
                {doc.specialization || "Senior Consultant"}
              </p>

              {/* Timing details */}
              <div className="flex flex-col gap-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {doc.availability?.timings?.map((shift, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600"
                  >
                    <Clock size={14} className="text-primary-500 shrink-0" />
                    {shift.startTime} - {shift.endTime}
                  </div>
                ))}
                <div className="text-[10px] font-semibold text-slate-400 mt-1 pt-1 border-t border-slate-200">
                  {doc.availability?.days?.join(", ") || "Mon-Sat"}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-primary-50/50 p-3 rounded-2xl border border-primary-50">
                  <Briefcase size={18} className="text-primary-500" />
                  <span className="font-semibold text-xs truncate max-w-[120px]">
                    {doc.department}
                  </span>
                  <span className="ml-auto text-xs bg-white px-2 py-1 rounded-lg shadow-sm text-nowrap">
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

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Visibility
                  </span>
                  <span
                    className={`text-sm font-black ${
                      doc.isAvailable ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {doc.isAvailable ? "Active" : "On Break"}
                  </span>
                </div>

                {/* <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                    title="Edit Doctor"
                  >
                    <Pencil size={16} />
                  </button>
                  <ToggleDoctor doctor={doc} />
                </div> */}
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

      {showModal && (
        <AddDoctorModal close={handleClose} editDoctor={editingDoctor} />
      )}
    </div>
  );
}
