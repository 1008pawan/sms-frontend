"use client";
import api from "../../../components/Api/PrivateApi";
import { useQuery } from "@tanstack/react-query";
import RazorpayButton from "components/Payment/RazorpayButton";
import React, { useState } from "react";

const LIMIT = 10;

const page = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["appointments", page],
    queryFn: async () => {
      const res = await api.get("/appointment/user", {
        params: { page, limit: LIMIT },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const appointments = data?.data || [];
  const pagination = data?.pagination;
  const stats = data?.stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  // Filter by tab (client-side on current page)
  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status.toLowerCase() === activeTab);

  const unpaidCount = appointments.filter((a) => !a.payment?.isPaid).length;

  if (isLoading) return <AppointmentsSkeleton />;
  if (error) return <ErrorState />;

  return (
    <div className="w-full p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              My Appointments
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track and manage all your doctor consultations
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live updates
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard
            label="Total"
            value={stats.total}
            color="blue"
            icon={<CalendarIcon />}
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="amber"
            icon={<ClockIcon />}
          />
          <StatCard
            label="Approved"
            value={stats.approved}
            color="emerald"
            icon={<CheckIcon />}
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            color="rose"
            icon={<XIcon />}
          />

          <StatCard
            label="Unpaid"
            value={unpaidCount}
            color="amber"
            icon={<WalletIcon />}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header + Tabs */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  Appointment History
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {pagination?.total || 0} total records
                </p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto">
                {[
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending" },
                  { key: "approved", label: "Approved" },
                  { key: "rejected", label: "Rejected" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-slate-50/80">
                  {[
                    "#",
                    "Patient",
                    "Phone",
                    "Department",
                    "Doctor",
                    "Date",
                    "Slot",
                    "Status",
                    "Payment",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-500"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-400">
                        {String((page - 1) * LIMIT + index + 1).padStart(
                          2,
                          "0",
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {item.patientName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold text-slate-800 text-sm">
                            {item.patientName}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
                        {item.phone}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {item.doctorId?.department || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                        Dr.{" "}
                        {item.doctorId?.name?.replace(/^Dr\.?\s*/i, "") || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-700">
                          {new Date(item.appointmentDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {item.slot}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentBadge payment={item.payment} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {!item.payment?.isPaid && !item.payment?.isRefunded ? (
                          <PayNowButton appointment={item} />
                        ) : item.payment?.isRefunded ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              />
                            </svg>
                            Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          No appointments found
                        </p>
                        <p className="text-xs text-slate-400">
                          {activeTab !== "all"
                            ? `No ${activeTab} appointments on this page`
                            : "Book your first appointment to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-slate-100 bg-slate-50/50">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {(pagination.page - 1) * LIMIT + 1}
                </span>{" "}
                –{" "}
                <span className="font-bold text-slate-700">
                  {Math.min(pagination.page * LIMIT, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700">
                  {pagination.total}
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <PaginationButton
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pagination.hasPrevPage || isFetching}
                  aria-label="Previous"
                >
                  <ChevronLeft />
                </PaginationButton>

                {getPageNumbers(pagination.page, pagination.totalPages).map(
                  (p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        disabled={isFetching}
                        className={`w-10 h-10 cursor-pointer rounded-xl text-sm font-bold transition-all ${
                          pagination.page === p
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                )}

                <PaginationButton
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage || isFetching}
                  aria-label="Next"
                >
                  <ChevronRight />
                </PaginationButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay for page transitions */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
          <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Loading...
        </div>
      )}
    </div>
  );
};

/* ================= Sub-components ================= */

const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    blue: {
      border: "border-blue-100",
      bg: "bg-blue-50",
      text: "text-blue-600",
      glow: "from-blue-600 to-blue-700",
    },
    amber: {
      border: "border-amber-100",
      bg: "bg-amber-50",
      text: "text-amber-600",
      glow: "from-amber-600 to-amber-700",
    },
    emerald: {
      border: "border-emerald-100",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      glow: "from-emerald-600 to-emerald-700",
    },
    rose: {
      border: "border-rose-100",
      bg: "bg-rose-50",
      text: "text-rose-600",
      glow: "from-rose-600 to-rose-700",
    },
    orange: {
      border: "border-orange-100",
      bg: "bg-orange-50",
      text: "text-orange-600",
      glow: "from-orange-600 to-orange-700",
    },
  };
  const c = colors[color];

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 shadow-sm border ${c.border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group`}
    >
      <div
        className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${c.glow} opacity-5 group-hover:opacity-10 transition-opacity`}
      />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <h2 className={`text-4xl font-black mt-2 ${c.text}`}>{value}</h2>
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      ring: "ring-emerald-200",
    },
    rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      ring: "ring-rose-200",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      ring: "ring-amber-200",
    },
  };
  const c = config[status?.toLowerCase()] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ring-1 ${c.bg} ${c.text} ${c.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
};

/* ================= Payment Badge ================= */
const PaymentBadge = ({ payment }) => {
  const isPaid = payment?.isPaid;
  const isRefunded = payment?.isRefunded;
  const amount = (payment?.amount || 0) / 100;

  if (isRefunded) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 bg-blue-50 text-blue-700 ring-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Refunded
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${
          isPaid
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-orange-50 text-orange-700 ring-orange-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPaid ? "bg-emerald-500" : "bg-orange-500 animate-pulse"
          }`}
        />
        {isPaid ? "Paid" : "Unpaid"}
      </span>
      {amount > 0 && (
        <span className="text-xs font-bold text-slate-600 text-center">
          ₹{amount.toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
};

/* ================= Pay Now Button ================= */
const PayNowButton = ({ appointment }) => {
  const [showPay, setShowPay] = useState(false);

  if (appointment.status?.toLowerCase() === "rejected") {
    return (
      <span
        className="text-xs text-slate-400 font-medium"
        title="Rejected appointment"
      >
        —
      </span>
    );
  }

  const fee = appointment?.doctorId?.consultationFee || 500;

  return (
    <>
      {/* ==================== TRIGGER BUTTON ==================== */}
      <button
        onClick={() => setShowPay(true)}
        className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <svg
          className="w-3.5 h-3.5 relative"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <span className="relative">Pay Now</span>
      </button>

      <p className="text-2xl text-center font-black text-slate-900 mt-1">
        ₹{fee.toLocaleString("en-IN")}
      </p>

      {/* ==================== MODAL ==================== */}
      {showPay && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setShowPay(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* ===== Gradient Header ===== */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 px-6 pt-6 pb-16 text-white overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/10" />

              {/* Close button */}
              <button
                onClick={() => setShowPay(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm z-10"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-black tracking-tight">
                  Complete Payment
                </h3>
                <p className="text-sm text-indigo-100 mt-1">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>

            {/* ===== Amount Card (overlapping) ===== */}
            <div className="relative px-6 -mt-12">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Amount to Pay
                    </p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      ₹{fee.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Appointment Details ===== */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Appointment Details
              </p>

              <div className="space-y-3">
                {/* Patient */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Patient
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {appointment.patientName}
                    </p>
                  </div>
                </div>

                {/* Doctor */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Doctor
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      Dr.{" "}
                      {appointment.doctorId?.name?.replace(/^Dr\.?\s*/i, "") ||
                        "—"}
                    </p>
                  </div>
                </div>

                {/* Date & Slot */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Date & Slot
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                      {appointment.slot && (
                        <span className="text-slate-500 font-medium">
                          {" "}
                          • {appointment.slot}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Pay Button ===== */}
            <div className="px-6 pb-6">
              <RazorpayButton
                appointmentId={appointment._id}
                patientName={appointment.patientName}
                amount={appointment?.doctorId?.consultationFee || 500}
                isPaid={appointment?.payment?.isPaid}
                isRefunded={appointment?.payment?.isRefunded}
                onSuccess={() => {
                  setShowPay(false);
                  window.location.reload();
                }}
              />
            </div>

            {/* ===== Footer ===== */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <svg
                className="w-3.5 h-3.5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>
                100% Secure Payment • Powered by <b>Razorpay</b>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PaginationButton = ({ children, disabled, onClick, ...rest }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="w-10 h-10 cursor-pointer rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
    {...rest}
  >
    {children}
  </button>
);

/* ================= Pagination helper ================= */
const getPageNumbers = (current, total) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) rangeWithDots.push(l + 1);
      else if (i - l !== 1) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

/* ================= Icons ================= */
const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronLeft = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const WalletIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0010.586 5H5a2 2 0 00-2 2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 13h.01" />
  </svg>
);

/* ================= Skeleton / Error ================= */
const AppointmentsSkeleton = () => (
  <div className="w-full p-4 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse"
          />
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="w-full p-6 min-h-screen flex items-center justify-center">
    <div className="bg-white rounded-2xl border border-rose-100 p-8 max-w-md text-center shadow-lg">
      <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <XIcon />
      </div>
      <h3 className="text-lg font-bold text-slate-800">
        Failed to load appointments
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        Please refresh the page or try again later.
      </p>
    </div>
  </div>
);

export default page;
