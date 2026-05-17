"use client";

import api from "@/components/Api/PrivateApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    newPassword: "",
  });

  /* ================= GET ADMIN PROFILE ================= */
  const { data: admin = {}, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await api.get("/admin/me");
      return res.data.admin;
    },
  });

  useEffect(() => {
    if (admin && Object.keys(admin).length > 0) {
      setFormData({
        fullName: admin.fullName ?? "",
        phone: admin.phone ?? "",
        newPassword: "",
      });
    }
  }, [admin]);

  /* ================= UPDATE PROFILE ================= */
  const updateMutation = useMutation({
    mutationFn: (data) => api.put("/admin/profile", data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["admin-profile"]);
      setIsEdit(false);
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
      }));
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className="md:p-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {admin.fullName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{admin.fullName}</h2>
            <p className="text-xs text-gray-500">{admin.phone}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="fullName"
            value={formData.fullName ?? ""}
            onChange={handleChange}
            readOnly={!isEdit}
            className="border border-zinc-200 px-3 py-2 rounded-md"
          />

          <input
            value={admin.phone}
            readOnly
            className="border border-zinc-200 px-3 py-2 rounded-md bg-gray-100"
          />

          {isEdit && (
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword ?? ""}
              onChange={handleChange}
              placeholder="New Password"
              className="border border-zinc-200 px-3 py-2 rounded-md"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEdit(false)}
                className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate(formData)}
                disabled={updateMutation.isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
