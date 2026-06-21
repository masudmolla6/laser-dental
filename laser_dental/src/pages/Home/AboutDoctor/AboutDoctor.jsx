import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Clock, Phone, Star, ArrowRight, CheckCircle2,
  MessageCircle, Award, Calendar, Users, TrendingUp, Building2,
  Sparkles, BadgeCheck, UserRound, X, ShieldCheck, Quote as QuoteIcon,
  ChevronRight, GraduationCap,
} from "lucide-react";
import AboutDoctorSkeleton from "./AboutDoctorSkeleton";
import { getIcon } from "../../../utils/iconMap";
import useFeaturedDoctors from "../../../hooks/useFeaturedDoctors";
import useBranches from "../../../hooks/useBranches";

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

// ── Reveal-on-scroll wrapper ─────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }) => {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
};

// ── Certificate lightbox modal ───────────────────────────────────────────────
const CertificateGalleryModal = ({ certificates, startIndex, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(startIndex || 0);
  const active = certificates[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i === 0 ? certificates.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === certificates.length - 1 ? 0 : i + 1));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 flex items-center justify-center text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Main image viewer */}
        <div className="relative bg-slate-100 flex items-center justify-center" style={{ minHeight: "320px" }}>
          <img
            src={active.certificateImage}
            alt={active.title}
            className="w-full h-auto object-contain max-h-[55vh]"
          />
          {certificates.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Active title bar */}
        <div className="px-5 py-3 bg-slate-50 border-t border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-slate-700 flex-1">{active.title}</p>
          {certificates.length > 1 && (
            <span className="text-xs text-slate-400 font-medium flex-shrink-0">
              {activeIndex + 1} / {certificates.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {certificates.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto scroll-hide bg-white">
            {certificates.map((cert, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIndex ? "border-sky-400" : "border-slate-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={cert.certificateImage} alt={cert.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
const AboutDoctor = () => {
  const [featuredDoctors, doctorsLoading] = useFeaturedDoctors();
  const [branches, branchesLoading] = useBranches();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const DOCTOR = featuredDoctors?.[0];

  if (doctorsLoading || branchesLoading) {
    return <AboutDoctorSkeleton />;
  }

  if (!DOCTOR) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-5 py-20 bg-[#06101f]">
        <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/30 flex items-center justify-center mb-4">
          <UserRound size={24} />
        </div>
        <p className="text-white/30 text-sm">No featured doctor has been set up yet.</p>
      </div>
    );
  }

  const normalizedDegrees = (DOCTOR.degrees || []).map((d) =>
    typeof d === "string" ? { title: d, certificateImage: "" } : d
  );
  const certifiedCount = normalizedDegrees.filter((d) => d.certificateImage).length;
  const certifiedDegrees = normalizedDegrees.filter((d) => d.certificateImage);
  const myBranches = (branches || []).filter((b) => DOCTOR.branchSlugs?.includes(b.slug));

  return (
    <div style={{ background: "#06101f" }}>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .float-slow { animation: floatSlow 7s ease-in-out infinite; }

        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer {
          background: linear-gradient(90deg, #38bdf8 0%, #a78bfa 40%, #f472b6 70%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 6s linear infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), border-color 0.3s ease, background 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56,189,248,0.35);
          background: rgba(255,255,255,0.06);
        }

        .spec-pill {
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .spec-pill:hover {
          transform: translateY(-3px);
          border-color: rgba(56,189,248,0.4) !important;
        }

        .cred-row {
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .cred-row:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(56,189,248,0.3) !important;
        }

        .cert-thumb img { transition: transform 0.4s ease; }
        .cert-thumb:hover img { transform: scale(1.15); }

        .loc-glass {
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), border-color 0.3s ease;
        }
        .loc-glass:hover {
          transform: translateY(-6px);
          border-color: rgba(56,189,248,0.4) !important;
        }

        .btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 10px 32px rgba(56,189,248,0.5);
        }
        .btn-primary:active { transform: scale(0.97); }

        .btn-ghost {
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .photo-shine::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shine 4.5s ease-in-out infinite;
        }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .scroll-hide { scrollbar-width: none; }
        .scroll-hide::-webkit-scrollbar { display: none; }

        .cert-cta-pill {
          background: rgba(16,185,129,0.14);
          border: 1px solid rgba(52,211,153,0.45);
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .cert-cta-pill:hover {
          transform: translateY(-2px);
          background: rgba(16,185,129,0.22);
          border-color: rgba(52,211,153,0.7);
        }
        .cert-cta-pill:active { transform: scale(0.97); }
        @keyframes certGlowSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .cert-cta-glow {
          position: absolute;
          top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
          animation: certGlowSweep 3.2s ease-in-out infinite;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .doctor-split-left { position: sticky; top: 0; height: 100vh; }
        }
      `}</style>

      <div className="lg:flex">

        {/* ════════════════════════════════════════════════════════════════
            LEFT — sticky photo panel (desktop) / hero (mobile)
        ════════════════════════════════════════════════════════════════ */}
        <div
          className="doctor-split-left relative w-full lg:w-[44%] flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(165deg, #0a1830 0%, #050c18 100%)",
            minHeight: "100vh",
          }}
        >
          {/* Noise + dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px",
            }}
          />
          <div className="absolute inset-0 pointer-events-none dot-grid" />

          {/* Ambient glows */}
          <div
            className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none float-slow"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.14), transparent 70%)" }}
          />

          {/* Doctor photo — fills the panel */}
          <div className="relative h-full min-h-[100vh] flex flex-col">
            <div className="relative flex-1 photo-shine overflow-hidden">
              {DOCTOR.photo ? (
                <img
                  src={DOCTOR.photo}
                  alt={DOCTOR.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-40 h-40 rounded-full flex items-center justify-center float-slow"
                    style={{
                      background: "linear-gradient(135deg, #0284c7, #7c3aed)",
                      boxShadow: "0 0 0 14px rgba(56,189,248,0.08), 0 0 0 28px rgba(56,189,248,0.04)",
                    }}
                  >
                    <span className="text-white font-display text-5xl font-bold">Dr</span>
                  </div>
                </div>
              )}

              {/* Bottom gradient for text legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                style={{ background: "linear-gradient(to top, #050c18 0%, rgba(5,12,24,0.7) 35%, transparent 100%)" }}
              />

              {/* Top badges row */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-2 backdrop-blur-md"
                  style={{ background: "rgba(56,189,248,0.2)", border: "1px solid rgba(56,189,248,0.4)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300 pulse-dot" />
                  <span className="text-[11px] text-sky-200 font-bold tracking-wider">Available now</span>
                </div>
                {certifiedCount > 0 && (
                  <div
                    className="flex items-center gap-1.5 rounded-full px-3.5 py-2 backdrop-blur-md"
                    style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.4)" }}
                  >
                    <ShieldCheck size={13} color="#34d399" strokeWidth={2.5} />
                    <span className="text-[11px] text-emerald-200 font-bold tracking-wider">{certifiedCount} verified</span>
                  </div>
                )}
              </div>

              {/* Name block, bottom of photo */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                    Meet your doctor
                  </span>
                </div>
                <h1
                  className="font-display font-bold text-white leading-[1.05] mb-2 text-[clamp(2rem,4.5vw,3rem)]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {DOCTOR.name}
                </h1>
                <p className="text-sky-300 text-sm md:text-base font-semibold mb-5">{DOCTOR.title}</p>

                {/* Rating row + Verified Certificates pill */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />
                    ))}
                    <span className="text-white/70 text-xs font-semibold ml-1">4.9 patient rating</span>
                  </div>

                  {certifiedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryStartIndex(0);
                        setGalleryOpen(true);
                      }}
                      className="cert-cta-pill group relative inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full overflow-hidden"
                    >
                      <span className="cert-cta-glow" />
                      <span className="relative w-6 h-6 rounded-full flex items-center justify-center bg-emerald-400/25 flex-shrink-0">
                        <ShieldCheck size={12} className="text-emerald-300" strokeWidth={2.5} />
                      </span>
                      <span className="relative text-[11px] font-bold text-emerald-100 tracking-wide">
                        Verified — view {certifiedCount} certificate{certifiedCount > 1 ? "s" : ""}
                      </span>
                      <ChevronRight size={13} className="relative text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    to="/appointment"
                    className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-xs bg-gradient-to-br from-sky-500 to-sky-400"
                    style={{ boxShadow: "0 8px 24px rgba(56,189,248,0.4)" }}
                  >
                    Book consultation
                    <ArrowRight size={13} />
                  </Link>
                  <a
                    href="https://wa.me/8801745565435"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs border border-white/20 text-white/85"
                  >
                    <MessageCircle size={13} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT — scrollable content
        ════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[56%] flex flex-col">

          {/* ── Stat strip ── */}
          <div className="px-6 md:px-12 pt-12 md:pt-16">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Calendar, value: DOCTOR.yearsExperience || 10, suffix: "+", label: "Years exp." },
                  { icon: Users, value: DOCTOR.patientsCount || 500, suffix: "+", label: "Patients" },
                  { icon: ShieldCheck, value: certifiedCount || normalizedDegrees.length || 1, suffix: "", label: "Credentials" },
                  { icon: Building2, value: myBranches.length || 1, suffix: "", label: "Location" + (myBranches.length > 1 ? "s" : "") },
                ].map(({ icon: Icon, value, suffix, label }, i) => (
                  <div key={i} className="glass-card rounded-2xl px-4 py-5 flex flex-col gap-2">
                    <Icon size={16} className="text-sky-400" strokeWidth={1.75} />
                    <p className="font-display font-bold text-white text-2xl leading-none" style={{ letterSpacing: "-0.03em" }}>
                      <Counter target={value} suffix={suffix} />
                    </p>
                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── Bio ── */}
          {DOCTOR.bio && (
            <div className="px-6 md:px-12 pt-12 md:pt-16">
              <Reveal>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">About</span>
                </div>
                <p className="text-white/65 text-base md:text-lg leading-relaxed" style={{ fontWeight: 400 }}>
                  {DOCTOR.bio}
                </p>
              </Reveal>
            </div>
          )}

          {/* ── Specializations ── */}
          {DOCTOR.specializations?.length > 0 && (
            <div className="px-6 md:px-12 pt-12 md:pt-16">
              <Reveal>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Specializations</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {DOCTOR.specializations.map((spec) => {
                    const Icon = getIcon(spec.iconKey);
                    return (
                      <div
                        key={spec.label}
                        className="spec-pill flex items-center gap-2 rounded-full pl-2.5 pr-4 py-2 border"
                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: `${spec.color}25`, color: spec.color }}
                        >
                          <Icon size={12} strokeWidth={2} />
                        </div>
                        <span className="text-white/75 text-xs font-semibold">{spec.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          )}

          {/* ── Credentials with certificates ── */}
          {normalizedDegrees.length > 0 && (
            <div className="px-6 md:px-12 pt-12 md:pt-16">
              <Reveal>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Credentials</span>
                  </div>
                  {certifiedCount > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                      <ShieldCheck size={11} /> {certifiedCount} document-verified
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  {normalizedDegrees.map((deg, i) => (
                    <div
                      key={i}
                      className="cred-row flex items-center gap-3.5 rounded-2xl px-4 py-3.5 border"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-500/15 text-sky-300">
                        <GraduationCap size={15} strokeWidth={1.75} />
                      </div>
                      <span className="text-white/80 text-sm font-medium leading-snug flex-1">{deg.title}</span>
                      {deg.certificateImage ? (
                        <button
                          type="button"
                          onClick={() => {
                            const idx = certifiedDegrees.findIndex((d) => d.certificateImage === deg.certificateImage);
                            setGalleryStartIndex(idx >= 0 ? idx : 0);
                            setGalleryOpen(true);
                          }}
                          className="cert-thumb relative w-11 h-11 rounded-lg overflow-hidden border-2 flex-shrink-0"
                          style={{ borderColor: "rgba(52,211,153,0.5)" }}
                          title="View certificate"
                        >
                          <img src={deg.certificateImage} alt={deg.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                            <ShieldCheck size={11} className="text-emerald-300" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 text-white/25">
                          <CheckCircle2 size={13} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          )}

          {/* ── Achievements ── */}
          {DOCTOR.achievements?.length > 0 && (
            <div className="px-6 md:px-12 pt-12 md:pt-16">
              <Reveal>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Recognition</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DOCTOR.achievements.map((item, i) => {
                    const Icon = getIcon(item.iconKey);
                    return (
                      <div
                        key={i}
                        className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3.5"
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-500/15 text-violet-300">
                          <Icon size={15} strokeWidth={1.75} />
                        </div>
                        <span className="text-white/75 text-sm font-medium leading-snug">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          )}

          {/* ── Quote ── */}
          {DOCTOR.quote && (
            <div className="px-6 md:px-12 pt-12 md:pt-16">
              <Reveal>
                <div
                  className="rounded-3xl p-7 md:p-9 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(167,139,250,0.08))",
                    border: "1px solid rgba(56,189,248,0.2)",
                  }}
                >
                  <QuoteIcon
                    size={100}
                    className="absolute -top-2 -right-2 text-sky-400/10 pointer-events-none select-none"
                    fill="currentColor"
                  />
                  <p
                    className="text-white text-lg md:text-xl leading-relaxed relative z-10"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 400 }}
                  >
                    "{DOCTOR.quote}"
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #38bdf8, #a78bfa)", boxShadow: "0 6px 18px rgba(56,189,248,0.4)" }}
                    >
                      {DOCTOR.name.split(" ")[1]?.[0] || "D"}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-tight">{DOCTOR.name}</p>
                      <p className="text-white/40 text-xs">{DOCTOR.title}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {/* ── Locations ── */}
          {myBranches.length > 0 && (
            <div className="px-6 md:px-12 pt-12 md:pt-16">
              <Reveal>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Find this doctor</span>
                </div>
                <div className="flex flex-col gap-3">
                  {myBranches.map((loc) => (
                    <div
                      key={loc._id || loc.slug}
                      className="loc-glass rounded-2xl p-5 border"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.09)" }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-white font-bold text-sm">{loc.name}</p>
                          <p className="text-sky-300 text-xs font-semibold mt-0.5">{loc.area}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-500/15 text-sky-300">
                          <MapPin size={16} strokeWidth={1.75} />
                        </div>
                      </div>
                      {loc.address && (
                        <p className="text-white/45 text-xs leading-relaxed mb-3">{loc.address}</p>
                      )}
                      <div className="flex gap-2">
                        {loc.mapLink && (
                          <a
                            href={loc.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-500/90 hover:bg-sky-500 transition-colors"
                          >
                            <MapPin size={12} /> Directions
                          </a>
                        )}
                        {loc.phone && (
                          <a
                            href={`tel:${loc.phone}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white/80 border border-white/15 hover:bg-white/5 transition-colors"
                          >
                            <Phone size={12} /> Call
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          )}

          {/* ── Final CTA ── */}
          <div className="px-6 md:px-12 py-12 md:py-16">
            <Reveal>
              <div
                className="rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(155deg, rgba(56,189,248,0.12), rgba(167,139,250,0.1))",
                  border: "1px solid rgba(56,189,248,0.25)",
                }}
              >
                <Sparkles size={16} className="text-sky-300 mx-auto mb-4" />
                <h2 className="font-display font-bold text-white text-xl md:text-2xl mb-2 leading-snug">
                  Your perfect smile is one<br />appointment away.
                </h2>
                <p className="text-white/45 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
                  Book a consultation with {DOCTOR.name} — personal, professional, painless care.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <Link
                    to="/appointment"
                    className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm bg-gradient-to-br from-sky-500 to-sky-400"
                    style={{ boxShadow: "0 8px 26px rgba(56,189,248,0.45)" }}
                  >
                    Book appointment
                    <ChevronRight size={15} strokeWidth={2.5} />
                  </Link>
                  <a
                    href="tel:01745565435"
                    className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border border-white/20 text-white/85"
                  >
                    <Phone size={14} /> 01745565435
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {galleryOpen && certifiedDegrees.length > 0 && (
        <CertificateGalleryModal
          certificates={certifiedDegrees}
          startIndex={galleryStartIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default AboutDoctor;
