"use client";
import { Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaHeartbeat } from "react-icons/fa";
import { FiHome, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";

const menuItems = [
  {
    name: "Dashboard",
    href: "/user/dashboard",
    icon: FiHome,
  },
  {
    name: "Book Appointments",
    href: "/user/appointment",
    icon: FiCalendar,
  },
  {
    name: "Profile",
    href: "/user/profile",
    icon: FiUser,
  },
  {
    name: "Review",
    href: "/user/review",
    icon: Star,
  },
];

const UserSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    toast.success("Logout Successful!");
    localStorage.clear();
    router.replace("/");
  };

  return (
    <aside className="md:block hidden fixed top-0 left-0 h-full w-64 bg-white z-40">
      {/* Logo */}
      <div className="p-5 text-xl font-bold">
        <Link
          href="/user/dashboard"
          className="flex items-center gap-2 text-black"
        >
          <FaHeartbeat className="text-blue-600 text-xl" />
          SMS Hospital
        </Link>
      </div>

      {/* Menu */}
      <nav className="px-2 space-y-2 text-sm">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-semibold transition ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-zinc-800"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-3 text-red-600 cursor-pointer rounded-md bg-red-50 font-semibold hover:bg-red-100"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default UserSidebar;
