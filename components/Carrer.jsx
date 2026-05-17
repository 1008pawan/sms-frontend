"use client";
import React, { useState } from "react";
import { BsBriefcase, BsMortarboard } from "react-icons/bs";
import api from "./Api/publicApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Carrer = ({ setModal }) => {
  const [errors, setErrors] = useState({});
  const [resumeUrl, setResumeUrl] = useState(null);
  const [carrerData, setCarrerData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    applicationType: "Full-time Job",
    specialization: "General Medicine",
  });

  const carrer = async (data) => {
    const res = await api.post("/carrer/add", data);
    return res.data;
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: carrer,

    onSuccess: () => {
      toast.success("Appointment Submited Successful!");
      setCarrerData({
        fullName: "",
        email: "",
        phoneNumber: "",
        applicationType: "",
        specialization: "",
      });
      setResumeUrl("");
      setModal?.(false);
    },
    onError: (errror) => {
      console.log(
        "Something want wrong please try again",
        errors.response?.data
      );
      setErrors(errror?.response?.data);
    },
  });

  const handelSubmit = () => {
    setErrors({});

    const formData = new FormData();

    formData.append("fullName", carrerData.fullName);
    formData.append("email", carrerData.email);
    formData.append("phoneNumber", carrerData.phoneNumber);
    formData.append("applicationType", carrerData.applicationType);
    formData.append("specialization", carrerData.specialization);

    if (resumeUrl) {
      formData.append("resume", resumeUrl);
    }

    mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl mx-4">
        <div className="rounded-[2rem] overflow-hidden bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-950 to-blue-900 text-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-2xl mb-1">Career Registration</h3>
                <p className="text-white/70 text-sm">
                  Join the world-class medical institute team
                </p>
              </div>

              <button
                onClick={() => setModal?.(false)}
                className="text-white text-xl hover:opacity-80 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-7 bg-white">
            {/* Application Type */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-4">
                Application Type
              </label>

              <div className="grid grid-cols-2 gap-4 mt-2">
                {["Full-time Job", "Internship"].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      checked={carrerData.applicationType === type}
                      onChange={() =>
                        setCarrerData({ ...carrerData, applicationType: type })
                      }
                      className="hidden peer"
                    />
                    <div className="rounded-xl p-4 border border-zinc-200 text-center peer-checked:bg-blue-600 peer-checked:text-white">
                      {type === "Full-time Job" ? (
                        <BsBriefcase className="mx-auto text-3xl mb-1" />
                      ) : (
                        <BsMortarboard className="mx-auto text-3xl mb-1" />
                      )}
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="text-sm font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={carrerData.fullName}
                  onChange={(e) => {
                    setCarrerData({ ...carrerData, fullName: e.target.value });
                  }}
                  placeholder="Enter Your Full Name"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-3"
                  required
                />
                {isError && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors?.errors?.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={carrerData.email}
                  onChange={(e) => {
                    setCarrerData({ ...carrerData, email: e.target.value });
                  }}
                  placeholder="abc@example.com"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-3"
                  required
                />
                {isError && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors?.errors?.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="text-sm font-bold">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={carrerData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setCarrerData({
                        ...carrerData,
                        phoneNumber: value,
                      });
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-3"
                />

                {isError && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors?.errors?.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="specialization" className="text-sm font-bold">
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={carrerData.specialization}
                  onChange={(e) =>
                    setCarrerData({
                      ...carrerData,
                      specialization: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-3"
                >
                  <option>General Medicine</option>
                  <option>Surgery</option>
                  <option>Nursing</option>
                </select>
                {isError && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors?.errors?.specialization}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="resume" className="text-sm font-bold">
                  Upload Resume (PDF)
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  onChange={(e) => setResumeUrl(e.target.files[0])}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-3"
                />
                {isError && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors?.errors?.resumeUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handelSubmit}
              disabled={isPending}
              className="mt-6 w-full cursor-pointer rounded-full bg-blue-950 py-3 text-white font-semibold hover:bg-blue-900"
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrer;
