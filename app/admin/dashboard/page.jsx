"use client";
import { useQuery } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const usersRes = await api.get("/admin/users");
      const appointmentsRes = await api.get("/appointment/all");

      const appointments = appointmentsRes.data.data;

      return {
        users: usersRes.data.data.length,
        appointmentsCount: appointments.length,
        appointments: appointments,
        pending: appointments.filter((a) => a.status === "Pending").length,
        approved: appointments.filter((a) => a.status === "approved").length,
        rejected: appointments.filter((a) => a.status === "rejected").length,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center">
        Dashboard data is not loading...
      </p>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: data.users,
      icon: Users,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Total Appointments",
      value: data.appointmentsCount,
      icon: CalendarCheck,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Pending Appointments",
      value: data.pending,
      icon: Clock,
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      title: "Approved Appointments",
      value: data.approved,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Rejected Appointments",
      value: data.rejected,
      icon: XCircle,
      gradient: "from-red-500 to-rose-500",
    },
  ];

  return (
    <div className="space-y-10">
      {/* ===== Section 1 ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`rounded-2xl p-6 text-white shadow
                bg-gradient-to-r ${item.gradient}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">{item.title}</p>
                    <p className="text-3xl font-bold mt-1">{item.value}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Recent Appointments ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>

        <div className="bg-white rounded-xl shadow divide-y divide-zinc-300">
          {data.appointments.slice(0, 3).map((a) => (
            <div
              key={a._id}
              className="flex justify-between items-center p-3 hover:bg-zinc-100"
            >
              <div>
                <p className="font-medium">{a.patientName}</p>
                <p className="text-sm text-zinc-500">{`Department : ${a.doctorId?.department || '_'}`}</p>
                <p className="text-sm text-zinc-500">{`Doctor : ${a.doctorId?.name || '_'}`}</p>
                <p className="text-xs text-zinc-400">
                  {new Date(a.appointmentDate).toLocaleDateString()} - {a.slot}
                </p>
              </div>

              <span
                className={`text-xs px-4 py-1 rounded-full
                ${
                  a.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : a.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
