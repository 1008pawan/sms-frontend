"use client";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👇 Request Interceptor: Har request me token daalo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👇 Response Interceptor: Agar 401 (Unauthorized) aata hai to logout karo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expire ho gaya
      localStorage.clear();
      toast.error("Session expired. Please login again.");
      window.location.href = "/login"; // Direct login page pe bhej do
    }
    return Promise.reject(error);
  },
);

export default api;
