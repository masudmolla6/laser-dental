import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ── Floating tooth/dental SVG icons ────────────────────────────────────────
const ToothIcon = ({ size = 40, opacity = 0.12, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity, ...style }}>
    <path
      d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z"
      fill="currentColor"
    />
  </svg>
);

const PlusIcon = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Animated counter ────────────────────────────────────────────────────────
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
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
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

// ── Main Hero component ─────────────────────────────────────────────────────
const Hero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#09111f]">

      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(8deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(-6deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-float  { animation: float  6s ease-in-out infinite; }
        .animate-floatB { animation: floatB 8s ease-in-out infinite; }
        .pulse-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid #0ea5e9;
          animation: pulse-ring 2.2s ease-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #0ea5e9 0%, #6366f1 40%, #0ea5e9 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .dark .glass {
          background: rgba(15,30,55,0.72);
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px -10px rgba(14,165,233,0.2);
        }
      `}</style>

      {/* ── Background mesh & decorative shapes ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft gradient blob top-right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)" }} />
        {/* Soft gradient blob bottom-left */}
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

        {/* Decorative tooth icons */}
        <div className="absolute top-16 left-[8%] text-sky-400 dark:text-sky-500 animate-float">
          <ToothIcon size={48} opacity={0.15} />
        </div>
        <div className="absolute top-32 right-[10%] text-indigo-400 animate-floatB" style={{ animationDelay: "1.5s" }}>
          <ToothIcon size={36} opacity={0.12} />
        </div>
        <div className="absolute bottom-48 left-[5%] text-sky-300 animate-floatB" style={{ animationDelay: "3s" }}>
          <ToothIcon size={28} opacity={0.1} />
        </div>
        <div className="absolute bottom-32 right-[6%] text-indigo-300 animate-float" style={{ animationDelay: "2s" }}>
          <ToothIcon size={44} opacity={0.1} />
        </div>

        {/* Geometric grid dots */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-10 font-body">

        {/* ── Top badge ── */}
        <div className="flex justify-center" style={fadeUp(0)}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-sky-200 dark:border-sky-800 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 tracking-wide">
              Now open at 2 locations in Dhaka
            </span>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[82vh]">

          {/* ── Left: Text column ── */}
          <div className="flex flex-col gap-7">

            {/* Headline */}
            <div style={fadeUp(100)}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.08] text-gray-900 dark:text-white"
                style={{ letterSpacing: "-0.02em" }}>
                Your Smile,
                <br />
                <span className="shimmer-text">Our Passion.</span>
                <br />
                <span className="text-gray-800 dark:text-gray-100">Your Care.</span>
              </h1>
            </div>

            {/* Subtext */}
            <div style={fadeUp(200)}>
              <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
                Laser Dental Point delivers world-class dental care with laser precision — from routine cleanings to complete smile makeovers — in a calm, comfortable environment you'll trust.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="flex flex-col gap-2.5" style={fadeUp(300)}>
              {[
                "Painless laser-assisted treatments",
                "Expert doctor with 15+ years experience",
                "Two convenient Dhaka locations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                    <CheckIcon />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2" style={fadeUp(400)}>
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-200 active:scale-95 group"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                  boxShadow: "0 8px 28px -4px rgba(14,165,233,0.5)",
                }}
              >
                Book Appointment
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  <ArrowRight />
                </span>
              </Link>

              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-sm border transition-all duration-200 active:scale-95 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
              >
                <WhatsAppIcon />
                WhatsApp Us
              </a>

              <a
                href="tel:+8801XXXXXXXXX"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm border transition-all duration-200 active:scale-95 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <PhoneIcon />
                Call Now
              </a>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-4 pt-2" style={fadeUp(500)}>
              {/* Avatar stack */}
              <div className="flex -space-x-2.5">
                {[
                  { bg: "#bfdbfe", text: "#1d4ed8", label: "RH" },
                  { bg: "#bbf7d0", text: "#166534", label: "KA" },
                  { bg: "#fce7f3", text: "#9d174d", label: "SB" },
                  { bg: "#fef3c7", text: "#92400e", label: "NR" },
                ].map((a) => (
                  <div key={a.label}
                    className="w-9 h-9 rounded-full border-2 border-white dark:border-[#09111f] flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: a.bg, color: a.text }}>
                    {a.label}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">1,200+</span> happy patients
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Visual column ── */}
          <div className="relative flex justify-center items-center" style={fadeUp(200)}>

            {/* Main circle visual */}
            <div className="relative">
              {/* Outer pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full" style={{ position: "relative" }}>
                  <div className="pulse-ring" style={{ animationDelay: "0s" }} />
                  <div className="pulse-ring" style={{ animationDelay: "1.1s" }} />
                </div>
              </div>

              {/* Main circle */}
              <div
                className="w-72 h-72 md:w-[380px] md:h-[380px] rounded-full flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(145deg, #e0f2fe 0%, #bae6fd 50%, #e0e7ff 100%)",
                  boxShadow: "0 0 0 12px rgba(14,165,233,0.08), 0 40px 80px -20px rgba(14,165,233,0.25)",
                }}
              >
                {/* Big tooth center icon */}
                <div className="text-sky-400" style={{ opacity: 0.35 }}>
                  <ToothIcon size={160} opacity={1} />
                </div>

                {/* Clinic name overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}>
                      <ToothIcon size={36} opacity={1} style={{ color: "#fff" }} />
                    </div>
                    <p className="font-display text-lg font-bold text-gray-800 leading-tight">
                      Laser Dental
                    </p>
                    <p className="font-display text-lg font-bold text-gray-800 leading-tight">
                      Point
                    </p>
                    <p className="text-xs text-sky-600 font-medium mt-1 tracking-wider uppercase">
                      Est. 2010 · Dhaka
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card: Doctor info */}
              <div
                className="absolute -left-8 md:-left-16 top-10 glass border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3.5 shadow-xl card-hover"
                style={{ minWidth: "160px" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}>
                    Dr
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">Dr. [Name]</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">BDS, FCPS</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Available today</span>
                </div>
              </div>

              {/* Floating card: Laser badge */}
              <div
                className="absolute -right-6 md:-right-14 top-16 glass border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl card-hover"
                style={{ animationDelay: "0.5s" }}
              >
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-1">Technology</p>
                <p className="text-sm font-bold text-sky-600 dark:text-sky-400">Laser Assisted</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Painless treatments</p>
              </div>

              {/* Floating card: Rating */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass border border-white/60 dark:border-white/10 rounded-2xl px-5 py-3 shadow-xl card-hover"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white font-display">4.9</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Patient</p>
                    <p className="text-[10px] text-gray-400 font-medium">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div style={fadeUp(600)}>
          <div
            className="mt-16 glass border border-white/70 dark:border-white/10 rounded-3xl p-8 shadow-lg"
            style={{ boxShadow: "0 4px 40px rgba(14,165,233,0.07)" }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y-2 md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
              {[
                { target: 15, suffix: "+", label: "Years of Excellence", sub: "Trusted since 2010" },
                { target: 1200, suffix: "+", label: "Happy Patients", sub: "Across Dhaka" },
                { target: 98, suffix: "%", label: "Success Rate", sub: "Clinically verified" },
                { target: 2, suffix: "", label: "Locations", sub: "Dhaka, Bangladesh" },
              ].map(({ target, suffix, label, sub }, i) => (
                <div key={label} className="flex flex-col items-center text-center py-2 md:py-0 md:px-6 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
                  <span
                    className="font-display text-4xl font-black text-gray-900 dark:text-white"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    <Counter target={target} suffix={suffix} duration={1600 + i * 100} />
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">{label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick location strip ── */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3" style={fadeUp(700)}>
          {[
            { branch: "Branch 1", area: "Location TBD, Dhaka", time: "Sat – Thu: 10am – 8pm" },
            { branch: "Branch 2", area: "Location TBD, Dhaka", time: "Sat – Thu: 3pm – 9pm" },
          ].map((loc) => (
            <div
              key={loc.branch}
              className="flex-1 glass border border-white/60 dark:border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm card-hover"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">{loc.branch}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{loc.area}</p>
                <p className="text-xs text-gray-400 mt-0.5">{loc.time}</p>
              </div>
              <div className="ml-auto flex-shrink-0 text-gray-400">
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;
