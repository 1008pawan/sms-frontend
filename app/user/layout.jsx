"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

export default function MainLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null;
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <UserSidebar />
      <div className="flex-1 md:ml-64 min-h-screen bg-slate-200 overflow-x-hidden">
        <UserHeader />
        <div className="pt-14">{children}</div>
      </div>
    </div>
  );
}
