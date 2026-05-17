"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/components/Api/PrivateApi";

export default function AdminAppointmentsPage() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: getAllAppointments,
  });

  // ================= MUTATIONS =================
  const { mutate: updateStatus } = useMutation({
    mutationFn: updateAppointmentStatus,

    onSuccess: () => {
      toast.success("Appointment status updated");

      queryClient.invalidateQueries({
        queryKey: ["admin-appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-appointments"],
      });
    },

    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const { mutate: deleteAppt } = useMutation({
    mutationFn: deleteAppointment,

    onSuccess: () => {
      toast.success("Appointment deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-appointments"],
      });
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
    (item) => item.status?.toLowerCase() === "pending",
  ).length;

  const approvedAppointments = appointments.filter(
    (item) => item.status?.toLowerCase() === "approved",
  ).length;

  const rejectedAppointments = appointments.filter(
    (item) => item.status?.toLowerCase() === "rejected",
  ).length;

  // ================= PAGINATION =================
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return appointments.slice(start, end);
  }, [appointments, currentPage]);

  // ================= STATES =================
  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {error?.response?.data?.message || "Failed to load appointments"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            Total Appointments
          </p>

          <h2 className="text-4xl font-black text-blue-600 mt-3">
            {totalAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pending</p>

          <h2 className="text-4xl font-black text-yellow-500 mt-3">
            {pendingAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Approved</p>

          <h2 className="text-4xl font-black text-green-600 mt-3">
            {approvedAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Rejected</p>

          <h2 className="text-4xl font-black text-red-500 mt-3">
            {rejectedAppointments}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800">
            Appointment Records
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            List of all appointment requests
          </p>
        </div>

        {/* Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "S.No",
                  "Patient",
                  "Phone",
                  "Department",
                  "Doctor",
                  "Date",
                  "Slot",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((appt, index) => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-5 text-sm font-semibold text-gray-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </td>

                    <td className="px-3 py-5">
                      <div className="font-semibold text-gray-900">
                        {appt.patientName}
                      </div>
                    </td>

                    <td className="px-3 py-5 text-sm text-gray-600">
                      {appt.phone}
                    </td>

                    <td className="px-3 py-5 text-sm text-gray-700">
                      {appt.department}
                    </td>

                    <td className="px-3 py-5 text-sm font-medium text-gray-800">
                      {appt.doctorId?.name || "—"}
                    </td>

                    <td className="px-3 py-5 text-sm text-gray-600">
                      {new Date(appt.appointmentDate).toLocaleDateString()}
                    </td>

                    <td className="px-3 py-5 text-sm text-gray-600">
                      {appt.slot}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold capitalize
                      ${
                        appt.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                      >
                        {appt.status}
                      </span>
                    </td>

                    <td className="px-3 py-5">
                      {appt.status?.toLowerCase() === "pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              updateStatus({
                                id: appt._id,
                                status: "approved",
                              })
                            }
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-semibold rounded-lg cursor-pointer transition"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateStatus({
                                id: appt._id,
                                status: "rejected",
                              })
                            }
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-semibold rounded-lg cursor-pointer transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure?")) {
                              deleteAppt(appt._id);
                            }
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-semibold rounded-lg cursor-pointer transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-500">
                    No appointments found
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
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
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
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 hover:bg-gray-100"
                }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
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
