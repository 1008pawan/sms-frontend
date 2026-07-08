"use client";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";
const token =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
