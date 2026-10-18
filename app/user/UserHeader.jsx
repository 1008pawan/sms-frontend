"use client";
import api from "../../components/Api/PrivateApi";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiLogOut,
  FiMenu,
  FiUser,
  FiChevronDown,
  FiCalendar,
  FiHome, // 👈 Home icon import kiya
} from "react-icons/fi";

const pageTitles = {
  "/user/dashboard": "Dashboard",
  "/user/appointment": "Book Appointment",
  "/user/profile": "My Profile",
  "/user/review": "Reviews",
};

const UserHeader = ({ onMenuClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/me");
      return res.data.data;
    },
  });

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout successful!");
    router.replace("/");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([k]) =>
      pathname?.startsWith(k + "/"),
    )?.[1] ||
    "Dashboard";

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-3">
        {/* Left */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition text-slate-700 shrink-0"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>User</span>
              <span>/</span>
              <span className="text-slate-600 truncate">{pageTitle}</span>
            </div>
            <h1 className="text-base md:text-lg font-black text-slate-800 truncate leading-tight">
              {pageTitle}
            </h1>
          </div>

          {/* 👇 Back to Home Button (Desktop) */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all shrink-0"
            title="Back to Main Website"
          >
            <FiHome size={16} />
            Home
          </Link>
          <div className="hidden md:block w-px h-6 bg-slate-200 mx-1" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Quick book button */}
          {pathname !== "/user/appointment" && (
            <Link
              href="/user/appointment"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <FiCalendar size={14} />
              Book Appointment
            </Link>
          )}

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((p) => !p)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-all"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/30">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">
                  {user?.fullName || "User"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user?.phone || ""}
                </span>
              </div>
              <FiChevronDown
                className={`hidden md:block text-slate-400 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden py-1.5">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.phone || ""}
                  </p>
                </div>

                {/* 👇 Home Link in Dropdown (Mobile users can use this) */}
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  <FiHome className="text-slate-400 w-4 h-4" />
                  Main Website
                </Link>

                <Link
                  href="/user/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  <FiUser className="text-slate-400 w-4 h-4" />
                  My Profile
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
