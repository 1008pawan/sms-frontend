"use client";
import api from "@/components/Api/PrivateApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

const UserHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/user/dashboard" },
    { name: "Appointments", href: "/user/appointment" },
    { name: "Review", href: "/user/review" },
    { name: "Profile", href: "/user/profile" },
  ];

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/me");
      return res.data.data;
    },
  });

  const handleLogout = () => {
    toast.success("Logout Successful!");
    localStorage.clear();
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {user?.fullName || "User"}
            </h2>
            <p className="text-xs text-gray-500">{user?.phone || ""}</p>
          </div>
        </div>

        {/* Desktop Logout */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center cursor-pointer gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 font-semibold"
        >
          <FiLogOut size={16} />
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="md:hidden bg-white px-4 py-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-md font-semibold text-center ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-zinc-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-md font-semibold hover:bg-red-100"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default UserHeader;
