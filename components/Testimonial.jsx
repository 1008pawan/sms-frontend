"use client";

import React, { useEffect, useState } from "react";
import {
  BsArrowLeftCircleFill,
  BsArrowRightCircleFill,
  BsPencilFill,
  BsQuote,
} from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import api from "@/components/Api/publicApi";
import { FaStar } from "react-icons/fa";

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(false);

  /* ================= GET REVIEWS ================= */
  const getReviews = async () => {
    const res = await api.get("/review");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  };

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (pause || reviews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [pause, reviews.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="pb-20 md:pt-0 pt-10 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= HEADING ================= */}
        <div className="text-center mb-12">
          <h2 className="font-black text-4xl md:text-5xl text-slate-900 tracking-tight">
            Experience Excellence in Care
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            See why thousands of families trust us for a superior healthcare
            experience.
          </p>
        </div>

        {/* ================= SLIDER ================= */}
        <div
          className="relative"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
        >
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Abhi koi review available nahi hai
            </p>
          ) : (
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {reviews.map((item, index) => (
                  <div key={index} className="min-w-full flex justify-center">
                    <div className="max-w-3xl w-full">
                      <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center">
                        <div className="text-6xl text-gray-200 mb-2 flex justify-center">
                          <BsQuote />
                        </div>

                        {/* Rating */}
                        <div className="flex justify-center mb-3">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const getDisplayColor = (rating) => {
                              if (rating <= 2) return "text-red-500";
                              if (rating === 3) return "text-orange-400";
                              return "text-green-500";
                            };

                            return (
                              <span
                                key={star}
                                className={`text-xl transition-colors duration-300 ${
                                  star <= item.rating
                                    ? getDisplayColor(item.rating)
                                    : "text-gray-300"
                                }`}
                              >
                                <FaStar />
                              </span>
                            );
                          })}
                        </div>

                        <p className="text-lg text-gray-700">
                          “{item.comment}”
                        </p>

                        <hr className="my-6 opacity-20" />

                        <div className="flex items-center justify-center gap-4">
                          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold">
                            {item.name?.slice(0, 2).toUpperCase()}
                          </div>
                          <h5 className="font-bold">{item.name}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute cursor-pointer md:left-0 left-1 top-1/2 -translate-y-1/2 text-blue-600 text-4xl opacity-40 hover:opacity-100"
              >
                <BsArrowLeftCircleFill />
              </button>

              <button
                onClick={nextSlide}
                className="absolute cursor-pointer md:right-0 right-1 top-1/2 -translate-y-1/2 text-blue-600 text-4xl opacity-40 hover:opacity-100"
              >
                <BsArrowRightCircleFill />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {(() => {
              const total = reviews.length;
              if (total === 0) return null;

              let start = Math.max(0, current - 1);
              let end = Math.min(total - 1, start + 2);

              if (end - start < 2) {
                start = Math.max(0, end - 2);
              }

              return reviews.slice(start, end + 1).map((_, i) => {
                const index = start + i;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      current === index
                        ? "bg-blue-600 scale-125"
                        : "bg-blue-300"
                    }`}
                  />
                );
              });
            })()}
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div className="text-center mt-16">
          <a href="/login">
            <button className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-lg font-bold px-10 py-4 rounded-full shadow-xl hover:-translate-y-1 hover:shadow-2xl transition">
              <BsPencilFill /> Your Feedback in SMS Hospital
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
