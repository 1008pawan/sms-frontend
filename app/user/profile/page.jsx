"use client";
import api from "../../../components/Api/PrivateApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChangePasswordModal from "components/ChangePasswordModal";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Calendar, Lock, Camera, Shield } from "lucide-react";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information and account security.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Cover Photo */}
          <div className="h-32 bg-blue-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-black">
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">{user.fullName}</h2>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                  <Mail size={14} /> {user.email || "No email provided"}
                </p>
              </div>
              {!isEdit ? (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-5 py-2.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-100 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateMutation.mutate(formData)}
                    disabled={updateMutation.isPending}
                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Form Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    readOnly={!isEdit}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      !isEdit 
                        ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                        : "bg-white border-blue-300 focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={user.phone}
                    readOnly
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-medium appearance-none transition-all ${
                      !isEdit 
                        ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                        : "bg-white border-blue-300 focus:ring-2 focus:ring-blue-500/20 text-slate-800 cursor-pointer"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Shield className="text-blue-500" size={20} /> Security
              </h3>
              <div className="bg-slate-50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-700">Account Password</p>
                  <p className="text-xs text-slate-500 mt-1">Keep your account secure by using a strong password.</p>
                </div>
                <button
                  onClick={() => setOpenPasswordModal(true)}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Lock size={16} /> Change Password
                </button>
              </div>
            </div>
          </div>
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