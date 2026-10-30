"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function MainLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/");
      return;
    }

    setChecked(true);

    // 👇 30 Minutes Auto Logout Timer
    const SESSION_TIME = 30 * 60 * 1000; // 30 minutes in ms
    const timer = setTimeout(() => {
      localStorage.clear();
      toast.error("Admin session expired! Please login again.");
      router.replace("/");
    }, SESSION_TIME);

    return () => clearTimeout(timer);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-64 min-h-screen flex flex-col">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>

        <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm px-4 md:px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-bold text-slate-700">SMS Hospital</span>.
              All rights reserved.
            </p>
            <p className="flex items-center gap-3">
              <span className="hidden sm:inline">Admin Panel v1.0</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline" />
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
