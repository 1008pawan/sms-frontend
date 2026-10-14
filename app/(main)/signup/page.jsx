"use client";
import { ArrowLeft } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // flat object: { fullName: "...", phone: "...", email: "..." }
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
      // backend ka errors object seedha flat state mein
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
    `w-full p-2 mt-1 rounded-lg border ${
      errors[field] ? "border-red-500" : "border-zinc-300"
    }`;

  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-sm text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-zinc-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-black"
          >
            <div>
              <img
                src="/images/logo/logo.jpeg"
                className="rounded-full h-13 w-13"
                alt=""
              />
            </div>
            SMS Hospital
          </a>

          <button
            onClick={() => router.push("/")}
            className="bg-zinc-200 hover:bg-zinc-300 cursor-pointer p-2 px-3 rounded-lg flex justify-center items-center gap-2"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </nav>

      <div className="bg-blue-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md py-6 rounded-2xl shadow-2xl bg-white">
          <h1 className="text-3xl text-center font-bold mb-5">Signup</h1>

          <form onSubmit={handleSubmit} className="px-8 space-y-3" noValidate>
            {/* Full Name */}
            <div>
              <label className="font-semibold">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputCls("fullName")}
                placeholder="Full Name"
              />
              <Err field="fullName" />
            </div>

            <div className="grid md:grid-cols-12 grid-cols-1 gap-3">
              {/* Phone */}
              <div className="md:col-span-7">
                <label className="font-semibold">Phone Number</label>
                <input
                  value={phone}
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className={inputCls("phone")}
                  placeholder="Phone Number"
                />
                <Err field="phone" />
              </div>

              {/* Gender */}
              <div className="md:col-span-5">
                <label className="font-semibold">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputCls("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <Err field="gender" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls("email")}
                placeholder="Email (used for password reset)"
              />
              <Err field="email" />
            </div>

            {/* Password */}
            <div>
              <label className="font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls("password")}
                  placeholder="Password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <Err field="password" />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-semibold">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls("confirmPassword")}
                  placeholder="Confirm Password"
                />
                <span
                  onClick={() => setShowCPassword(!showCPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showCPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <Err field="confirmPassword" />
            </div>

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
    </>
  );
};

export default Signup;
