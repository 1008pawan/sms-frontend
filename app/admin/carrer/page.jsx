"use client";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Trash2,
  Eye,
  Search,
  Mail,
  Phone,
  User,
  Briefcase,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
} from "lucide-react";
import PdfPreviewModal from "../../../components/PdfPreviewModal";

const AdminCareerPage = () => {
  const queryClient = useQueryClient();

  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const itemsPerPage = 10;

  // ================= GET CAREERS =================
  const getCareers = async () => {
    const res = await api.get("/carrer/getdata");
    return res.data;
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["career-applications"],
    queryFn: getCareers,
  });

  // ================= DELETE CAREER =================
  const deleteCareer = async (id) => {
    const res = await api.delete(`/carrer/${id}`);
    return res.data;
  };

  const { mutate: removeCareerMutation } = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-applications"] });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to delete application",
        confirmButtonColor: "#e11d48",
      });
    },
  });

  // 👇 Confirm + delete wrapper
  const removeCareer = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Application?",
      html: `Are you sure you want to delete <b>${name}</b>'s application?<br/><span style="color: #ef4444; font-size: 13px;">This action cannot be undone.</span>`,
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

    removeCareerMutation(id, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Application has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  const careers = data?.data || [];

  // ================= STATS =================
  const totalApplications = careers.length;
  const doctorApplications = careers.filter(
    (c) => c.applicationType?.toLowerCase() === "doctor",
  ).length;
  const staffApplications = careers.filter(
    (c) => c.applicationType?.toLowerCase() !== "doctor",
  ).length;
  const todayApplications = careers.filter((c) => {
    const d = new Date(c.appliedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  // ================= FILTERED =================
  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      const matchesSearch =
        !searchTerm ||
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phoneNumber?.includes(searchTerm) ||
        c.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || c.applicationType?.toLowerCase() === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [careers, searchTerm, typeFilter]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);

  const paginatedCareers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCareers.slice(start, start + itemsPerPage);
  }, [filteredCareers, currentPage]);

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

  // ================= LOADING =================
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
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-gray-100 rounded-xl animate-pulse"
            />
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
          <p className="text-rose-600 font-semibold">
            Error loading applications
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Career Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage all job applications
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-60"
        >
          <span className={isFetching ? "animate-spin" : ""}>
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </span>
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total"
          value={totalApplications}
          icon={<FileText />}
          color="blue"
        />
        <StatCard
          label="Doctor"
          value={doctorApplications}
          icon={<User />}
          color="emerald"
        />
        <StatCard
          label="Staff"
          value={staffApplications}
          icon={<Briefcase />}
          color="violet"
        />
        <StatCard
          label="Today"
          value={todayApplications}
          icon={<Calendar />}
          color="amber"
        />
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-4 md:px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Applications</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredCareers.length} record
                {filteredCareers.length !== 1 && "s"} found
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
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-40 appearance-none px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                {[
                  "#",
                  "Applicant",
                  "Contact",
                  "Type",
                  "Specialization",
                  "Resume",
                  "Applied",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedCareers.length > 0 ? (
                paginatedCareers.map((app, index) => (
                  <tr
                    key={app._id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Applicant */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                          {getInitials(app.fullName)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {app.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Applied for{" "}
                            <span className="font-semibold text-indigo-600 capitalize">
                              {app.applicationType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${app.email}`}
                          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[160px]">
                            {app.email}
                          </span>
                        </a>
                        <a
                          href={`tel:${app.phoneNumber}`}
                          className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {app.phoneNumber}
                        </a>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-4">
                      <TypeBadge type={app.applicationType} />
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-4">
                      <span className="inline-block max-w-[180px] truncate align-middle px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {app.specialization || "—"}
                      </span>
                    </td>

                    {/* Resume */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          const url = `${
                            process.env.NEXT_PUBLIC_API_BASE
                          }/${app.resumeUrl.replace(/\\/g, "/")}`;
                          setPdfUrl(url);
                          setOpenPdf(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-lg transition active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>

                    {/* Applied At */}
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-700">
                        {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(app.appliedAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeCareer(app._id, app.fullName)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition active:scale-95 whitespace-nowrap"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
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
                        <Search className="w-7 h-7" />
                      </div>
                      <p className="text-gray-600 font-semibold">
                        No applications found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm || typeFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Applications will appear here"}
                      </p>
                      {(searchTerm || typeFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setTypeFilter("all");
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

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        open={openPdf}
        pdfUrl={pdfUrl}
        onClose={() => setOpenPdf(false)}
      />
    </div>
  );
};

/* ================= Sub-components ================= */

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/30",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/30",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/30",
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

const TypeBadge = ({ type }) => {
  const t = type?.toLowerCase();
  const styles = {
    doctor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    nurse: "bg-blue-50 text-blue-700 ring-blue-200",
    staff: "bg-violet-50 text-violet-700 ring-violet-200",
    other: "bg-gray-50 text-gray-700 ring-gray-200",
  };
  const dots = {
    doctor: "bg-emerald-500",
    nurse: "bg-blue-500",
    staff: "bg-violet-500",
    other: "bg-gray-500",
  };

  return (
    <span
      className={`inline-flex text-nowrap items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ring-1 ring-inset ${
        styles[t] || styles.other
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[t] || dots.other}`} />
      {type || "Other"}
    </span>
  );
};

export default AdminCareerPage;
