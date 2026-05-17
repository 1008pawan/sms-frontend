"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import { Trash2 } from "lucide-react";
import { FaStar } from "react-icons/fa";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ================= GET REVIEWS ================= */
  const getReviews = async () => {
    const res = await api.get("/review");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  };

  const { data: reviews = [], isLoading } = useQuery({
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
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });
    },
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure to delete this review")) {
      mutation.mutate(id);
    }
  };

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(
    reviews.length / itemsPerPage
  );

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return reviews.slice(start, end);
  }, [reviews, currentPage]);

  /* ================= UI ================= */
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">
        All Reviews
      </h1>

      {isLoading ? (
        <p className="text-gray-500">
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">
          Koi review available nahi hai
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4">S.No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Review</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedReviews.map((review, index) => (
                  <tr
                    key={
                      review.id ??
                      `${review._id}-${index}`
                    }
                    className="border-t border-zinc-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold">
                      {(currentPage - 1) *
                        itemsPerPage +
                        index +
                        1}.
                    </td>

                    <td className="p-4 font-semibold">
                      {review.name}
                    </td>

                    <td className="p-4 text-gray-600 max-w-md">
                      {review.comment}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(
                          (star) => {
                            const getDisplayColor = (
                              rating
                            ) => {
                              if (rating <= 2)
                                return "text-red-500";
                              if (rating === 3)
                                return "text-orange-400";
                              return "text-green-500";
                            };

                            return (
                              <span
                                key={star}
                                className={`text-xl transition-colors duration-300 ${
                                  star <=
                                  review.rating
                                    ? getDisplayColor(
                                        review.rating
                                      )
                                    : "text-gray-300"
                                }`}
                              >
                                <FaStar />
                              </span>
                            );
                          }
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          handleDelete(
                            review._id ||
                              review.id
                          )
                        }
                        className="text-red-600 hover:text-red-800 text-xl cursor-pointer"
                        disabled={mutation.isPending}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Previous */}
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="px-4 py-2 rounded-xl cursor-pointer border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setCurrentPage(index + 1)
                      }
                      className={`w-10 h-10 rounded-xl cursor-pointer text-sm font-semibold transition
                        ${
                          currentPage ===
                          index + 1
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className="px-4 py-2 rounded-xl cursor-pointer border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}