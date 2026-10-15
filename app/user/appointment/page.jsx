"use client";
import api from "../../../components/Api/PrivateApi";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import RazorpayButton from "components/Payment/RazorpayButton";

const DEPARTMENTS = [
  "Neonatology & Pediatrician Department",
  "General Medicine",
  "Orthopedic Department",
  "Surgery Department",
  "Gynecology Department",
  "Urology Department",
  "Psychiatric Department",
  "ENT Department",
  "Pathology Department",
  "Neurology",
  "Cardiology",
  "Dental Department",
  "General Surgery",
  "Pediatric Surgery",
  "Gastro Surgery",
];

/* ---------- Local date helper (timezone-safe) ---------- */
const getTodayLocal = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/* ---------- Slot generator ---------- */
const generateSlots = () => {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  const interval = 10;
  let totalMinutes = startHour * 60;
  const endMinutes = endHour * 60;
  while (totalMinutes < endMinutes) {
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const paddedMinutes = minutes.toString().padStart(2, "0");
    slots.push({
      label: `${hours12}:${paddedMinutes} ${period}`,
      minutes: totalMinutes,
    });
    totalMinutes += interval;
  }

  return slots;
};

const ALL_SLOTS = generateSlots();

const AppointmentSchema = Yup.object().shape({
  patientName: Yup.string()
    .min(2, "Too Short")
    .max(50, "Too Long")
    .required("Patient name is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number")
    .required("Phone number is required"),
  department: Yup.string()
    .oneOf(DEPARTMENTS, "Please choose a valid department")
    .required("Choose your department"),
  doctorId: Yup.string().required("Please select a doctor"),
  slot: Yup.string().required("Please select a time slot"),
  appointmentDate: Yup.date()
    .required("Appointment date is required")
    .typeError("Invalid date")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Past date is not allowed"),
});

const Page = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  const appointments = async (values) => {
    const res = await api.post("/appointment/create", values);
    return res.data;
  };

  const appointmentMutation = useMutation({
    mutationFn: appointments,
    onSuccess: (data) => {
      toast.success("Your appointment has been booked successfully!");
      setCreatedAppointment(data.data);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    },
  });

  const appointmentformik = useFormik({
    initialValues: {
      patientName: "",
      phone: "",
      department: "",
      doctorId: "",
      appointmentDate: "",
      slot: "",
    },
    validationSchema: AppointmentSchema,
    onSubmit: (values) => {
      appointmentMutation.mutate(values);
    },
  });

  /* ---------- Available slots ---------- */
  const slots = useMemo(() => {
    const selectedDate = appointmentformik.values.appointmentDate;
    if (!selectedDate) return ALL_SLOTS;
    const todayStr = getTodayLocal();
    if (selectedDate !== todayStr) return ALL_SLOTS;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + 15;
    return ALL_SLOTS.filter((s) => s.minutes > currentMinutes);
  }, [appointmentformik.values.appointmentDate]);

  /* ---------- Fetch doctors by department ---------- */
  useEffect(() => {
    const department = appointmentformik.values.department;

    if (!department) {
      setDoctors([]);
      appointmentformik.setFieldValue("doctorId", "");
      return;
    }

    api
      .get(`/admin/doctors`, { params: { department } })
      .then((res) => {
        setDoctors(res.data.data);
        appointmentformik.setFieldValue("doctorId", "");
      })
      .catch((err) => {
        console.error("API Error:", err);
        setDoctors([]);
      });
  }, [appointmentformik.values.department]);

  /* ---------- Reset slot if invalid ---------- */
  useEffect(() => {
    const selected = appointmentformik.values.slot;
    if (!selected) return;

    const stillValid = slots.some((s) => s.label === selected);
    if (!stillValid) {
      appointmentformik.setFieldValue("slot", "");
    }
  }, [appointmentformik.values.appointmentDate]);

  return (
    <div className="w-full">
      <div>
        <h2 className="text-3xl font-bold mb-6">Book Appointment</h2>

        {!createdAppointment ? (
          /* ========== FORM SECTION ========== */
          <div>
            <div className="rounded-xl bg-white p-8 md:p-10 shadow-xl inset-shadow-sm/30 border border-blue-100">
              <form
                onSubmit={appointmentformik.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Patient Name */}
                <div>
                  <label
                    htmlFor="patientName"
                    className="block text-xs font-bold uppercase mb-2"
                  >
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    placeholder="Enter Your Name"
                    required
                    onChange={appointmentformik.handleChange}
                    value={appointmentformik.values.patientName}
                    onBlur={appointmentformik.handleBlur}
                    className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      appointmentformik.errors.patientName &&
                      appointmentformik.touched.patientName
                        ? "border-red-400"
                        : "border-zinc-300"
                    }`}
                  />
                  {appointmentformik.errors.patientName &&
                    appointmentformik.touched.patientName && (
                      <p className="text-xs text-red-500 my-0.5">
                        {appointmentformik.errors.patientName}
                      </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold uppercase mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 00000 00000"
                    maxLength={10}
                    onChange={appointmentformik.handleChange}
                    value={appointmentformik.values.phone}
                    onBlur={appointmentformik.handleBlur}
                    className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      appointmentformik.errors.phone &&
                      appointmentformik.touched.phone
                        ? "border-red-400"
                        : "border-zinc-300"
                    }`}
                  />
                  {appointmentformik.errors.phone &&
                    appointmentformik.touched.phone && (
                      <p className="text-red-500 text-xs my-0.5">
                        {appointmentformik.errors.phone}
                      </p>
                    )}
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    className="block text-xs font-bold uppercase mb-2"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    onChange={appointmentformik.handleChange}
                    value={appointmentformik.values.department}
                    onBlur={appointmentformik.handleBlur}
                    className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      appointmentformik.errors.department &&
                      appointmentformik.touched.department
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Choose Dept...
                    </option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {appointmentformik.errors.department &&
                    appointmentformik.touched.department && (
                      <p className="text-red-500 text-xs my-0.5">
                        {appointmentformik.errors.department}
                      </p>
                    )}
                </div>

                {/* Doctor */}
                <div>
                  <label
                    htmlFor="doctorId"
                    className="block text-xs font-bold uppercase mb-2"
                  >
                    Doctor
                  </label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={appointmentformik.values.doctorId}
                    onChange={appointmentformik.handleChange}
                    onBlur={appointmentformik.handleBlur}
                    disabled={!doctors.length}
                    className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      appointmentformik.errors.doctorId &&
                      appointmentformik.touched.doctorId
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                  {appointmentformik.errors.doctorId &&
                    appointmentformik.touched.doctorId && (
                      <p className="text-red-500 text-xs my-0.5">
                        {appointmentformik.errors.doctorId}
                      </p>
                    )}
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="block text-xs font-bold uppercase mb-2"
                  >
                    Consultation Date
                  </label>
                  <input
                    id="appointmentDate"
                    name="appointmentDate"
                    type="date"
                    required
                    min={getTodayLocal()}
                    onChange={appointmentformik.handleChange}
                    value={appointmentformik.values.appointmentDate}
                    onBlur={appointmentformik.handleBlur}
                    className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      appointmentformik.errors.appointmentDate &&
                      appointmentformik.touched.appointmentDate
                        ? "border-red-400"
                        : "border-zinc-300"
                    }`}
                  />
                  {appointmentformik.errors.appointmentDate &&
                    appointmentformik.touched.appointmentDate && (
                      <p className="text-red-500 text-xs my-0.5">
                        {appointmentformik.errors.appointmentDate}
                      </p>
                    )}
                </div>

                {/* Slots */}
                <div>
                  <label
                    htmlFor="slot"
                    className="block text-xs font-bold uppercase mb-2"
                  >
                    Available Slot
                  </label>
                  <select
                    id="slot"
                    name="slot"
                    value={appointmentformik.values.slot}
                    onChange={appointmentformik.handleChange}
                    onBlur={appointmentformik.handleBlur}
                    disabled={!slots.length}
                    className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      appointmentformik.errors.slot &&
                      appointmentformik.touched.slot
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      {slots.length === 0
                        ? "No slots available for today"
                        : "Select a time slot"}
                    </option>
                    {slots.map((slot) => (
                      <option key={slot.label} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {appointmentformik.errors.slot &&
                    appointmentformik.touched.slot && (
                      <p className="text-red-500 text-xs my-0.5">
                        {appointmentformik.errors.slot}
                      </p>
                    )}
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={appointmentMutation.isPending}
                    className="w-full rounded-full bg-gradient-to-r cursor-pointer from-blue-600 to-blue-800 py-4 text-lg font-bold text-white shadow hover:shadow-xl hover:-translate-y-0.5 transition"
                  >
                    {appointmentMutation.isPending
                      ? "Confirming Appointment..."
                      : "Confirm Appointment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* ========== PAYMENT SECTION ========== */
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              {/* ===== Gradient Header ===== */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 px-6 pt-8 pb-20 text-white overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/10" />
                <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

                <div className="relative text-center">
                  {/* Success icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-5 shadow-xl">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="text-3xl font-black tracking-tight">
                    Appointment Booked!
                  </h3>
                  <p className="text-indigo-100 mt-2 max-w-sm mx-auto">
                    Almost there! Complete the payment to confirm your
                    appointment.
                  </p>
                </div>
              </div>

              {/* ===== Amount Card (overlapping) ===== */}
              <div className="relative px-6 -mt-14">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Amount to Pay
                      </p>
                      <p className="text-4xl font-black text-slate-900 mt-1">
                        ₹
                        {createdAppointment?.doctorId?.consultationFee
                          ? createdAppointment.doctorId.consultationFee.toLocaleString(
                              "en-IN",
                            )
                          : createdAppointment?.payment?.amount
                            ? (
                                createdAppointment.payment.amount / 100
                              ).toLocaleString("en-IN")
                            : "500"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Consultation Fee (one-time)
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Booking Details ===== */}
              <div className="px-6 pt-6 pb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                  Booking Summary
                </p>

                <div className="space-y-3">
                  {/* Patient */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Patient
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {createdAppointment.patientName}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Consultation Date
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(
                          createdAppointment.appointmentDate,
                        ).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Slot */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path strokeLinecap="round" d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Time Slot
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {createdAppointment.slot}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-zinc-500">Consultation Fee:</span>
                    <span className="font-bold text-indigo-600">
                      ₹
                      {createdAppointment?.payment?.amount
                        ? (
                            createdAppointment.payment.amount / 100
                          ).toLocaleString("en-IN")
                        : "500"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===== Pay Button ===== */}
              <div className="px-6 pb-4">
                <RazorpayButton
                  appointmentId={createdAppointment._id}
                  patientName={createdAppointment.patientName}
                  amount={createdAppointment?.doctorId?.consultationFee || 500}
                  isPaid={createdAppointment?.payment?.isPaid}
                  isRefunded={createdAppointment?.payment?.isRefunded}
                  onSuccess={() => {
                    router.push("/user/dashboard");
                  }}
                />
              </div>

              {/* ===== Pay Later ===== */}
              {!createdAppointment?.payment?.isPaid &&
                !createdAppointment?.payment?.isRefunded && (
                  <div className="px-6 pb-5">
                    <button
                      onClick={() => router.push("/user/dashboard")}
                      className="w-full py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      I'll pay later →
                    </button>
                  </div>
                )}

              {/* ===== Footer ===== */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <svg
                  className="w-3.5 h-3.5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>
                  100% Secure Payment • Powered by <b>Razorpay</b>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
