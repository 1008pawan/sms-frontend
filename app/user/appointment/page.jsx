"use client";
import api from "@/components/Api/PrivateApi";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useEffect, useState } from "react";

const AppointmentSchema = Yup.object().shape({
  patientName: Yup.string()
    .min(2, "Too Short")
    .max(50, "Too Long")
    .required("Patient name is required"),

  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number")
    .required("Phone number is required"),

  department: Yup.string().required("Choose your department"),
  doctorId: Yup.string().required("Please select a doctor"),
  appointmentDate: Yup.date()
    .required("Appointment date is required")
    .typeError("Invalid date"),

  slot: Yup.string().required("Please select a time slot"),
});

const page = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);

  const slots = ["10:00 AM", "12:30 PM", "04:00 PM", "06:30 PM"];

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
        error.response?.data?.message || "Failed to book appointment"
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

 useEffect(() => {
  const department = appointmentformik.values.department;

  if (!department) {
    setDoctors([]);
    appointmentformik.setFieldValue("doctorId", "");
    return;
  }

  api
    .get(`/admin/doctors?department=${department}`)   // ✅ FIXED URL
    .then((res) => {
      setDoctors(res.data.data);
      appointmentformik.setFieldValue("doctorId", "");
    })
    .catch((err) => {
      console.error("API Error:", err);
      setDoctors([]);
    });
}, [appointmentformik.values.department]);

  return (
    <div className="w-full shadow-md">
      {/* Appointment Form */}
      <div className="p-3 md:p-8">
        <h2 className="text-3xl font-bold mb-6">Book Appointment</h2>
        <div className="">
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
                  <option value="Neonatology & Pediatric Department">Neonatology & Pediatric Department</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Orthopedic Department">Orthopedic Department</option>
                  <option value="Surgery Department">Surgery Department</option>
                  <option value="Gynecology Department">Gynecology Department</option>
                  <option value="Urology Department">Urology Department</option>
                  <option value="Psychiatric Department">Psychiatric Department</option>
                  <option value="ENT Department">ENT Department</option>
                  <option value="Pathology Department">Pathology Department</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dental Department">Dental Department</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Pediatric Surgery">Pediatric Surgery</option>
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
                  min={new Date().toISOString().split("T")[0]} // for block back date picker
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
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase mb-4">
                  Available Slots
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <label key={slot} className="cursor-pointer">
                      <input
                        type="radio"
                        name="slot"
                        value={slot}
                        checked={appointmentformik.values.slot === slot}
                        onChange={appointmentformik.handleChange}
                        onBlur={appointmentformik.handleBlur}
                        className="peer hidden"
                      />
                      <div
                        className={`rounded-xl border font-semibold px-4 py-2 text-center
                        peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600
                        ${
                          appointmentformik.errors.slot &&
                          appointmentformik.touched.slot
                            ? "border-red-400"
                            : "border-zinc-300"
                        }`}
                      >
                        {slot}
                      </div>
                    </label>
                  ))}
                </div>
                {appointmentformik.errors.slot &&
                  appointmentformik.touched.slot && (
                    <p className="text-red-500 text-xs mt-2">
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
