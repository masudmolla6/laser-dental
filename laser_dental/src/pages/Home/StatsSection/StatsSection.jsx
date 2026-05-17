import React from "react";
import {
  FaUserFriends,
  FaSmileBeam,
  FaClock,
  FaAward,
} from "react-icons/fa";

const statsData = [
  {
    id: 1,
    number: "500+",
    title: "Happy Patients",
    icon: <FaSmileBeam />,
  },
  {
    id: 2,
    number: "5+",
    title: "Years Experience",
    icon: <FaAward />,
  },
  {
    id: 3,
    number: "24/7",
    title: "Emergency Support",
    icon: <FaClock />,
  },
  {
    id: 4,
    number: "100%",
    title: "Patient Satisfaction",
    icon: <FaUserFriends />,
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-sky-500 to-cyan-500">
      <div className="max-w-6xl mx-auto px-4">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trusted Dental Care Experience
          </h2>

          <p className="text-sky-100 mt-3 max-w-2xl mx-auto">
            Providing quality dental treatment with care, professionalism,
            and modern technology.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center hover:-translate-y-2 transition duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white text-3xl mb-5">
                {stat.icon}
              </div>

              {/* Number */}
              <h3 className="text-4xl font-bold text-white">
                {stat.number}
              </h3>

              {/* Title */}
              <p className="text-sky-100 mt-2 text-lg">
                {stat.title}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default StatsSection;