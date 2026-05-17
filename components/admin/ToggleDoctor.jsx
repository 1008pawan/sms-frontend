"use client";

import React from "react";
import api from "../Api/PrivateApi";
import { Power, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ToggleDoctor = ({ doctor }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedStatus) => {
      return await api.put(`/admin/doctors/${doctor._id}`, {
        isAvailable: updatedStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-doctors"]);
    },
  });

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(!doctor.isAvailable)}
      className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
        doctor.isAvailable
          ? "bg-green-100 hover:bg-green-200"
          : "bg-red-100 hover:bg-red-200"
      }`}
      title={doctor.isAvailable ? "Active" : "Inactive"}
    >
      {mutation.isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Power
          size={16}
          className={doctor.isAvailable ? "text-green-600" : "text-red-500"}
        />
      )}
    </button>
  );
};

export default ToggleDoctor;