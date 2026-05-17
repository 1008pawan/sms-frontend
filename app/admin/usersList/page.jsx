"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/components/Api/PrivateApi";

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ================= API =================
  const getAllUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
  };

  // ================= QUERY =================
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });

  // ================= DATA =================
  const users = data?.data || [];

  // ================= PAGINATION =================
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return users.slice(start, end);
  }, [users, currentPage]);

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to load users</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-zinc-800">Users</h1>

        <p className="text-gray-500">Manage all registered users</p>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Users</p>

          <h2 className="text-4xl font-black text-blue-600 mt-3">
            {users.length}
          </h2>
        </div>
      </div> */}

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800">User Records</h2>

          <p className="text-sm text-gray-500 mt-1">
            List of all registered users
          </p>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                {["S.No", "Name", "Phone", "Gender", "Created Date"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {user.fullName}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                      {user.phone}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold capitalize bg-blue-100 text-blue-700">
                        {user.gender}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
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
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 cursor-pointer rounded-xl text-sm font-semibold transition
                    ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
