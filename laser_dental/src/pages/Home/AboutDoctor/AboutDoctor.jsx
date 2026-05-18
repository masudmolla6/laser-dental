import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ── Icons ──────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const GraduationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const AwardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const LaserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" /><line x1="4.22" y1="4.22" x2="7.05" y2="7.05" />
    <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" /><line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
);

// ── Animated counter ────────────────────────────────────────────────────────
const Counter = ({ target, suffix = "", duration = 1600 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Data ────────────────────────────────────────────────────────────────────
const DOCTOR = {
  name: "Dr. [Doctor Name]",
  title: "Chief Dental Surgeon",
  degrees: [
    "BDS (Dhaka Dental College)",
    "FCPS (Oral & Maxillofacial Surgery)",
    "Laser Dentistry Certified — AALZ Germany",
  ],
  specializations: [
    { icon: <LaserIcon />, label: "Laser Dentistry", color: "#0ea5e9" },
    { icon: <HeartIcon />, label: "Cosmetic Dentistry", color: "#ec4899" },
    { icon: <AwardIcon />, label: "Dental Implants", color: "#8b5cf6" },
    { icon: <GraduationIcon />, label: "Orthodontics", color: "#10b981" },
  ],
  bio: "With over 15 years of experience, Dr. [Name] has transformed thousands of smiles across Dhaka. Trained in laser dentistry from Germany and holding an FCPS in oral surgery, the doctor combines cutting-edge technology with a deeply compassionate approach — ensuring every patient feels comfortable, heard, and cared for from the first consultation to the final result.",
  quote: "Every smile I restore reminds me why I chose this profession. Your comfort and confidence are my priority — always.",
  achievements: [
    "1,200+ successful treatments",
    "Laser dentistry pioneer in Dhaka",
    "AALZ Germany certified",
    "Featured in national health journals",
    "15+ years of expertise",
    "Dual-location practice",
  ],
};

const LOCATIONS = [
  {
    id: 1,
    branch: "Branch 1",
    area: "Location TBD, Dhaka",
    address: "Full address here, Dhaka — 1XXX",
    phone: "01745565435",
    schedule: [
      { days: "Sat – Thu (Morning)", time: "10:00 AM – 2:00 PM" },
      { days: "Sat – Thu (Evening)", time: "5:00 PM – 9:00 PM" },
      { days: "Friday", time: "Closed" },
    ],
    mapLink: "https://maps.google.com",
    color: "#0ea5e9",
  },
  {
    id: 2,
    branch: "Branch 2",
    area: "Location TBD, Dhaka",
    address: "Full address here, Dhaka — 1XXX",
    phone: "01745565435",
    schedule: [
      { days: "Sat – Thu", time: "3:00 PM – 9:00 PM" },
      { days: "Friday", time: "Closed" },
    ],
    mapLink: "https://maps.google.com",
    color: "#8b5cf6",
  },
];

// ── Main Component ──────────────────────────────────────────────────────────
const AboutDoctor = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float { animation: float 5s ease-in-out infinite; }
        .card-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-lift:hover { transform: translateY(-5px); box-shadow: 0 20px 50px -10px rgba(0,0,0,0.12); }
        .shimmer {
          background: linear-gradient(90deg, #0284c7 0%, #6366f1 50%, #0284c7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .loc-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .loc-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px -12px rgba(0,0,0,0.12); }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-24 pb-24 px-5 md:px-10"
        style={{ background: "linear-gradient(160deg, #09142d 0%, #0c2340 60%, #0f2d52 100%)" }}
      >
        {/* Background decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
          <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Doctor visual */}
            <div className="flex justify-center" style={fadeUp(0)}>
              <div className="relative">
                {/* Main card */}
                <div className="w-72 md:w-80 rounded-3xl overflow-hidden relative"
                  style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
                  {/* Photo area */}
                  <div className="w-full h-[420px] flex flex-col items-center justify-center gap-4"
                    style={{ background: "linear-gradient(160deg, #1a3a6e 0%, #0c2340 100%)" }}>
                    <div
                      className="w-36 h-36 rounded-full flex items-center justify-center text-5xl font-bold text-white float font-display"
                      style={{
                        background: "linear-gradient(135deg, #0284c7, #6366f1)",
                        boxShadow: "0 0 0 8px rgba(14,165,233,0.15), 0 0 0 18px rgba(14,165,233,0.06)",
                      }}
                    >
                      Dr
                    </div>
                    <p className="text-white/30 text-xs">Replace with doctor photo</p>
                  </div>
                  {/* Name overlay */}
                  <div className="absolute bottom-0 inset-x-0 px-6 py-5"
                    style={{ background: "linear-gradient(to top, rgba(9,20,45,0.96), transparent)" }}>
                    <p className="text-white font-bold text-lg font-display">{DOCTOR.name}</p>
                    <p className="text-sky-400 text-sm font-medium mt-0.5">{DOCTOR.title}</p>
                  </div>
                  {/* Top badge */}
                  <div className="absolute top-4 right-4 bg-sky-500/20 backdrop-blur-sm border border-sky-400/30 rounded-full px-3 py-1.5">
                    <span className="text-[11px] text-sky-300 font-semibold tracking-wide">✦ Certified Expert</span>
                  </div>
                </div>

                {/* Floating: Experience */}
                <div className="absolute -bottom-5 -left-8 bg-white rounded-2xl px-5 py-4 card-lift"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
                  <p className="text-3xl font-black text-gray-900 font-display">
                    <Counter target={15} suffix="+" />
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-tight">Years of<br />Experience</p>
                </div>

                {/* Floating: Rating */}
                <div className="absolute -top-4 -right-8 bg-white rounded-2xl px-4 py-3.5 card-lift"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="text-sm font-bold text-gray-800">4.9 / 5.0</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Patient Rating</p>
                </div>
              </div>
            </div>

            {/* Doctor text */}
            <div className="flex flex-col gap-6 text-white" style={fadeUp(150)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-sky-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Meet Your Doctor</span>
              </div>

              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-2">
                  {DOCTOR.name}
                </h1>
                <p className="text-sky-300 text-lg font-medium">{DOCTOR.title}</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {DOCTOR.degrees.map((deg, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-sky-400">
                      <CheckIcon />
                    </div>
                    <span className="text-sm text-white/80 leading-relaxed">{deg}</span>
                  </div>
                ))}
              </div>

              <p className="text-white/55 text-sm leading-relaxed border-l-2 border-sky-500/40 pl-4">
                {DOCTOR.bio}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/appointment"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all active:scale-95 group"
                  style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)", boxShadow: "0 6px 24px rgba(14,165,233,0.45)" }}>
                  Book a Consultation
                  <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
                </Link>
                <a href="https://wa.me/8801745565435" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm border border-white/20 text-white/80 hover:bg-white/10 transition-all active:scale-95">
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ──────────────────────────────────────────────── */}
      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Expertise</span>
              <div className="w-8 h-px bg-sky-500" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Areas of <span className="shimmer">Specialization</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {DOCTOR.specializations.map((spec) => (
              <div key={spec.label}
                className="rounded-2xl p-7 flex flex-col items-center text-center gap-3 card-lift"
                style={{
                  background: spec.color + "0d",
                  border: `1.5px solid ${spec.color}22`,
                }}>
                <div className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: spec.color + "18", color: spec.color }}>
                  {spec.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{spec.label}</p>
              </div>
            ))}
          </div>

          {/* Achievements grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
            {DOCTOR.achievements.map((ach, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 text-sky-600">
                  <CheckIcon />
                </div>
                <span className="text-sm text-gray-700 font-medium">{ach}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS + QUOTE ────────────────────────────────────────────────── */}
      <section className="py-20 px-5 md:px-10 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { target: 1200, suffix: "+", label: "Patients Treated", sub: "Across Dhaka" },
                { target: 15, suffix: "+", label: "Years Experience", sub: "Since 2010" },
                { target: 98, suffix: "%", label: "Success Rate", sub: "Clinically verified" },
                { target: 2, suffix: "", label: "Locations", sub: "Both in Dhaka" },
              ].map(({ target, suffix, label, sub }) => (
                <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 card-lift"
                  style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                  <p className="font-display text-4xl font-black text-gray-900" style={{ letterSpacing: "-0.03em" }}>
                    <Counter target={target} suffix={suffix} />
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-2">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Quote + story */}
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Our Story</span>
                <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">Why Laser Dental Point?</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                The clinic was built around one doctor's vision — that dental care shouldn't be feared. Every detail, from the calm interiors to the laser-assisted painless procedures, was designed to make patients feel at ease.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Believing that a healthy smile is a gateway to confidence, the clinic now operates across two Dhaka locations — served by one dedicated doctor who ensures consistent, personal care at every visit.
              </p>
              {/* Quote */}
              <div className="rounded-2xl p-5 border-l-4"
                style={{ background: "linear-gradient(135deg, #e0f2fe, #ede9fe)", borderLeftColor: "#0284c7" }}>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{DOCTOR.quote}"</p>
                <p className="text-xs text-sky-600 font-bold mt-3">— {DOCTOR.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO LOCATIONS ────────────────────────────────────────────────── */}
      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Find Us</span>
              <div className="w-8 h-px bg-sky-500" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="shimmer">Two Locations</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto">
              One doctor, two clinics — both in Dhaka, both delivering the same premium care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LOCATIONS.map((loc) => (
              <div key={loc.id} className="loc-card rounded-3xl overflow-hidden border border-gray-100 bg-white"
                style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.06)" }}>

                {/* Header */}
                <div className="px-7 py-6 flex items-center justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${loc.color}12, ${loc.color}06)`,
                    borderBottom: `1px solid ${loc.color}18`,
                  }}>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                      style={{ background: loc.color + "18", color: loc.color }}>
                      {loc.branch}
                    </span>
                    <h3 className="font-display text-xl font-bold text-gray-900 mt-2">Laser Dental Point</h3>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: loc.color }}>{loc.area}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: loc.color + "15", color: loc.color }}>
                    <LocationIcon />
                  </div>
                </div>

                {/* Body */}
                <div className="px-7 py-6 flex flex-col gap-5">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: loc.color + "12", color: loc.color }}>
                      <LocationIcon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Address</p>
                      <p className="text-sm text-gray-700 font-medium">{loc.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: loc.color + "12", color: loc.color }}>
                      <PhoneIcon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Phone</p>
                      <a href={`tel:${loc.phone}`} className="text-sm font-semibold hover:underline"
                        style={{ color: loc.color }}>{loc.phone}</a>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: loc.color + "12", color: loc.color }}>
                      <ClockIcon />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-medium mb-2">Schedule</p>
                      <div className="flex flex-col gap-1.5">
                        {loc.schedule.map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{s.days}</span>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                              style={{
                                background: s.time === "Closed" ? "#fee2e2" : loc.color + "15",
                                color: s.time === "Closed" ? "#dc2626" : loc.color,
                              }}>
                              {s.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 pt-2 border-t border-gray-100">
                    <a href={loc.mapLink} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 text-white"
                      style={{ background: loc.color, boxShadow: `0 4px 14px ${loc.color}40` }}>
                      <LocationIcon />
                      Get Directions
                    </a>
                    <a href={`https://wa.me/880${loc.phone.replace(/^0/, "")}`} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100">
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 px-5 md:px-10 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl px-8 py-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #09142d 0%, #0c2340 100%)" }}>
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400 mb-3">
                Ready to get started?
              </p>
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                Your perfect smile is one appointment away.
              </h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                Book a consultation with {DOCTOR.name} at either of our Dhaka locations — we'll take care of the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/appointment"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 group"
                  style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)", boxShadow: "0 6px 24px rgba(14,165,233,0.45)" }}>
                  Book Appointment
                  <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
                </Link>
                <a href="tel:01745565435"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm border border-white/20 text-white/80 hover:bg-white/10 transition-all active:scale-95">
                  <PhoneIcon />
                  01745565435
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutDoctor;
