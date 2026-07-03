import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Phone, Star, ArrowRight, ArrowLeft, CheckCircle2,
  MessageCircle, Calendar, Users, Building2, UserRound,
  ShieldCheck, Quote as QuoteIcon, X, GraduationCap,
  Minus, Plus, Maximize2, ChevronRight, Award,
} from "lucide-react";
import useDoctorBySlug from "../../../hooks/useDoctorBySlug";
import useBranches from "../../../hooks/useBranches";
import { getIcon } from "../../../utils/iconMap";

/*
  DESIGN CONCEPT B — "Centered Award Profile"
  ------------------------------------------------------------------
  Palette
    --navy        #06101F  page background
    --navy-2      #0B1A2E  panel / card surface
    --navy-3      #101F38  raised card surface
    --hair        rgba(255,255,255,0.09)   hairline rule
    --sky         #38BDF8  primary accent (trust / clinical)
    --sky-dim     rgba(56,189,248,0.14)
    --gold        #E8BE72  award / premium accent
    --gold-dim    rgba(232,190,114,0.14)
    --ink         #FFFFFF
    --ink-70      rgba(255,255,255,0.72)
    --ink-45      rgba(255,255,255,0.45)

  Type
    Display : Fraunces — the centered name, honorific, section titles.
    Body    : Inter.
    Utility : IBM Plex Mono — ghost monogram, stat figures, meta labels.

  Signature elements
    · A giant translucent monogram ("ghost initials") behind the
      circular portrait — the "award profile" centerpiece.
    · A gold laurel-style ring around the portrait.
    · A horizontal certificate "filmstrip" — small verified frames
      strung on a hairline, echoing an awards wall.
  ------------------------------------------------------------------
*/

// ── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ target, suffix = "", duration = 1400 }) => {
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
        transform: shown ? "translateY(0)" : "translateY(22px)",
        transition: "opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
};

// ── Centered section heading ────────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title }) => (
  <div className="flex flex-col items-center text-center mb-10">
    <span className="font-mono text-[10px] font-semibold tracking-[0.3em] mb-3" style={{ color: "var(--gold)" }}>
      {eyebrow}
    </span>
    <h2 className="font-display font-bold text-2xl md:text-[2rem]" style={{ color: "var(--ink)" }}>
      {title}
    </h2>
    <span className="mt-4 w-10 h-px" style={{ background: "var(--gold)", opacity: 0.6 }} />
  </div>
);

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
      <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" style={{ background: "var(--navy-2)", border: "1px solid var(--hair)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 flex items-center justify-center text-white transition-colors">
          <X size={16} />
        </button>
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/55 rounded-full p-1">
          <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM} className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-35 transition-colors">
            <Minus size={14} />
          </button>
          <span className="font-mono text-[11px] text-white font-semibold min-w-[34px] text-center select-none">{Math.round(zoom * 100)}%</span>
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
          className="relative flex items-center justify-center overflow-hidden"
          style={{ minHeight: "320px", background: "var(--navy-3)", cursor: zoom > MIN_ZOOM ? (dragState.current.dragging ? "grabbing" : "grab") : "default" }}
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
        <div className="px-5 py-3 flex items-center gap-2 border-t border-b" style={{ background: "var(--gold-dim)", borderColor: "var(--hair)" }}>
          <ShieldCheck size={14} style={{ color: "var(--gold)" }} className="flex-shrink-0" />
          <p className="text-sm font-semibold flex-1" style={{ color: "var(--ink)" }}>{active.title}</p>
          {certificates.length > 1 && (
            <span className="font-mono text-[11px] flex-shrink-0" style={{ color: "var(--ink-45)" }}>{activeIndex + 1} / {certificates.length}</span>
          )}
        </div>
        {certificates.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto scroll-hide" style={{ background: "var(--navy-2)" }}>
            {certificates.map((cert, i) => (
              <button key={i} onClick={() => switchTo(i)} className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all" style={{ borderColor: i === activeIndex ? "var(--gold)" : "var(--hair)", opacity: i === activeIndex ? 1 : 0.55 }}>
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
  <div style={{ background: "#06101F" }} className="min-h-screen">
    <div className="max-w-md mx-auto pt-24 flex flex-col items-center gap-6 px-6">
      <div className="w-36 h-36 rounded-full animate-pulse" style={{ background: "#101F38" }} />
      <div className="h-5 w-48 rounded animate-pulse" style={{ background: "#101F38" }} />
      <div className="h-4 w-32 rounded animate-pulse" style={{ background: "#101F38" }} />
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
      <div style={{ background: "#06101F" }} className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-20">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#101F38", color: "rgba(255,255,255,0.35)" }}>
          <UserRound size={24} />
        </div>
        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>This doctor profile could not be found.</p>
        <Link to="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: "#38BDF8" }}>
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
  const initials = doctor.name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div style={{ background: "var(--navy)" }}>
      <style>{`
        :root {
          --navy: #06101F;
          --navy-2: #0B1A2E;
          --navy-3: #101F38;
          --hair: rgba(255,255,255,0.09);
          --sky: #38BDF8;
          --sky-dim: rgba(56,189,248,0.14);
          --gold: #E8BE72;
          --gold-dim: rgba(232,190,114,0.14);
          --ink: #FFFFFF;
          --ink-70: rgba(255,255,255,0.72);
          --ink-45: rgba(255,255,255,0.45);
        }
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        .scroll-hide { scrollbar-width: none; }
        .scroll-hide::-webkit-scrollbar { display: none; }

        .stage-glow {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(56,189,248,0.16) 0%, transparent 60%),
            radial-gradient(40% 35% at 80% 15%, rgba(232,190,114,0.10) 0%, transparent 60%);
        }
        .dot-field {
          background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        @keyframes ringSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ring-slow { animation: ringSpin 34s linear infinite; transform-origin: center; }

        @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        .card-lift { transition: transform .32s cubic-bezier(.22,1,.36,1), border-color .3s ease, background .3s ease; }
        .card-lift:hover { transform: translateY(-5px); border-color: rgba(232,190,114,0.4) !important; background: var(--navy-3) !important; }

        .film-frame { transition: transform .3s cubic-bezier(.22,1,.36,1), border-color .3s ease; }
        .film-frame:hover { transform: translateY(-4px) scale(1.04); border-color: var(--gold) !important; }

        .spec-chip { transition: transform .22s ease, border-color .22s ease, background .22s ease; }
        .spec-chip:hover { transform: translateY(-2px); border-color: var(--sky) !important; background: var(--sky-dim) !important; }

        .btn-primary { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
        .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 14px 34px -10px rgba(232,190,114,0.55); }
        .btn-primary:active { transform: scale(0.97); }
        .btn-ghost { transition: background .2s ease, transform .2s ease, border-color .2s ease; }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); transform: translateY(-1px); }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ════════════════════════ HERO — centered award profile ════════════════════════ */}
      <section className="relative overflow-hidden stage-glow">
        <div className="absolute inset-0 dot-field opacity-60 pointer-events-none" />

        {/* top bar */}
        <div className="relative z-10 px-5 md:px-12 pt-7 flex items-center justify-between max-w-5xl mx-auto">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-xs font-semibold transition-colors font-body" style={{ color: "var(--ink-70)" }}>
            <ArrowLeft size={14} /> All Doctors
          </Link>
          <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5" style={{ background: "var(--sky-dim)", border: "1px solid rgba(56,189,248,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--sky)" }} />
            <span className="font-mono text-[10px] font-semibold tracking-wider" style={{ color: "var(--sky)" }}>AVAILABLE NOW</span>
          </div>
        </div>

        {/* ghost monogram + portrait */}
        <div className="relative z-10 flex flex-col items-center pt-6 pb-4 px-5">
          <span
            aria-hidden="true"
            className="font-display font-bold select-none pointer-events-none absolute"
            style={{ fontSize: "clamp(9rem, 26vw, 15rem)", color: "rgba(255,255,255,0.035)", top: "-1.2rem", lineHeight: 1, letterSpacing: "-0.04em" }}
          >
            {initials}
          </span>

          <Reveal>
            <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-6">
              <svg viewBox="0 0 200 200" className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] ring-slow">
                <circle cx="100" cy="100" r="97" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="1.5 6" opacity="0.55" />
              </svg>
              <div className="w-full h-full rounded-full overflow-hidden" style={{ background: "var(--navy-3)", border: "2px solid rgba(232,190,114,0.5)", boxShadow: "0 0 50px -8px rgba(56,189,248,0.35)" }}>
                {doctor.photo ? (
                  <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--ink-45)" }}>
                    <UserRound size={40} strokeWidth={1.2} />
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full pl-1.5 pr-3 py-1"
                style={{ background: "var(--navy)", border: "1px solid rgba(232,190,114,0.5)" }}
              >
                <Star size={10} fill="var(--gold)" color="var(--gold)" />
                <span className="font-mono text-[10px] font-semibold" style={{ color: "var(--ink)" }}>4.9</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="flex items-center gap-2 justify-center mb-3">
              <span className="w-6 h-px" style={{ background: "var(--gold)", opacity: 0.6 }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
                {doctor.title}
              </span>
              <span className="w-6 h-px" style={{ background: "var(--gold)", opacity: 0.6 }} />
            </div>
            <h1
              className="font-display font-bold text-center leading-[1.02] mb-4"
              style={{ fontSize: "clamp(2.1rem, 6vw, 3.4rem)", color: "var(--ink)", letterSpacing: "-0.01em" }}
            >
              {doctor.name}
            </h1>
          </Reveal>

          {doctor.quote && (
            <Reveal delay={150}>
              <p className="font-body text-center max-w-md mx-auto mb-7" style={{ color: "var(--ink-70)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {doctor.quote}
              </p>
            </Reveal>
          )}

          {/* certificate filmstrip */}
          {certifiedDegrees.length > 0 && (
            <Reveal delay={200}>
              <button
                type="button"
                onClick={() => { setGalleryStartIndex(0); setGalleryOpen(true); }}
                className="flex flex-col items-center gap-3 group"
                aria-label="View verified certificates"
              >
                <div className="flex items-center -space-x-3">
                  {certifiedDegrees.slice(0, 4).map((cert, i) => (
                    <div
                      key={i}
                      className="film-frame w-11 h-11 rounded-lg overflow-hidden border-2 relative"
                      style={{ borderColor: "rgba(232,190,114,0.45)", background: "var(--navy-3)", zIndex: 10 - i }}
                    >
                      <img src={cert.certificateImage} alt={cert.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {certifiedDegrees.length > 4 && (
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center border-2 font-mono text-[10px] font-semibold" style={{ borderColor: "rgba(232,190,114,0.45)", background: "var(--navy-3)", color: "var(--gold)" }}>
                      +{certifiedDegrees.length - 4}
                    </div>
                  )}
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wide" style={{ color: "var(--ink-45)" }}>
                  <ShieldCheck size={11} style={{ color: "var(--gold)" }} />
                  {certifiedDegrees.length} VERIFIED CREDENTIAL{certifiedDegrees.length > 1 ? "S" : ""}
                  <ChevronRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </Reveal>
          )}
        </div>

        {/* stat row */}
        <Reveal delay={260}>
          <div className="relative z-10 max-w-4xl mx-auto px-5 mt-10 mb-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Calendar, value: doctor.yearsExperience || 10, suffix: "+", label: "Years exp." },
                { icon: Users, value: doctor.patientsCount || 500, suffix: "+", label: "Patients" },
                { icon: Award, value: certifiedDegrees.length || normalizedDegrees.length || 1, suffix: "", label: "Credentials" },
                { icon: Building2, value: myBranches.length || 1, suffix: "", label: "Location" + (myBranches.length > 1 ? "s" : "") },
              ].map(({ icon: Icon, value, suffix, label }, i) => (
                <div key={i} className="card-lift rounded-2xl px-4 py-5 flex flex-col items-center text-center gap-2" style={{ background: "var(--navy-2)", border: "1px solid var(--hair)" }}>
                  <Icon size={15} style={{ color: "var(--sky)" }} strokeWidth={1.75} />
                  <p className="font-mono font-semibold text-2xl leading-none" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>
                    <Counter target={value} suffix={suffix} />
                  </p>
                  <p className="font-body text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-45)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════ PROFILE ════════════════════════ */}
      {doctor.bio && (
        <section className="px-5 md:px-12 pb-20">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <SectionHeading eyebrow="About" title="Profile" />
              <p className="font-body text-center leading-relaxed" style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--ink-70)" }}>
                {doctor.bio}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ════════════════════════ SPECIALIZATIONS ════════════════════════ */}
      {doctor.specializations?.length > 0 && (
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-5 md:px-12">
            <Reveal>
              <SectionHeading eyebrow="Expertise" title="Specializations" />
            </Reveal>
          </div>
          <Reveal delay={90}>
            <div className="flex gap-3 overflow-x-auto scroll-hide px-5 md:px-12 pb-2 justify-center flex-wrap max-w-5xl mx-auto">
              {doctor.specializations.map((spec) => {
                const Icon = getIcon(spec.iconKey);
                return (
                  <div
                    key={spec.label}
                    className="spec-chip flex-shrink-0 flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 border"
                    style={{ background: "var(--navy-2)", borderColor: "var(--hair)" }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--sky-dim)", color: "var(--sky)" }}>
                      <Icon size={14} strokeWidth={2} />
                    </div>
                    <span className="font-body text-sm font-semibold whitespace-nowrap" style={{ color: "var(--ink)" }}>{spec.label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ════════════════════════ CREDENTIALS — award wall grid ════════════════════════ */}
      {normalizedDegrees.length > 0 && (
        <section className="px-5 md:px-12 pb-20">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionHeading eyebrow="Recognition" title="Credentials" />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {normalizedDegrees.map((deg, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div
                    onClick={() => {
                      if (!deg.certificateImage) return;
                      const idx = certifiedDegrees.findIndex((d) => d.certificateImage === deg.certificateImage);
                      setGalleryStartIndex(idx >= 0 ? idx : 0);
                      setGalleryOpen(true);
                    }}
                    className={`card-lift rounded-2xl overflow-hidden border flex items-center gap-4 p-4 ${deg.certificateImage ? "cursor-pointer" : ""}`}
                    style={{ background: "var(--navy-2)", borderColor: "var(--hair)" }}
                  >
                    {deg.certificateImage ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(232,190,114,0.35)" }}>
                        <img src={deg.certificateImage} alt={deg.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-end justify-center pb-1" style={{ background: "linear-gradient(to top, rgba(6,16,31,0.6), transparent)" }}>
                          <ShieldCheck size={11} style={{ color: "var(--gold)" }} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--sky-dim)", color: "var(--sky)" }}>
                        <GraduationCap size={22} strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold leading-snug" style={{ color: "var(--ink)" }}>{deg.title}</p>
                      {deg.certificateImage && (
                        <p className="font-mono text-[10px] font-medium mt-1.5 flex items-center gap-1" style={{ color: "var(--gold)" }}>
                          VIEW CERTIFICATE <ChevronRight size={10} />
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
        <section className="px-5 md:px-12 pb-20">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionHeading eyebrow="Milestones" title="Achievements" />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.achievements.map((item, i) => {
                const Icon = getIcon(item.iconKey);
                return (
                  <Reveal key={i} delay={i * 55}>
                    <div className="card-lift flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: "var(--navy-2)", border: "1px solid var(--hair)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
                        <Icon size={15} strokeWidth={1.75} />
                      </div>
                      <span className="font-body text-sm font-medium leading-snug" style={{ color: "var(--ink-70)" }}>{item.text}</span>
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
        <section className="px-5 md:px-12 pb-20">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionHeading eyebrow="Visit" title={`Find ${firstName}`} />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {myBranches.map((loc, i) => (
                <Reveal key={loc._id || loc.slug} delay={i * 75}>
                  <div className="card-lift rounded-2xl p-5 border" style={{ background: "var(--navy-2)", borderColor: "var(--hair)" }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-body font-bold text-sm" style={{ color: "var(--ink)" }}>{loc.name}</p>
                        <p className="font-mono text-[11px] font-semibold mt-1" style={{ color: "var(--sky)" }}>{loc.area}</p>
                      </div>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--sky-dim)", color: "var(--sky)" }}>
                        <MapPin size={16} strokeWidth={1.75} />
                      </div>
                    </div>
                    {loc.address && <p className="font-body text-xs leading-relaxed mb-3" style={{ color: "var(--ink-45)" }}>{loc.address}</p>}
                    <div className="flex gap-2">
                      {loc.mapLink && (
                        <a href={loc.mapLink} target="_blank" rel="noreferrer" className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold" style={{ background: "var(--gold)", color: "var(--navy)" }}>
                          <MapPin size={12} /> Directions
                        </a>
                      )}
                      {loc.phone && (
                        <a href={`tel:${loc.phone}`} className="btn-ghost flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border" style={{ borderColor: "var(--hair)", color: "var(--ink-70)" }}>
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
      <section className="px-5 md:px-12 pb-24">
        <Reveal>
          <div
            className="max-w-4xl mx-auto rounded-[28px] p-8 md:p-14 text-center relative overflow-hidden dot-field"
            style={{ background: "var(--navy-2)", border: "1px solid rgba(232,190,114,0.25)" }}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "var(--gold-dim)" }}>
              <Award size={18} style={{ color: "var(--gold)" }} />
            </div>
            <h2 className="font-display font-bold text-xl md:text-3xl mb-3 leading-snug" style={{ color: "var(--ink)" }}>
              Ready to meet {firstName}?
            </h2>
            <p className="font-body text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--ink-45)" }}>
              Book a consultation and experience personal, professional, painless dental care.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                to="/appointment"
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
                style={{ background: "var(--gold)", color: "var(--navy)" }}
              >
                Book Appointment <ArrowRight size={15} />
              </Link>
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "var(--ink)" }}
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
