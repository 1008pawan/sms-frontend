"use client";
import api from "@/components/Api/PrivateApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
    password: "",
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
        password: "",
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
      queryClient.invalidateQueries(["profile"]);
      setIsEdit(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

if (isLoading || !user) {
  return <div className="p-10">Loading profile...</div>;
}


  return (
    <div className="p-6 md:p-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-xl inset-shadow-sm/10 shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-15 h-15 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {user.fullName?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.fullName || "-"}</h2>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            readOnly={!isEdit}
            className="border border-zinc-300 px-3 py-2 rounded-md"
          />

          <input
            value={user.phone}
            readOnly
            className="border border-zinc-300 px-3 py-2 rounded-md bg-gray-100"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEdit}
            className="border border-zinc-300 px-3 py-2 rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {isEdit && (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              className="border border-zinc-300 px-3 py-2 rounded-md"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="px-5 py-2 bg-gray-200 hover:bg-zinc-300 rounded-md cursor-pointer"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEdit(false)}
                className="px-5 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate(formData)}
                className="px-5 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
