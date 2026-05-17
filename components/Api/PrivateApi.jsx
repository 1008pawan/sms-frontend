"use client";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";
const token =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export default api;
