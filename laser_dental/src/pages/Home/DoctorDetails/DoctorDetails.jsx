import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Phone, Star, ArrowRight, ArrowLeft, CheckCircle2,
  MessageCircle, Calendar, Users, Building2, UserRound,
  ShieldCheck, Quote as QuoteIcon, X, GraduationCap,
  Minus, Plus, Maximize2, ChevronRight, Stethoscope,
} from "lucide-react";
import useDoctorBySlug from "../../../hooks/useDoctorBySlug";
import useBranches from "../../../hooks/useBranches";
import { getIcon } from "../../../utils/iconMap";

/*
  DESIGN CONCEPT — "Clinical Dossier"
  ------------------------------------------------------------------
  Palette
    --porcelain      #F4F6F4  page background (cool enamel white)
    --porcelain-2    #ECEFEA  card / section tint
    --ink            #10231C  primary text (deep teal-black)
    --ink-60         rgba(16,35,28,.62)
    --ink-40         rgba(16,35,28,.42)
    --teal           #0E4D3C  brand / primary accent (clinical trust)
    --teal-soft      #E7EFE9  tinted surface
    --brass          #B08D57  premium credential accent
    --brass-soft     #F3E9D8
    --line           rgba(16,35,28,.12)  hairline rule

  Type
    Display : Fraunces (serif, optical sizing) — the doctor's name,
              section labels — carries the "private practice" authority.
    Body    : Inter — clean, legible, gets out of the way.
    Utility : IBM Plex Mono — stats, tab indices, meta labels —
              a lab-report / chart precision note.

  Signature element
    A rotated wax-seal "Verification Seal" replacing the generic glass
    pill for certified credentials — echoes a medical board stamp.
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
        transition: "opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
};

// ── Section tab label (dossier-style, not a numbered sequence) ─────────────
const TabLabel = ({ tag, title }) => (
  <div className="flex items-center gap-3 mb-7">
    <span
      className="tab-tag font-mono text-[10px] font-semibold tracking-[0.18em] px-2 py-1 rounded"
      style={{ color: "var(--teal)", background: "var(--teal-soft)" }}
    >
      {tag}
    </span>
    <span className="font-display text-[13px] font-semibold tracking-[0.02em]" style={{ color: "var(--ink)" }}>
      {title}
    </span>
    <span className="flex-1 h-px" style={{ background: "var(--line)" }} />
  </div>
);

// ── Verification Seal (signature element) ───────────────────────────────────
const VerificationSeal = ({ count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="seal-btn relative inline-flex items-center gap-3 pl-1 pr-4 py-1 rounded-full"
    aria-label={`View ${count} verified certificate${count > 1 ? "s" : ""}`}
  >
    <span className="seal-badge relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full seal-ring">
        <circle cx="22" cy="22" r="19.5" fill="none" stroke="var(--brass)" strokeWidth="1" strokeDasharray="2.4 3.2" />
      </svg>
      <ShieldCheck size={16} strokeWidth={2} style={{ color: "var(--brass)" }} />
    </span>
    <span className="text-left">
      <span className="block font-display text-[13px] font-semibold leading-none" style={{ color: "var(--ink)" }}>
        Verified credentials
      </span>
      <span className="block font-mono text-[10px] mt-1 tracking-wide" style={{ color: "var(--ink-40)" }}>
        {count} document{count > 1 ? "s" : ""} on file — view
      </span>
    </span>
    <ChevronRight size={14} style={{ color: "var(--brass)" }} />
  </button>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-[#10231C]/80 backdrop-blur-md" onClick={onClose}>
      <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" style={{ background: "var(--porcelain)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-[#10231C]/60 hover:bg-[#10231C]/80 flex items-center justify-center text-white transition-colors">
          <X size={16} />
        </button>
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-[#10231C]/60 rounded-full p-1">
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
          style={{ minHeight: "320px", background: "var(--porcelain-2)", cursor: zoom > MIN_ZOOM ? (dragState.current.dragging ? "grabbing" : "grab") : "default" }}
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
              <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#10231C]/50 hover:bg-[#10231C]/70 flex items-center justify-center text-white transition-colors">
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#10231C]/50 hover:bg-[#10231C]/70 flex items-center justify-center text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
        <div className="px-5 py-3 flex items-center gap-2 border-t border-b" style={{ background: "var(--teal-soft)", borderColor: "var(--line)" }}>
          <ShieldCheck size={14} style={{ color: "var(--teal)" }} className="flex-shrink-0" />
          <p className="text-sm font-semibold flex-1" style={{ color: "var(--ink)" }}>{active.title}</p>
          {certificates.length > 1 && (
            <span className="font-mono text-[11px] flex-shrink-0" style={{ color: "var(--ink-40)" }}>{activeIndex + 1} / {certificates.length}</span>
          )}
        </div>
        {certificates.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto scroll-hide" style={{ background: "var(--porcelain)" }}>
            {certificates.map((cert, i) => (
              <button key={i} onClick={() => switchTo(i)} className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all" style={{ borderColor: i === activeIndex ? "var(--teal)" : "var(--line)", opacity: i === activeIndex ? 1 : 0.55 }}>
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
  <div style={{ background: "#F4F6F4" }} className="min-h-screen">
    <div className="h-[62vh]" style={{ background: "linear-gradient(160deg,#ECEFEA,#E2E7E1)" }} />
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-6">
      <div className="h-4 w-32 rounded animate-pulse" style={{ background: "#E2E7E1" }} />
      <div className="h-4 w-full rounded animate-pulse" style={{ background: "#E2E7E1" }} />
      <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: "#E2E7E1" }} />
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
      <div style={{ background: "#F4F6F4" }} className="min-h-screen flex flex-col items-center justify-center text-center px-5 py-20">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#ECEFEA", color: "#10231C66" }}>
          <UserRound size={24} />
        </div>
        <p className="text-sm mb-5" style={{ color: "#10231C99" }}>This doctor profile could not be found.</p>
        <Link to="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: "#0E4D3C" }}>
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
    <div style={{ background: "var(--porcelain)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --porcelain: #F4F6F4;
          --porcelain-2: #ECEFEA;
          --ink: #10231C;
          --ink-60: rgba(16,35,28,.62);
          --ink-40: rgba(16,35,28,.42);
          --teal: #0E4D3C;
          --teal-soft: #E7EFE9;
          --brass: #B08D57;
          --brass-soft: #F3E9D8;
          --line: rgba(16,35,28,.12);
        }
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        body, .font-body { font-family: 'Inter', -apple-system, sans-serif; }

        .scroll-hide { scrollbar-width: none; }
        .scroll-hide::-webkit-scrollbar { display: none; }

        .dossier-grain {
          background-image: radial-gradient(circle, rgba(16,35,28,0.05) 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .card-lift { transition: transform .32s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .3s ease; }
        .card-lift:hover { transform: translateY(-5px); border-color: rgba(14,77,60,0.35) !important; box-shadow: 0 22px 44px -20px rgba(16,35,28,0.22); }

        .tab-tag { }

        .seal-btn { transition: transform .25s ease; }
        .seal-btn:hover { transform: translateY(-2px); }
        .seal-btn:hover .seal-ring { animation: sealSpin 5s linear infinite; }
        @keyframes sealSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .seal-badge { background: var(--brass-soft); border: 1px solid rgba(176,141,87,0.4); }

        .spec-chip { transition: transform .22s ease, border-color .22s ease, background .22s ease; }
        .spec-chip:hover { transform: translateY(-2px); border-color: var(--teal) !important; background: var(--teal-soft) !important; }

        .cred-frame { transition: transform .35s cubic-bezier(.22,1,.36,1); }
        .cred-card:hover .cred-frame { transform: scale(1.06); }

        .btn-primary { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
        .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 14px 30px -8px rgba(14,77,60,0.5); }
        .btn-primary:active { transform: scale(0.97); }
        .btn-ghost { transition: background .2s ease, transform .2s ease, border-color .2s ease; }
        .btn-ghost:hover { background: var(--teal-soft); border-color: var(--teal); transform: translateY(-1px); }

        .id-tab {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ════════════════════════ HERO — patient-record card ════════════════════════ */}
      <section className="relative px-5 md:px-12 pt-6 md:pt-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-xs font-semibold transition-colors font-body" style={{ color: "var(--ink-60)" }}>
            <ArrowLeft size={14} /> All Doctors
          </Link>
          <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5" style={{ background: "var(--teal-soft)", border: "1px solid rgba(14,77,60,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
            <span className="font-mono text-[10px] font-semibold tracking-wider" style={{ color: "var(--teal)" }}>AVAILABLE NOW</span>
          </div>
        </div>

        <Reveal>
          <div className="max-w-5xl mx-auto rounded-[28px] overflow-hidden relative" style={{ background: "#fff", border: "1px solid var(--line)" }}>
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              {/* Portrait — ID-card framing */}
              <div className="relative h-72 md:h-auto" style={{ background: "var(--porcelain-2)" }}>
                {doctor.photo ? (
                  <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--ink-40)" }}>
                    <UserRound size={48} strokeWidth={1.2} />
                  </div>
                )}
                <div
                  className="id-tab hidden md:flex absolute top-0 right-0 h-full w-8 items-center justify-center font-mono text-[10px] tracking-[0.25em]"
                  style={{ background: "var(--teal)", color: "var(--teal-soft)" }}
                >
                  RECORD&nbsp;·&nbsp;{firstName.toUpperCase()}
                </div>
              </div>

              {/* Name + meta */}
              <div className="p-7 md:p-10 flex flex-col justify-center dossier-grain">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope size={13} style={{ color: "var(--brass)" }} />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brass)" }}>
                    {doctor.title}
                  </span>
                </div>
                <h1
                  className="font-display font-semibold leading-[0.98] mb-4"
                  style={{ fontSize: "clamp(2.2rem, 5.4vw, 3.6rem)", color: "var(--ink)", letterSpacing: "-0.01em" }}
                >
                  {doctor.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="var(--brass)" color="var(--brass)" />)}
                    <span className="font-body text-sm font-semibold ml-1.5" style={{ color: "var(--ink-60)" }}>4.9 patient rating</span>
                  </div>
                </div>
                {certifiedDegrees.length > 0 && (
                  <div className="mt-3">
                    <VerificationSeal count={certifiedDegrees.length} onClick={() => { setGalleryStartIndex(0); setGalleryOpen(true); }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════ STAT STRIP ════════════════════════ */}
      <div className="px-5 md:px-12 mt-5">
        <Reveal delay={90}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Calendar, value: doctor.yearsExperience || 10, suffix: "+", label: "Years exp." },
              { icon: Users, value: doctor.patientsCount || 500, suffix: "+", label: "Patients" },
              { icon: ShieldCheck, value: certifiedDegrees.length || normalizedDegrees.length || 1, suffix: "", label: "Credentials" },
              { icon: Building2, value: myBranches.length || 1, suffix: "", label: "Location" + (myBranches.length > 1 ? "s" : "") },
            ].map(({ icon: Icon, value, suffix, label }, i) => (
              <div key={i} className="card-lift rounded-2xl px-4 py-5 flex flex-col gap-2" style={{ background: "#fff", border: "1px solid var(--line)" }}>
                <Icon size={15} style={{ color: "var(--teal)" }} strokeWidth={1.75} />
                <p className="font-mono font-semibold text-2xl leading-none" style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}>
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="font-body text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-40)" }}>{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ════════════════════════ PROFILE — Bio + Quote ════════════════════════ */}
      <section className="px-5 md:px-12 py-20 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14">
          {doctor.bio && (
            <div className="md:col-span-3">
              <Reveal>
                <TabLabel tag="A" title="Profile" />
                <p className="font-body leading-relaxed" style={{ fontSize: "clamp(1.02rem, 1.5vw, 1.25rem)", lineHeight: 1.7, color: "var(--ink-60)" }}>
                  {doctor.bio}
                </p>
              </Reveal>
            </div>
          )}

          {doctor.quote && (
            <div className="md:col-span-2">
              <Reveal delay={100}>
                <div
                  className="rounded-2xl p-7 relative overflow-hidden h-full flex flex-col justify-center"
                  style={{ background: "var(--teal)" }}
                >
                  <QuoteIcon size={84} className="absolute -top-2 -right-2 pointer-events-none select-none" style={{ color: "rgba(255,255,255,0.08)" }} fill="currentColor" />
                  <p className="text-lg leading-relaxed relative z-10 font-display" style={{ color: "#F4F6F4", fontStyle: "italic", fontWeight: 400 }}>
                    "{doctor.quote}"
                  </p>
                  <div className="flex items-center gap-3 mt-6 relative z-10">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-semibold flex-shrink-0" style={{ background: "var(--brass)", color: "var(--ink)" }}>
                      {firstName[0]}
                    </div>
                    <p className="font-mono text-[11px] font-medium tracking-wide" style={{ color: "rgba(244,246,244,0.65)" }}>{doctor.name}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════ SPECIALIZATIONS ════════════════════════ */}
      {doctor.specializations?.length > 0 && (
        <section className="pb-20 md:pb-24">
          <div className="max-w-5xl mx-auto px-5 md:px-12">
            <Reveal>
              <TabLabel tag="B" title="Specializations" />
            </Reveal>
          </div>
          <Reveal delay={90}>
            <div className="flex gap-3 overflow-x-auto scroll-hide px-5 md:px-12 pb-2">
              {doctor.specializations.map((spec) => {
                const Icon = getIcon(spec.iconKey);
                return (
                  <div
                    key={spec.label}
                    className="spec-chip flex-shrink-0 flex items-center gap-3 rounded-xl pl-3 pr-5 py-3 border"
                    style={{ background: "#fff", borderColor: "var(--line)" }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <span className="font-body text-sm font-semibold whitespace-nowrap" style={{ color: "var(--ink)" }}>{spec.label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ════════════════════════ CREDENTIALS ════════════════════════ */}
      {normalizedDegrees.length > 0 && (
        <section className="px-5 md:px-12 pb-20 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex items-center justify-between mb-1">
                <TabLabel tag="C" title="Credentials" />
              </div>
              {certifiedDegrees.length > 0 && (
                <p className="font-mono text-[10px] font-semibold mb-6 -mt-4" style={{ color: "var(--brass)" }}>
                  {certifiedDegrees.length} DOCUMENT-VERIFIED · TAP TO INSPECT
                </p>
              )}
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {normalizedDegrees.map((deg, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div
                    onClick={() => {
                      if (!deg.certificateImage) return;
                      const idx = certifiedDegrees.findIndex((d) => d.certificateImage === deg.certificateImage);
                      setGalleryStartIndex(idx >= 0 ? idx : 0);
                      setGalleryOpen(true);
                    }}
                    className={`cred-card card-lift rounded-2xl overflow-hidden border flex items-center gap-4 p-4 ${deg.certificateImage ? "cursor-pointer" : ""}`}
                    style={{ background: "#fff", borderColor: "var(--line)" }}
                  >
                    {deg.certificateImage ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "var(--porcelain-2)" }}>
                        <img src={deg.certificateImage} alt={deg.title} className="cred-frame w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-end justify-center pb-1" style={{ background: "linear-gradient(to top, rgba(16,35,28,0.55), transparent)" }}>
                          <ShieldCheck size={12} style={{ color: "var(--brass-soft)" }} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
                        <GraduationCap size={26} strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold leading-snug" style={{ color: "var(--ink)" }}>{deg.title}</p>
                      {deg.certificateImage && (
                        <p className="font-mono text-[10px] font-medium mt-1.5 flex items-center gap-1" style={{ color: "var(--brass)" }}>
                          VIEW CERTIFICATE <ChevronRight size={11} />
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
        <section className="px-5 md:px-12 pb-20 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <TabLabel tag="D" title="Recognition" />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.achievements.map((item, i) => {
                const Icon = getIcon(item.iconKey);
                return (
                  <Reveal key={i} delay={i * 55}>
                    <div className="card-lift flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: "#fff", border: "1px solid var(--line)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--brass-soft)", color: "var(--brass)" }}>
                        <Icon size={15} strokeWidth={1.75} />
                      </div>
                      <span className="font-body text-sm font-medium leading-snug" style={{ color: "var(--ink-60)" }}>{item.text}</span>
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
        <section className="px-5 md:px-12 pb-20 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <TabLabel tag="E" title={`Find ${firstName}`} />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {myBranches.map((loc, i) => (
                <Reveal key={loc._id || loc.slug} delay={i * 75}>
                  <div className="card-lift rounded-2xl p-5 border" style={{ background: "#fff", borderColor: "var(--line)" }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-body font-bold text-sm" style={{ color: "var(--ink)" }}>{loc.name}</p>
                        <p className="font-mono text-[11px] font-semibold mt-1" style={{ color: "var(--teal)" }}>{loc.area}</p>
                      </div>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
                        <MapPin size={16} strokeWidth={1.75} />
                      </div>
                    </div>
                    {loc.address && <p className="font-body text-xs leading-relaxed mb-3" style={{ color: "var(--ink-40)" }}>{loc.address}</p>}
                    <div className="flex gap-2">
                      {loc.mapLink && (
                        <a href={loc.mapLink} target="_blank" rel="noreferrer" className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold text-white" style={{ background: "var(--teal)" }}>
                          <MapPin size={12} /> Directions
                        </a>
                      )}
                      {loc.phone && (
                        <a href={`tel:${loc.phone}`} className="btn-ghost flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border" style={{ borderColor: "var(--line)", color: "var(--ink-60)" }}>
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
      <section className="px-5 md:px-12 pb-20 md:pb-24">
        <Reveal>
          <div
            className="max-w-5xl mx-auto rounded-[28px] p-8 md:p-14 text-center relative overflow-hidden dossier-grain"
            style={{ background: "var(--teal)" }}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(244,246,244,0.1)" }}>
              <Stethoscope size={18} style={{ color: "var(--brass-soft)" }} />
            </div>
            <h2 className="font-display font-semibold text-xl md:text-3xl mb-3 leading-snug" style={{ color: "#F4F6F4" }}>
              Ready to meet {firstName}?
            </h2>
            <p className="font-body text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "rgba(244,246,244,0.6)" }}>
              Book a consultation and experience personal, professional, painless dental care.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                to="/appointment"
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
                style={{ background: "var(--brass)", color: "var(--ink)" }}
              >
                Book Appointment <ArrowRight size={15} />
              </Link>
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border"
                style={{ borderColor: "rgba(244,246,244,0.3)", color: "#F4F6F4" }}
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