"use client";

import { useState } from "react";
import api from "../Api/PrivateApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const departmentOptions = [
  "Neonatology & Pediatric Department",
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
];

export default function AddDoctorModal({ close }) {
  const queryClient = useQueryClient();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    specialty: "",
    specialization: "",
    experience: "",
    phone: "",
    description: "",
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (file) {
        form.append("photo", file);
      }

      const response = await api.post("/admin/doctors", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Doctor Added Successfully!");

      queryClient.invalidateQueries({
        queryKey: ["admin-doctors"],
      });

      close();
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add doctor");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            Register New Doctor
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
              {file ? "Change Photo" : "Upload Doctor Image"}

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
                value={formData.name || ""}
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
                value={formData.department || ""}
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
                value={formData.specialty || ""}
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
                value={formData.specialization || ""}
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
                value={formData.experience || ""}
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
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
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
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Brief professional summary..."
              className="w-full border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
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
                  Saving...
                </>
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
