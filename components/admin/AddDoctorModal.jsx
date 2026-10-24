"use client";

import { useState, useEffect } from "react";
import api from "../Api/PrivateApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2, Clock, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const departmentOptions = [
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AddDoctorModal({ close, editDoctor = null }) {
  const queryClient = useQueryClient();

  const isEdit = !!editDoctor?._id;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [availability, setAvailability] = useState({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    timings: [{ startTime: "10:00 AM", endTime: "05:00 PM" }],
  });

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    specialty: "",
    specialization: "",
    experience: "",
    phone: "",
    description: "",
    consultationFee: "",
  });

  // 👇 Edit mode me existing data pre-fill karo
  useEffect(() => {
    if (editDoctor) {
      setFormData({
        name: editDoctor.name || "",
        department: editDoctor.department || "",
        specialty: editDoctor.specialty || "",
        specialization: editDoctor.specialization || "",
        experience: editDoctor.experience || "",
        phone: editDoctor.phone || "",
        description: editDoctor.description || "",
        consultationFee: editDoctor.consultationFee || 500,
      });

      if (editDoctor.availability) {
        setAvailability(editDoctor.availability);
      }

      if (editDoctor.photo) {
        const baseURL =
          process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
          "http://localhost:5000";
        setPreview(
          editDoctor.photo.startsWith("http")
            ? editDoctor.photo
            : `${baseURL}/${editDoctor.photo}`,
        );
      }
    }
  }, [editDoctor]);

  const toggleDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleAddShift = () => {
    setAvailability((prev) => ({
      ...prev,
      timings: [...prev.timings, { startTime: "", endTime: "" }],
    }));
  };

  const handleRemoveShift = (index) => {
    setAvailability((prev) => ({
      ...prev,
      timings: prev.timings.filter((_, i) => i !== index),
    }));
  };

  const handleShiftChange = (index, field, value) => {
    const updatedTimings = [...availability.timings];
    updatedTimings[index][field] = value;
    setAvailability({ ...availability, timings: updatedTimings });
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        form.append(key, value);
      });

      form.append("availability", JSON.stringify(availability));

      if (file) {
        form.append("photo", file);
      }

      // 👇 POST vs PUT based on mode
      const response = isEdit
        ? await api.put(`/admin/doctors/${editDoctor._id}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post("/admin/doctors", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      return response.data;
    },

    onSuccess: () => {
      toast.success(
        isEdit ? "Doctor Updated Successfully!" : "Doctor Added Successfully!",
      );

      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });

      close();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          (isEdit ? "Failed to update doctor" : "Failed to add doctor"),
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {isEdit ? "Update Doctor" : "Register New Doctor"}
          </h2>

          <button
            type="button"
            onClick={close}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={22} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
          {/* Upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-6 bg-slate-50/50 hover:border-blue-400 transition-all">
            {preview ? (
              <img
                src={preview}
                alt="Doctor Preview"
                className="h-28 w-28 object-cover rounded-2xl mb-3 border-4 border-white shadow-md"
              />
            ) : (
              <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                <Upload size={30} className="text-slate-300" />
              </div>
            )}

            <label className="cursor-pointer text-sm font-bold text-blue-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 hover:bg-blue-50 transition">
              {file
                ? "Change Photo"
                : preview
                  ? "Change Photo"
                  : "Upload Doctor Image"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Rajesh Kumar"
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Department
              </label>
              <select
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Specialty
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="MBBS, MD"
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Heart Surgeon"
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="12 Years"
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Consultation Fee */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black uppercase text-slate-400 ml-2">
                Consultation Fee (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  name="consultationFee"
                  required
                  min={0}
                  value={formData.consultationFee}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full border border-slate-200 p-4 pl-9 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase text-slate-400 ml-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief professional summary..."
              className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-sm font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
              <Clock size={16} /> Consultation Timing
            </h3>

            <div className="space-y-3 mb-4">
              {availability.timings.map((timing, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Start Time (e.g. 10:00 AM)"
                    value={timing.startTime}
                    onChange={(e) =>
                      handleShiftChange(index, "startTime", e.target.value)
                    }
                    className="flex-1 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-slate-400 font-bold">to</span>
                  <input
                    type="text"
                    placeholder="End Time (e.g. 01:00 PM)"
                    value={timing.endTime}
                    onChange={(e) =>
                      handleShiftChange(index, "endTime", e.target.value)
                    }
                    className="flex-1 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {availability.timings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveShift(index)}
                      className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddShift}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 mb-6"
            >
              <Plus size={14} /> Add Another Shift
            </button>

            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                    availability.days.includes(day)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={close}
              className="px-6 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 disabled:opacity-70"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {isEdit ? "Updating..." : "Saving..."}
                </>
              ) : isEdit ? (
                "Update Doctor"
              ) : (
                "Save Doctor Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
