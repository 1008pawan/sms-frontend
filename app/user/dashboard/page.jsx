"use client";
import api from "@/components/Api/PrivateApi";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchAppointments = async () => {
    const res = await api.get(`/appointment/user`);
    return res.data.data;
  };

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-appointments"],
    queryFn: fetchAppointments,
  });

  // status
  const totalAppointments = data.length;

  const pendingAppointments = data.filter(
    (item) => item.status === "Pending",
  ).length;

  const approvedAppointments = data.filter(
    (item) => item.status === "approved",
  ).length;

  const rejectedAppointments = data.filter(
    (item) => item.status === "rejected",
  ).length;

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return data.slice(start, end);
  }, [data, currentPage]);

  // AFTER ALL HOOKS
  if (isLoading) {
    return <p className="p-5">Loading...</p>;
  }

  if (error) {
    return <p className="p-5">Failed to load appointments</p>;
  }

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Total Appointments
            </p>

            <h2 className="text-4xl font-black mt-3 text-blue-600">
              {totalAppointments}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Pending Appointments
            </p>

            <h2 className="text-4xl font-black mt-3 text-yellow-500">
              {pendingAppointments}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Approved Appointments
            </p>

            <h2 className="text-4xl font-black mt-3 text-green-600">
              {approvedAppointments}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Rejected Appointments
            </p>

            <h2 className="text-4xl font-black mt-3 text-red-500">
              {rejectedAppointments}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                Appointment History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                View all your booked appointments
              </p>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
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
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {item.patientName}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                        {item.phone}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700 whitespace-nowrap">
                        {item.doctorId?.department || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {item.doctorId?.name || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(item.appointmentDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                        {item.slot}
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold capitalize
                      ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-16 text-gray-500 text-sm"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="px-4 py-2 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
