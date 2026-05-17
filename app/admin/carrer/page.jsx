"use client";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import PdfPreviewModal from "../../../components/PdfPreviewModal";

const AdminCareerPage = () => {
  const queryClient = useQueryClient();

  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ================= GET CAREERS =================
  const getCareers = async () => {
    const res = await api.get("/carrer/getdata");
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["career-applications"],
    queryFn: getCareers,
  });

  // ================= DELETE CAREER =================
  const deleteCareer = async (id) => {
    const res = await api.delete(`/carrer/${id}`);
    return res.data;
  };

  const { mutate: removeCareer } = useMutation({
    mutationFn: deleteCareer,

    onSuccess: () => {
      toast.success("Application deleted");

      queryClient.invalidateQueries({
        queryKey: ["career-applications"],
      });
    },

    onError: () => {
      toast.error("Failed to delete application");
    },
  });
  const careers = data?.data || [];

  // ================= PAGINATION =================
  const totalPages = Math.ceil(careers.length / itemsPerPage);

  const paginatedCareers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return careers.slice(start, end);
  }, [careers, currentPage]);

  // ================= STATES =================
  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">Error loading applications</p>
      </div>
    );
  }
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Career Applications</h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-200 text-left">
            <tr>
              <th className="p-3">S.NO</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Type</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Resume</th>
              <th className="p-3">Applied At</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCareers.length > 0 ? (
              paginatedCareers.map((app, index) => (
                <tr
                  key={app._id}
                  className="border-t border-zinc-200 hover:bg-zinc-50"
                >
                  <td className="p-3 font-medium">
                    {" "}
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3 font-medium">{app.fullName}</td>
                  <td className="p-3">
                    <a
                      href={`mailto:${app.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {app.email}
                    </a>
                  </td>

                  <td className="p-3">
                    <a
                      href={`tel:${app.phoneNumber}`}
                      className="text-blue-600 hover:underline"
                    >
                      {app.phoneNumber}
                    </a>
                  </td>

                  <td className="p-3">{app.applicationType}</td>
                  <td className="p-3">{app.specialization}</td>

                  <td className="p-3">
                    <a
                      onClick={() => {
                        const pdfUrl = `${
                          process.env.NEXT_PUBLIC_API_BASE
                        }/${app.resumeUrl.replace(/\\/g, "/")}`;
                        setPdfUrl(pdfUrl);
                        setOpenPdf(true);
                        console.log(pdfUrl);
                      }}
                      className="inline-flex items-center cursor-pointer font-semibold gap-1 text-blue-600"
                    >
                      View
                    </a>
                  </td>

                  <td className="p-3">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeCareer(app._id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-zinc-500 font-medium"
                >
                  No career applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <PdfPreviewModal
          open={openPdf}
          pdfUrl={pdfUrl}
          onClose={() => setOpenPdf(false)}
        />

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

              {/* Page Numbers */}
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
};

export default AdminCareerPage;
