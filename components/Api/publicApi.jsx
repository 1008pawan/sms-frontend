"use client";
import axios from "axios";

// const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE ??  "http://localhost:8000/api";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  // },
});

export default api;
