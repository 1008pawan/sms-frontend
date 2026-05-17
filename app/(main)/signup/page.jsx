"use client";
import api from "../../../components/Api/publicApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const signupUser = async (data) => {
    const res = await api.post("/user/add", data);
    return res.data;
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: signupUser,

    onSuccess: () => {
      toast.success("Account created successfully");
      setFullName("");
      setPhone("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    },

    onError: (error) => {
      setErrors(error?.response?.data || {});
      toast.error(error?.response?.data?.message || "Account creation failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    mutate({
      fullName,
      phone,
      password,
      gender,
    });
  };

  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md py-6 rounded-2xl shadow-2xl bg-white">
        <h1 className="text-3xl text-center font-bold mb-5">Signup</h1>

        <form onSubmit={handleSubmit} className="px-8 space-y-3">
          {/* Full Name */}
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full p-2 mt-1 rounded-lg border ${
                errors?.errors?.fullName ? "border-red-500" : "border-zinc-300"
              }`}
              placeholder="Full Name"
            />
            {isError && errors?.errors?.fullName && (
              <p className="text-sm text-red-500">{errors.errors.fullName}</p>
            )}
          </div>

          <div className="grid md:grid-cols-12 grid-cols-1 gap-3">
            {/* Phone */}
            <div className="md:col-span-7">
              <label className="font-semibold">Phone Number</label>
              <input
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-2 mt-1 rounded-lg border ${
                  errors?.errors?.phone ? "border-red-500" : "border-zinc-300"
                }`}
                placeholder="Phone Number"
              />
              {isError && errors?.errors?.phone && (
                <p className="text-sm text-red-500">{errors.errors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <div className="md:col-span-5">
              <label className="font-semibold">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full p-2 mt-1 rounded-lg border ${
                  errors?.errors?.gender ? "border-red-500" : "border-zinc-300"
                }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {isError && errors?.errors?.gender && (
                <p className="text-sm text-red-500">{errors.errors.gender}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 mt-1 rounded-lg border ${
                  errors?.errors?.password
                    ? "border-red-500"
                    : "border-zinc-300"
                }`}
                placeholder="Password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {isError && errors?.errors?.password && (
              <p className="text-sm text-red-500">{errors.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-2 mt-1 rounded-lg border ${
                  errors?.confirmPassword ? "border-red-500" : "border-zinc-300"
                }`}
                placeholder="Confirm Password"
              />
              <span
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showCPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {isError && errors?.errors?.password && (
              <p className="text-sm text-red-500">{errors.errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            disabled={isPending}
            className="w-full py-2 text-lg font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 font-semibold">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
