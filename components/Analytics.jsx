"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import api from "./Api/PrivateApi";
import Link from "next/link";

const COLORS = {
  indigo: "#6366f1",
  blue: "#3b82f6",
  emerald: "#10b981",
  orange: "#f97316",
  amber: "#f59e0b",
  red: "#ef4444",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  lime: "#84cc16",
  slate: "#94a3b8",
};

const PIE_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const FILTERS = [
  { label: "Today", value: "today" },
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

export default function Analytics() {
  const [filter, setFilter] = useState("6m");

  /* ============================================================
     FETCH ALL DATA
  ============================================================ */
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["analytics-users"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.data || [];
    },
  });

  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["analytics-appointments"],
    queryFn: async () => {
      const res = await api.get("/appointment/all");
      return res.data.data || [];
    },
  });

  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ["analytics-doctors"],
    queryFn: async () => {
      const res = await api.get("/admin/doctors");
      return res.data.data || [];
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["analytics-reviews"],
    queryFn: async () => {
      const res = await api.get("/review");
      return res.data.data || [];
    },
  });

  const { data: careersData } = useQuery({
    queryKey: ["analytics-careers"],
    queryFn: async () => {
      const res = await api.get("/carrer/getdata");
      return res.data.data || [];
    },
  });

  const isLoading = usersLoading || appointmentsLoading || doctorsLoading;

  const users = usersData || [];
  const appointments = appointmentsData || [];
  const doctors = doctorsData || [];
  const reviews = reviewsData || [];
  const careers = careersData || [];

  /* ============================================================
     FILTER DATA BY DATE RANGE
  ============================================================ */
  const { start, end } = getDateRange(filter);

  const inRange = (dateStr) => {
    if (!start && !end) return true;
    if (!dateStr) return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  const filteredUsers = useMemo(
    () => users.filter((u) => inRange(u.createdAt)),
    [users, filter],
  );
  const filteredAppointments = useMemo(
    () => appointments.filter((a) => inRange(a.appointmentDate || a.createdAt)),
    [appointments, filter],
  );
  const filteredDoctors = useMemo(
    () => doctors.filter((d) => inRange(d.createdAt)),
    [doctors, filter],
  );
  const filteredReviews = useMemo(
    () => reviews.filter((r) => inRange(r.createdAt)),
    [reviews, filter],
  );
  const filteredCareers = useMemo(
    () => careers.filter((c) => inRange(c.createdAt)),
    [careers, filter],
  );

  /* ============================================================
     KPI CALCULATIONS
  ============================================================ */
  const totalUsers = filteredUsers.length;
  const totalAppointments = filteredAppointments.length;
  const totalDoctors = filteredDoctors.length;
  const totalReviews = filteredReviews.length;
  const totalCareers = filteredCareers.length;

  const pendingAppointments = filteredAppointments.filter(
    (a) => a.status?.toLowerCase() === "pending",
  ).length;
  const approvedAppointments = filteredAppointments.filter(
    (a) => a.status?.toLowerCase() === "approved",
  ).length;
  const rejectedAppointments = filteredAppointments.filter(
    (a) => a.status?.toLowerCase() === "rejected",
  ).length;
  const refundedAppointments = filteredAppointments.filter(
    (a) => a.payment?.isRefunded,
  ).length;
  const paidAppointments = filteredAppointments.filter(
    (a) => a.payment?.isPaid,
  ).length;
  const unpaidAppointments = totalAppointments - paidAppointments;

  const totalRevenue =
    filteredAppointments
      .filter((a) => a.payment?.isPaid && !a.payment?.isRefunded)
      .reduce((sum, a) => sum + (a.payment?.amount || 0), 0) / 100;

  const refundedAmount =
    filteredAppointments
      .filter((a) => a.payment?.isRefunded)
      .reduce(
        (sum, a) => sum + (a.payment?.refundAmount || a.payment?.amount || 0),
        0,
      ) / 100;

  const pendingRevenue =
    filteredAppointments
      .filter((a) => !a.payment?.isPaid)
      .reduce((sum, a) => sum + (a.payment?.amount || 0), 0) / 100;

  /* ============================================================
     CHART DATA 1: MONTHLY TREND (all entities)
  ============================================================ */
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const monthCount =
      filter === "today" || filter === "7d"
        ? 1
        : filter === "30d"
          ? 2
          : filter === "6m"
            ? 6
            : 12;

    const months = [];
    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        users: 0,
        appointments: 0,
        doctors: 0,
        reviews: 0,
        careers: 0,
        revenue: 0,
      });
    }

    const match = (dateStr) => {
      if (!dateStr) return months[months.length - 1];
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return months[months.length - 1];
      return months.find(
        (m) => m.month === d.getMonth() && m.year === d.getFullYear(),
      );
    };

    filteredUsers.forEach((u) => {
      const m = match(u.createdAt);
      if (m) m.users += 1;
    });
    filteredAppointments.forEach((a) => {
      const m = match(a.appointmentDate || a.createdAt);
      if (m) {
        m.appointments += 1;
        if (a.payment?.isPaid && !a.payment?.isRefunded) {
          m.revenue += (a.payment?.amount || 0) / 100;
        }
      }
    });
    filteredDoctors.forEach((d) => {
      const m = match(d.createdAt);
      if (m) m.doctors += 1;
    });
    filteredReviews.forEach((r) => {
      const m = match(r.createdAt);
      if (m) m.Reviews += 1;
    });
    filteredCareers.forEach((c) => {
      const m = match(c.createdAt);
      if (m) m.careers += 1;
    });

    return months;
  }, [
    filter,
    filteredUsers,
    filteredAppointments,
    filteredDoctors,
    filteredReviews,
    filteredCareers,
  ]);

  /* ============================================================
     CHART DATA 2: APPOINTMENT STATUS PIE
  ============================================================ */
  const statusPieData = [
    { name: "Pending", value: pendingAppointments },
    { name: "Approved", value: approvedAppointments },
    { name: "Rejected", value: rejectedAppointments },
    { name: "Refunded", value: refundedAppointments },
  ].filter((d) => d.value > 0);

  /* ============================================================
     CHART DATA 3: PAYMENT STATUS PIE
  ============================================================ */
  const paymentPieData = [
    { name: "Paid", value: paidAppointments - refundedAppointments },
    { name: "Unpaid", value: unpaidAppointments },
    { name: "Refunded", value: refundedAppointments },
  ].filter((d) => d.value > 0);

  /* ============================================================
     CHART DATA 4: USERS BY GENDER
  ============================================================ */
  const genderData = useMemo(() => {
    const map = {};
    filteredUsers.forEach((u) => {
      const g = (u.gender || "unknown").toLowerCase();
      map[g] = (map[g] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredUsers]);

  /* ============================================================
     CHART DATA 5: TOP DEPARTMENTS
  ============================================================ */
  const departmentData = useMemo(() => {
    const map = {};
    filteredAppointments.forEach((a) => {
      const dept = a.doctorId?.department || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, Appointments: value }))
      .sort((a, b) => b.Appointments - a.Appointments)
      .slice(0, 8);
  }, [filteredAppointments]);

  /* ============================================================
     CHART DATA 6: TOP DOCTORS
  ============================================================ */
  const topDoctors = useMemo(() => {
    const map = {};
    filteredAppointments.forEach((a) => {
      const name = a.doctorId?.name || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, Appointments: value }))
      .sort((a, b) => b.Appointments - a.Appointments)
      .slice(0, 8);
  }, [filteredAppointments]);

  /* ============================================================
     CHART DATA 7: DOCTORS BY DEPARTMENT
  ============================================================ */
  const doctorsByDept = useMemo(() => {
    const map = {};
    filteredDoctors.forEach((d) => {
      const dept = d.department || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, Doctors: value }))
      .sort((a, b) => b.Doctors - a.Doctors)
      .slice(0, 8);
  }, [filteredDoctors]);

  /* ============================================================
     CHART DATA 8: REVIEWS BY RATING
  ============================================================ */
  const reviewsByRating = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredReviews.forEach((r) => {
      const rating = Math.round(r.rating || 0);
      if (rating >= 1 && rating <= 5) counts[rating] += 1;
    });
    return Object.entries(counts)
      .map(([star, value]) => ({ star: `${star}★`, Reviews: value }))
      .reverse();
  }, [filteredReviews]);

  const avgRating = filteredReviews.length
    ? (
        filteredReviews.reduce((s, r) => s + (r.rating || 0), 0) /
        filteredReviews.length
      ).toFixed(1)
    : 0;

  /* ============================================================
     CHART DATA 9: CAREERS BY STATUS
  ============================================================ */
  const careersByStatus = useMemo(() => {
    const map = {};
    filteredCareers.forEach((c) => {
      const s = c.status || "pending";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredCareers]);

  /* ============================================================
     CHART DATA 10: PEAK HOURS
  ============================================================ */
  const peakHours = useMemo(() => {
    const hours = {};
    for (let i = 0; i < 24; i++) hours[i] = 0;

    filteredAppointments.forEach((a) => {
      const slot = a.slot || "";
      const m = slot.match(/^(\d{1,2}):?(\d{2})?\s?(AM|PM)?/i);
      if (m) {
        let h = parseInt(m[1], 10);
        const period = (m[3] || "").toUpperCase();
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        hours[h] = (hours[h] || 0) + 1;
      }
    });

    return Object.entries(hours)
      .filter(([h, c]) => c > 0)
      .map(([h, count]) => ({
        hour: `${h.padStart(2, "0")}:00`,
        Appointments: count,
      }));
  }, [filteredAppointments]);

  const formatINR = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  /* ============================================================
     RENDER
  ============================================================ */
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ==================== HEADER + FILTER ==================== */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-2xl font-black text-zinc-800 tracking-tight">
            Analytics Overview
          </h2>
          <p className="text-sm text-gray-500">
            Insights across users, appointments, payments, doctors & more
          </p>
        </div>

        <select
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

      {/* ==================== KPI ROW ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/admin/doctors">
          <KpiCard
            label="Doctors"
            value={totalDoctors}
            color="emerald"
            icon="🩺"
          />
        </Link>

        <Link href="/admin/reviews">
          <KpiCard
            label="Reviews"
            value={totalReviews}
            color="amber"
            icon="⭐"
          />
        </Link>

        <Link href="/admin/carrer">
          <KpiCard
            label="Careers"
            value={totalCareers}
            color="violet"
            icon="💼"
          />
        </Link>
      </div>

      {/* ==================== ROW 8: REVENUE SUMMARY ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RevenueCard
          label="Total Revenue"
          value={formatINR(totalRevenue)}
          subtitle="From paid appointments"
          color="from-emerald-500 to-teal-500"
        />
        <RevenueCard
          label="Pending Revenue"
          value={formatINR(pendingRevenue)}
          subtitle="Yet to be collected"
          color="from-orange-500 to-amber-500"
        />
        <RevenueCard
          label="Refunded"
          value={formatINR(refundedAmount)}
          subtitle={`${refundedAppointments} appointment${refundedAppointments !== 1 ? "s" : ""}`}
          color="from-blue-500 to-cyan-500"
        />
      </div>

      {/* ==================== ROW 1: OVERALL TREND (full) ==================== */}
      <SectionCard
        title="Overall Growth Trend"
        subtitle="Users, appointments, doctors, reviews & careers over time"
      >
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={monthlyTrend}>
            <defs>
              {Object.entries({
                users: COLORS.blue,
                appointments: COLORS.indigo,
                doctors: COLORS.emerald,
                reviews: COLORS.amber,
                careers: COLORS.violet,
              }).map(([key, color]) => (
                <linearGradient
                  key={key}
                  id={`grad-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="users"
              stroke={COLORS.blue}
              fill="url(#grad-users)"
              strokeWidth={2}
              name="Users"
            />
            <Area
              type="monotone"
              dataKey="appointments"
              stroke={COLORS.indigo}
              fill="url(#grad-appointments)"
              strokeWidth={2}
              name="Appointments"
            />
            <Area
              type="monotone"
              dataKey="doctors"
              stroke={COLORS.emerald}
              fill="url(#grad-doctors)"
              strokeWidth={2}
              name="Doctors"
            />
            <Area
              type="monotone"
              dataKey="reviews"
              stroke={COLORS.amber}
              fill="url(#grad-reviews)"
              strokeWidth={2}
              name="Reviews"
            />
            <Area
              type="monotone"
              dataKey="careers"
              stroke={COLORS.violet}
              fill="url(#grad-careers)"
              strokeWidth={2}
              name="Careers"
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* ==================== ROW 2: APPOINTMENTS + PAYMENTS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Appointment Status"
          subtitle="Pending / Approved / Rejected / Refunded"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Payment Status"
          subtitle={`Total Revenue: ${formatINR(totalRevenue)}`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill={COLORS.emerald} />
                <Cell fill={COLORS.orange} />
                <Cell fill={COLORS.blue} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ==================== ROW 3: REVENUE TREND ==================== */}
      <SectionCard title="Revenue Trend" subtitle="Paid appointments per month">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.violet} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.violet} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis
              allowDecimals={false}
              tickFormatter={(v) => `₹${v}`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.violet}
              strokeWidth={3}
              fill="url(#grad-rev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* ==================== ROW 4: USERS + DOCTORS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Users by Gender"
          subtitle={`${totalUsers} total users`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Doctors by Department"
          subtitle={`${totalDoctors} total doctors`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={doctorsByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10 }}
              />
              <Tooltip />
              <Bar dataKey="Doctors" radius={[0, 6, 6, 0]}>
                {doctorsByDept.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ==================== ROW 5: TOP DEPARTMENTS + DOCTORS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Top Departments" subtitle="By appointment count">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 10 }}
              />
              <Tooltip />
              <Bar dataKey="Appointments" radius={[0, 6, 6, 0]}>
                {departmentData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top Doctors" subtitle="By appointment count">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topDoctors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 10 }}
              />
              <Tooltip />
              <Bar dataKey="Appointments" radius={[0, 6, 6, 0]}>
                {topDoctors.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ==================== ROW 6: REVIEWS + CAREERS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="Reviews Distribution"
          subtitle={`Average Rating: ${avgRating} ⭐ (${totalReviews} reviews)`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reviewsByRating}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="star" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="Reviews" fill={COLORS.amber} radius={[6, 6, 0, 0]}>
                {reviewsByRating.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981"][
                        i % 5
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Job Applications"
          subtitle={`${totalCareers} total applications`}
        >
          {careersByStatus.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
              No career applications yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={careersByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {careersByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      {/* ==================== ROW 7: PEAK HOURS ==================== */}
      <SectionCard
        title="Peak Appointment Hours"
        subtitle="Appointment distribution by hour"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={peakHours}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar
              dataKey="Appointments"
              fill={COLORS.cyan}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}

/* ==================== SUB-COMPONENTS ==================== */

const KpiCard = ({ label, value, color = "blue", icon, trend }) => {
  const colorMap = {
    blue: {
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/30",
      glow: "from-blue-500/10",
      text: "text-blue-600",
      ring: "hover:border-blue-200",
    },
    indigo: {
      iconBg: "bg-gradient-to-br from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-500/30",
      glow: "from-indigo-500/10",
      text: "text-indigo-600",
      ring: "hover:border-indigo-200",
    },
    emerald: {
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
      glow: "from-emerald-500/10",
      text: "text-emerald-600",
      ring: "hover:border-emerald-200",
    },
    amber: {
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/30",
      glow: "from-amber-500/10",
      text: "text-amber-600",
      ring: "hover:border-amber-200",
    },
    violet: {
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/30",
      glow: "from-violet-500/10",
      text: "text-violet-600",
      ring: "hover:border-violet-200",
    },
    rose: {
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/30",
      glow: "from-rose-500/10",
      text: "text-rose-600",
      ring: "hover:border-rose-200",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${c.ring}`}
    >
      {/* Subtle gradient glow on hover */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${c.iconBg} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-tight">
            {label}
          </p>

          <p className="text-3xl font-black text-gray-900 mt-2 leading-none tracking-tight">
            {value}
          </p>

          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                  trend >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {trend >= 0 ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                {Math.abs(trend)}%
              </span>
              <span className="text-[10px] text-gray-400">vs last period</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={`shrink-0 w-11 h-11 rounded-xl ${c.iconBg} ${c.shadow} shadow-lg flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <div className="mb-4">
      <h3 className="font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const RevenueCard = ({ label, value, subtitle, color }) => (
  <div className={`rounded-xl p-5 bg-gradient-to-r ${color} text-white shadow`}>
    <p className="text-sm opacity-90">{label}</p>
    <p className="text-3xl font-black mt-1">{value}</p>
    {subtitle && <p className="text-xs opacity-80 mt-1.5">{subtitle}</p>}
  </div>
);
