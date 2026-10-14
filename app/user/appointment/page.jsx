"use client";
import api from "../../../components/Api/PrivateApi";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";

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

/* ---------- Slot generator (module-level, ek hi baar) ---------- */
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

const page = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);

  const appointments = async (values) => {
    const res = await api.post("/appointment/create", values);
    return res.data;
  };

  const appointmentMutation = useMutation({
    mutationFn: appointments,

    onSuccess: () => {
      toast.success("Your appointment has been booked successfully!");
      appointmentformik.resetForm();
      router.push("/user/dashboard");
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

  /* ---------- Available slots (memoized) ---------- */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentformik.values.department]);

  /* ---------- Reset slot if invalid after date change ---------- */
  useEffect(() => {
    const selected = appointmentformik.values.slot;
    if (!selected) return;

    const stillValid = slots.some((s) => s.label === selected);
    if (!stillValid) {
      appointmentformik.setFieldValue("slot", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentformik.values.appointmentDate]);

  return (
    <div className="w-full shadow-md">
      <div className="p-3 md:p-8">
        <h2 className="text-3xl font-bold mb-6">Book Appointment</h2>
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
      </div>
    </div>
  );
};

export default page;
