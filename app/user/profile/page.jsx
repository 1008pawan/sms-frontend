"use client";
import api from "../../../components/Api/PrivateApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChangePasswordModal from "components/ChangePasswordModal";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
   const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data.data || null;
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put("/user/profile", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEdit(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
    }
    setIsEdit(false);
  };

  if (isLoading || !user) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.fullName || "-"}</h2>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEdit}
              className={`w-full border border-zinc-300 px-3 py-2 rounded-md ${
                !isEdit ? "bg-gray-50" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Phone (locked)
            </label>
            <input
              value={user.phone}
              readOnly
              className="w-full border border-zinc-300 px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEdit}
              className={`w-full border border-zinc-300 px-3 py-2 rounded-md ${
                !isEdit ? "bg-gray-50" : ""
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-5 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate(formData)}
                disabled={updateMutation.isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>

        {/* Change Password button */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Password</p>
            <p className="text-xs text-slate-500">Last changed: unknown</p>
          </div>
          <button
            onClick={() => setOpenPasswordModal(true)}
            className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition"
          >
            🔒 Change Password
          </button>
        </div>
      </div>

      {/* Modal */}
      <ChangePasswordModal
        isOpen={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
