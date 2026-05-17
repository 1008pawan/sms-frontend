"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const Review = () => {
  const queryClient = useQueryClient();
  const initialState = {
    name: "",
    comment: "",
    rating: 5,
  };

  const [form, setForm] = useState(initialState);
  const [hover, setHover] = useState(null);

  /* ================= ADD REVIEW ================= */
  const addReview = async (payload) => {
    const res = await api.post("/review", payload);
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      toast.success("Review Submitted Successfully!");
      queryClient.invalidateQueries(["reviews"]);
      setForm(initialState);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.comment)
      return toast.error("Please fill all fields");
    mutation.mutate(form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 md:p-14 p-4 pt-0">
      <div
        className="bg-white rounded-xl p-8 w-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Leave a Review
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Your feedback helps us improve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Full Name
            </label>
            <input
              required
              placeholder="Ex: Amit Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Your Experience
            </label>
            <textarea
              required
              placeholder="Tell us about your visit..."
              rows="4"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full mt-1 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium resize-none"
            />
          </div>

          <div className="py-1">
            <p className="text-xs font-bold text-slate-500 uppercase text-center mb-2">
              Rate your experience
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const ratingValue = star;

                const getStarColor = (val) => {
                  if (val <= 2) return "text-red-600";
                  if (val === 3) return "text-orange-400";
                  return "text-green-500";
                };

                const isActive = ratingValue <= (hover || form.rating);

                return (
                  <label key={star} className="cursor-pointer group">
                    <input
                      type="radio"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setForm({ ...form, rating: ratingValue })}
                    />
                    <FaStar
                      size={32}
                      className={`transition-all duration-200 transform group-hover:scale-125 ${
                        isActive
                          ? getStarColor(hover || form.rating)
                          : "text-slate-200"
                      }`}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
              mutation.isPending
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
            }`}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              "Post Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;
