"use client";

import React, { useState } from "react";
import api from "../Api/PrivateApi";
import { Power, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ToggleDoctor = ({ doctor }) => {
  const queryClient = useQueryClient();
  const [showDurationForm, setShowDurationForm] = useState(false);
  const [durationDays, setDurationDays] = useState("0");
  const [durationHours, setDurationHours] = useState("1");

  const mutation = useMutation({
    mutationFn: async (availability) => {
      return await api.patch(
        `/admin/doctors/${doctor._id}/toggle-status`,
        availability,
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      setShowDurationForm(false);
      toast.success(res.data.message || "Status updated!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  const handleToggle = () => {
    if (doctor.isAvailable) {
      setDurationDays("0");
      setDurationHours("1");
      setShowDurationForm(true);
      return;
    }

    mutation.mutate({ isAvailable: true });
  };

  const handleDeactivate = (event) => {
    event.preventDefault();
    const days = Number(durationDays);
    const hours = Number(durationHours);

    if (
      !Number.isInteger(days) ||
      days < 0 ||
      !Number.isInteger(hours) ||
      hours < 0 ||
      hours >= 24 ||
      days * 24 + hours < 1
    ) {
      toast.error("Choose an inactive duration of at least one hour.");
      return;
    }

    mutation.mutate({
      isAvailable: false,
      durationDays: days,
      durationHours: hours,
    });
  };

  return (
    <>
      <button
        disabled={mutation.isPending}
        onClick={handleToggle}
        className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
          doctor.isAvailable
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
            : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
        }`}
        title={doctor.isAvailable ? "Make Inactive" : "Make Active"}
        aria-label={doctor.isAvailable ? "Make doctor inactive" : "Make doctor active"}
      >
        {mutation.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Power size={16} />
        )}
      </button>

      {showDurationForm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setShowDurationForm(false)}
        >
          <form
            onSubmit={handleDeactivate}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowDurationForm(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="pr-8">
              <h2 className="text-xl font-black text-slate-900">
                Set inactive duration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {doctor.name} will automatically become active when this
                duration ends.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                Days
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={durationDays}
                  onChange={(event) => setDurationDays(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                Hours
                <input
                  type="number"
                  min="0"
                  max="23"
                  step="1"
                  required
                  value={durationHours}
                  onChange={(event) => setDurationHours(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <p className="text-xs text-slate-500">
              Duration must total at least one hour. The doctor will be
              unavailable for new bookings until the timer expires.
            </p>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
              {mutation.isPending ? "Updating..." : "Confirm inactive"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ToggleDoctor;
