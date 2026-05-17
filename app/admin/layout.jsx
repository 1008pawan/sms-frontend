"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function MainLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/");
      return;
    }

    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="md:ml-64 ml-0 w-full bg-slate-200 min-h-screen">
        <AdminHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
