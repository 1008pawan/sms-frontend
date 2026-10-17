"use client";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaKey,
  FaArrowLeft,
  FaEye,
  FaEyeSlash, // 👈 Naya import
} from "react-icons/fa";
import * as Yup from "yup";
import api from "components/Api/PrivateApi";
import axios from "axios"; // 👈 MISSING THA, YE ZAROORI HAI

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  // 👇 Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 👇 Backend ki strict validation
  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .required("OTP is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[0-9]/, "Must contain a number")
      .matches(/[\W_]/, "Must contain a special character")
      .required("Password is required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const API = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/otp`
    : "http://localhost:5000/api/otp";

  // 🔥 SEND OTP
  const sendOTPMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("Email is required");
      const { data } = await api.post(`${API}/request-otp`, { email });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent to your email");
      setShowReset(true);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Failed to send OTP",
      );
    },
  });

  // 🔥 VERIFY & RESET
  const verifyOTPMutation = useMutation({
    mutationFn: async ({ otp, password }) => {
      await axios.post(`${API}/verify-otp`, { email, otp });
      return axios.post(`${API}/reset-password`, {
        email,
        newPassword: password,
      });
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid OTP");
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* ==================== LEFT BRAND PANEL (Desktop) ==================== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
              <FaHeartbeat className="text-white text-xl" />
            </div>
            <div>
              <p className="text-white font-black text-lg tracking-tight">
                SMS Hospital
              </p>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">
                Super Speciality
              </p>
            </div>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Secure your account <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                in just a few steps.
              </span>
            </h2>
            <p className="text-blue-100/80 leading-relaxed">
              We'll send a verification OTP to your registered email. Enter it
              below along with your new password to regain access.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { n: 1, text: "Enter your registered email address" },
                { n: 2, text: "Check your inbox for the OTP" },
                { n: 3, text: "Create a new secure password" },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center font-black text-xs shrink-0">
                    {step.n}
                  </div>
                  <p className="text-sm text-blue-100 pt-1.5">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-blue-300/60">
            © {new Date().getFullYear()} SMS Hospital. All rights reserved.
          </p>
        </div>
      </div>

      {/* ==================== RIGHT FORM PANEL ==================== */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="text-xl font-black text-slate-800">
                SMS Hospital
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8 flex flex-col justify-center items-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
                <FaLock className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-slate-500 text-sm mt-1.5 text-center">
                {showReset
                  ? "Enter the OTP sent to your email and set a new password."
                  : "No worries — enter your registered email and we'll send you an OTP."}
              </p>
            </div>

            {/* EMAIL FORM */}
            {!showReset && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendOTPMutation.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sendOTPMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendOTPMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <FaKey />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP + RESET FORM */}
            {showReset && (
              <Formik
                initialValues={{ otp: "", password: "", confirm: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) =>
                  verifyOTPMutation.mutate({
                    otp: values.otp,
                    password: values.password,
                  })
                }
              >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* OTP */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        OTP
                      </label>
                      <input
                        name="otp"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={values.otp}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition tracking-widest text-center font-bold text-lg ${
                          errors.otp && touched.otp
                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                      {errors.otp && touched.otp && (
                        <p className="text-rose-500 text-xs mt-1 font-medium">
                          {errors.otp}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type={showPassword ? "text" : "password"} // 👈 Toggle type
                          name="password"
                          placeholder="At least 8 characters"
                          value={values.password}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border outline-none transition ${
                            errors.password && touched.password
                              ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          }`}
                        />
                        {/* 👇 EYE BUTTON */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <p className="text-rose-500 text-xs mt-1 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type={showConfirmPassword ? "text" : "password"} // 👈 Toggle type
                          name="confirm"
                          placeholder="Re-enter new password"
                          value={values.confirm}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border outline-none transition ${
                            errors.confirm && touched.confirm
                              ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          }`}
                        />
                        {/* 👇 EYE BUTTON */}
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.confirm && touched.confirm && (
                        <p className="text-rose-500 text-xs mt-1 font-medium">
                          {errors.confirm}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={verifyOTPMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                      {verifyOTPMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>
                )}
              </Formik>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
              >
                <FaArrowLeft size={12} />
                Back to Login
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Your data is protected with industry-standard encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;