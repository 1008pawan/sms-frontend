"use client";
import React, { useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import Carrer from "./Carrer";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-zinc-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-black"
          >
            <div>
              <img
                src="/images/logo/logo.jpeg"
                className="rounded-full h-13 w-13"
                alt=""
              />
            </div>
            SMS Hospital
          </a>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-2xl text-gray-700 cursor-pointer"
          >
            ☰
          </button>

          {/* Menu */}
          <div
            className={`${
              open ? "flex" : "hidden"
            } lg:flex absolute lg:static top-full left-0 w-full lg:w-auto
            justify-center md:border-none border-b border-zinc-300 md:bg-transparent bg-white/90`}
          >
            <ul className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 p-6 lg:p-0">
              <li>
                <a
                  href="/"
                  className=" relative pb-1 font-semibold text-gray-700 hover:text-blue-600 transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-500 after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 "
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/departments"
                  className=" relative pb-1 font-semibold text-gray-700 hover:text-blue-600 transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-500 after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 "
                >
                  Departments
                </a>
              </li>

              <li>
                <button
                  onClick={() => setModal(true)}
                  className=" relative pb-1 font-semibold text-gray-700 hover:text-blue-600 transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-500 after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 cursor-pointer "
                >
                  Career
                </button>
              </li>

              <li>
                <a
                  href="/login"
                  className="bg-[#05162e] cursor-pointer text-white font-semibold rounded-full px-8 py-4 transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  Book Appointment
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* modal */}
      {modal && <Carrer setModal={setModal} />}
    </>
  );
};

export default Header;
