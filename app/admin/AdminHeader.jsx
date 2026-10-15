"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiLogOut, FiMenu, FiUser, FiChevronDown, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Users", href: "/admin/usersList" },
  { name: "Appointments", href: "/admin/appointmentList" },
  { name: "Carrer", href: "/admin/carrer" },
  { name: "Reviews", href: "/admin/reviews" },
  { name: "Doctors", href: "/admin/doctors" },
];

// Page title map
const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/usersList": "Users",
  "/admin/appointmentList": "Appointments",
  "/admin/carrer": "Career Applications",
  "/admin/reviews": "Reviews",
  "/admin/doctors": "Doctors",
};

const AdminHeader = ({ onMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setAdmin(JSON.parse(user));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Admin logout successful!");
    router.replace("/");
  };

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
    Object.entries(pageTitles).find(([key]) =>
      pathname?.startsWith(key + "/")
    )?.[1] ||
    "Admin";

  const initials = admin?.fullName
    ? admin.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-3">
        {/* ============ LEFT ============ */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Hamburger (mobile) */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition text-slate-700 shrink-0"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          {/* Breadcrumb / Title */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Admin</span>
              <span>/</span>
              <span className="text-slate-600 truncate">{pageTitle}</span>
            </div>
            <h1 className="text-base md:text-lg font-black text-slate-800 truncate leading-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* ============ RIGHT ============ */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-all"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/30">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-sm font-bold text-slate-700">
                  {admin?.fullName || "Admin"}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                  Administrator
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
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in duration-150">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {admin?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {admin?.email || "admin@hospital.com"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/admin/profile");
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  <FiUser className="text-slate-400 w-4 h-4" />
                  My Profile
                </button>

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

export default AdminHeader;