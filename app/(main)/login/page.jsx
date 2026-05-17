"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaHeartbeat } from "react-icons/fa";
import api from "@/components/Api/publicApi";
import { ArrowLeft } from "lucide-react";

const UserLoginSchema = Yup.object({
  phone: Yup.string().required("Phone Number is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const userLogin = async (values) => {
    const res = await api.post("/user/authenticate", values);
    return res.data;
  };

  const userMutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("User login successful");
      userFormik.resetForm();
      router.replace("/user/dashboard");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Login failed");
    },
  });

  const userFormik = useFormik({
    initialValues: { phone: "", password: "" },
    validationSchema: UserLoginSchema,
    onSubmit: (values) => userMutation.mutate(values),
  });

  const [adminData, setAdminData] = useState({
    phone: "",
    password: "",
  });
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
    },
  });

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAdminErrors({});
    adminMutation.mutate(adminData);
  };

  return (
    <div className="bg-blue-100 min-h-screen">
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
      <div className="h-[90vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            {["user", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`w-1/2 py-2 rounded-full font-semibold cursor-pointer transition ${
                  role === r ? "bg-blue-500 text-white" : "text-gray-600"
                }`}
              >
                {r === "user" ? "User" : "Admin"}
              </button>
            ))}
          </div>

          {role === "user" && (
            <form onSubmit={userFormik.handleSubmit} className="space-y-4">
              <div className="mb-1">
                <label className="font-semibold">Phone Number</label>
                <input
                  name="phone"
                  value={userFormik.values.phone}
                  onChange={userFormik.handleChange}
                  placeholder="Enter your Phone Number"
                  className="w-full p-2 mt-1 rounded-lg border border-zinc-300"
                />
                {userFormik.touched.phone && userFormik.errors.phone && (
                  <p className="text-sm text-red-500">
                    {userFormik.errors.phone}
                  </p>
                )}
              </div>

              <div className="mb-0 text-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-500 font-semibold"
                >
                  Forgot password?
                </a>
              </div>

              <div>
                <label className="font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userFormik.values.password}
                    onChange={userFormik.handleChange}
                    placeholder="Enter your Password"
                    className="w-full p-2 mt-1 rounded-lg border border-zinc-300"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button
                disabled={userMutation.isPending}
                className="w-full py-2 rounded-full cursor-pointer bg-blue-500 text-white font-semibold"
              >
                {userMutation.isPending ? "Logging in..." : "Login as User"}
              </button>

              <div className="m-0">
                <p className="text-center text-sm">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-blue-500 font-semibold">
                    Signup
                  </a>
                </p>
              </div>
            </form>
          )}

          {role === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="font-semibold">Phone Number</label>
                <input
                  value={adminData.phone}
                  placeholder="Enter your Phone Number"
                  onChange={(e) =>
                    setAdminData({ ...adminData, phone: e.target.value })
                  }
                  className="w-full p-2 mt-1 rounded-lg border border-zinc-300"
                />
              </div>

              <div>
                <label className="font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showCPassword ? "text" : "password"}
                    value={adminData.password}
                    placeholder="Enter your Password"
                    onChange={(e) =>
                      setAdminData({ ...adminData, password: e.target.value })
                    }
                    className="w-full p-2 mt-1 rounded-lg border border-zinc-300"
                  />
                  <span
                    onClick={() => setShowCPassword(!showCPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600"
                  >
                    {showCPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button
                disabled={adminMutation.isPending}
                className="w-full py-2 rounded-full cursor-pointer bg-blue-500 text-white font-semibold"
              >
                {adminMutation.isPending ? "Logging in..." : "Login as Admin"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
