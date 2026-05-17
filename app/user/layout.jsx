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
    <div className="flex">
      <UserSidebar />
      <div className="md:ml-64 ml-0 w-full bg-slate-200 min-h-screen">
        <UserHeader />
        {children}
      </div>
    </div>
  );
}
