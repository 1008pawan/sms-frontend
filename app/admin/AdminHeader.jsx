"use client";
import { useRouter, usePathname } from "next/navigation"; // pathname ke liye hook
import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi"; // FiX (close icon) add kiya
import Link from "next/link"; // Link import zaroori hai
import { toast } from "react-hot-toast"; // toast import karein

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Users", href: "/admin/usersList" },
  { name: "Appointments", href: "/admin/appointmentList" },
  { name: "Carrer", href: "/admin/carrer" },
  { name: "Reviews", href: "/admin/reviews" },
  { name: "Doctors", href: "/admin/doctors" },
];

const AdminHeader = () => {
  const router = useRouter();
  const pathname = usePathname(); // pathname yahan se milega
  const [open, setOpen] = useState(false); // Profile dropdown
  const [openOption, setOpenOption] = useState(false); // Mobile menu
  const dropdownRef = useRef(null);

  // LocalStorage safe check
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setAdmin(JSON.parse(user));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Admin logout Successful!");
    router.replace("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button Fixed */}
          <button 
            onClick={() => setOpenOption(!openOption)} 
            className="md:hidden p-2 cursor-pointer rounded hover:bg-gray-100 transition-colors"
          >
            {openOption ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <h1 className="text-lg font-bold text-zinc-800">Admin Dashboard</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                {admin?.fullName?.charAt(0) || "A"}
              </div>
              <span className="hidden md:block text-sm font-semibold text-zinc-700">
                {admin?.fullName || "Admin"}
              </span>
            </button>

            {/* Dropdown Profile */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in duration-150">
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/admin/profile");
                  }}
                  className="flex items-center gap-2 cursor-pointer w-full px-4 py-2.5 text-sm text-zinc-600 hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="text-zinc-400" /> Profile
                </button>

                <div className="border-t border-zinc-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Content Fixed */}
      {openOption && (
        <nav className="md:hidden bg-white border-b border-zinc-200 px-4 py-4 space-y-1 shadow-inner overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenOption(false)}
                className={`flex justify-center items-center px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-zinc-600 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex cursor-pointer justify-center items-center gap-2 px-4 py-3 text-red-600 bg-red-50 rounded-xl font-bold hover:bg-red-100 transition-colors"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default AdminHeader;