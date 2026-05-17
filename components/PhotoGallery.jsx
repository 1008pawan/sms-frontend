"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaImages, FaCalendarAlt } from "react-icons/fa";

const galleryData = [
  {
    id: "26-jan-2026",
    title: "Republic Day Celebration",
    date: "26 Jan 2026",
    category: "events",
    cover: "images/img/26jan/img1.jpeg",
    photos: [
      "images/img/26jan/img1.jpeg",
      "images/img/26jan/img2.jpeg",
      "images/img/26jan/img3.jpeg",
      "images/img/26jan/img4.jpeg",
    ],
  },
  {
    id: "doctors",
    title: "Doctors",
    date: "15 Jan 2025",
    category: "doctors",
    cover: "images/doctors/DR. RAM MILAN.jpeg",
    photos: [
      "images/doctors/Dr. Somit Kumar Sinha.jpeg",
      "images/doctors/DR. RAM MILAN.jpeg",
      "images/doctors/Dr. Vishal Singh.jpeg",
      "images/doctors/Dr. Akhilesh Jaiswal.jpeg",
      "images/doctors/Dr. P.K Satyarthi.jpeg",
    ],
  },
  // {
  //   id: "annual-summit",
  //   title: "Annual Medical Summit",
  //   date: "15 Dec 2025",
  //   category: "events",
  //   cover: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600",
  //   photos: [
  //     "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600",
  //   ],
  // },
  {
    id: "campus-tour",
    title: "Modern OPD Wing",
    date: "Hospital Campus",
    category: "campus",
    cover: "images/img/hospital/WhatsApp Image 2026-01-28 at 5.36.49 PM (1).jpeg",
    photos: [
      "images/img/hospital/WhatsApp Image 2026-01-28 at 5.36.50 PM.jpeg",
      "images/img/hospital/WhatsApp Image 2026-01-28 at 5.36.49 PM (1).jpeg",
      "images/img/hospital/WhatsApp Image 2026-01-28 at 5.36.49 PM.jpeg",
      "images/img/hospital/WhatsApp Image 2026-01-28 at 6.10.03 PM (1).jpeg",
      "images/img/hospital/WhatsApp Image 2026-01-28 at 6.10.03 PM.jpeg",
    ],
  },
];

const PhotoGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredFolders =
    activeFilter === "all"
      ? galleryData
      : galleryData.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <span className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
                Life at SMS Hospital
              </span>
              <h2 className="font-black text-5xl mt-2 text-slate-900">
                Our Gallery
              </h2>

              <div className="flex justify-center md:gap-3 gap-2 mt-8 flex-nowrap">
                {["all", "campus", "events", "doctors"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`md:px-6 px-3 md:py-2 py-1.5 cursor-pointer rounded-full font-semibold text-sm transition-all shadow-sm ${
                      activeFilter === filter
                        ? "bg-blue-600 text-white shadow-blue-200 scale-105"
                        : "bg-white text-slate-500 hover:bg-blue-50"
                    }`}
                  >
                    {filter === "all" ? "All Moments" : filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back-nav"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12 flex items-center justify-between gap-4"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all cursor-pointer group"
              >
                <FaArrowLeft /> Back to Gallery
              </button>
              <div className="text-right">
                <h2 className="md:text-3xl font-black text-slate-900">
                  {selectedEvent.title}
                </h2>
                <p className="text-slate-500 flex items-center justify-end gap-2 mt-1">
                  <FaCalendarAlt className="text-blue-400" />{" "}
                  {selectedEvent.date}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {!selectedEvent
              ? filteredFolders.map((event) => (
                  <motion.div
                    key={event.id}
                    layoutId={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="group cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="relative h-80 rounded-4xl overflow-hidden shadow-lg border-4 border-white group-hover:shadow-2xl transition-all">
                      <img
                        src={event.cover}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                        <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-[10px] text-white font-bold uppercase mb-3 flex items-center gap-2">
                          <FaImages /> {event.photos.length} Photos
                        </div>
                        <h6 className="text-white text-xl font-bold">
                          {event.title}
                        </h6>
                        <small className="text-white/60 font-medium">
                          {event.date}
                        </small>
                      </div>
                    </div>
                  </motion.div>
                ))
              : selectedEvent.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative h-72 rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    <img
                      src={photo}
                      alt="Gallery item"
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                      onClick={() => window.open(photo, "_blank")}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>

        {!selectedEvent && filteredFolders.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No events found in this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;
