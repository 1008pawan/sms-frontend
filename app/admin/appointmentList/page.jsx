"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import Swal from "sweetalert2";
import ViewAppointmentModal from "../../../components/admin/ViewAppointmentModal";
import { Check, Eye, X } from "lucide-react";
// ================= ICONS =================
const Icons = {
  Calendar: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Clock: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  X: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  Filter: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
  Eye: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  Refresh: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Rupee: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 3h12M6 8h12M6 13h3a3 3 0 100-6H6v6zm0 0l6 8"
      />
    </svg>
  ),
  Wallet: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0010.586 5H5a2 2 0 00-2 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 13h.01"
      />
    </svg>
  ),
};

// ================= STAT CARD =================
const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-500" },
    yellow: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-500" },
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: "bg-emerald-500",
    },
    red: { bg: "bg-rose-50", text: "text-rose-600", icon: "bg-rose-500" },
    purple: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      icon: "bg-violet-500",
    },
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
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-xl ${c.bg} ${c.text} group-hover:scale-110 transition-transform`}
        >
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
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[s] || dots.pending} animate-pulse`}
      />
      {status}
    </span>
  );
};

// ================= PAYMENT BADGE =================
const PaymentBadge = ({ payment, consultationFee }) => {
  const isPaid = payment?.isPaid;
  const isRefunded = payment?.isRefunded;
  const paymentStatus =
    payment?.status || (isPaid ? "approved" : "not_submitted");
  const amount = (payment?.amount || 0) / 100;

  if (isRefunded) {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex justify-center items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Refunded
        </span>
        {amount > 0 && (
          <span className="text-xs text-nowrap text-center font-semibold text-zinc-600">
            {paymentStatus === "approved" ? "Verified" : "Reported"}: ₹
            {amount.toLocaleString("en-IN")}
          </span>
        )}
        {paymentStatus !== "not_submitted" && consultationFee > 0 && (
          <span className="text-[11px] text-center text-zinc-500">
            Fee: ₹{consultationFee.toLocaleString("en-IN")}
          </span>
        )}
      </div>
    );
  }

  const statusStyles = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
    not_submitted: "bg-orange-50 text-orange-700 ring-orange-600/20",
  };
  const statusLabels = {
    approved: "Approved",
    pending: "Awaiting Review",
    rejected: "Rejected",
    not_submitted: "Not Submitted",
  };
  const statusDots = {
    approved: "bg-emerald-500",
    pending: "bg-amber-500 animate-pulse",
    rejected: "bg-rose-500",
    not_submitted: "bg-orange-500",
  };

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex justify-center items-center text-nowrap gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${statusStyles[paymentStatus] || statusStyles.not_submitted}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${statusDots[paymentStatus] || statusDots.not_submitted}`}
        />
        {statusLabels[paymentStatus] || statusLabels.not_submitted}
      </span>
      {amount > 0 && (
        <span className="text-xs text-center font-semibold text-zinc-600">
          ₹{amount.toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
};

// ================= LOADING SKELETON =================
const LoadingSkeleton = () => (
  <div className="min-h-screen p-4 md:p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse"
        >
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
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <p className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
        of <span className="font-semibold text-gray-700">{totalPages}</span>
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
            <span key={`e${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-9 h-9 rounded-lg text-sm font-semibold transition ${
                currentPage === p
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300"
              }`}
            >
              {p}
            </button>
          ),
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

const EMPTY_APPOINTMENTS = [];

// ================= MAIN COMPONENT =================
export default function AdminAppointmentsPage() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const itemsPerPage = 10;

  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
  const { mutateAsync: updateStatusMutation } = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const updateStatus = async ({ id, status }) => {
    const isApprove = status === "approved";

    const result = await Swal.fire({
      title: isApprove ? "Approve Appointment?" : "Reject Appointment?",
      html: isApprove
        ? "The patient will be notified that their appointment is confirmed."
        : "The patient will be notified that their appointment was declined.",
      icon: isApprove ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: isApprove ? "#059669" : "#e11d48",
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
      title: "Updating...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await updateStatusMutation({ id, status });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: isApprove
          ? "Appointment approved successfully."
          : "Appointment rejected successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error?.response?.data?.message ||
          "Something went wrong while updating",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const reviewPayment = async ({ id, status }) => {
    const isApprove = status === "approved";
    const appointment = appointments.find((item) => item._id === id);
    const submittedAmount = (appointment?.payment?.amount || 0) / 100;
    const consultationFee = appointment?.doctorId?.consultationFee || 500;
    const transactionId = appointment?.payment?.transactionId || "not provided";
    const result = await Swal.fire({
      title: isApprove ? "Approve Payment?" : "Reject Payment?",
      text: isApprove
        ? `Verify transaction ${transactionId} in your payment records. Patient reported ₹${submittedAmount.toLocaleString("en-IN")} against the consultation fee of ₹${consultationFee.toLocaleString("en-IN")}. Approving marks it as paid.`
        : `Reject transaction ${transactionId} (reported amount ₹${submittedAmount.toLocaleString("en-IN")})? The patient can submit corrected payment details.`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: isApprove ? "Approve Payment" : "Reject Payment",
      cancelButtonText: "Cancel",
      confirmButtonColor: isApprove ? "#059669" : "#e11d48",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Reviewing payment...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await api.patch(`/payment/${id}/review`, { status });
      await queryClient.invalidateQueries({
        queryKey: ["admin-appointments"],
      });
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      Swal.fire({
        icon: "success",
        title: "Payment reviewed",
        text: response.data.message || `Payment ${status}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment review failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong while reviewing payment",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const { mutate: deleteApptMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      setDeleteTarget(null);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err?.response?.data?.message || "Failed to delete",
        confirmButtonColor: "#e11d48",
      });
    },
  });

  const deleteAppt = async (id) => {
    const result = await Swal.fire({
      title: "Delete Appointment?",
      text: "This action cannot be undone. The appointment will be permanently removed.",
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

    deleteApptMutation(id, {
      onSuccess: () => {
        setDeleteTarget(null);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Appointment has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  // ================= DATA =================
  const appointments = data?.data || EMPTY_APPOINTMENTS;

  // ================= STATS =================
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (i) => i.status?.toLowerCase() === "pending",
  ).length;
  const approvedAppointments = appointments.filter(
    (i) => i.status?.toLowerCase() === "approved",
  ).length;
  const rejectedAppointments = appointments.filter(
    (i) => i.status?.toLowerCase() === "rejected",
  ).length;
  // 👇 Paid AND not refunded — actual revenue
  const paidAppointments = appointments.filter(
    (a) => a.payment?.isPaid && !a.payment?.isRefunded,
  );
  const totalRevenue =
    paidAppointments.reduce((sum, a) => sum + (a.payment?.amount || 0), 0) /
    100;

  const pendingPaymentCount = appointments.filter(
    (a) => a.payment?.status === "pending",
  ).length;

  // Payments awaiting an admin decision
  const pendingRevenue =
    appointments
      .filter((a) => a.payment?.status === "pending")
      .reduce((sum, a) => sum + (a.payment?.amount || 0), 0) / 100;

  // ================= FILTERED DATA =================
  const filteredAppointments = appointments.filter((appt) => {
      const matchesSearch =
        !searchTerm ||
        appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.phone?.includes(searchTerm) ||
        appt.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || appt.status?.toLowerCase() === statusFilter;
      const paymentStatus =
        appt.payment?.status ||
        (appt.payment?.isPaid ? "approved" : "not_submitted");

      const matchesPayment =
        paymentFilter === "all" || paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
  });

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAppointments.slice(start, start + itemsPerPage);

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
    <div className="min-h-screen">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          icon={<Icons.Rupee />}
          color="purple"
          subtitle={`₹${pendingRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })} pending`}
        />

        <StatCard
          title="Payments Awaiting Review"
          value={pendingPaymentCount}
          icon={<Icons.Wallet />}
          color="yellow"
          subtitle={`₹${pendingRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })} submitted`}
        />
      </div>

      {/* Table Card */}
      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header + Filters */}
        <div className="px-4 md:px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Appointment Records
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredAppointments.length} record
                {filteredAppointments.length !== 1 && "s"} found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
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
                  className="w-full sm:w-70 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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
                  className="w-full sm:w-36 appearance-none pl-10 pr-8 py-2.5 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Icons.Wallet />
                </span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full sm:w-40 appearance-none pl-10 pr-8 py-2.5 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white cursor-pointer"
                >
                  <option value="all">All Payments</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Awaiting Review</option>
                  <option value="rejected">Rejected</option>
                  <option value="not_submitted">Not Submitted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="min-w-0 overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-282 table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="w-47.5" />
              <col className="w-41.25" />
              <col className="w-38.75" />
              <col className="w-36.25" />
              <col className="w-30" />
              <col className="w-31.25" />
              <col className="w-45" />
            </colgroup>
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {[
                  "#",
                  "Patient",
                  "Department",
                  "Doctor",
                  "Date & Slot",
                  "Status",
                  "Payment",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-3 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedData.length > 0 ? (
                paginatedData.map((appt, index) => (
                  <tr
                    key={appt._id}
                    className="group transition-colors hover:bg-blue-50/50"
                  >
                    <td className="px-3 py-4 text-sm font-semibold text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Patient + Phone merged */}
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                          {getInitials(appt.patientName)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm truncate max-w-35">
                            {appt.patientName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appt.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department with truncate */}
                    <td className="px-3 py-4">
                      <span
                        className="inline-block max-w-40 truncate align-middle px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700"
                        title={appt.department}
                      >
                        {appt.department}
                      </span>
                    </td>

                    {/* Doctor with truncate */}
                    <td className="px-3 py-4 text-sm font-medium text-gray-800">
                      <div
                        className="truncate max-w-35"
                        title={appt.doctorId?.name}
                      >
                        {appt.doctorId?.name || (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Date + Slot merged */}
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-700 font-medium">
                        {new Date(appt.appointmentDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {appt.slot}
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <StatusBadge status={appt.status} />
                    </td>

                    <td className="px-3 py-4">
                      <PaymentBadge
                        payment={appt.payment}
                        consultationFee={appt.doctorId?.consultationFee}
                      />
                    </td>

                    {/* Compact appointment and payment actions */}
                    <td className="px-2 py-2 align-middle">
                      <div className="mx-auto flex w-full max-w-[180px] flex-wrap items-center justify-center gap-1">
                        {appt.status?.toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus({
                                  id: appt._id,
                                  status: "approved",
                                })
                              }
                              title="Approve appointment"
                              aria-label="Approve appointment"
                              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() =>
                                updateStatus({
                                  id: appt._id,
                                  status: "rejected",
                                })
                              }
                              title="Reject appointment"
                              aria-label="Reject appointment"
                              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 active:scale-95"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </>
                        )}

                        {appt.payment?.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                reviewPayment({
                                  id: appt._id,
                                  status: "approved",
                                })
                              }
                              title="Verify and approve payment"
                              aria-label="Verify and approve payment"
                              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() =>
                                reviewPayment({
                                  id: appt._id,
                                  status: "rejected",
                                })
                              }
                              title="Reject payment"
                              aria-label="Reject payment"
                              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 active:scale-95"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedAppointment(appt)}
                          title="View appointment details"
                          aria-label="View appointment details"
                          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                        >
                          <Eye size={14} strokeWidth={2.25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-20">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                        <Icons.Search />
                      </div>
                      <p className="text-gray-600 font-semibold">
                        No appointments found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        paymentFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Appointments will appear here once created"}
                      </p>
                      {(searchTerm || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setPaymentFilter("all");
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

        {selectedAppointment && (
          <ViewAppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </div>
    </div>
  );
}
