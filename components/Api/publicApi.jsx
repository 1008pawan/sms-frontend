"use client";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
