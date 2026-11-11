"use client";
import api from "../../../components/Api/PrivateApi";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Stepper from "components/Stepper";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
  "Neurology Department",
  "Cardiology Department",
  "Dental Department",
  "General Surgery",
  "Pediatric Surgery",
  "Gastro Surgery",
];

const getTodayLocal = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

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

const IMG_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

const Page = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [inactiveDoctor, setInactiveDoctor] = useState(null);

  const appointments = async (values) => {
    const res = await api.post("/appointment/create", values);
    return res.data;
  };

  const appointmentMutation = useMutation({
    mutationFn: appointments,
    onSuccess: (data) => {
      toast.success("Your appointment has been created!");
      setCreatedAppointment(data.data);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/payment/submit", {
        appointmentId: createdAppointment._id,
        transactionId: transactionId.trim(),
        amount: Number(paidAmount),
      });
      return res.data;
    },
    onSuccess: (data) => {
      setCreatedAppointment((current) => ({
        ...current,
        payment: data.data.payment,
      }));
      setTransactionId("");
      setPaidAmount("");
      toast.success(data.message || "Payment submitted for approval");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit payment details",
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

  const slots = useMemo(() => {
    const selectedDate = appointmentformik.values.appointmentDate;
    if (!selectedDate) return ALL_SLOTS;
    const todayStr = getTodayLocal();
    if (selectedDate !== todayStr) return ALL_SLOTS;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + 15;
    return ALL_SLOTS.filter((s) => s.minutes > currentMinutes);
  }, [appointmentformik.values.appointmentDate]);

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

  useEffect(() => {
    const selected = appointmentformik.values.slot;
    if (!selected) return;
    const stillValid = slots.some((s) => s.label === selected);
    if (!stillValid) {
      appointmentformik.setFieldValue("slot", "");
    }
  }, [appointmentformik.values.appointmentDate]);

  const getImageUrl = (photo) => {
    if (!photo)
      return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
    return photo.startsWith("http")
      ? photo
      : `${IMG_BASE_URL}/${photo.replace(/^\/+/, "")}`;
  };

  const formatAvailabilityDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="w-full">
      <div>
        <Stepper currentStep={createdAppointment ? 2 : 1} />

        {!createdAppointment ? (
          /* ========== STEP 1: FORM SECTION ========== */
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              Book Appointment
            </h2>

            <form
              onSubmit={appointmentformik.handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Enter Your Name"
                  onChange={appointmentformik.handleChange}
                  value={appointmentformik.values.patientName}
                  onBlur={appointmentformik.handleBlur}
                  className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${appointmentformik.errors.patientName && appointmentformik.touched.patientName ? "border-red-400" : "border-slate-200"}`}
                />
                {appointmentformik.errors.patientName &&
                  appointmentformik.touched.patientName && (
                    <p className="text-xs text-red-500 mt-1">
                      {appointmentformik.errors.patientName}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 00000 00000"
                  maxLength={10}
                  onChange={appointmentformik.handleChange}
                  value={appointmentformik.values.phone}
                  onBlur={appointmentformik.handleBlur}
                  className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${appointmentformik.errors.phone && appointmentformik.touched.phone ? "border-red-400" : "border-slate-200"}`}
                />
                {appointmentformik.errors.phone &&
                  appointmentformik.touched.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {appointmentformik.errors.phone}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500">
                  Department
                </label>
                <select
                  name="department"
                  onChange={appointmentformik.handleChange}
                  value={appointmentformik.values.department}
                  onBlur={appointmentformik.handleBlur}
                  className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${appointmentformik.errors.department && appointmentformik.touched.department ? "border-red-400" : "border-slate-200"}`}
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
                    <p className="text-xs text-red-500 mt-1">
                      {appointmentformik.errors.department}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500">
                  Doctor
                </label>
                <select
                  name="doctorId"
                  value={appointmentformik.values.doctorId}
                  onChange={(event) => {
                    const selectedDoctor = doctors.find(
                      (doctor) => doctor._id === event.target.value,
                    );

                    if (selectedDoctor && !selectedDoctor.isAvailable) {
                      appointmentformik.setFieldValue("doctorId", "");
                      setInactiveDoctor(selectedDoctor);
                      return;
                    }

                    setInactiveDoctor(null);
                    appointmentformik.handleChange(event);
                  }}
                  onBlur={appointmentformik.handleBlur}
                  disabled={!doctors.length}
                  className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${appointmentformik.errors.doctorId && appointmentformik.touched.doctorId ? "border-red-400" : "border-slate-200"}`}
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
                    <p className="text-xs text-red-500 mt-1">
                      {appointmentformik.errors.doctorId}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500">
                  Consultation Date
                </label>
                <input
                  name="appointmentDate"
                  type="date"
                  min={getTodayLocal()}
                  onChange={appointmentformik.handleChange}
                  value={appointmentformik.values.appointmentDate}
                  onBlur={appointmentformik.handleBlur}
                  className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${appointmentformik.errors.appointmentDate && appointmentformik.touched.appointmentDate ? "border-red-400" : "border-slate-200"}`}
                />
                {appointmentformik.errors.appointmentDate &&
                  appointmentformik.touched.appointmentDate && (
                    <p className="text-xs text-red-500 mt-1">
                      {appointmentformik.errors.appointmentDate}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500">
                  Available Slot
                </label>
                <select
                  name="slot"
                  value={appointmentformik.values.slot}
                  onChange={appointmentformik.handleChange}
                  onBlur={appointmentformik.handleBlur}
                  disabled={!slots.length}
                  className={`w-full rounded-xl border px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none ${appointmentformik.errors.slot && appointmentformik.touched.slot ? "border-red-400" : "border-slate-200"}`}
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
                    <p className="text-xs text-red-500 mt-1">
                      {appointmentformik.errors.slot}
                    </p>
                  )}
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={appointmentMutation.isPending}
                  className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-all"
                >
                  {appointmentMutation.isPending
                    ? "Confirming..."
                    : "Continue to Review"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========== STEP 2: REVIEW & QR PAYMENT SECTION ========== */
          <div className="space-y-6">
            {/* 1. Doctor Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex items-start gap-5 border-b border-slate-100 pb-6 mb-6">
                <img
                  src={getImageUrl(createdAppointment.doctorId?.photo)}
                  alt={createdAppointment.doctorId?.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Dr.{" "}
                    {createdAppointment.doctorId?.name?.replace(
                      /^Dr\.?\s*/i,
                      "",
                    )}
                  </h2>
                  <p className="text-slate-600 font-semibold text-sm mt-1">
                    {createdAppointment.doctorId?.department || "Specialist"}
                  </p>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {createdAppointment.doctorId?.experience || "10+"} years
                    experience
                  </p>
                  <p className="text-slate-800 font-bold text-sm mt-2">
                    Consult Fee: ₹
                    {createdAppointment.doctorId?.consultationFee || 500}
                  </p>
                </div>
              </div>

              {/* 2. Appointment Details */}
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Appointment Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaHospital />
                  </div>
                  <span className="font-medium">Offline Consultation</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaCalendarAlt />
                  </div>
                  <span className="font-medium">
                    {new Date(
                      createdAppointment.appointmentDate,
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    , {createdAppointment.slot}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaMapMarkerAlt />
                  </div>
                  <span className="font-medium">
                    SMS Hospital Pvt Ltd, Gorakhpur
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Manual Payment Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-slate-900 mb-2">
                  Scan & Pay ₹
                  {createdAppointment?.doctorId?.consultationFee || 500}
                </h2>
                <p className="text-slate-500 text-sm">
                  Scan the QR code below using any UPI app (GPay, PhonePe,
                  Paytm).
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 border-2 border-slate-200 rounded-2xl shadow-sm mb-6">
                  <img
                    src="/images/payment/qr-code.png" // 👈 Apna QR image path yaha daalein
                    alt="Payment QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <div className="w-full max-w-sm space-y-3">
                  {createdAppointment.payment?.isPaid ||
                  createdAppointment.payment?.status === "approved" ? (
                    <div className="rounded-xl bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-700">
                      Payment approved
                    </div>
                  ) : createdAppointment.payment?.status === "pending" ? (
                    <div className="rounded-xl bg-amber-50 p-4 text-center text-sm font-bold text-amber-700">
                      Payment submitted. Waiting for admin approval.
                    </div>
                  ) : (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        paymentMutation.mutate();
                      }}
                      className="space-y-3"
                    >
                      {createdAppointment.payment?.status === "rejected" && (
                        <p className="text-sm font-semibold text-rose-600">
                          Previous payment submission was rejected. Please
                          verify your payment and submit its transaction ID
                          again.
                        </p>
                      )}
                      <label
                        htmlFor="paidAmount"
                        className="block text-left text-xs font-bold uppercase text-slate-500"
                      >
                        Amount Paid (₹)
                      </label>
                      <input
                        id="paidAmount"
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={paidAmount}
                        onChange={(event) => setPaidAmount(event.target.value)}
                        placeholder="Enter the exact amount you paid"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <label
                        htmlFor="transactionId"
                        className="block text-left text-xs font-bold uppercase text-slate-500"
                      >
                        UPI Transaction ID
                      </label>
                      <input
                        id="transactionId"
                        type="text"
                        required
                        maxLength={120}
                        value={transactionId}
                        onChange={(event) =>
                          setTransactionId(event.target.value)
                        }
                        placeholder="Enter the transaction/reference ID"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="submit"
                        disabled={
                          paymentMutation.isPending ||
                          !transactionId.trim() ||
                          !paidAmount ||
                          Number(paidAmount) <= 0
                        }
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {paymentMutation.isPending
                          ? "Submitting..."
                          : "Submit Payment for Approval"}
                      </button>
                    </form>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push("/user/dashboard")}
                    className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Go to dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {inactiveDoctor && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setInactiveDoctor(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inactive-doctor-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <FaClock />
            </div>
            <h2
              id="inactive-doctor-title"
              className="text-xl font-black text-slate-900"
            >
              Doctor temporarily unavailable
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {inactiveDoctor.name} is not accepting appointments right now.
            </p>

            {inactiveDoctor.inactiveFrom && inactiveDoctor.inactiveUntil ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                    Inactive from
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {formatAvailabilityDateTime(inactiveDoctor.inactiveFrom)}
                  </p>
                </div>
                <div className="border-t border-amber-200 pt-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                    Available again from
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {formatAvailabilityDateTime(inactiveDoctor.inactiveUntil)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                This doctor is inactive. Please select another doctor or try
                again later.
              </p>
            )}

            <p className="mt-4 text-xs text-slate-500">
              Please choose another available doctor for your appointment.
            </p>
            <button
              type="button"
              onClick={() => setInactiveDoctor(null)}
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Choose another doctor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
