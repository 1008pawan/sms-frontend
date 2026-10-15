"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Carrer from "./Carrer";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiPhone, FiCalendar } from "react-icons/fi";

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

  // Scroll detection for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
            >
              <div className="relative">
                <img
                  src="/images/logo/logo.jpeg"
                  className="rounded-full h-11 w-11 md:h-12 md:w-12 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all object-cover"
                  alt="SMS Hospital"
                />
                {/* <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" /> */}
              </div>
              <div className="leading-tight">
                <p className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                  SMS Hospital
                </p>
                <p className="text-[10px] md:text-2xs font-semibold text-slate-500 uppercase tracking-widest">
                  Super Speciality
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

              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <FiCalendar size={15} />
                Book Appointment
              </Link>
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

            <button
              onClick={() => {
                setOpen(false);
                setModal(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
            >
              Career
            </button>

            <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
              <a
                href="tel:+916307730544"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
              >
                <FiPhone size={14} />
                Call Now
              </a>

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
              >
                <FiCalendar size={15} />
                Book Appointment
              </Link>
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