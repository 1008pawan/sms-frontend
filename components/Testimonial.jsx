"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../components/Api/PrivateApi";
import {
  FaStar,
  FaQuoteRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsPatchCheckFill, BsPencilFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(false);
  const [direction, setDirection] = useState(1);

  /* ================= GET REVIEWS ================= */
  const getReviews = async () => {
    const res = await api.get("/review");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  };

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (pause || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p === reviews.length - 1 ? 0 : p + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [pause, reviews.length]);

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p === reviews.length - 1 ? 0 : p + 1));
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p === 0 ? reviews.length - 1 : p - 1));
  };

  /* ================= STATS ================= */
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const totalReviews = reviews.length;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const satisfiedCount = reviews.filter((r) => r.rating >= 4).length;
  const satisfiedPercent = totalReviews
    ? Math.round((satisfiedCount / totalReviews) * 100)
    : 0;

  /* ================= HELPERS ================= */
  const getAvatarBg = (name) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-sky-600",
    ];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getTimeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const currentReview = reviews[current];

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 h-[500px] bg-white rounded-3xl animate-pulse" />
            <div className="lg:col-span-3 h-[500px] bg-white rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
            <FaQuoteRight className="text-slate-300 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No reviews yet</h3>
          <p className="text-sm text-slate-400 mt-1">
            Be the first to share your experience.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* ================= HEADING ================= */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Patient Stories
          </span>
          <h2 className="mt-5 font-black text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
            Real Voices,
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Real Care.
            </span>
          </h2>
          <p className="text-slate-500 mt-4">
            Stories from patients who trusted us with their health.
          </p>
        </div>

        {/* ================= MAIN SPLIT LAYOUT ================= */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          {/* ============ LEFT: RATING SUMMARY ============ */}
          <div className="lg:col-span-2">
            <div className="relative h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/5" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />

              <div className="relative h-full flex flex-col">
                {/* Big rating */}
                <div className="text-center pb-6 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                    Overall Rating
                  </p>
                  <div className="flex items-end justify-center gap-2 mt-3">
                    <span className="text-7xl font-black leading-none">
                      {avgRating}
                    </span>
                    <span className="text-3xl text-blue-300 leading-none mb-2">
                      /5
                    </span>
                  </div>

                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        className={`text-lg ${
                          s <= Math.round(avgRating)
                            ? "text-amber-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-blue-200 mt-3">
                    Based on <b className="text-white">{totalReviews}</b>{" "}
                    verified review{totalReviews !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Rating breakdown */}
                <div className="py-6 space-y-2.5 flex-1">
                  {ratingBreakdown.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12 shrink-0">
                        <span className="text-xs font-bold text-white">
                          {star}
                        </span>
                        <FaStar className="text-amber-400 text-xs" />
                      </div>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-blue-200 w-6 text-right shrink-0">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Satisfied stat */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                        Would Recommend
                      </p>
                      <p className="text-2xl font-black mt-1">
                        {satisfiedPercent}%
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                      <BsPatchCheckFill className="text-emerald-400 text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT: REVIEW CARD ============ */}
          <div className="lg:col-span-3">
            <div
              className="relative h-full flex flex-col"
              onMouseEnter={() => setPause(true)}
              onMouseLeave={() => setPause(false)}
            >
              {/* Card container */}
              <div className="relative flex-1 min-h-[420px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <div className="relative h-full bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-100 flex flex-col">
                      {/* Top: Quote + Time */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <FaQuoteRight className="text-white text-xl" />
                        </div>

                        {currentReview?.createdAt && (
                          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                            {getTimeAgo(currentReview.createdAt)}
                          </span>
                        )}
                      </div>

                      {/* Rating stars */}
                      <div className="flex items-center gap-1 mb-5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`text-xl ${
                              star <= currentReview.rating
                                ? "text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs font-black text-slate-500">
                          {currentReview.rating}.0
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="flex-1 mb-6">
                        <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                          {currentReview.comment}
                        </p>
                      </div>

                      {/* Author footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarBg(
                              currentReview.name,
                            )} text-white flex items-center justify-center font-black text-sm shadow-lg`}
                          >
                            {getInitials(currentReview.name)}
                          </div>
                          <div>
                            <h5 className="font-black text-slate-800 text-base">
                              {currentReview.name}
                            </h5>
                            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                              <BsPatchCheckFill />
                              Verified Patient
                            </p>
                          </div>
                        </div>

                        {/* Navigation arrows inline */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={prev}
                            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all active:scale-95"
                            aria-label="Previous"
                          >
                            <FaChevronLeft size={12} />
                          </button>
                          <button
                            onClick={next}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                            aria-label="Next"
                          >
                            <FaChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress dots below card */}
              <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    aria-label={`Go to review ${i + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      current === i
                        ? "w-8 h-1.5 bg-blue-600"
                        : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div className="text-center mt-14">
          <Link
            href="/login"
            className="group inline-flex items-center gap-3 bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-600 text-base font-bold px-8 py-4 rounded-2xl shadow-sm hover:shadow-xl transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <BsPencilFill size={12} />
            </div>
            Share Your Experience
          </Link>

          <p className="text-xs text-slate-400 mt-3">
            Your feedback helps us serve you better
          </p>
        </div>
      </div>
    </section>
  );
}
