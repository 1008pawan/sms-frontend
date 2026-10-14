"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../components/Api/PrivateApi";

// ================= ICONS =================
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

// ================= STAT CARD =================
const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-500" },
    yellow: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-500" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-500" },
    red: { bg: "bg-rose-50", text: "text-rose-600", icon: "bg-rose-500" },
  };
  const c = colorMap[color];

  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <h2 className="text-3xl font-black text-gray-800 mt-2">{value}</h2>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ${c.text} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// ================= STATUS BADGE =================
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  };
  const dots = {
    approved: "bg-emerald-500",
    rejected: "bg-rose-500",
    pending: "bg-amber-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ring-1 ring-inset ${
        styles[s] || styles.pending
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[s] || dots.pending} animate-pulse`} />
      {status}
    </span>
  );
};

// ================= LOADING SKELETON =================
const LoadingSkeleton = () => (
  <div className="w-full max-w-full min-h-screen p-4 md:p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded mb-2 animate-pulse" />
      ))}
    </div>
  </div>
);

// ================= DELETE MODAL =================
const DeleteModal = ({ open, onClose, onConfirm, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-center w-14 h-14 mx-auto bg-rose-100 rounded-full mb-4">
          <div className="text-rose-600">
            <Icons.Trash />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900">
          Delete Appointment?
        </h3>
        <p className="text-sm text-gray-500 text-center mt-2">
          This action cannot be undone. The appointment record will be
          permanently removed.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= PAGINATION =================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <p className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
        <span className="font-semibold text-gray-700">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-semibold transition ${
                currentPage === p
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ================= MAIN COMPONENT =================
export default function AdminAppointmentsPage() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const itemsPerPage = 10;

  // ================= API =================
  const getAllAppointments = async () => {
    const res = await api.get("/appointment/all");
    return res.data;
  };

  const updateAppointmentStatus = async ({ id, status }) => {
    const res = await api.patch(`/appointment/${id}/status`, { status });
    return res.data;
  };

  const deleteAppointment = async (id) => {
    const res = await api.delete(`/appointment/delete-appointment/${id}`);
    return res.data;
  };

  // ================= QUERY =================
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: getAllAppointments,
  });

  // ================= MUTATIONS =================
  const { mutate: updateStatus } = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      toast.success("Appointment status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const { mutate: deleteAppt, isPending: isDeleting } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      toast.success("Appointment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      setDeleteTarget(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete");
    },
  });

  // ================= DATA =================
  const appointments = data?.data || [];

  // ================= STATS =================
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (i) => i.status?.toLowerCase() === "pending"
  ).length;
  const approvedAppointments = appointments.filter(
    (i) => i.status?.toLowerCase() === "approved"
  ).length;
  const rejectedAppointments = appointments.filter(
    (i) => i.status?.toLowerCase() === "rejected"
  ).length;

  // ================= FILTERED DATA =================
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesSearch =
        !searchTerm ||
        appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.phone?.includes(searchTerm) ||
        appt.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        appt.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  // ================= INITIALS =================
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // ================= STATES =================
  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="p-6">
        <div className="border border-rose-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-rose-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-rose-600 text-xl">⚠️</span>
          </div>
          <p className="text-rose-700 font-semibold">
            {error?.response?.data?.message || "Failed to load appointments"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-h-screen p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all patient appointment requests
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm disabled:opacity-60"
        >
          <span className={isFetching ? "animate-spin" : ""}>
            <Icons.Refresh />
          </span>
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total"
          value={totalAppointments}
          icon={<Icons.Calendar />}
          color="blue"
          subtitle="All appointments"
        />
        <StatCard
          title="Pending"
          value={pendingAppointments}
          icon={<Icons.Clock />}
          color="yellow"
          subtitle="Awaiting review"
        />
        <StatCard
          title="Approved"
          value={approvedAppointments}
          icon={<Icons.Check />}
          color="green"
          subtitle="Confirmed"
        />
        <StatCard
          title="Rejected"
          value={rejectedAppointments}
          icon={<Icons.X />}
          color="red"
          subtitle="Declined"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {/* Header + Filters */}
        <div className="px-4 md:px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Appointment Records
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredAppointments.length} record{filteredAppointments.length !== 1 && "s"} found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search />
                </span>
                <input
                  type="text"
                  placeholder="Search patient, phone, doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Icons.Filter />
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-44 appearance-none pl-10 pr-8 py-2.5 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {["#", "Patient", "Contact", "Department", "Doctor", "Date", "Slot", "Status", "Actions"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedData.length > 0 ? (
                paginatedData.map((appt, index) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                          {getInitials(appt.patientName)}
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {appt.patientName}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                      {appt.phone}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {appt.department}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                      {appt.doctorId?.name || <span className="text-gray-400">—</span>}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                      {appt.slot}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={appt.status} />
                    </td>

                    <td className="px-4 py-4">
                      {appt.status?.toLowerCase() === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateStatus({ id: appt._id, status: "approved" })
                            }
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm hover:shadow-md active:scale-95"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateStatus({ id: appt._id, status: "rejected" })
                            }
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition shadow-sm hover:shadow-md active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteTarget(appt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition active:scale-95"
                        >
                          <Icons.Trash />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-20">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                        <Icons.Search />
                      </div>
                      <p className="text-gray-600 font-semibold">
                        No appointments found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Appointments will appear here once created"}
                      </p>
                      {(searchTerm || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteAppt(deleteTarget._id)}
        loading={isDeleting}
      />
    </div>
  );
}