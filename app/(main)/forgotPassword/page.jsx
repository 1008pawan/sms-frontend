"use client";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHeartbeat } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [showReset, setShowReset] = useState(false);

  const validationSchema = Yup.object().shape({
    otp: Yup.string().required("OTP is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });
  const API = "http://localhost:5000/otp";

  // 🔥 SEND OTP
  const sendOTPMutation = useMutation({
    mutationFn: async () => {
      if (!phone) throw new Error("Phone number is required");

      const { data } = await axios.post(`${API}/request-otp`, { phone });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully");
      setShowReset(true);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    },
  });

  // 🔥 VERIFY OTP + RESET PASSWORD
  const verifyOTPMutation = useMutation({
    mutationFn: async ({ otp, password }) => {
      await axios.post(`${API}/verify-otp`, {
        phone,
        otp,
      });

      return axios.post(`${API}/reset-password`, {
        phone,
        newPassword: password,
      });
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/user/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid OTP");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <FaHeartbeat className="text-blue-600 text-xl" />
          <span className="text-xl font-bold">SMS Hospital</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">Forgot Password?</h1>
        <p className="text-gray-500 mb-8 text-center">
          Enter your phone number and we'll send you an OTP.
        </p>

        {/* PHONE FORM */}
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            sendOTPMutation.mutate();
          }}
        >
          <input
            type="tel"
            className="w-full px-4 py-3 border rounded-lg mb-4"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            required
          />
          <button
            type="submit"
            disabled={sendOTPMutation.isPending}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold"
          >
            {sendOTPMutation.isPending ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* OTP + RESET */}
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
            {({ values, handleChange, handleSubmit, errors }) => (
              <form className="w-full mt-6" onSubmit={handleSubmit}>
                <input
                  name="otp"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={values.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg mb-2"
                />
                {errors.otp && (
                  <p className="text-red-500 text-xs">{errors.otp}</p>
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg mt-3 mb-2"
                />

                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirm Password"
                  value={values.confirm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg mb-2"
                />

                <button
                  type="submit"
                  disabled={verifyOTPMutation.isPending}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold mt-2"
                >
                  {verifyOTPMutation.isPending
                    ? "Verifying..."
                    : "Reset Password"}
                </button>
              </form>
            )}
          </Formik>
        )}

        <a href="/user/login" className="mt-6 text-orange-600">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;
