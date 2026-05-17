import React from "react";
import {
  BsHeartPulseFill,
  BsFacebook,
  BsInstagram,
  BsYoutube,
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
} from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h4 className="flex items-center gap-2 text-xl font-bold mb-4">
              <div>
                <img
                  src="/images/logo/logo.jpeg"
                  className="rounded-full h-13 w-13"
                  alt=""
                />
              </div>
              SMS HOSPITAL
            </h4>

            <p className="text-gray-400 leading-relaxed">
              SMS Hospital, Gorakhpur – Gorakhpur’s most trusted and largest
              government hospital, dedicated to serving the public for years.
            </p>

            <div className="flex gap-3 mt-6">
              {[BsFacebook, FaXTwitter, BsInstagram, BsYoutube].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition"
                  >
                    <Icon />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h6 className="text-sm font-bold uppercase mb-4">Services</h6>
            <ul className="space-y-2">
              {["Cardiology", "Neurology", "Surgical Wing", "OPD Timings"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="/departments"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h6 className="text-sm font-bold uppercase mb-4">Support</h6>
            <ul className="space-y-2">
              {[
                "Help Desk",
                "Blood Bank",
                "Emergency 24/7",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h6 className="text-sm font-bold uppercase mb-4">Contact Info</h6>

            <div className="flex items-start gap-3 mb-4">
              <BsGeoAlt className="text-blue-500 text-lg mt-1" />
              <p className="text-gray-400">
                Plot No. 474 Gayatripuram, Near HDFC Bank, Nakaha No.1,
                Gorakhpur-273004
              </p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <BsTelephone className="text-blue-500 text-lg" />

              <a
                href="tel:+916307730544"
                className="text-gray-400 hover:text-blue-500 transition"
              >
                +91 630 773 0544
              </a>

              <span className="text-gray-500">,</span>

              <a
                href="tel:+916386720220"
                className="text-gray-400 hover:text-blue-500 transition"
              >
                638 672 0220
              </a>
            </div>

            <div className="flex items-center gap-3">
              <BsEnvelope className="text-blue-500 text-lg" />
              <p className="text-gray-400">info@smshospital.com</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-700" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            Copyright © 2026 | Developed & Designed by{" "}
            <span className="font-semibold"> A3P Creation </span> (Alok Kumar &
            Pawan Sharma).
          </p>
          <small className="text-gray-400">
            Super Medical Speciality Hospital. Pvt Ltd
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
