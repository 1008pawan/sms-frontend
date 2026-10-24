"use client";
import { X, Phone, Briefcase, Clock, CalendarDays, MapPin } from "lucide-react";

export default function DoctorViewModal({ doctor, onClose, IMG_BASE_URL }) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full h-[90%] max-w-2xl rounded-[1rem] shadow-2xl overflow-auto scrollbar-thin animate-in zoom-in-95 duration-200">
        <div className="relative h-32 bg-blue-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-4 flex items-end justify-between">
            <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
              <img
                src={
                  doctor.photo
                    ? doctor.photo.startsWith("http")
                      ? doctor.photo
                      : `${IMG_BASE_URL}/${doctor.photo.replace(/^\/+/, "")}`
                    : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                }
                alt={doctor.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
                doctor.isAvailable
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              {doctor.isAvailable ? "● Active" : "○ Inactive"}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-800">
              {doctor.name}
            </h2>
            <p className="text-primary-600 font-bold text-sm mt-1">
              {doctor.specialization || "Senior Consultant"}
            </p>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <MapPin size={14} /> {doctor.department}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                Experience
              </p>
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={16} className="text-primary-500" />{" "}
                {doctor.experience || "0"} Years
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                Consultation Fee
              </p>
              <p className="font-bold text-slate-800">
                ₹ {doctor.consultationFee || 500}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              Availability Timings
            </h3>
            <div className="space-y-2">
              {doctor.availability?.timings?.map((shift, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                  <Clock size={16} className="text-primary-500" />{" "}
                  {shift.startTime} - {shift.endTime}
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 pt-3 mt-2 border-t border-slate-200">
                <CalendarDays size={16} className="text-primary-500" />{" "}
                {doctor.availability?.days?.join(", ") || "Mon-Sat"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                <Phone size={18} />
              </div>
              <span className="font-semibold">
                {doctor.phone || "Not Provided"}
              </span>
            </div>
            {doctor.description && (
              <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl">
                <p className="font-bold text-slate-700 mb-1">About</p>
                {doctor.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
