import React from "react";

const Contact = () => {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* CONTACT INFO */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Get in touch with LASER DENTAL Clinic. We are here to answer your
            questions and schedule appointments.
          </p>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Banani & Uttara, Dhaka, Bangladesh
            </p>
          </div>

          {/* Phone */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              +880 1234 567890
            </p>
          </div>

          {/* Email */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              info@laserdental.com
            </p>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Working Hours</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Mon – Sat: 9:00 AM – 7:00 PM <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div>
          <form className="p-6 rounded-xl shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>

      {/* GOOGLE MAP */}
      <div className="mt-12 w-full h-64 rounded-xl overflow-hidden shadow-md">
        <iframe
          title="Clinic Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.123456789!2d90.3950!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8a7!2sDhaka!5e0!3m2!1sen!2sbd!4v1688822330000!5m2!1sen!2sbd"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </section>
  );
};

export default Contact;