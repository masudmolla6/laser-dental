import { useEffect, useRef, useState } from "react";
import {
  Check, ArrowRight, Phone, MapPin, Star,
  MessageCircle, Zap, Play, Pause, Volume2, VolumeX,
  Maximize, Loader2, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useActiveVideo from "../../../hooks/useActiveVideo";

// ── Tooth SVG (lucide has no tooth icon) ──────────────────────────────────
const ToothIcon = ({ size = 40, opacity = 0.12, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity, ...style }}>
    <path
      d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z"
      fill="currentColor"
    />
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

// ── Premium custom video player ──────────────────────────────────────────────
const HeroVideoPlayer = ({ video, isLoading }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (video) {
      setMuted(video.muted ?? true);
      setPlaying(video.autoplay ?? true);
    }
  }, [video]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  };

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const revealControls = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2600);
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="relative w-full aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 size={28} className="text-sky-400 animate-spin" />
      </div>
    );
  }

  // ── No active video set ──
  if (!video) {
    return (
      <div className="relative w-full aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Sparkles size={28} />
        <p className="text-xs font-medium">No video has been set up yet</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="hero-video-shell relative w-full rounded-[2rem] overflow-hidden group"
      onMouseEnter={revealControls}
      onMouseMove={revealControls}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={revealControls}
      style={{
        boxShadow: "0 30px 70px -15px rgba(14,165,233,0.35), 0 0 0 1px rgba(14,165,233,0.08)",
      }}
    >
      {/* Glow border ring */}
      <div className="hero-video-glow" />

      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="relative w-full h-full object-cover aspect-[4/5] md:aspect-square"
        autoPlay={video.autoplay}
        muted={video.muted}
        loop={video.loop}
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setVideoReady(true);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Top gradient (legibility for badge) */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      {/* Live badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md bg-black/35 border border-white/15">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-white font-bold tracking-wider uppercase">Clinic Tour</span>
      </div>

      {/* Center play button — only visible when paused or hovering */}
      {(!playing || showControls) && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className={`hero-play-btn flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 ${
              playing ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100" : "opacity-100 scale-100"
            }`}
          >
            {playing ? (
              <Pause size={26} className="text-white" fill="white" />
            ) : (
              <Play size={26} className="text-white ml-0.5" fill="white" />
            )}
          </span>
        </button>
      )}

      {/* Bottom controls bar */}
      <div
        className={`absolute bottom-0 inset-x-0 px-4 pb-4 pt-10 transition-opacity duration-300 ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "linear-gradient(to top, rgba(5,12,24,0.85) 0%, transparent 100%)" }}
      >
        {/* Progress bar */}
        <div
          className="relative h-1.5 rounded-full bg-white/25 cursor-pointer mb-3 group/bar"
          onClick={handleSeek}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 to-sky-300"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              {playing ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" className="ml-0.5" />}
            </button>
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <span className="text-[11px] text-white/70 font-medium tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button
            onClick={handleFullscreen}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <Maximize size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Hero component ─────────────────────────────────────────────────────
const Hero = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const [activeVideo, videoLoading] = useActiveVideo();

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

      <style>{`
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

        /* ── Hero video player styling ── */
        @keyframes heroGlowPulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        .hero-video-shell {
          background: #050c18;
        }
        .hero-video-glow {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(135deg, #38bdf8, #818cf8, #38bdf8);
          background-size: 200% 200%;
          opacity: 0.5;
          z-index: -1;
          filter: blur(2px);
          animation: heroGlowPulse 4s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-play-btn {
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.35);
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .hero-play-btn:hover {
          background: rgba(255,255,255,0.26);
          transform: scale(1.08);
        }
      `}</style>

      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
        />

        {/* Floating tooth decorations */}
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

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-10">

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

          {/* ── Left: Video column (replaces the old text block) ── */}
          <div className="flex flex-col gap-5" style={fadeUp(100)}>
            <HeroVideoPlayer video={activeVideo} isLoading={videoLoading} />

            {/* CTA buttons — kept here so the page still converts visitors */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1" style={fadeUp(400)}>
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-200 active:scale-95 group bg-gradient-to-br from-sky-600 to-sky-400 shadow-[0_8px_28px_-4px_rgba(14,165,233,0.5)]"
              >
                Book Appointment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-sm border transition-all duration-200 active:scale-95 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </a>

              <a
                href="tel:+8801745565435"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm border transition-all duration-200 active:scale-95 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-4 pt-1" style={fadeUp(500)}>
              <div className="flex -space-x-2.5">
                {[
                  { bg: "bg-blue-200",    text: "text-blue-800",    label: "RH" },
                  { bg: "bg-emerald-200", text: "text-emerald-800", label: "KA" },
                  { bg: "bg-pink-200",    text: "text-pink-800",    label: "SB" },
                  { bg: "bg-amber-200",   text: "text-amber-800",   label: "NR" },
                ].map((a) => (
                  <div
                    key={a.label}
                    className={`w-9 h-9 rounded-full border-2 border-white dark:border-[#09111f] flex items-center justify-center text-[11px] font-bold ${a.bg} ${a.text}`}
                  >
                    {a.label}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">1,200+</span> happy patients
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Visual column (unchanged) ── */}
          <div className="relative flex justify-center items-center" style={fadeUp(200)}>
            <div className="relative">

              {/* Outer pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full relative">
                  <div className="pulse-ring" style={{ animationDelay: "0s" }} />
                  <div className="pulse-ring" style={{ animationDelay: "1.1s" }} />
                </div>
              </div>

              {/* Main circle */}
              <div
                className="w-72 h-72 md:w-[380px] md:h-[380px] rounded-full flex items-center justify-center relative"
                style={{
                  backgroundImage: `url(${user?.photoURL || "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  boxShadow: "0 0 0 12px rgba(14,165,233,0.08), 0 40px 80px -20px rgba(14,165,233,0.25)",
                }}
              >
                <div className="text-sky-400" style={{ opacity: 0.35 }}>
                  <ToothIcon size={160} opacity={1} />
                </div>
              </div>

              {/* Floating card: Doctor info */}
              <div className="absolute -left-8 md:-left-16 top-10 glass border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3.5 shadow-xl card-hover min-w-[160px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-gradient-to-br from-sky-600 to-indigo-500">
                    Dr
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">Dr. Fatema</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">BDS, FCPS</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Available today</span>
                </div>
              </div>

              {/* Floating card: Laser */}
              <div className="absolute -right-6 md:-right-14 top-16 glass border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 shadow-xl card-hover">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={12} className="text-sky-500" strokeWidth={2.5} />
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Technology</p>
                </div>
                <p className="text-sm font-bold text-sky-600 dark:text-sky-400">Laser Assisted</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Painless treatments</p>
              </div>

              {/* Floating card: Rating */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass border border-white/60 dark:border-white/10 rounded-2xl px-5 py-3 shadow-xl card-hover">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white font-display">4.9</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />
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
                { target: 15,   suffix: "+", label: "Years of Excellence", sub: "Trusted since 2010" },
                { target: 1200, suffix: "+", label: "Happy Patients",      sub: "Across Dhaka" },
                { target: 98,   suffix: "%", label: "Success Rate",        sub: "Clinically verified" },
                { target: 2,    suffix: "",  label: "Locations",           sub: "Dhaka, Bangladesh" },
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
            { branch: "Branch 1", area: "Mirpur-10, Dhaka", time: "Sat – Thu: 10am – 9pm" },
            { branch: "Branch 2", area: "Uttara, Dhaka",    time: "Sat – Thu: 3pm – 9pm" },
          ].map((loc) => (
            <div
              key={loc.branch}
              className="flex-1 glass border border-white/60 dark:border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm card-hover"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white bg-gradient-to-br from-sky-600 to-indigo-500">
                <MapPin size={18} />
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
