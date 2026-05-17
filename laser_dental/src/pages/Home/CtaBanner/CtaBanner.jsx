import React from "react";

const CtaBanner = () => {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready for a Healthier Smile?
        </h2>

        {/* Subtitle */}
        <p className="text-blue-100 mt-3">
          Book your dental appointment today and take care of your smile with expert care.
        </p>

        {/* Button */}
        <button className="mt-6 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
          Book Appointment
        </button>

      </div>
    </section>
  );
};

export default CtaBanner;