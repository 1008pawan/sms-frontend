"use client";
import { useState } from "react";
import api from "./Api/PrivateApi";
import { useMutation } from "@tanstack/react-query";
import { X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put("/user/change-password", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to change password");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👇 Check karo ki naya password purane se alag hai
    if (form.currentPassword === form.newPassword) {
      return toast.error(
        "New password must be different from current password",
      );
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    // 👇 Backend ko sirf zaroori fields bhejo
    mutation.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  const renderInput = (name, placeholder, showKey) => (
    <div>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
        {placeholder}
      </label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type={show[showKey] ? "text" : "password"}
          placeholder={`Enter ${placeholder.toLowerCase()}`}
          required
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm font-medium"
        />
        <button
          type="button"
          onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <ShieldCheck size={24} />
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-1">
          Change Password
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Ensure your account is secure by updating your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInput("currentPassword", "Current Password", "current")}
          {renderInput("newPassword", "New Password", "new")}
          {renderInput("confirmPassword", "Confirm New Password", "confirm")}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              <b>Password must contain:</b> at least 8 characters, one
              uppercase, one lowercase, one number, and one special character.
            </p>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
