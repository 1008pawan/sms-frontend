"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Loader2 } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import api from "components/Api/PrivateApi";

const getRatingColor = (rating) => {
  if (rating <= 2) return "text-rose-500 bg-rose-50";
  if (rating === 3) return "text-amber-500 bg-amber-50";
  return "text-emerald-500 bg-emerald-50";
};

export default function Page() {
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["user-reviews"],
    queryFn: async () => {
      const res = await api.get("/review/my-reviews");
      return res.data;
    },
  });

  const reviews = data?.data || [];
  const stats = data?.stats || { total: 0, average: 0, ratingCounts: {} };

  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter((r) => r.rating === Number(filter));
  }, [reviews, filter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          My Reviews
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Your feedback and ratings for doctors.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Reviews
          </p>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Rating
          </p>
          <p className="text-3xl font-black text-amber-500">
            {stats.average} ★
          </p>
        </div>
        <Link
          href="/user/review"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700"
        >
          + Add Review
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: RATING SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl sticky top-24">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 text-center">
              Average Rating
            </p>
            <div className="flex items-end justify-center gap-2 mt-2 mb-2">
              <span className="text-6xl font-black leading-none">
                {stats.average}
              </span>
              <span className="text-2xl text-blue-300 mb-2">/5</span>
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar
                  key={s}
                  className={`text-lg ${s <= Math.round(stats.average) ? "text-amber-400" : "text-white/20"}`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-blue-200 mb-6">
              Based on <b className="text-white">{stats.total}</b> reviews
            </p>

            <div className="space-y-2 border-t border-white/10 pt-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingCounts?.[star] || 0;
                const percent = stats.total ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-8">{star} ★</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-blue-200 w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: REVIEWS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {["all", "5", "4", "3", "2", "1"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-xs font-bold cursor-pointer rounded-lg border whitespace-nowrap transition-all ${
                  filter === tab
                    ? "bg-blue-500 text-white border-primary-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab === "all" ? "All" : `${tab} Star`}
              </button>
            ))}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <MessageSquare
                className="text-slate-400 mx-auto mb-3"
                size={32}
              />
              <h3 className="text-lg font-bold text-slate-700">
                No reviews found
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                You haven't given any reviews yet.
              </p>
              <Link
                href="/user/dashboard"
                className="inline-block mt-4 px-5 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg"
              >
                Book Appointment
              </Link>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {rev.doctorId?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">
                        Dr.{" "}
                        {rev.doctorId?.name?.replace(/^Dr\.?\s*/i, "") ||
                          "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {rev.doctorId?.department || "General"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 ${getRatingColor(rev.rating)}`}
                  >
                    {rev.rating}.0 <FaStar size={12} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                  "{rev.comment || "No comment"}"
                </p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xs ${star <= rev.rating ? "text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
