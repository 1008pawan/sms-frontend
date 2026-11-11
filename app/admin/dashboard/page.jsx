"use client";
import { useQuery } from "@tanstack/react-query";
import api from "../../../components/Api/PrivateApi";
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Wallet,
} from "lucide-react";
import Analytics from "components/Analytics";

const getPaymentStatus = (payment) =>
  payment?.status || (payment?.isPaid ? "approved" : "not_submitted");

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const usersRes = await api.get("/admin/users");
      const appointmentsRes = await api.get("/appointment/all");

      const appointments = appointmentsRes.data.data;

      // Only manually approved payments count as collected revenue.
      const totalRevenue = appointments
        .filter((a) => getPaymentStatus(a.payment) === "approved")
        .reduce((sum, a) => sum + (a.payment?.amount || 0), 0);

      const awaitingPayments = appointments.filter(
        (a) => getPaymentStatus(a.payment) === "pending",
      );
      const rejectedPayments = appointments.filter(
        (a) => getPaymentStatus(a.payment) === "rejected",
      ).length;
      const notSubmittedPayments = appointments.filter(
        (a) => getPaymentStatus(a.payment) === "not_submitted",
      ).length;

      return {
        users: usersRes.data.data.length,
        appointmentsCount: appointments.length,
        appointments: appointments,
        pending: appointments.filter((a) => a.status === "Pending").length,
        approved: appointments.filter((a) => a.status === "approved").length,
        rejected: appointments.filter((a) => a.status === "rejected").length,
        totalRevenue,
        awaitingPayments: awaitingPayments.length,
        awaitingAmount: awaitingPayments.reduce(
          (sum, a) => sum + (a.payment?.amount || 0),
          0,
        ),
        rejectedPayments,
        notSubmittedPayments,
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
    {
      title: "Total Revenue",
      value: `₹${(data.totalRevenue / 100).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Payments Awaiting Review",
      value: data.awaitingPayments,
      icon: Wallet,
      gradient: "from-yellow-500 to-orange-500",
      subtitle: `₹${(data.awaitingAmount / 100).toLocaleString("en-IN")} submitted`,
    },
    {
      title: "Rejected Payments",
      value: data.rejectedPayments,
      icon: XCircle,
      gradient: "from-rose-500 to-red-500",
      subtitle: "Need corrected submission",
    },
    {
      title: "Payments Not Submitted",
      value: data.notSubmittedPayments,
      icon: Clock,
      gradient: "from-slate-500 to-slate-700",
      subtitle: "No payment details received",
    },
  ];
  return (
    <div className="space-y-6">
      {/* ===== Section 1 ===== */}
      <div>
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                    {item.subtitle && (
                      <p className="mt-1 text-xs opacity-80">
                        {item.subtitle}
                      </p>
                    )}
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

      {/* ===== Analytics ===== */}
      <Analytics appointments={data.appointments} />

      {/* ===== Recent Appointments ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Appointments</h2>

        <div className="bg-white rounded-xl shadow divide-y divide-zinc-300">
          {data.appointments.slice(0, 3).map((a) => (
            <div
              key={a._id}
              className="flex justify-between items-center p-3 hover:bg-zinc-100"
            >
              <div>
                <p className="font-medium">{a.patientName}</p>
                <p className="text-sm text-zinc-500">{`Department : ${a.doctorId?.department || "_"}`}</p>
                <p className="text-sm text-zinc-500">{`Doctor : ${a.doctorId?.name || "_"}`}</p>
                <p
                  className={`text-xs font-semibold ${
                    getPaymentStatus(a.payment) === "approved"
                      ? "text-green-600"
                      : getPaymentStatus(a.payment) === "pending"
                        ? "text-amber-600"
                        : getPaymentStatus(a.payment) === "rejected"
                          ? "text-red-500"
                          : "text-zinc-500"
                  }`}
                >
                  {getPaymentStatus(a.payment) === "approved"
                    ? `Payment approved · ₹${((a.payment?.amount || 0) / 100).toLocaleString("en-IN")}`
                    : getPaymentStatus(a.payment) === "pending"
                      ? `Awaiting admin review · ₹${((a.payment?.amount || 0) / 100).toLocaleString("en-IN")}`
                      : getPaymentStatus(a.payment) === "rejected"
                        ? `Payment rejected · ₹${((a.payment?.amount || 0) / 100).toLocaleString("en-IN")}`
                        : "Payment not submitted"}
                </p>
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
