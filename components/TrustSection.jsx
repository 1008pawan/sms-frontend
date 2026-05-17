import React from "react";

const TrustSection = () => {
  return (
    <div className="w-full flex justify-center items-center px-10 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-0">
        <div className="lg:col-span-3">
          <h1 className="text-zinc-700 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Trust Your Health to Us
          </h1>
          <p className="text-zinc-600 text-lg lg:text-xl py-4 lg:py-5">
            Ready to take the next step toward better health? We're here to
            help. Schedule with us today and experience personalized healthcare
            tailored to your unique needs. Our dedicated team is committed to
            providing you with top-notch care in a comfortable and convenient
            setting. Your well-being is our priority, and we look forward to
            serving you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-0">
            <button className="bg-blue-500 text-white rounded-xl hover:bg-white hover:text-blue-500 hover:border-blue-500 border-1 p-2 w-full sm:w-auto">
              <a href="/appointment">Our Values</a>
            </button>
            <button className="bg-zinc-700 text-white rounded-xl hover:bg-white hover:text-zinc-700 hover:border-zinc-500 border-1 p-2 lg:ml-4 w-full sm:w-auto">
              <a href="/our-services">Join the Team</a>
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 flex justify-center lg:justify-end">
          <img
            className="w-full max-w-md lg:w-200 rounded-xl object-cover"
            src="https://images.pexels.com/photos/6129681/pexels-photo-6129681.jpeg?cs=srgb&dl=pexels-rdne-6129681.jpg&fm=jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
