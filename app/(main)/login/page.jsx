"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserShield,
  FaLock,
  FaPhoneAlt,
} from "react-icons/fa";
import api from "../../../components/Api/publicApi";
import { useMutation } from "@tanstack/react-query";

const UserLoginSchema = Yup.object({
  identifier: Yup.string()
    .trim()
    .required("Phone number or email is required")
    .test("phone-or-email", "Enter a valid 10 digit phone or email", (v) => {
      if (!v) return false;
      return /^[0-9]{10}$/.test(v) || /^\S+@\S+\.\S+$/.test(v);
    }),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  /* ================= USER LOGIN ================= */
  const userLogin = async (values) => {
    const res = await api.post("/user/authenticate", values);
    return res.data;
  };

  const userMutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      if (!data?.token) {
        toast.error("Login failed. Please try again.");
        return;
      }
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back!");
      userFormik.resetForm();
      router.replace("/user/dashboard");
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });

  const userFormik = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema: UserLoginSchema,
    onSubmit: (values) => userMutation.mutate(values),
  });

  /* ================= ADMIN LOGIN ================= */
  const [adminData, setAdminData] = useState({ phone: "", password: "" });
  const [adminErrors, setAdminErrors] = useState({});

  const adminLogin = async (data) => {
    const res = await api.post("/admin/login", data);
    return res.data;
  };

  const adminMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      if (data?.admin?.role !== "admin") {
        toast.error("Admin access only");
        return;
      }
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("user", JSON.stringify(data.admin));
      toast.success("Admin login successful");
      setAdminData({ phone: "", password: "" });
      router.replace("/admin/dashboard");
    },
    onError: (err) => {
      setAdminErrors(err?.response?.data || {});
      toast.error(err?.response?.data?.message || "Admin login failed");
    },
  });

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAdminErrors({});
    adminMutation.mutate(adminData);
  };

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
          {/* Dark overlay taaki text clear dikhe */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            {/* LOGO IMAGE INSTEAD OF ICON */}
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
                Super Medical Speciality
              </p>
            </div>
          </Link>

          {/* Content (Fake patient data removed) */}
          <div className="max-w-md">
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Your Health, <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Our Priority.
              </span>
            </h2>
            <p className="text-blue-100/90 leading-relaxed text-lg">
              Welcome back to SMS Hospital. Access your dashboard to book
              appointments, view medical records, and connect with our
              specialists.
            </p>
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
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              {/* 👇 Mobile Logo Image */}
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

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-500 text-sm mt-1.5">
                Please sign in to your account
              </p>
            </div>

            {/* ROLE TABS */}
            <div className="flex mb-6 bg-slate-100 p-1.5 rounded-xl">
              {[
                { id: "user", label: "Patient", icon: FaUser },
                { id: "admin", label: "Admin", icon: FaUserShield },
              ].map((r) => {
                const Icon = r.icon;
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon size={14} />
                    {r.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* USER FORM */}
              {role === "user" && (
                <motion.form
                  key="user"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={userFormik.handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Phone or Email
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        name="identifier"
                        value={userFormik.values.identifier}
                        onChange={userFormik.handleChange}
                        onBlur={userFormik.handleBlur}
                        placeholder="Enter phone or email"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          userFormik.touched.identifier &&
                          userFormik.errors.identifier
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                    {userFormik.touched.identifier &&
                      userFormik.errors.identifier && (
                        <p className="text-rose-500 text-xs mt-1 font-medium">
                          {userFormik.errors.identifier}
                        </p>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Password
                      </label>
                      <Link
                        href="/forgotPassword"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={userFormik.values.password}
                        onChange={userFormik.handleChange}
                        placeholder="Enter password"
                        className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={userMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {userMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <p className="text-center text-sm text-slate-500 mt-6 pt-6 border-t border-slate-100">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-bold text-blue-600 hover:text-blue-700"
                    >
                      Create one
                    </Link>
                  </p>
                </motion.form>
              )}

              {/* ADMIN FORM */}
              {role === "admin" && (
                <motion.form
                  key="admin"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAdminSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Admin Phone
                    </label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        value={adminData.phone}
                        onChange={(e) =>
                          setAdminData({ ...adminData, phone: e.target.value })
                        }
                        placeholder="Enter admin phone number"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition ${
                          adminErrors.phone
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                    </div>
                    {adminErrors.phone && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">
                        {adminErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type={showCPassword ? "text" : "password"}
                        value={adminData.password}
                        onChange={(e) =>
                          setAdminData({
                            ...adminData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter password"
                        className={`w-full pl-11 pr-11 py-3 rounded-xl border outline-none transition ${
                          adminErrors.password
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCPassword(!showCPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showCPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {adminErrors.password && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">
                        {adminErrors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={adminMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold rounded-xl shadow-lg shadow-slate-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {adminMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                        Authenticating...
                      </>
                    ) : (
                      "Access Dashboard"
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-6 pt-6 border-t border-slate-100">
                    Protected by enterprise-grade security.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
