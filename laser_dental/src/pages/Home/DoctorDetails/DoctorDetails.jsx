import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Phone, Star, ArrowRight, ArrowLeft, CheckCircle2,
  MessageCircle, Calendar, Users, Building2, UserRound,
  ShieldCheck, Quote as QuoteIcon, X, GraduationCap,
  Sparkles, Minus, Plus, Maximize2, ChevronRight,
} from "lucide-react";
import useDoctorBySlug from "../../../hooks/useDoctorBySlug";
import useBranches from "../../../hooks/useBranches";
import { getIcon } from "../../../utils/iconMap";

// ── Animated Counter ────────────────────────────────────────────────────────
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
const Reveal = ({ children, delay = 0, className = "" }) => {
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
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
};

// ── Certificate gallery modal (zoomable) ─────────────────────────────────────
const CertificateGalleryModal = ({ certificates, startIndex, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(startIndex || 0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, panX: 0, panY: 0 });
  const active = certificates[activeIndex];

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3.5;
  const STEP = 0.6;

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const switchTo = (i) => { setActiveIndex(i); resetZoom(); };
  const goPrev = () => switchTo(activeIndex === 0 ? certificates.length - 1 : activeIndex - 1);
  const goNext = () => switchTo(activeIndex === certificates.length - 1 ? 0 : activeIndex + 1);
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + STEP).toFixed(2)));
  const zoomOut = () => setZoom((z) => {
    const next = Math.max(MIN_ZOOM, +(z - STEP).toFixed(2));
    if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
    return next;
  });
  const handleDoubleClick = () => (zoom > MIN_ZOOM ? resetZoom() : setZoom(2.2));
  const handlePointerDown = (e) => {
    if (zoom <= MIN_ZOOM) return;
    dragState.current = { dragging: true, startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  };
  const handlePointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPan({ x: dragState.current.panX + dx, y: dragState.current.panY + dy });
  };
  const handlePointerUp = () => { dragState.current.dragging = false; };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 flex items-center justify-center text-white transition-colors">
          <X size={16} />
        </button>
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/55 rounded-full p-1">
          <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM} className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-35 transition-colors">
            <Minus size={14} />
          </button>
          <span className="text-[11px] text-white font-semibold min-w-[34px] text-center select-none">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} disabled={zoom >= MAX_ZOOM} className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-35 transition-colors">
            <Plus size={14} />
          </button>
          {zoom > MIN_ZOOM && (
            <button onClick={resetZoom} className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors">
              <Maximize2 size={12} />
            </button>
          )}
        </div>
        <div
          className="relative bg-slate-100 flex items-center justify-center overflow-hidden"
          style={{ minHeight: "320px", cursor: zoom > MIN_ZOOM ? (dragState.current.dragging ? "grabbing" : "grab") : "default" }}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            src={active.certificateImage}
            alt={active.title}
            draggable={false}
            className="w-full h-auto object-contain max-h-[55vh] select-none"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: dragState.current.dragging ? "none" : "transform 0.2s ease-out" }}
          />
          {certificates.length > 1 && zoom === MIN_ZOOM && (
            <>
              <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center text-white transition-colors">
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-slate-700 flex-1">{active.title}</p>
          {certificates.length > 1 && (
            <span className="text-xs text-slate-400 font-medium flex-shrink-0">{activeIndex + 1} / {certificates.length}</span>
          )}
        </div>
        {certificates.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto scroll-hide bg-white">
            {certificates.map((cert, i) => (
              <button key={i} onClick={() => switchTo(i)} className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? "border-sky-400" : "border-slate-200 opacity-60 hover:opacity-100"}`}>
                <img src={cert.certificateImage} alt={cert.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
const DoctorDetailsSkeleton = () => (
  <div style={{ background: "#06101f" }} className="min-h-screen">
    <div className="h-[70vh] bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-6">
      <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
      <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const DoctorDetails = () => {
  const { slug } = useParams();
  const [doctor, isLoading] = useDoctorBySlug(slug);
  const [branches, branchesLoading] = useBranches();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  if (isLoading || branchesLoading) {
    return <DoctorDetailsSkeleton />;
  }

  if (!doctor) {
    return (
      <div style={{ background: "#06101f" }} className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-20">
        <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/30 flex items-center justify-center mb-4">
          <UserRound size={24} />
        </div>
        <p className="text-white/40 text-sm mb-5">This doctor profile could not be found.</p>
        <Link to="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors">
          <ArrowLeft size={14} /> Back to all doctors
        </Link>
      </div>
    );
  }

  const normalizedDegrees = (doctor.degrees || []).map((d) =>
    typeof d === "string" ? { title: d, certificateImage: "" } : d
  );
  const certifiedDegrees = normalizedDegrees.filter((d) => d.certificateImage);
  const myBranches = (branches || []).filter((b) => doctor.branchSlugs?.includes(b.slug));
  const firstName = doctor.name.split(" ")[1] || doctor.name;

  return (
    <div style={{ background: "#06101f" }}>
      <style>{`
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
        @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .scroll-hide { scrollbar-width: none; }
        .scroll-hide::-webkit-scrollbar { display: none; }

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

        .spec-pill { transition: transform 0.25s ease, border-color 0.25s ease; }
        .spec-pill:hover { transform: translateY(-3px); border-color: rgba(56,189,248,0.4) !important; }

        .cred-card { transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, border-color 0.3s ease; }
        .cred-card:hover { transform: translateY(-6px); border-color: rgba(56,189,248,0.4) !important; box-shadow: 0 20px 50px -12px rgba(56,189,248,0.25); }
        .cred-card-img { transition: transform 0.5s ease; }
        .cred-card:hover .cred-card-img { transform: scale(1.08); }

        .loc-glass { transition: transform 0.3s cubic-bezier(.22,1,.36,1), border-color 0.3s ease; }
        .loc-glass:hover { transform: translateY(-6px); border-color: rgba(56,189,248,0.4) !important; }

        .btn-primary { transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease; }
        .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 32px rgba(56,189,248,0.5); }
        .btn-primary:active { transform: scale(0.97); }
        .btn-ghost { transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease; }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); transform: translateY(-1px); }

        .cert-banner-pill {
          background: rgba(16,185,129,0.14);
          border: 1px solid rgba(52,211,153,0.45);
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .cert-banner-pill:hover { transform: translateY(-2px); background: rgba(16,185,129,0.22); border-color: rgba(52,211,153,0.7); }
      `}</style>

      {/* ════════════════════════ MAGAZINE HERO ════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          {doctor.photo ? (
            <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full" style={{ background: "linear-gradient(160deg, #0a1830 0%, #050c18 100%)" }} />
          )}
          {/* Multi-layer gradient for text legibility + mood */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #06101f 0%, rgba(6,16,31,0.75) 28%, rgba(6,16,31,0.25) 55%, rgba(6,16,31,0.15) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(6,16,31,0.55) 0%, transparent 45%, rgba(6,16,31,0.15) 100%)" }} />
          <div className="absolute inset-0 pointer-events-none dot-grid opacity-40" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 px-6 md:px-12 pt-7 flex items-center justify-between">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-semibold transition-colors">
            <ArrowLeft size={14} /> All Doctors
          </Link>
          <div className="flex items-center gap-1.5 rounded-full px-3.5 py-2 backdrop-blur-md" style={{ background: "rgba(56,189,248,0.18)", border: "1px solid rgba(56,189,248,0.35)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300 pulse-dot" />
            <span className="text-[11px] text-sky-200 font-bold tracking-wider">Available now</span>
          </div>
        </div>

        {/* Magazine name block */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-16">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-300">{doctor.title}</span>
            </div>
            <h1
              className="font-display font-bold text-white leading-[0.95] mb-5"
              style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)", letterSpacing: "-0.03em" }}
            >
              {doctor.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                <span className="text-white/70 text-sm font-semibold ml-1">4.9 patient rating</span>
              </div>
              {certifiedDegrees.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setGalleryStartIndex(0); setGalleryOpen(true); }}
                  className="cert-banner-pill inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-400/25 flex-shrink-0">
                    <ShieldCheck size={12} className="text-emerald-300" strokeWidth={2.5} />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-100 tracking-wide">
                    Verified — view {certifiedDegrees.length} certificate{certifiedDegrees.length > 1 ? "s" : ""}
                  </span>
                  <ChevronRight size={13} className="text-emerald-200" />
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════ FLOATING STAT BAR ════════════════════════ */}
      <div className="relative z-20 px-6 md:px-12 -mt-10">
        <Reveal delay={100}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Calendar, value: doctor.yearsExperience || 10, suffix: "+", label: "Years exp." },
              { icon: Users, value: doctor.patientsCount || 500, suffix: "+", label: "Patients" },
              { icon: ShieldCheck, value: certifiedDegrees.length || normalizedDegrees.length || 1, suffix: "", label: "Credentials" },
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

      {/* ════════════════════════ PROFILE — Bio + Quote, editorial columns ════════════════════════ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14">

          {/* Bio — wider column */}
          {doctor.bio && (
            <div className="md:col-span-3">
              <Reveal>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Profile</span>
                </div>
                <p className="text-white/70 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.65 }}>
                  {doctor.bio}
                </p>
              </Reveal>
            </div>
          )}

          {/* Quote — narrower column, editorial style */}
          {doctor.quote && (
            <div className="md:col-span-2">
              <Reveal delay={120}>
                <div
                  className="rounded-3xl p-7 relative overflow-hidden h-full flex flex-col justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(167,139,250,0.08))", border: "1px solid rgba(56,189,248,0.2)" }}
                >
                  <QuoteIcon size={90} className="absolute -top-2 -right-2 text-sky-400/10 pointer-events-none select-none" fill="currentColor" />
                  <p className="text-white text-lg leading-relaxed relative z-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
                    "{doctor.quote}"
                  </p>
                  <div className="flex items-center gap-3 mt-6 relative z-10">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #38bdf8, #a78bfa)" }}>
                      {firstName[0]}
                    </div>
                    <p className="text-white/50 text-xs font-semibold">{doctor.name}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════ SPECIALIZATIONS — horizontal scroll strip ════════════════════════ */}
      {doctor.specializations?.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Specializations</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="flex gap-3 overflow-x-auto scroll-hide px-6 md:px-12 pb-2">
              {doctor.specializations.map((spec) => {
                const Icon = getIcon(spec.iconKey);
                return (
                  <div
                    key={spec.label}
                    className="spec-pill flex-shrink-0 flex items-center gap-3 rounded-2xl pl-3 pr-5 py-3 border"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${spec.color}25`, color: spec.color }}>
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <span className="text-white/80 text-sm font-semibold whitespace-nowrap">{spec.label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ════════════════════════ CREDENTIALS — large certificate showcase grid ════════════════════════ */}
      {normalizedDegrees.length > 0 && (
        <section className="px-6 md:px-12 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Credentials</span>
                </div>
                {certifiedDegrees.length > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck size={11} /> {certifiedDegrees.length} document-verified
                  </span>
                )}
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {normalizedDegrees.map((deg, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div
                    onClick={() => {
                      if (!deg.certificateImage) return;
                      const idx = certifiedDegrees.findIndex((d) => d.certificateImage === deg.certificateImage);
                      setGalleryStartIndex(idx >= 0 ? idx : 0);
                      setGalleryOpen(true);
                    }}
                    className={`cred-card rounded-2xl overflow-hidden border flex items-center gap-4 p-4 ${deg.certificateImage ? "cursor-pointer" : ""}`}
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    {deg.certificateImage ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={deg.certificateImage} alt={deg.title} className="cred-card-img w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end justify-center pb-1">
                          <ShieldCheck size={12} className="text-emerald-300" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-500/10 text-sky-300">
                        <GraduationCap size={26} strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-white/85 text-sm font-semibold leading-snug">{deg.title}</p>
                      {deg.certificateImage && (
                        <p className="text-emerald-300/80 text-[11px] font-medium mt-1.5 flex items-center gap-1">
                          View certificate <ChevronRight size={11} />
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════ ACHIEVEMENTS ════════════════════════ */}
      {doctor.achievements?.length > 0 && (
        <section className="px-6 md:px-12 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Recognition</span>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.achievements.map((item, i) => {
                const Icon = getIcon(item.iconKey);
                return (
                  <Reveal key={i} delay={i * 60}>
                    <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-500/15 text-violet-300">
                        <Icon size={15} strokeWidth={1.75} />
                      </div>
                      <span className="text-white/75 text-sm font-medium leading-snug">{item.text}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════ LOCATIONS ════════════════════════ */}
      {myBranches.length > 0 && (
        <section className="px-6 md:px-12 pb-20 md:pb-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-px bg-gradient-to-r from-sky-400 to-transparent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Find {firstName}</span>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {myBranches.map((loc, i) => (
                <Reveal key={loc._id || loc.slug} delay={i * 80}>
                  <div className="loc-glass rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.09)" }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-white font-bold text-sm">{loc.name}</p>
                        <p className="text-sky-300 text-xs font-semibold mt-0.5">{loc.area}</p>
                      </div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-500/15 text-sky-300">
                        <MapPin size={16} strokeWidth={1.75} />
                      </div>
                    </div>
                    {loc.address && <p className="text-white/45 text-xs leading-relaxed mb-3">{loc.address}</p>}
                    <div className="flex gap-2">
                      {loc.mapLink && (
                        <a href={loc.mapLink} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-500/90 hover:bg-sky-500 transition-colors">
                          <MapPin size={12} /> Directions
                        </a>
                      )}
                      {loc.phone && (
                        <a href={`tel:${loc.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white/80 border border-white/15 hover:bg-white/5 transition-colors">
                          <Phone size={12} /> Call
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════ FINAL CTA ════════════════════════ */}
      <section className="px-6 md:px-12 pb-20 md:pb-28">
        <Reveal>
          <div
            className="max-w-5xl mx-auto rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(155deg, rgba(56,189,248,0.12), rgba(167,139,250,0.1))", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <Sparkles size={16} className="text-sky-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-white text-xl md:text-3xl mb-3 leading-snug">
              Ready to meet {firstName}?
            </h2>
            <p className="text-white/45 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
              Book a consultation and experience personal, professional, painless dental care.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                to="/appointment"
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm bg-gradient-to-br from-sky-500 to-sky-400"
                style={{ boxShadow: "0 8px 26px rgba(56,189,248,0.45)" }}
              >
                Book Appointment <ArrowRight size={15} />
              </Link>
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border border-white/20 text-white/85"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

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

export default DoctorDetails;
