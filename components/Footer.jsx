import React from "react";
import Link from "next/link";
import {
  BsHeartPulseFill,
  BsFacebook,
  BsInstagram,
  BsYoutube,
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
  BsArrowRight,
} from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

const SERVICES = [
  { name: "Cardiology", href: "/departments" },
  { name: "Neurology", href: "/departments" },
  { name: "Surgical Wing", href: "/departments" },
  { name: "OPD Timings", href: "/departments" },
  { name: "Emergency 24/7", href: "/departments" },
];

const SUPPORT = [
  { name: "Help Desk", href: "/contact" },
  { name: "Blood Bank", href: "/contact" },
  { name: "Emergency 24/7", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const SOCIALS = [
  { Icon: BsFacebook, href: "#", color: "hover:bg-blue-600" },
  { Icon: FaXTwitter, href: "#", color: "hover:bg-slate-700" },
  { Icon: BsInstagram, href: "#", color: "hover:bg-pink-600" },
  { Icon: BsYoutube, href: "#", color: "hover:bg-red-600" },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* ============ TOP STRIP ============ */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black tracking-tight">
              Need Medical Help?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Our emergency team is available 24/7
            </p>
          </div>
          <a
            href="tel:+916307730544"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all active:scale-95"
          >
            <BsTelephone className="text-lg" />
            Emergency: +91 630 773 0544
          </a>
        </div>
      </div>

      {/* ============ MAIN GRID ============ */}
      <div className="relative max-w-7xl mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* ============ BRAND ============ */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/images/logo/logo.jpeg"
                  className="rounded-full h-14 w-14 object-cover ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all"
                  alt="SMS Hospital"
                />
                {/* <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" /> */}
              </div>
              <div className="leading-tight">
                <p className="text-lg font-black tracking-tight">
                  SMS Hospital Pvt Ltd
                </p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Super Medical Speciality Hospital Pvt Ltd
                </p>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed mt-5 text-sm">
              SMS Hospital, Gorakhpur – Gorakhpur's most trusted and largest
              government hospital, dedicated to serving the public with
              world-class healthcare for years.
            </p>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-transparent hover:text-white transition-all active:scale-95 ${color}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ============ SERVICES ============ */}
          <div className="lg:col-span-2">
            <h6 className="text-xs font-black uppercase tracking-widest text-white mb-5">
              Services
            </h6>
            <ul className="space-y-3">
              {SERVICES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <BsArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ SUPPORT ============ */}
          <div className="lg:col-span-2">
            <h6 className="text-xs font-black uppercase tracking-widest text-white mb-5">
              Support
            </h6>
            <ul className="space-y-3">
              {SUPPORT.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <BsArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ CONTACT ============ */}
          <div className="lg:col-span-4">
            <h6 className="text-xs font-black uppercase tracking-widest text-white mb-5">
              Contact Info
            </h6>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <BsGeoAlt size={16} />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pt-1">
                  Plot No. 474 Gayatripuram, Near HDFC Bank, Nakaha No.1,
                  Gorakhpur-273004
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <BsTelephone size={16} />
                </div>
                <div className="pt-1 flex flex-col">
                  <a
                    href="tel:+916307730544"
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    +91 630 773 0544
                  </a>
                  <a
                    href="tel:+916386720220"
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    +91 638 672 0220
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 group-hover:bg-violet-500/20 transition-colors">
                  <BsEnvelope size={16} />
                </div>
                <a
                  href="mailto:info@smshospital.com"
                  className="text-sm text-slate-400 hover:text-white transition pt-1"
                >
                  info@smshospital.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SMS Hospital • Designed & Developed by{" "}
              <span className="font-bold text-slate-300">
                A3P Creation
              </span>
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Super Medical Speciality Hospital Pvt. Ltd
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;