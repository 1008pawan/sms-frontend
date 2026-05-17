"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { HiBriefcase, HiStar, HiUserGroup } from "react-icons/hi";
import toast from "react-hot-toast";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Users",
    href: "/admin/usersList",
    icon: <FaUsers />,
  },
  {
    name: "Appointments",
    href: "/admin/appointmentList",
    icon: <FaCalendarCheck />,
  },
  {
    name: "Carrer",
    href: "/admin/carrer",
    icon: <HiBriefcase />,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: <HiStar />,
  },
  {
    name: "Doctors",
    href: "/admin/doctors",
    icon: <HiUserGroup />,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Admin logout Successful!");
    router.replace("/");
  };

  return (
    <aside className="md:block hidden fixed left-0 top-0 h-screen w-64 bg-white shadow z-50">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6">
        <FaUserShield className="text-blue-600 text-xl" />
        <span className="text-lg font-bold">Admin Panel</span>
      </div>

      {/* Menu */}
      <nav className="p-2 space-y-2 text-sm">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-semibold transition ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-zinc-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 mt-2 text-red-600 bg-red-50 rounded-md font-semibold hover:bg-red-100"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
