"use client";

import { useState } from "react";
import {
  Plus,
  Phone,
  Briefcase,
  Loader2,
  AlertCircle,
  Pencil,
  Clock,
  CalendarDays,
  Users,
  Stethoscope,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";
import api from "../../../components/Api/PrivateApi";
import ToggleDoctor from "../../../components/admin/ToggleDoctor";
import AddDoctorModal from "../../../components/admin/AddDoctorModal";
import DoctorViewModal from "../../../components/admin/DoctorViewModal";
import { useQuery } from "@tanstack/react-query";

export default function AdminDoctorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const IMG_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const {
    data: doctors = [],
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

  const handleEdit = (doctor, e) => {
    e.stopPropagation();
    setEditingDoctor(doctor);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingDoctor(null);
  };

  const totalDoctors = doctors.length;
  const onlineDoctors = doctors.filter((d) => d.isAvailable).length;
  const offlineDoctors = totalDoctors - onlineDoctors;

  return (
    <div className="min-h-screen pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="text-primary-600" size={28} /> Doctor Panel
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage specialists, their profiles, and availability.
          </p>
        </div>
      </div>

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Doctors
              </p>
              <p className="text-2xl font-black text-slate-800">
                {totalDoctors}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Online / Active
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {onlineDoctors}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Offline / On Break
              </p>
              <p className="text-2xl font-black text-rose-500">
                {offlineDoctors}
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="animate-spin text-primary-600" size={40} />
          <p className="text-slate-500 font-bold">
            Fetching Medical Records...
          </p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
          <AlertCircle size={24} />
          <p className="font-bold">
            Error: {error?.message || "Failed to fetch doctors"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              onClick={() => setSelectedDoctor(doc)}
              className={`relative bg-white border rounded-3xl p-6 transition-all duration-300 group flex flex-col cursor-pointer ${
                doc.isAvailable
                  ? "border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200"
                  : "border-rose-100 bg-rose-50/10 grayscale-[20%]"
              }`}
            >
              <div
                className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl rounded-tr-3xl text-[10px] font-black uppercase tracking-wider z-10 ${
                  doc.isAvailable
                    ? "bg-emerald-50 text-emerald-600 border-l border-b border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-l border-b border-rose-100"
                }`}
              >
                {doc.isAvailable ? "● Active" : "○ Inactive"}
              </div>

              <div className="flex gap-4 items-center mt-2">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md shrink-0 group-hover:scale-105 transition-transform relative">
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
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${doc.isAvailable ? "bg-emerald-500" : "bg-slate-400"}`}
                  />
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <h2 className="font-black text-xl text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                    {doc.name}
                  </h2>
                  <p className="text-primary-600 text-xs font-bold uppercase tracking-wide truncate mt-0.5">
                    {doc.specialty || "General Medicine"}
                  </p>
                  <p className="text-slate-500 text-[11px] font-semibold uppercase truncate flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {doc.department}
                  </p>
                </div>
              </div>

              <div className="mt-5 bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3 flex-1">
                <div className="flex items-start gap-3">
                  <Clock
                    size={16}
                    className="text-primary-500 shrink-0 mt-0.5"
                  />
                  <div className="flex flex-col">
                    {doc.availability?.timings?.length > 0 ? (
                      doc.availability.timings.map((shift, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-bold text-slate-700"
                        >
                          {shift.startTime} - {shift.endTime}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Timing not set
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                      <CalendarDays size={12} />{" "}
                      {doc.availability?.days?.join(", ") || "Mon-Sat"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Experience
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {doc.experience || "0"} Years
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Consultation Fee
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      ₹{doc.consultationFee || 500}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Availability Toggle
                  </span>
                  <span
                    className={`text-xs font-black ${doc.isAvailable ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {doc.isAvailable ? "Accepting Bookings" : "Not Accepting"}
                  </span>
                </div>

                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleEdit(doc, e)}
                    className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-all shadow-sm"
                    title="Edit Doctor"
                  >
                    <Pencil size={16} />
                  </button>
                  <ToggleDoctor doctor={doc} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && doctors.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Stethoscope size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">
            No Specialists Registered
          </h3>
          <p className="text-slate-400 text-sm mt-1 mb-6">
            Add your first doctor to get started.
          </p>
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            + Add Specialist
          </button>
        </div>
      )}

      {showModal && (
        <AddDoctorModal close={handleClose} editDoctor={editingDoctor} />
      )}

      {selectedDoctor && (
        <DoctorViewModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          IMG_BASE_URL={IMG_BASE_URL}
        />
      )}
    </div>
  );
}
