import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
} from "lucide-react";

// ── Tooth SVG ──────────────────────────────────────────────────────────────
const ToothSVG = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z" />
  </svg>
);

// ── WhatsApp Icon ──────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Facebook Icon ──────────────────────────────────────────────────────────
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Home",           to: "/" },
  { label: "Services",       to: "/services" },
  { label: "About Doctor",   to: "/about" },
  { label: "Locations",      to: "/locations" },
  { label: "Contact",        to: "/contact" },
  { label: "Book Appointment", to: "/appointment" },
];

const SERVICES = [
  "Laser Teeth Whitening",
  "Dental Implants",
  "Root Canal Treatment",
  "Braces & Aligners",
  "Scaling & Polishing",
  "Smile Makeover",
];

const BRANCHES = [
  {
    label: "Branch 1",
    area: "Location TBD, Dhaka",
    hours: "Sat–Thu: 10AM–2PM & 5PM–9PM",
    color: "#0ea5e9",
  },
  {
    label: "Branch 2",
    area: "Location TBD, Dhaka",
    hours: "Sat–Thu: 3PM–9PM",
    color: "#8b5cf6",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(160deg, #060f22 0%, #0c2340 60%, #0f2d52 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .footer-link {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #38bdf8; }
        .footer-link svg { opacity: 0; transition: opacity 0.2s, transform 0.2s; transform: translateX(-4px); }
        .footer-link:hover svg { opacity: 1; transform: translateX(0); }

        .social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .social-btn:hover {
          border-color: rgba(56,189,248,0.5);
          background: rgba(56,189,248,0.1);
          color: #38bdf8;
          transform: translateY(-2px);
        }
        .social-btn.whatsapp:hover {
          border-color: rgba(34,197,94,0.5);
          background: rgba(34,197,94,0.1);
          color: #4ade80;
        }
        .footer-divider { border-color: rgba(255,255,255,0.06); }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-brand {
          background: linear-gradient(90deg, #38bdf8 0%, #818cf8 45%, #38bdf8 90%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* ── Top CTA strip ─────────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}
            >
              <ToothSVG size={20} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                Ready for your next appointment?
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                Walk-ins welcome · Same-day slots available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all active:scale-95 group"
              style={{
                background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                boxShadow: "0 4px 16px rgba(14,165,233,0.4)",
                textDecoration: "none",
              }}
            >
              Book Now
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://wa.me/8801745565435"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#4ade80",
                textDecoration: "none",
              }}
            >
              <WhatsAppIcon size={15} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main footer body ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand ────────────────────────────────────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-5">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}
              >
                <ToothSVG size={22} />
              </div>
              <div>
                <p className="shimmer-brand text-lg font-bold leading-tight">
                  Laser Dental
                </p>
                <p className="shimmer-brand text-lg font-bold leading-tight">
                  Point
                </p>
              </div>
            </div>

            <p className="text-white/45 text-sm leading-relaxed">
              Advanced laser-assisted dental care across two Dhaka locations — delivered by one dedicated doctor with 15+ years of expertise.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2.5">
              <a
                href="tel:01745565435"
                className="flex items-center gap-2.5 text-white/50 hover:text-sky-400 transition-colors text-sm"
                style={{ textDecoration: "none" }}
              >
                <Phone size={14} className="text-sky-500 flex-shrink-0" />
                01745565435
              </a>
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-white/50 hover:text-emerald-400 transition-colors text-sm"
                style={{ textDecoration: "none" }}
              >
                <WhatsAppIcon size={14} />
                WhatsApp Us
              </a>
              <span className="flex items-center gap-2.5 text-white/50 text-sm">
                <MapPin size={14} className="text-sky-500 flex-shrink-0" />
                Dhaka, Bangladesh · 2 Branches
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="social-btn whatsapp"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </a>
              <a
                href="tel:01745565435"
                className="social-btn"
                aria-label="Call"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick links ──────────────────────────────────────────── */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <div className="w-4 h-0.5 rounded-full bg-sky-500" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="footer-link">
                    <ArrowRight size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services ─────────────────────────────────────────────── */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <div className="w-4 h-0.5 rounded-full bg-purple-500" />
              Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link to="/services" className="footer-link">
                    <ArrowRight size={12} />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Branches + Hours ─────────────────────────────────────── */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <div className="w-4 h-0.5 rounded-full bg-emerald-500" />
              Our Locations
            </h4>

            <div className="flex flex-col gap-5">
              {BRANCHES.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ background: b.color + "20", color: b.color }}
                    >
                      {b.label}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs flex items-start gap-2 mb-1.5">
                    <MapPin size={12} className="flex-shrink-0 mt-0.5" style={{ color: b.color }} />
                    {b.area}
                  </p>
                  <p className="text-white/40 text-xs flex items-start gap-2">
                    <Clock size={12} className="flex-shrink-0 mt-0.5" style={{ color: b.color }} />
                    {b.hours}
                  </p>
                </div>
              ))}

              {/* Friday closed note */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400 font-medium">Friday: All branches closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div
        className="border-t footer-divider"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-white/30 text-xs flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            © {year} Laser Dental Point. All rights reserved.
          </p>

          <p className="text-white/20 text-xs flex items-center gap-1.5">
            Made with
            <Heart size={11} className="text-red-400 fill-red-400" />
            for healthier smiles in Dhaka
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="text-white/30 text-xs hover:text-white/60 transition-colors"
              style={{ textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
            <div className="w-px h-3 bg-white/10" />
            <Link
              to="/contact"
              className="text-white/30 text-xs hover:text-white/60 transition-colors"
              style={{ textDecoration: "none" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
