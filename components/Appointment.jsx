import React from "react";

const Appointment = () => {
  return (
    <section
      id="appointment"
      className="py-20 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-5">
            <span className="inline-block mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
              Priority Access
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Book a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-[#00d0ff] bg-clip-text text-transparent">
                Specialist
              </span>{" "}
              Consultation
            </h2>

            <p className="text-gray-500 mb-8">
              Book instant slots with India's top consultants. Experience 24/7
              support and zero waiting time.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div>
                <h6 className="font-bold">Verified Doctors Only</h6>
                <p className="text-sm text-gray-500">
                  Direct contact with senior board-certified consultants.
                </p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white p-8 md:p-10 shadow-xl border border-blue-100">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Your Name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">
                    Department
                  </label>
                  <select
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="" disabled>
                      Choose Dept...
                    </option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>General Surgery</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Slots */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-4">
                    Available Slots
                  </label>

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {["10:00 AM", "12:30 PM", "04:00 PM", "06:30 PM"].map(
                      (slot, index) => (
                        <label key={slot} className="cursor-pointer">
                          <input
                            type="radio"
                            name="time"
                            defaultChecked={index === 0}
                            className="peer hidden"
                          />
                          <div className="rounded-xl border font-semibold border-zinc-300 px-4 py-2 text-center peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600">
                            {slot}
                          </div>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-800 py-4 text-lg font-bold text-white shadow hover:shadow-xl hover:-translate-y-0.5 transition"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Appointment;
