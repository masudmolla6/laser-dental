import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const FloatingContact = () => {
  return (
    <div className="fixed right-5 bottom-5 flex flex-col gap-3 z-50">

      {/* Appointment */}
      <Link
        to="/appointment"
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        📅
      </Link>

      {/* Call */}
      <a
        href="tel:+8801XXXXXXXXX"
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <FaPhoneAlt />
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/8801XXXXXXXXX"
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <FaWhatsapp />
      </a>

    </div>
  );
};

export default FloatingContact;