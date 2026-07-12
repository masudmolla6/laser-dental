import { Link } from "react-router-dom";
import {
  MapPin, Phone, Clock, MessageCircle,
  ArrowRight, Heart, Shield, Star,
} from "lucide-react";

// ── Social icons (lucide-react has no brand icons) ───────────────────────────
const FbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);
import useBranches from "../../hooks/useBranches";
import useServices from "../../hooks/useServices";

// ── Tooth SVG ────────────────────────────────────────────────────────────────
const ToothIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z" />
  </svg>
);

// ── Quick links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Meet the Doctors" },
  { to: "/gallery", label: "Gallery" },
  { to: "/appointment", label: "Book Appointment" },
  { to: "/contact", label: "Contact" },
];

const SERVICE_LINKS = [
  "Laser Teeth Whitening",
  "Dental Implants",
  "Braces & Aligners",
  "Smile Makeover",
  "Root Canal Treatment",
  "Scaling & Polishing",
];

// ── Branch card ───────────────────────────────────────────────────────────────
const BranchCard = ({ branch }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3"
    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
  >
    <div className="flex items-center justify-between">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
        style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}
      >
        {branch.name}
      </span>
      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        Open
      </span>
    </div>

    {branch.address && (
      <div className="flex items-start gap-2.5 text-white/55 text-xs leading-relaxed">
        <MapPin size={13} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <span>{branch.address}</span>
      </div>
    )}

    {branch.phone && (
      <a
        href={`tel:${branch.phone}`}
        className="flex items-center gap-2.5 text-white/55 text-xs hover:text-white transition-colors"
      >
        <Phone size={13} className="text-sky-400 flex-shrink-0" />
        {branch.phone}
      </a>
    )}

    {/* Hours */}
    {branch.hours?.length > 0 && (
      <div className="flex flex-col gap-1.5">
        {branch.hours.map((h, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Clock size={13} className="text-sky-400 flex-shrink-0 mt-0.5" />
            <span className="text-white/50 text-xs leading-snug">
              {h.label}
              {h.morning && `: ${h.morning}`}
              {h.morning && h.evening && " & "}
              {h.evening && (h.morning ? h.evening : `: ${h.evening}`)}
            </span>
          </div>
        ))}
        {branch.closedDays?.length > 0 && (
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            </div>
            <span className="text-red-400/80 text-xs">
              {branch.closedDays.join(", ")}: Closed
            </span>
          </div>
        )}
      </div>
    )}

    {/* Action row */}
    <div className="flex gap-2 mt-1">
      {branch.mapLink && (
        <a
          href={branch.mapLink}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold text-white transition-colors"
          style={{ background: "rgba(14,165,233,0.9)" }}
        >
          <MapPin size={11} /> Directions
        </a>
      )}
      {branch.whatsapp && (
        <a
          href={`https://wa.me/${branch.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
        >
          <MessageCircle size={11} /> WhatsApp
        </a>
      )}
    </div>
  </div>
);

// ── Service skeleton ──────────────────────────────────────────────────────────
const ServiceSkeleton = () => (
  <li className="flex items-center gap-2 animate-pulse">
    <div className="w-3 h-3 rounded-full bg-white/10 flex-shrink-0" />
    <div className="h-3 rounded bg-white/8" style={{ width: `${60 + Math.random() * 30}%` }} />
  </li>
);

// ── Branch skeleton ───────────────────────────────────────────────────────────
const BranchSkeleton = () => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3 animate-pulse"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
  >
    <div className="h-5 w-24 rounded-full bg-white/10" />
    <div className="h-3 w-full rounded bg-white/8" />
    <div className="h-3 w-2/3 rounded bg-white/8" />
    <div className="h-3 w-3/4 rounded bg-white/8" />
    <div className="h-8 w-full rounded-xl bg-white/8 mt-1" />
  </div>
);

// ── Main Footer ───────────────────────────────────────────────────────────────
const Footer = () => {
  const [branches, isLoading, refetch, error]= useBranches();
  const [services]=useServices();

  return (
    <footer style={{ background: "linear-gradient(160deg, #080f1e 0%, #0c1e3a 100%)" }}>
      <style>{`
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .footer-shimmer {
          background: linear-gradient(90deg, #38bdf8 0%, #a78bfa 40%, #f472b6 70%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 5s linear infinite;
        }
        .footer-link {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footer-link:hover { color: rgba(255,255,255,0.9); }
        .social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          transition: background 0.2s, color 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .social-btn:hover {
          background: rgba(56,189,248,0.2);
          border-color: rgba(56,189,248,0.4);
          color: #38bdf8;
          transform: translateY(-2px);
        }
        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* Dot grid texture */}
      <div className="absolute inset-x-0 pointer-events-none dot-grid" style={{ height: "100%", opacity: 0.6 }} />

      {/* ── CTA Banner ── */}
      <div
        className="relative px-6 md:px-12 py-10 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-1.5">
              Ready for a healthier smile?
            </p>
            <h2 className="font-display text-white font-bold text-xl md:text-2xl">
              Book your consultation today —{" "}
              <span className="footer-shimmer">it's painless.</span>
            </h2>
          </div>
          <Link
            to="/appointment"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
            style={{ background: "linear-gradient(135deg,#0284c7,#0ea5e9)", boxShadow: "0 8px 24px rgba(14,165,233,0.4)" }}
          >
            Book Appointment <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="relative px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#0284c7,#0ea5e9)" }}
              >
                <ToothIcon size={20} className="text-white" />
              </div>
              <div>
                <p className="font-display text-white font-bold text-base leading-tight">Laser Dental Point</p>
                <p className="text-white/35 text-[10px] font-medium tracking-wider">Dhaka, Bangladesh</p>
              </div>
            </div>

            <p className="text-white/45 text-sm leading-relaxed">
              World-class dental care with laser precision — in a calm, comfortable environment you'll trust.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2">
              {[
                { icon: Shield, text: "Certified Laser Dentistry" },
                { icon: Star, text: "4.9★ Patient Rating" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/40 text-xs">
                  <Icon size={13} className="text-sky-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2 mt-1">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
                <FbIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
                <IgIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
                <YtIcon />
              </a>
              <a href="https://wa.me/8801745565435" target="_blank" rel="noreferrer" className="social-btn" aria-label="WhatsApp">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick links + Services */}
          <div className="flex flex-col gap-10">
            {/* Quick links */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
                Quick Links
              </p>
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer-link">
                      <ArrowRight size={12} className="text-sky-500 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3 — Services */}
        <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
              Our Services
            </p>
            <ul className="flex flex-col gap-2.5">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <ServiceSkeleton key={i} />)
                : services.map((service) => (
                    <li key={service._id}>
                      <Link to={`/services/${service._id}`} className="footer-link">
                        <ArrowRight size={12} className="text-sky-500 flex-shrink-0" />
                        {service.title}
                      </Link>
                    </li>
                  ))
              }
            </ul>
          </div>

          {/* Col 4 — Branches (dynamic) */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
              Our Locations
            </p>
            <div className="flex flex-col gap-4">
              {isLoading
                ? [0, 1].map((i) => <BranchSkeleton key={i} />)
                : (branches || []).map((b) => <BranchCard key={b._id} branch={b} />)
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="relative px-6 md:px-12 py-5 border-t"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} Laser Dental Point. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={11} className="text-red-400" fill="#f87171" /> in Dhaka, Bangladesh
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;