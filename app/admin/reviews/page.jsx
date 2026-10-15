"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import Swal from "sweetalert2";
import {
  Trash2,
  Search,
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  ThumbsUp,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaStar } from "react-icons/fa";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const itemsPerPage = 10;

  /* ================= GET REVIEWS ================= */
  const getReviews = async () => {
    const res = await api.get("/review");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  };

  const {
    data: reviews = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getReviews,
  });

  /* ================= DELETE REVIEW ================= */
  const deleteReview = async (id) => {
    return api.delete(`/review/${id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to delete review",
        confirmButtonColor: "#e11d48",
      });
    },
  });

  // 👇 Confirm + delete wrapper
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      html: `Are you sure you want to delete <b>${name}</b>'s review?<br/><span style="color: #ef4444; font-size: 13px;">This action cannot be undone.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
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

    Swal.fire({
      title: "Deleting...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    mutation.mutate(id, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Review has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  /* ================= STATS ================= */
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const lowRatingCount = reviews.filter((r) => r.rating <= 2).length;

  /* ================= FILTERED ================= */
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        !searchTerm ||
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "5" && r.rating === 5) ||
        (ratingFilter === "4" && r.rating === 4) ||
        (ratingFilter === "3" && r.rating === 3) ||
        (ratingFilter === "low" && r.rating <= 2);

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, ratingFilter]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  /* ================= HELPERS ================= */
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRatingColor = (rating) => {
    if (rating <= 2) return "text-red-500";
    if (rating === 3) return "text-amber-500";
    return "text-emerald-500";
  };

  const getInitialBg = (name) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-red-500 to-red-600",
      "from-cyan-500 to-sky-600",
    ];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 space-y-6">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Reviews & Ratings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all patient feedback and reviews
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-60"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Reviews"
          value={totalReviews}
          icon={<MessageSquare />}
          color="blue"
        />
        <StatCard
          label="Average Rating"
          value={`${avgRating} ⭐`}
          icon={<TrendingUp />}
          color="amber"
        />
        <StatCard
          label="5 Star Reviews"
          value={fiveStarCount}
          icon={<ThumbsUp />}
          color="emerald"
        />
        <StatCard
          label="Low Rating (≤2)"
          value={lowRatingCount}
          icon={<Users />}
          color="red"
        />
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-4 md:px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">All Reviews</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredReviews.length} review
                {filteredReviews.length !== 1 && "s"} found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search name, comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full sm:w-40 appearance-none px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="low">Low (≤2)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                {["#", "Reviewer", "Comment", "Rating", "Actions"].map(
                  (head) => (
                    <th
                      key={head}
                      className={`px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap ${
                        head === "Actions" ? "text-center" : ""
                      }`}
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((review, index) => (
                  <tr
                    key={review._id || review.id || index}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Reviewer */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${getInitialBg(
                            review.name,
                          )} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {getInitials(review.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {review.name}
                          </div>
                          <div className="text-xs text-gray-400">Patient</div>
                        </div>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-4 py-4">
                      <p
                        className="text-sm text-gray-600 max-w-md line-clamp-2"
                        title={review.comment}
                      >
                        {review.comment || (
                          <span className="text-gray-400 italic">
                            No comment
                          </span>
                        )}
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-base ${
                                star <= review.rating
                                  ? getRatingColor(review.rating)
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-md bg-gray-50 ${getRatingColor(
                            review.rating,
                          )}`}
                        >
                          {review.rating}/5
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() =>
                          handleDelete(review._id || review.id, review.name)
                        }
                        disabled={mutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                      <p className="text-gray-600 font-semibold">
                        No reviews found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm || ratingFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Reviews will appear here once submitted"}
                      </p>
                      {(searchTerm || ratingFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setRatingFilter("all");
                          }}
                          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4 inline" /> Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`min-w-[36px] h-9 rounded-lg text-sm font-semibold transition ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "border border-gray-200 text-gray-600 hover:bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= Sub-components ================= */

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/30",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/30",
    red: "from-red-500 to-red-600 shadow-red-500/30",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {label}
          </p>
          <p className="text-3xl font-black text-gray-800 mt-2">{value}</p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-white`}
        >
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
      </div>
    </div>
  );
};
