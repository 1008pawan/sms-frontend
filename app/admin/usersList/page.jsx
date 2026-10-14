"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";

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

  // ================= STATS =================
  const totalUsers = users.length;
  const maleUsers = users.filter((u) => u.gender?.toLowerCase() === "male").length;
  const femaleUsers = users.filter((u) => u.gender?.toLowerCase() === "female").length;
  const otherUsers = users.filter(
    (u) =>
      u.gender &&
      !["male", "female"].includes(u.gender?.toLowerCase())
  ).length;

  // 👇 This month new users
  const thisMonthUsers = users.filter((u) => {
    const d = new Date(u.createdAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

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
      <div className="w-full p-4 md:p-6 space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="p-6">
        <div className="border border-rose-200 rounded-2xl p-6 text-center max-w-md mx-auto">
          <p className="text-rose-600 font-semibold">Failed to load users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-zinc-800">Users</h1>
        <p className="text-gray-500 mt-0.5">Manage all registered users</p>
      </div>

      {/* ================= Stats Cards ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle="All registered"
          icon={<UsersIcon />}
          color="blue"
        />
        <StatCard
          title="Male"
          value={maleUsers}
          subtitle={`${totalUsers ? Math.round((maleUsers / totalUsers) * 100) : 0}% of total`}
          icon={<MaleIcon />}
          color="indigo"
        />
        <StatCard
          title="Female"
          value={femaleUsers}
          subtitle={`${totalUsers ? Math.round((femaleUsers / totalUsers) * 100) : 0}% of total`}
          icon={<FemaleIcon />}
          color="pink"
        />
        <StatCard
          title="New This Month"
          value={thisMonthUsers}
          subtitle={new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
          icon={<CalendarIcon />}
          color="emerald"
        />
      </div>

      {/* ================= Table Card ================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-800">User Records</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {users.length} total user{users.length !== 1 && "s"}
            </p>
          </div>

          {/* Gender chips */}
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Male: {maleUsers}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              Female: {femaleUsers}
            </span>
            {otherUsers > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-violet-50 text-violet-700">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Other: {otherUsers}
              </span>
            )}
          </div>
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
                  )
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
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                          {getInitials(user.fullName)}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {user.fullName}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                      {user.phone}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <GenderBadge gender={user.gender} />
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
              Page {currentPage} of {totalPages} • {users.length} users
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 cursor-pointer rounded-xl text-sm font-semibold transition
                    ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "border border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

/* ================= Sub-components ================= */

// 👇 Stat Card
const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colors = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "border-blue-100" },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      ring: "border-indigo-100",
    },
    pink: { bg: "bg-pink-50", text: "text-pink-600", ring: "border-pink-100" },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "border-emerald-100",
    },
  };
  const c = colors[color];

  return (
    <div
      className={`group bg-white rounded-2xl p-5 shadow-sm border ${c.ring} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {title}
          </p>
          <h2 className={`text-4xl font-black mt-2 ${c.text}`}>{value}</h2>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// 👇 Gender Badge
const GenderBadge = ({ gender }) => {
  const g = gender?.toLowerCase();
  const styles = {
    male: "bg-blue-50 text-blue-700 ring-blue-200",
    female: "bg-pink-50 text-pink-700 ring-pink-200",
  };
  const dots = {
    male: "bg-blue-500",
    female: "bg-pink-500",
  };
  const fallback = "bg-violet-50 text-violet-700 ring-violet-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ring-1 ring-inset ${
        styles[g] || fallback
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[g] || "bg-violet-500"}`}
      />
      {gender || "N/A"}
    </span>
  );
};

// 👇 Initials helper
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/* ================= Icons ================= */
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MaleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="10" cy="14" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 5l-5.4 5.4M19 5h-5M19 5v5" />
  </svg>
);

const FemaleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="9" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7M9 18h6" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);