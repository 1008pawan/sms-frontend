"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Carrer from "./Carrer";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiPhone, FiCalendar, FiUser } from "react-icons/fi"; // 👈 FiUser import kiya

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Departments", href: "/departments" },
  { name: "Doctors", href: "/doctors" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Career", href: "/career" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 👇 User login state
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    const userRole = localStorage.getItem("role");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setRole(userRole);
    }
  }, [pathname]); // Jab bhi route change ho, check karo

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Dashboard link based on role
  const dashboardLink =
    role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <>
      {/* ============ TOP ANNOUNCEMENT BAR ============ */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <span className="hidden sm:inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">
              Emergency 24/7 Available • Book Appointment Online
            </span>
          </p>
          <a
            href="tel:+916307730544"
            className="hidden sm:flex items-center gap-1.5 font-bold hover:underline"
          >
            <FiPhone size={12} />
            +91 630 773 0544
          </a>
        </div>
      </div>

      {/* ============ MAIN HEADER ============ */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "backdrop-blur-xl bg-white/90 border-slate-200 shadow-sm"
            : "backdrop-blur-lg bg-white/70 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ============ BRAND ============ */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <img
                  src="/images/logo/logo.jpeg"
                  className="rounded-full h-11 w-11 md:h-12 md:w-12 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all object-cover"
                  alt="SMS Hospital"
                />
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                  SMS Hospital Pvt Ltd
                </p>
                <p className="text-[10px] md:text-2xs font-semibold text-slate-500 uppercase tracking-widest">
                  Super Medical Speciality Hospital Pvt Ltd
                </p>
              </div>
            </Link>

            {/* ============ DESKTOP NAV ============ */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* ============ DESKTOP CTA ============ */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+916307730544"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 text-sm font-bold text-slate-700 hover:text-blue-600 transition-all"
              >
                <FiPhone size={14} />
                <span className="hidden xl:inline">Call Now</span>
              </a>

              {/* 👇 CONDITIONAL RENDERING LOGIC */}
              {user ? (
                <Link
                  href={dashboardLink}
                  className="group inline-flex items-center gap-2 px-2 py-1.5 pr-4 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <FiUser size={16} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">
                      {role === "admin" ? "Admin" : "Patient"}
                    </span>
                    <span className="text-sm font-black text-slate-800 leading-none max-w-[100px] truncate">
                      {user.fullName?.split(" ")[0] || "User"}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <FiCalendar size={15} />
                  Book Appointment
                </Link>
              )}
            </div>

            {/* ============ MOBILE MENU TOGGLE ============ */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
              aria-label="Menu"
            >
              {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>

        {/* ============ MOBILE MENU ============ */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-5 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
              <a
                href="tel:+916307730544"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
              >
                <FiPhone size={14} />
                Call Now
              </a>

              {/* 👇 MOBILE CONDITIONAL RENDERING LOGIC */}
              {user ? (
                <Link
                  href={dashboardLink}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl transition-all active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                      <FiUser size={16} />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {role === "admin" ? "Admin Account" : "My Account"}
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {user.fullName || "User"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">
                    Dashboard &rarr;
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                >
                  <FiCalendar size={15} />
                  Book Appointment
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ============ CAREER MODAL ============ */}
      {modal && <Carrer setModal={setModal} />}
    </>
  );
};

export default Header;
