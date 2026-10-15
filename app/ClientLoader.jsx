"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaHeartbeat } from "react-icons/fa";

export default function ClientLoader({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // ============ INITIAL LOAD ============
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 400);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // ============ ROUTE CHANGE ============
  useEffect(() => {
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {/* INITIAL FULL LOADER */}
      {loading && <PageLoader />}

      {/* ROUTE PROGRESS BAR */}
      {routeLoading && !loading && <RouteProgressBar />}

      {/* CONTENT */}
      <div
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}

/* ==================== PAGE LOADER ==================== */
const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <img
              src="/images/logo/logo.jpeg"
              className="rounded-full h-15 w-15 md:h-18 md:w-18 ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all object-cover"
              alt="SMS Hospital"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">
          SMS Hospital
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-semibold">
          Loading...
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

/* ==================== ROUTE PROGRESS BAR ==================== */
const RouteProgressBar = () => (
  <>
    <div className="fixed top-0 left-0 right-0 z-[9998] h-0.5 bg-transparent">
      <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-progress" />
    </div>

    <style jsx global>{`
      @keyframes progress {
        0% {
          width: 0%;
        }
        50% {
          width: 70%;
        }
        100% {
          width: 95%;
        }
      }
      .animate-progress {
        animation: progress 0.6s ease-out forwards;
      }
    `}</style>
  </>
);
