"use client";

import React from "react";
import api from "../Api/PrivateApi";
import { Power, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ToggleDoctor = ({ doctor }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      // 👇 Naya route call karo
      return await api.patch(`/admin/doctors/${doctor._id}/toggle-status`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-doctors"]);
      toast.success(res.data.message || "Status updated!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
      className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
        doctor.isAvailable
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
          : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
      }`}
      title={doctor.isAvailable ? "Make Inactive" : "Make Active"}
    >
      {mutation.isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Power size={16} />
      )}
    </button>
  );
};

export default ToggleDoctor;
