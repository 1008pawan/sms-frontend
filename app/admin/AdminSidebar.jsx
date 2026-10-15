"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { HiBriefcase, HiStar, HiUserGroup } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { toast } from "react-hot-toast";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  { name: "Users", href: "/admin/usersList", icon: <FaUsers /> },
  {
    name: "Appointments",
    href: "/admin/appointmentList",
    icon: <FaCalendarCheck />,
  },
  { name: "Carrer", href: "/admin/carrer", icon: <HiBriefcase /> },
  { name: "Reviews", href: "/admin/reviews", icon: <HiStar /> },
  { name: "Doctors", href: "/admin/doctors", icon: <HiUserGroup /> },
];

const AdminSidebar = ({ open = false, onClose = () => {} }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will be signed out of the admin panel.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-semibold",
        cancelButton: "rounded-xl font-semibold",
      },
    });

    if (!result.isConfirmed) return;

    localStorage.clear();
    toast.success("Admin logout successful!");
    router.replace("/");
  };

  return (
    <>
      {/* ============ MOBILE OVERLAY ============ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 z-50 flex flex-col
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* ============ LOGO ============ */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <FaUserShield className="text-white text-base" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-black tracking-tight">Admin</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Panel
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* ============ SECTION LABEL ============ */}
        <p className="px-5 pt-5 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          Main Menu
        </p>

        {/* ============ NAV ============ */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/80" />
                )}

                <span
                  className={`text-lg transition-transform ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ============ BOTTOM SECTION ============ */}
        <div className="px-3 pb-4 pt-3 border-t border-white/10 shrink-0 space-y-2">
          {/* Support / Info card */}
          <div className="px-3.5 py-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Need Help?
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              Contact support for admin access issues.
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all active:scale-[0.98]"
          >
            <FaSignOutAlt className="text-base" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;