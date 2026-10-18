"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../components/Api/publicApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaVenusMars,
} from "react-icons/fa";

const Signup = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const signupUser = async (data) => {
    const res = await api.post("/user/add", data);
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/login");
    },
    onError: (error) => {
      setErrors(error?.response?.data?.errors || {});
      toast.error(error?.response?.data?.message || "Account creation failed");
    },
  });

  const validate = () => {
    const e = {};

    if (!fullName.trim()) e.fullName = "Full name is required";
    else if (fullName.trim().length < 2) e.fullName = "At least 2 characters";
    else if (!/^[A-Za-z ]+$/.test(fullName))
      e.fullName = "Only letters and spaces";

    if (!phone) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(phone)) e.phone = "Must be exactly 10 digits";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      e.email = "Enter a valid email";

    if (!gender) e.gender = "Gender is required";

    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "At least 8 characters";
    else if (!/[a-z]/.test(password)) e.password = "Add a lowercase letter";
    else if (!/[A-Z]/.test(password)) e.password = "Add an uppercase letter";
    else if (!/[0-9]/.test(password)) e.password = "Add a number";
    else if (!/[\W_]/.test(password)) e.password = "Add a special character";

    if (!confirmPassword) e.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";

    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    mutate({
      fullName: fullName.trim(),
      phone,
      email: email.trim().toLowerCase(),
      password,
      gender,
    });
  };

  const inputCls = (field) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
      errors[field]
        ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    }`;

  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-rose-500 text-xs mt-1.5 font-medium">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex">
      {/* ==================== LEFT BRAND PANEL ==================== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* BACKGROUND IMAGE WITH OVERLAY */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/img/hospital/hospital.jpeg"
            alt="SMS Hospital"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* LOGO IMAGE INSTEAD OF ICON */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xl shadow-black/50 group-hover:scale-110 transition-transform overflow-hidden border-2 border-white/20">
              <img
                src="/images/logo/logo.jpeg"
                alt="SMS Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <p className="text-white font-black text-lg tracking-tight">
                SMS Hospital Pvt Ltd
              </p>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">
                Super Medical Speciality Hospital Pvt Ltd
              </p>
            </div>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Join Us for a <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Healthier Tomorrow.
              </span>
            </h2>
            <p className="text-blue-100/90 leading-relaxed text-lg">
              Create your account to book appointments, consult with top
              specialists, and manage your health records — all in one place.
            </p>

            {/* Benefits */}
            <div className="mt-10 space-y-3">
              {[
                "Easy online appointment booking",
                "Access to 50+ expert doctors",
                "Secure medical records",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-blue-100">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm">25,000+ Patients</p>
            <p className="text-blue-300 text-xs">Trust us with their care</p>
          </div>

          <p className="text-xs text-blue-300/60 font-medium">
            © {new Date().getFullYear()} SMS Hospital. All rights reserved.
          </p>
        </div>
      </div>

      {/* ==================== RIGHT FORM PANEL ==================== */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <div className="w-full max-w-md my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-lg overflow-hidden border border-slate-200">
                <img
                  src="/images/logo/logo.jpeg"
                  alt="SMS Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="text-xl font-black text-slate-800">
                SMS Hospital
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-slate-500 text-sm mt-1.5">
                It only takes a minute to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputCls("fullName")}
                    placeholder="Enter your full name"
                  />
                </div>
                <Err field="fullName" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      value={phone}
                      maxLength={10}
                      inputMode="numeric"
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      className={inputCls("phone")}
                      placeholder="9876543210"
                    />
                  </div>
                  <Err field="phone" />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Gender
                  </label>
                  <div className="relative">
                    <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`${inputCls("gender")} cursor-pointer appearance-none`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Err field="gender" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls("email")}
                    placeholder="you@example.com"
                  />
                </div>
                <Err field="email" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCls("password")}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <Err field="password" />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showCPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputCls("confirmPassword")}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPassword(!showCPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showCPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <Err field="confirmPassword" />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-6 pt-6 border-t border-slate-100">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
