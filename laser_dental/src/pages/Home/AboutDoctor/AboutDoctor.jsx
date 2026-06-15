import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Clock, Phone, Star, ArrowRight, CheckCircle2,
  MessageCircle, GraduationCap, Award, Heart, Zap,
  ChevronRight, Users, Calendar, TrendingUp, Building2,
  Stethoscope, Sparkles, Shield, BadgeCheck
} from "lucide-react";
import AboutDoctorSkeleton from "./AboutDoctorSkeleton";

// ── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ target, suffix = "", duration = 1800 }) => {
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
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Data ────────────────────────────────────────────────────────────────────
const DOCTOR = {
  name: "Dr. Fatema Khanam",
  title: "Chief Dental Surgeon & Laser Specialist",
  degrees: [
    "BDS — Dhaka Dental College & Hospital",
    "FCPS (Oral & Maxillofacial Surgery)",
    "Laser Dentistry Certified — AALZ Germany",
  ],
  photo: "https://images.pexels.com/photos/32115957/pexels-photo-32115957.jpeg",
  specializations: [
    { icon: Zap,           label: "Laser Dentistry",    color: "#0ea5e9", bg: "#e0f2fe" },
    { icon: Sparkles,      label: "Cosmetic Dentistry", color: "#ec4899", bg: "#fce7f3" },
    { icon: Shield,        label: "Dental Implants",    color: "#8b5cf6", bg: "#ede9fe" },
    { icon: GraduationCap, label: "Orthodontics",       color: "#10b981", bg: "#d1fae5" },
    { icon: Heart,         label: "Preventive Care",    color: "#f59e0b", bg: "#fef3c7" },
    { icon: Stethoscope,   label: "Oral Surgery",       color: "#ef4444", bg: "#fee2e2" },
  ],
  bio: "With over 15 years of experience, Dr. Fatema has transformed thousands of smiles across Dhaka. Trained in laser dentistry from Germany and holding an FCPS in oral surgery, she combines cutting-edge technology with a deeply compassionate approach — ensuring every patient feels comfortable, heard, and cared for from the first consultation to the final result.",
  quote: "Every smile I restore reminds me why I chose this profession. Your comfort and confidence are my priority — always.",
  achievements: [
    { icon: Users,      text: "1,200+ successful treatments" },
    { icon: Zap,        text: "Laser dentistry pioneer in Dhaka" },
    { icon: BadgeCheck, text: "AALZ Germany certified" },
    { icon: Award,      text: "Featured in national health journals" },
    { icon: Calendar,   text: "15+ years of expertise" },
    { icon: Building2,  text: "Dual-location practice" },
  ],
};

const LOCATIONS = [
  {
    id: 1,
    branch: "Branch 01",
    area: "Mirpur, Dhaka",
    address: "House 12, Road 7, Block C, Mirpur-10, Dhaka — 1216",
    phone: "01745565435",
    schedule: [
      { days: "Sat – Thu (Morning)", time: "10:00 AM – 2:00 PM" },
      { days: "Sat – Thu (Evening)", time: "5:00 PM – 9:00 PM" },
      { days: "Friday",              time: "Closed" },
    ],
    mapLink: "https://maps.google.com",
    color: "#0ea5e9",
  },
  {
    id: 2,
    branch: "Branch 02",
    area: "Uttara, Dhaka",
    address: "House 45, Road 3, Sector 7, Uttara, Dhaka — 1230",
    phone: "01745565435",
    schedule: [
      { days: "Sat – Thu", time: "3:00 PM – 9:00 PM" },
      { days: "Friday",    time: "Closed" },
    ],
    mapLink: "https://maps.google.com",
    color: "#7c3aed",
  },
];

// ── Main Component ──────────────────────────────────────────────────────────
const AboutDoctor = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);


  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  });

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }
        .float { animation: floatY 6s ease-in-out infinite; }

        @keyframes shimmer-text {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer {
          background: linear-gradient(90deg, #0ea5e9 0%, #7c3aed 40%, #ec4899 70%, #0ea5e9 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 5s linear infinite;
        }

        .card-rise {
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
        }
        .card-rise:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px -10px rgba(0,0,0,0.13);
        }

        .spec-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .spec-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12);
        }

        .loc-card {
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
        }
        .loc-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 32px 70px -12px rgba(0,0,0,0.14);
        }

        .btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
          box-shadow: 0 8px 28px rgba(14,165,233,0.5);
        }
        .btn-primary:active { transform: scale(0.97); }

        .btn-ghost {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); transform: translateY(-1px); }
        .btn-ghost:active { transform: scale(0.97); }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        @keyframes shine {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        .photo-shine::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          animation: shine 4s ease-in-out infinite;
        }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(155deg, #080f1e 0%, #0c1e3a 55%, #101d35 100%)",
          paddingTop: "clamp(5rem, 10vw, 7rem)",
          paddingBottom: "clamp(5rem, 10vw, 7rem)",
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none dot-grid" />
        {/* Glow orbs */}
        <div
          className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 70% 30%, rgba(14,165,233,0.09), transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 30% 70%, rgba(124,58,237,0.08), transparent 65%)" }}
        />

        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* ── Doctor Visual ── */}
            <div className="flex justify-center order-1 lg:order-none" style={fadeUp(0)}>
              <div className="relative">

                {/* Outer glow */}
                <div
                  className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(124,58,237,0.1))",
                    transform: "scale(1.05)",
                    filter: "blur(20px)",
                  }}
                />

                {/* Photo Card */}
                <div
                  className="relative w-72 md:w-80 rounded-[2.5rem] overflow-hidden photo-shine"
                  style={{
                    boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
                    background: "linear-gradient(160deg, #1a3a6e 0%, #0c1e3a 100%)",
                  }}
                >
                  <div className="w-full h-[420px]">
                    {DOCTOR.photo ? (
                      <img
                        src={DOCTOR.photo}
                        alt={DOCTOR.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-5"
                        style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #0c1e3a 100%)" }}
                      >
                        <div
                          className="w-32 h-32 rounded-full flex items-center justify-center float"
                          style={{
                            background: "linear-gradient(135deg, #0284c7, #7c3aed)",
                            boxShadow: "0 0 0 10px rgba(14,165,233,0.1), 0 0 0 22px rgba(14,165,233,0.05)",
                          }}
                        >
                          <span className="text-white font-display text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>
                            Dr
                          </span>
                        </div>
                        <p className="text-white/20 text-[11px] font-medium tracking-widest uppercase">
                          Doctor Photo Here
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Name overlay */}
                  <div
                    className="absolute bottom-0 inset-x-0 px-6 py-5"
                    style={{ background: "linear-gradient(to top, rgba(8,15,30,0.97) 0%, transparent 100%)" }}
                  >
                    <p className="text-white font-display text-xl font-bold leading-tight">{DOCTOR.name}</p>
                    <p className="text-sky-400 text-xs font-semibold mt-1 tracking-wide">{DOCTOR.title}</p>
                  </div>

                  {/* Certified badge */}
                  <div
                    className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
                    style={{
                      background: "rgba(14,165,233,0.18)",
                      border: "1px solid rgba(14,165,233,0.35)",
                    }}
                  >
                    <BadgeCheck size={12} color="#38bdf8" strokeWidth={2.5} />
                    <span className="text-[10px] text-sky-300 font-bold tracking-wider">Certified Expert</span>
                  </div>
                </div>

                {/* Floating: Years */}
                <div
                  className="absolute -bottom-5 -left-8 bg-white rounded-2xl px-5 py-4 card-rise cursor-default"
                  style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.14)" }}
                >
                  <p className="font-display text-4xl font-bold text-gray-900" style={{ letterSpacing: "-0.04em" }}>
                    <Counter target={15} suffix="+" />
                  </p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-1 leading-tight uppercase tracking-wider">
                    Years of<br />Experience
                  </p>
                </div>

                {/* Floating: Rating */}
                <div
                  className="absolute -top-5 -right-8 bg-white rounded-2xl px-4 py-3.5 card-rise cursor-default"
                  style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                >
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-800">4.9 / 5.0</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Patient Rating</p>
                </div>

                {/* Floating: Patients */}
                <div
                  className="absolute -bottom-5 -right-6 bg-white rounded-2xl px-4 py-3.5 card-rise cursor-default"
                  style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                >
                  <p className="font-display text-3xl font-bold text-gray-900" style={{ letterSpacing: "-0.04em" }}>
                    <Counter target={1200} suffix="+" />
                  </p>
                  <p className="text-[11px] text-gray-500 font-semibold mt-1 uppercase tracking-wider">Patients</p>
                </div>
              </div>
            </div>

            {/* ── Doctor Text ── */}
            <div className="flex flex-col gap-6 text-white" style={fadeUp(160)}>
              {/* Label */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">
                  Meet Your Doctor
                </span>
              </div>

              {/* Name & Title */}
              <div>
                <h1
                  className="font-display leading-none mb-2 text-[clamp(2.2rem,5vw,3.2rem)] font-bold"
                >
                  {DOCTOR.name}
                </h1>
                <p className="text-sky-300 text-base font-medium">{DOCTOR.title}</p>
              </div>

              {/* Degrees */}
              <div className="flex flex-col gap-2.5">
                {DOCTOR.degrees.map((deg, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-sky-500/20 text-sky-300">
                      <CheckCircle2 size={11} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm text-white/75 leading-relaxed">{deg}</span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-sm text-white/50 leading-relaxed pl-4 border-l-2 border-sky-500/35">
                {DOCTOR.bio}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  to="/appointment"
                  className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-sm bg-gradient-to-br from-sky-600 to-sky-400 shadow-[0_8px_28px_rgba(14,165,233,0.42)]"
                >
                  Book a Consultation
                  <ArrowRight size={15} />
                </Link>
                <a
                  href="https://wa.me/8801745565435"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm border border-white/20 text-white/80"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ──────────────────────────────────────────────── */}
      <section className="py-24 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sky-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500">Expertise</span>
              <div className="w-8 h-px bg-sky-400" />
            </div>
            <h2 className="font-display font-bold text-gray-900 text-[clamp(1.8rem,4vw,2.8rem)]">
              Areas of <span className="shimmer">Specialization</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
              Comprehensive dental care powered by the latest technology and genuine compassion.
            </p>
          </div>

          {/* Spec grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {DOCTOR.specializations.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.label}
                  className="spec-card rounded-2xl p-5 flex flex-col items-center text-center gap-3 cursor-default"
                  style={{
                    background: spec.bg,
                    border: `1.5px solid ${spec.color}22`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${spec.color}1a`, color: spec.color }}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 leading-tight">{spec.label}</p>
                </div>
              );
            })}
          </div>

          {/* Achievements grid */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {DOCTOR.achievements.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-5 py-4 card-rise cursor-default bg-slate-50 border border-slate-200 shadow-sm"
              >
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-500/10 text-sky-600">
                  <Icon size={14} strokeWidth={2} />
                </div>
                <span className="text-sm text-gray-700 font-medium leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS + STORY ────────────────────────────────────────────────── */}
      <section className="py-24 px-5 md:px-10 bg-[#f7f9fc]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

            {/* Stats 2x2 */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { target: 1200, suffix: "+", label: "Patients Treated", sub: "Across Dhaka",       icon: Users,      color: "#0ea5e9" },
                { target: 15,   suffix: "+", label: "Years Experience",  sub: "Since 2010",          icon: Calendar,   color: "#7c3aed" },
                { target: 98,   suffix: "%", label: "Success Rate",      sub: "Clinically verified", icon: TrendingUp, color: "#10b981" },
                { target: 2,    suffix: "",  label: "Locations",         sub: "Both in Dhaka",       icon: Building2,  color: "#ec4899" },
              ].map(({ target, suffix, label, sub, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded-2xl p-6 card-rise cursor-default bg-white border border-slate-200 shadow-sm"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${color}15`, color }}
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </div>
                  <p
                    className="font-display font-bold text-gray-900 leading-none text-[clamp(2rem,5vw,2.75rem)]"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    <Counter target={target} suffix={suffix} />
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-2">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Story + Quote */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500">Our Story</span>
                <h2 className="font-display font-bold text-gray-900 mt-2 text-[clamp(1.6rem,3.5vw,2.2rem)]">
                  Why Laser Dental Point?
                </h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                The clinic was built around one doctor's vision — that dental care shouldn't be feared. Every detail, from the calm interiors to the laser-assisted painless procedures, was designed to make patients feel at ease.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Believing that a healthy smile is a gateway to confidence, the clinic now operates across two Dhaka locations — served by one dedicated doctor who ensures consistent, personal care at every visit.
              </p>

              {/* Quote card */}
              <div className="rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-sky-100 to-violet-100 border-l-4 border-sky-600">
                <div className="absolute top-3 right-4 font-display text-8xl font-bold leading-none select-none pointer-events-none text-sky-600/10">
                  "
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed relative z-10">
                  "{DOCTOR.quote}"
                </p>
                <div className="flex items-center gap-2.5 mt-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-sky-600 to-violet-600">
                    {DOCTOR.name.split(" ")[1]?.[0] || "D"}
                  </div>
                  <p className="text-xs text-sky-700 font-bold">— {DOCTOR.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO LOCATIONS ────────────────────────────────────────────────── */}
      <section className="py-24 px-5 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sky-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500">Find Us</span>
              <div className="w-8 h-px bg-sky-400" />
            </div>
            <h2 className="font-display font-bold text-gray-900 text-[clamp(1.8rem,4vw,2.8rem)]">
              Our <span className="shimmer">Two Locations</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
              One doctor, two clinics — both in Dhaka, both delivering the same premium care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="loc-card rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md"
              >
                {/* Card header */}
                <div
                  className="px-7 py-6 flex items-start justify-between"
                  style={{
                    background: `linear-gradient(135deg, ${loc.color}0f, ${loc.color}06)`,
                    borderBottom: `1px solid ${loc.color}1c`,
                  }}
                >
                  <div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
                      style={{ background: `${loc.color}18`, color: loc.color }}
                    >
                      {loc.branch}
                    </span>
                    <h3 className="font-display font-bold text-gray-900 mt-2.5 leading-tight text-[1.3rem]">
                      Laser Dental Point
                    </h3>
                    <p className="text-sm font-semibold mt-1" style={{ color: loc.color }}>
                      {loc.area}
                    </p>
                  </div>
                  {/* ✅ Fixed: removed duplicate w-13 h-13 */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4"
                    style={{ background: `${loc.color}18`, color: loc.color }}
                  >
                    <MapPin size={20} strokeWidth={1.75} />
                  </div>
                </div>

                {/* Card body */}
                <div className="px-7 py-6 flex flex-col gap-5">

                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${loc.color}12`, color: loc.color }}
                    >
                      <MapPin size={15} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-semibold mb-0.5 uppercase tracking-wide">Address</p>
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">{loc.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${loc.color}12`, color: loc.color }}
                    >
                      <Phone size={15} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-semibold mb-0.5 uppercase tracking-wide">Phone</p>
                      <a
                        href={`tel:${loc.phone}`}
                        className="text-sm font-bold hover:underline"
                        style={{ color: loc.color }}
                      >
                        {loc.phone}
                      </a>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${loc.color}12`, color: loc.color }}
                    >
                      <Clock size={15} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wide">Schedule</p>
                      <div className="flex flex-col gap-2">
                        {loc.schedule.map((s, i) => (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-600 leading-tight">{s.days}</span>
                            <span
                              className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                              style={{
                                background: s.time === "Closed" ? "#fee2e2" : `${loc.color}15`,
                                color:      s.time === "Closed" ? "#dc2626" : loc.color,
                              }}
                            >
                              {s.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                    <a
                      href={loc.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90"
                      style={{
                        background: loc.color,
                        boxShadow: `0 4px 18px ${loc.color}40`,
                      }}
                    >
                      <MapPin size={14} strokeWidth={2} />
                      Get Directions
                    </a>
                    <a
                      href={`https://wa.me/880${loc.phone.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-emerald-600 transition-all active:scale-95 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200"
                    >
                      <MessageCircle size={14} strokeWidth={2} />
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
      <section className="py-16 px-5 md:px-10 bg-[#f7f9fc]">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-[2rem] px-8 py-16 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(155deg, #080f1e 0%, #0c1e3a 100%)",
              boxShadow: "0 30px 80px rgba(8,15,30,0.25)",
            }}
          >
            {/* Noise */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.018]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "180px",
              }}
            />
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none dot-grid" />
            {/* Orbs */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12), transparent)" }}
            />
            <div
              className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(129,140,248,0.1), transparent)" }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-5">
                <Sparkles size={14} color="#38bdf8" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">
                  Ready to get started?
                </span>
              </div>
              <h2 className="font-display font-bold text-white mb-3 text-[clamp(1.6rem,3.5vw,2.4rem)]">
                Your perfect smile is<br />one appointment away.
              </h2>
              <p className="text-white/45 text-sm mb-10 max-w-md mx-auto leading-relaxed">
                Book a consultation with {DOCTOR.name} at either of our Dhaka locations — we'll take care of the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/appointment"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm bg-gradient-to-br from-sky-600 to-sky-400 shadow-[0_8px_28px_rgba(14,165,233,0.45)]"
                >
                  Book Appointment
                  <ChevronRight size={16} strokeWidth={2.5} />
                </Link>
                <a
                  href="tel:01745565435"
                  className="btn-ghost inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm border border-white/20 text-white/80"
                >
                  <Phone size={15} />
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
