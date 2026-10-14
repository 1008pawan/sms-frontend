"use client";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const DEPARTMENT_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const COLORS = ["#f97316", "#22c55e", "#ef4444", "#3b82f6"]; // pending, approved, rejected, refunded

const FILTERS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 6 months", value: "6m" },
  { label: "This year", value: "1y" },
  { label: "All time", value: "all" },
];

const getDateRange = (filter) => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  switch (filter) {
    case "today":
      return { start: startOfToday, end: endOfToday };

    case "yesterday": {
      const y = new Date(startOfToday);
      y.setDate(y.getDate() - 1);
      const yEnd = new Date(y);
      yEnd.setHours(23, 59, 59, 999);
      return { start: y, end: yEnd };
    }

    case "7d":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        end: null,
      };

    case "30d":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
        end: null,
      };

    case "6m":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        end: null,
      };

    case "1y":
      return { start: new Date(now.getFullYear(), 0, 1), end: null };

    case "all":
    default:
      return { start: null, end: null };
  }
};

export default function Analytics({ appointments = [] }) {
  const [filter, setFilter] = useState("6m");

  const filteredAppointments = useMemo(() => {
    const { start, end } = getDateRange(filter);
    if (!start && !end) return appointments;

    return appointments.filter((a) => {
      const d = new Date(a.appointmentDate);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }, [appointments, filter]);

  // ===== Monthly buckets =====
  const monthlyData = useMemo(() => {
    const now = new Date();

    const monthCount =
      filter === "today"
        ? 1
        : filter === "yesterday"
          ? 1
          : filter === "7d"
            ? 1
            : filter === "30d"
              ? 2
              : filter === "6m"
                ? 6
                : filter === "1y"
                  ? 12
                  : 12;

    const months = [];
    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        count: 0,
        revenue: 0,
        refunded: 0, // 👈 naya
      });
    }

    filteredAppointments.forEach((a) => {
      const d = new Date(a.appointmentDate);
      const found = months.find(
        (m) => m.month === d.getMonth() && m.year === d.getFullYear(),
      );
      if (found) {
        found.count += 1;
        if (a.payment?.isPaid) {
          // 👇 Refunded ko revenue me count nahi karo
          if (a.payment?.isRefunded) {
            found.refunded +=
              (a.payment?.refundAmount || a.payment?.amount || 0) / 100;
          } else {
            found.revenue += (a.payment?.amount || 0) / 100;
          }
        }
      }
    });

    return months.map(({ name, count, revenue }) => ({
      name,
      Appointments: count,
      Revenue: revenue,
    }));
  }, [filteredAppointments, filter]);

  // ===== Status Distribution (with Refunded) =====
  const statusData = useMemo(
    () =>
      [
        {
          name: "Pending",
          value: filteredAppointments.filter((a) => a.status === "Pending")
            .length,
        },
        {
          name: "Approved",
          value: filteredAppointments.filter((a) => a.status === "approved")
            .length,
        },
        {
          name: "Rejected",
          value: filteredAppointments.filter((a) => a.status === "rejected")
            .length,
        },
        // 👇 Refunded appointments
        {
          name: "Refunded",
          value: filteredAppointments.filter((a) => a.payment?.isRefunded)
            .length,
        },
      ].filter((s) => s.value > 0),
    [filteredAppointments],
  );

  // ===== Top Departments =====
  const departmentData = useMemo(() => {
    const map = {};
    filteredAppointments.forEach((a) => {
      const dept = a.doctorId?.department || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, Appointments: value }))
      .sort((a, b) => b.Appointments - a.Appointments)
      .slice(0, 5);
  }, [filteredAppointments]);

  // ===== Revenue Summary (refunded exclude) =====
  const totalRevenue =
    filteredAppointments
      .filter((a) => a.payment?.isPaid && !a.payment?.isRefunded)
      .reduce((sum, a) => sum + (a.payment?.amount || 0), 0) / 100;

  const pendingRevenue =
    filteredAppointments
      .filter((a) => !a.payment?.isPaid)
      .reduce((sum, a) => sum + (a.payment?.amount || 0), 0) / 100;

  // 👇 Refunded stats
  const refundedCount = filteredAppointments.filter(
    (a) => a.payment?.isRefunded,
  ).length;

  const refundedAmount =
    filteredAppointments
      .filter((a) => a.payment?.isRefunded)
      .reduce(
        (sum, a) => sum + (a.payment?.refundAmount || a.payment?.amount || 0),
        0,
      ) / 100;

  const thisMonthRevenue = (() => {
    const now = new Date();
    return (
      filteredAppointments
        .filter((a) => {
          if (!a.payment?.isPaid || a.payment?.isRefunded) return false;
          const d = new Date(a.payment?.paidAt || a.appointmentDate);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, a) => sum + (a.payment?.amount || 0), 0) / 100
    );
  })();

  const formatINR = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-5">
      {/* ===== Header + Filter ===== */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold">Analytics</h2>

        <div className="flex items-center gap-2">
          <label
            htmlFor="analytics-filter"
            className="text-sm text-zinc-500 hidden sm:block"
          >
            Time range:
          </label>
          <select
            id="analytics-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Revenue Summary Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-5 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow">
          <p className="text-sm opacity-80">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">{formatINR(totalRevenue)}</p>
          <p className="text-xs opacity-70 mt-2">From paid appointments</p>
        </div>

        <div className="rounded-xl p-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow">
          <p className="text-sm opacity-80">This Month Revenue</p>
          <p className="text-3xl font-bold mt-1">
            {formatINR(thisMonthRevenue)}
          </p>
          <p className="text-xs opacity-70 mt-2">
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-xl p-5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow">
          <p className="text-sm opacity-80">Pending Revenue</p>
          <p className="text-3xl font-bold mt-1">{formatINR(pendingRevenue)}</p>
          <p className="text-xs opacity-70 mt-2">Yet to be collected</p>
        </div>

        {/* 👇 Refunded card */}
        <div className="rounded-xl p-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow">
          <p className="text-sm opacity-80">Refunded</p>
          <p className="text-3xl font-bold mt-1">{formatINR(refundedAmount)}</p>
          <p className="text-xs opacity-70 mt-2">
            {refundedCount} appointment{refundedCount !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* ===== Charts ===== */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-zinc-500">
          No data available for the selected time range.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
            <h3 className="font-semibold mb-4 text-zinc-700">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Appointments */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4 text-zinc-700">
              Appointments Trend
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="Appointments"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution (with Refunded) */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4 text-zinc-700">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Departments */}
          <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
            <h3 className="font-semibold mb-4 text-zinc-700">
              Top Departments
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="Appointments" radius={[0, 6, 6, 0]}>
                  {departmentData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={DEPARTMENT_COLORS[i % DEPARTMENT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
