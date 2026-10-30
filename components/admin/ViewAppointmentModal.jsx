"use client";
import {
  X,
  User,
  Phone,
  Stethoscope,
  Calendar,
  Clock,
  CreditCard,
  Building,
} from "lucide-react";

export default function ViewAppointmentModal({ appointment, onClose }) {
  if (!appointment) return null;

  const isPaid = appointment.payment?.isPaid;
  const isRefunded = appointment.payment?.isRefunded;
  const amount = (appointment.payment?.amount || 0) / 100;

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved")
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    if (s === "rejected") return "bg-rose-50 text-rose-600 border-rose-200";
    return "bg-amber-50 text-amber-600 border-amber-200";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-blue-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-1">
            Appointment Details
          </p>
          <h2 className="text-2xl font-black">
            #{appointment._id.slice(-6).toUpperCase()}
          </h2>
          <div
            className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyle(appointment.status)} bg-white`}
          >
            {appointment.status}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Patient */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Patient
              </p>
              <p className="font-bold text-slate-800">
                {appointment.patientName}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Phone
              </p>
              <p className="font-bold text-slate-800">{appointment.phone}</p>
            </div>
          </div>

          {/* Doctor & Dept */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Stethoscope size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Doctor
                </p>
                <p className="font-bold text-slate-800 text-sm truncate">
                  {appointment.doctorId?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Building size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Dept
                </p>
                <p className="font-bold text-slate-800 text-sm truncate">
                  {appointment.department}
                </p>
              </div>
            </div>
          </div>

          {/* Date & Slot */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Date
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Slot
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {appointment.slot}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={18} className="text-slate-500" />
              <p className="text-xs font-bold text-slate-600 uppercase">
                Payment Status
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p
                  className={`text-sm font-black ${isRefunded ? "text-blue-600" : isPaid ? "text-emerald-600" : "text-rose-500"}`}
                >
                  {isRefunded ? "Refunded" : isPaid ? "Paid" : "Unpaid"}
                </p>
                {isPaid && appointment.payment?.razorpayPaymentId && (
                  <p className="text-[10px] text-slate-400 mt-1 font-mono break-all">
                    ID: {appointment.payment.razorpayPaymentId}
                  </p>
                )}
              </div>
              {amount > 0 && (
                <p className="text-2xl font-black text-slate-800">₹{amount}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 cursor-pointer bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
