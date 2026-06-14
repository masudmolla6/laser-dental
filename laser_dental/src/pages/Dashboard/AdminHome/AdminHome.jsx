import { useState, useEffect, useRef } from "react";
import {
  Images, CalendarCheck, Star, TrendingUp, TrendingDown,
  Clock, CheckCircle2, XCircle, AlertCircle, Sun, Moon,
  LayoutDashboard, RefreshCw, ChevronRight, Loader2,
  MessageSquare, Eye, Smile, Activity
} from "lucide-react";
import useAppointmentsSecure from "../../../hooks/useAppointmentsSecure";
import useReviewsSecure from "../../../hooks/useReviewsSecure";
import useServicesSecure from "../../../hooks/useServicesSecure";
import useGallerySecure from "../../../hooks/useGallerySecure";
import useBannersSecure from "../../../hooks/useBannersSecure";

// ── Theme toggle ──────────────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("admin-theme") === "dark");
  const toggle = () => setDark((p) => {
    const next = !p;
    localStorage.setItem("admin-theme", next ? "dark" : "light");
    return next;
  });
  return { dark, toggle };
};

// ── Animated number ───────────────────────────────────────────────────────
const AnimNum = ({ value, suffix = "", duration = 1400 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => { started.current = false; setDisplay(0); }, [value]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.floor(e * value));
          if (p < 1) requestAnimationFrame(animate);
          else setDisplay(value);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
};

// ── Stat card ─────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, suffix = "", sub, trend, color, dark }) => {
  const colors = {
    sky:     { grad: "from-sky-500 to-cyan-400",      ring: "ring-sky-200"      },
    violet:  { grad: "from-violet-500 to-purple-400", ring: "ring-violet-200"   },
    emerald: { grad: "from-emerald-500 to-teal-400",  ring: "ring-emerald-200"  },
    amber:   { grad: "from-amber-500 to-orange-400",  ring: "ring-amber-200"    },
    rose:    { grad: "from-rose-500 to-pink-400",     ring: "ring-rose-200"     },
    indigo:  { grad: "from-indigo-500 to-blue-400",   ring: "ring-indigo-200"   },
  };
  const c = colors[color] || colors.sky;
  return (
    <div className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default ring-1 ${
      dark ? "bg-slate-800 ring-slate-700 hover:shadow-slate-900/40" : `bg-white ${c.ring} hover:shadow-slate-200/80`
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${c.grad} shadow-lg`}>
          <Icon size={19} strokeWidth={1.75} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
            trend >= 0
              ? dark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              : dark ? "bg-red-900/40 text-red-400"         : "bg-red-50 text-red-500"
          }`}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className={`text-3xl font-black leading-none mb-1 ${dark ? "text-white" : "text-slate-900"}`}
        style={{ letterSpacing: "-0.04em" }}>
        <AnimNum value={typeof value === "number" ? value : 0} suffix={suffix} />
      </p>
      <p className={`text-xs font-semibold mb-0.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>{label}</p>
      {sub && <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{sub}</p>}
    </div>
  );
};

// ── Section header ────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, action, dark }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? "bg-slate-700 text-sky-400" : "bg-sky-50 text-sky-600"}`}>
        <Icon size={14} strokeWidth={2} />
      </div>
      <h2 className={`font-bold text-sm ${dark ? "text-white" : "text-slate-800"}`}>{title}</h2>
    </div>
    {action}
  </div>
);

// ── Status pill ───────────────────────────────────────────────────────────
const Pill = ({ status }) => {
  const map = {
    pending:   { cls: "bg-amber-100 text-amber-700",     label: "Pending"   },
    confirmed: { cls: "bg-sky-100 text-sky-700",         label: "Confirmed" },
    completed: { cls: "bg-emerald-100 text-emerald-700", label: "Completed" },
    cancelled: { cls: "bg-red-100 text-red-600",         label: "Cancelled" },
    published: { cls: "bg-emerald-100 text-emerald-700", label: "Published" },
    draft:     { cls: "bg-slate-100 text-slate-500",     label: "Draft"     },
  };
  const s = map[status] || { cls: "bg-slate-100 text-slate-500", label: status };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${s.cls}`}>{s.label}</span>;
};

// ── Stars ─────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={10}
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        color={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

// ── Main AdminHome ────────────────────────────────────────────────────────
const AdminHome = () => {
  const { dark, toggle } = useTheme();
  const [greeting, setGreeting] = useState("");

  // ── Custom hooks — unique variable names ─────────────────────────────
  const [reviews,      reviewsLoading,      reviewsRefetch     ] = useReviewsSecure();
  const [appointments, appointmentsLoading, appointmentsRefetch] = useAppointmentsSecure();
  const [services,     servicesLoading,     servicesRefetch    ] = useServicesSecure();
  const [gallery,      galleryLoading,      galleryRefetch     ] = useGallerySecure();
  const [banners,      bannersLoading,      bannersRefetch     ] = useBannersSecure();

  // ── Safe arrays ───────────────────────────────────────────────────────
  const safeReviews      = Array.isArray(reviews)      ? reviews      : [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeServices     = Array.isArray(services)     ? services     : [];
  const safeGallery      = Array.isArray(gallery)      ? gallery      : [];
  const safeBanners      = Array.isArray(banners)      ? banners      : [];

  const loading = reviewsLoading || appointmentsLoading || servicesLoading || galleryLoading || bannersLoading;

  const refetchAll = () => {
    reviewsRefetch();
    appointmentsRefetch();
    servicesRefetch();
    galleryRefetch();
    bannersRefetch();
  };

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12)      setGreeting("Good Morning");
    else if (h < 17) setGreeting("Good Afternoon");
    else             setGreeting("Good Evening");
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────
  const galPublished  = safeGallery.filter((g) => g.status === "published").length;
  const galDraft      = safeGallery.filter((g) => g.status === "draft").length;

  const apptPending   = safeAppointments.filter((a) => a.status === "pending").length;
  const apptConfirmed = safeAppointments.filter((a) => a.status === "confirmed").length;
  const apptCompleted = safeAppointments.filter((a) => a.status === "completed").length;
  const apptCancelled = safeAppointments.filter((a) => a.status === "cancelled").length;

  const avgRating = safeReviews.length
    ? (safeReviews.reduce((s, r) => s + (r.rating || 0), 0) / safeReviews.length).toFixed(1)
    : 0;

  const today      = new Date().toDateString();
  const todayAppts = safeAppointments.filter((a) => {
    const d = a.date || a.appointmentDate || a.createdAt;
    return d && new Date(d).toDateString() === today;
  }).length;

  const recentAppts   = [...safeAppointments]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  const recentReviews = [...safeReviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-900" : "bg-slate-100"}`}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay: 60ms;  }
        .fade-up-2 { animation-delay: 120ms; }
        .fade-up-3 { animation-delay: 180ms; }
        .fade-up-4 { animation-delay: 240ms; }
        .fade-up-5 { animation-delay: 300ms; }
        .fade-up-6 { animation-delay: 360ms; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

        {/* ── Top bar ── */}
        <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={14} className={dark ? "text-sky-400" : "text-sky-500"} />
              <span className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-sky-400" : "text-sky-500"}`}>
                Admin Dashboard
              </span>
            </div>
            <h1 className={`text-2xl md:text-3xl font-black ${dark ? "text-white" : "text-slate-800"}`}
              style={{ letterSpacing: "-0.02em" }}>
              {greeting}, Admin 👋
            </h1>
            <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-400"}`}>
              Here's what's happening with Laser Dental Point today.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={refetchAll}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                dark
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={toggle}
              className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
                dark
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title={dark ? "Switch to Light" : "Switch to Dark"}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className={`rounded-2xl py-10 flex items-center justify-center gap-3 ${dark ? "bg-slate-800" : "bg-white"}`}>
            <Loader2 size={22} className="animate-spin text-sky-500" />
            <p className={`text-sm font-medium ${dark ? "text-slate-400" : "text-slate-400"}`}>Loading dashboard data...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* ── Overview stats ── */}
            <div className="fade-up fade-up-1">
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Overview</p>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard icon={Images}        label="Total Cases"    value={safeGallery.length}      sub="All case studies"      color="sky"     dark={dark} trend={5}  />
                <StatCard icon={Eye}           label="Published"      value={galPublished}            sub="Live on website"       color="emerald" dark={dark}            />
                <StatCard icon={CalendarCheck} label="Appointments"   value={safeAppointments.length} sub="All time"             color="violet"  dark={dark} trend={12} />
                <StatCard icon={Clock}         label="Pending"        value={apptPending}             sub="Needs attention"       color="amber"   dark={dark}            />
                <StatCard icon={Star}          label="Avg Rating"     value={parseFloat(avgRating)}   suffix="/5" sub={`${safeReviews.length} reviews`} color="rose" dark={dark} />
                <StatCard icon={Smile}         label="Today"          value={todayAppts}              sub="Appointments today"    color="indigo"  dark={dark}            />
              </div>
            </div>

            {/* ── Extra counts row (Services + Banners) ── */}
            <div className="fade-up fade-up-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Activity}      label="Services"       value={safeServices.length}     sub="Active services"       color="emerald" dark={dark} />
                <StatCard icon={Images}        label="Banners"        value={safeBanners.length}      sub="Active banners"        color="indigo"  dark={dark} />
                <StatCard icon={Eye}           label="Gallery Drafts" value={galDraft}               sub="Unpublished cases"     color="amber"   dark={dark} />
                <StatCard icon={Star}          label="Total Reviews"  value={safeReviews.length}      sub="Patient feedback"      color="rose"    dark={dark} />
              </div>
            </div>

            {/* ── Appointment status breakdown ── */}
            <div className="fade-up fade-up-2">
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Appointments Breakdown</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Pending",   value: apptPending,   icon: AlertCircle,  color: "text-amber-500",   bg: dark ? "bg-amber-900/20"  : "bg-amber-50",  ring: dark ? "ring-amber-800"  : "ring-amber-200"   },
                  { label: "Confirmed", value: apptConfirmed, icon: CheckCircle2, color: "text-sky-500",     bg: dark ? "bg-sky-900/20"    : "bg-sky-50",    ring: dark ? "ring-sky-800"    : "ring-sky-200"     },
                  { label: "Completed", value: apptCompleted, icon: Activity,     color: "text-emerald-500", bg: dark ? "bg-emerald-900/20": "bg-emerald-50", ring: dark ? "ring-emerald-800": "ring-emerald-200" },
                  { label: "Cancelled", value: apptCancelled, icon: XCircle,      color: "text-red-500",     bg: dark ? "bg-red-900/20"    : "bg-red-50",    ring: dark ? "ring-red-800"    : "ring-red-200"     },
                ].map(({ label, value, icon: Icon, color, bg, ring }) => (
                  <div key={label} className={`rounded-2xl p-5 flex items-center gap-4 ring-1 transition-all hover:-translate-y-0.5 cursor-default ${bg} ${ring}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${dark ? "bg-slate-800/60" : "bg-white"}`}>
                      <Icon size={17} className={color} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className={`text-2xl font-black leading-none ${dark ? "text-white" : "text-slate-900"}`} style={{ letterSpacing: "-0.04em" }}>
                        <AnimNum value={value} />
                      </p>
                      <p className={`text-xs font-semibold mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Gallery + Reviews split ── */}
            <div className="fade-up fade-up-3 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Gallery mini stats */}
              <div className={`rounded-2xl p-6 ring-1 ${dark ? "bg-slate-800 ring-slate-700" : "bg-white ring-slate-200"}`}>
                <SectionHeader icon={Images} title="Gallery Overview" dark={dark} />
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Total Cases",  value: safeGallery.length,                                 color: dark ? "bg-slate-700"       : "bg-slate-50"  },
                    { label: "Published",    value: galPublished,                                        color: dark ? "bg-emerald-900/30"  : "bg-emerald-50"},
                    { label: "Drafts",       value: galDraft,                                            color: dark ? "bg-amber-900/30"    : "bg-amber-50"  },
                    { label: "With Images",  value: safeGallery.filter((g) => g.images?.main).length,   color: dark ? "bg-sky-900/30"      : "bg-sky-50"    },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`rounded-xl p-3.5 ${color}`}>
                      <p className={`text-xl font-black ${dark ? "text-white" : "text-slate-800"}`} style={{ letterSpacing: "-0.03em" }}>
                        <AnimNum value={value} />
                      </p>
                      <p className={`text-[11px] font-medium mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1.5">
                    <span className={dark ? "text-slate-400" : "text-slate-500"}>Published rate</span>
                    <span className={dark ? "text-emerald-400" : "text-emerald-600"}>
                      {safeGallery.length ? Math.round((galPublished / safeGallery.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                      style={{ width: safeGallery.length ? `${(galPublished / safeGallery.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Reviews overview */}
              <div className={`rounded-2xl p-6 ring-1 ${dark ? "bg-slate-800 ring-slate-700" : "bg-white ring-slate-200"}`}>
                <SectionHeader icon={Star} title="Reviews Overview" dark={dark} />
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${
                    dark ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-600"
                  }`} style={{ letterSpacing: "-0.04em" }}>
                    {avgRating}
                  </div>
                  <div>
                    <Stars rating={parseFloat(avgRating)} />
                    <p className={`text-xs font-semibold mt-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Average rating</p>
                    <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>From {safeReviews.length} reviews</p>
                  </div>
                </div>
                {[5,4,3,2,1].map((star) => {
                  const count = safeReviews.filter((r) => Math.round(r.rating) === star).length;
                  const pct   = safeReviews.length ? (count / safeReviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-[10px] font-bold w-3 text-right ${dark ? "text-slate-400" : "text-slate-500"}`}>{star}</span>
                      <Star size={9} fill="#f59e0b" color="#f59e0b" />
                      <div className={`flex-1 h-1.5 rounded-full ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
                        <div className="h-1.5 rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-[10px] w-5 text-right ${dark ? "text-slate-500" : "text-slate-400"}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Recent appointments ── */}
            <div className={`fade-up fade-up-4 rounded-2xl ring-1 overflow-hidden ${dark ? "bg-slate-800 ring-slate-700" : "bg-white ring-slate-200"}`}>
              <div className={`px-6 py-4 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
                <SectionHeader
                  icon={CalendarCheck}
                  title="Recent Appointments"
                  dark={dark}
                  action={
                    <span className={`text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${dark ? "text-sky-400 hover:text-sky-300" : "text-sky-500 hover:text-sky-600"}`}>
                      View all <ChevronRight size={11} />
                    </span>
                  }
                />
              </div>
              {recentAppts.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-2">
                  <CalendarCheck size={28} className={dark ? "text-slate-600" : "text-slate-300"} />
                  <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No appointments yet</p>
                </div>
              ) : (
                <div>
                  <div className={`grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider ${
                    dark ? "text-slate-500 bg-slate-800/50" : "text-slate-400 bg-slate-50"
                  }`}>
                    <span>Patient</span><span>Service</span><span>Date</span><span>Status</span>
                  </div>
                  {recentAppts.map((appt, idx) => (
                    <div
                      key={appt._id || idx}
                      className={`grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3.5 items-center transition-colors ${
                        idx !== recentAppts.length - 1 ? (dark ? "border-b border-slate-700/60" : "border-b border-slate-100") : ""
                      } ${dark ? "hover:bg-slate-700/40" : "hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          dark ? "bg-slate-700 text-sky-400" : "bg-sky-50 text-sky-600"
                        }`}>
                          {(appt.patientName || appt.name || "?")[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-slate-800"}`}>
                            {appt.patientName || appt.name || "—"}
                          </p>
                          <p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>
                            {appt.phone || appt.email || ""}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xs font-medium truncate ${dark ? "text-slate-300" : "text-slate-600"}`}>
                        {appt.service || appt.treatment || "—"}
                      </p>
                      <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {appt.date || appt.appointmentDate
                          ? new Date(appt.date || appt.appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                          : "—"}
                      </p>
                      <Pill status={appt.status || "pending"} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Recent reviews ── */}
            <div className="fade-up fade-up-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? "bg-slate-700 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
                    <MessageSquare size={14} strokeWidth={2} />
                  </div>
                  <h2 className={`font-bold text-sm ${dark ? "text-white" : "text-slate-800"}`}>Recent Reviews</h2>
                </div>
                <span className={`text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${dark ? "text-sky-400 hover:text-sky-300" : "text-sky-500 hover:text-sky-600"}`}>
                  View all <ChevronRight size={11} />
                </span>
              </div>
              {recentReviews.length === 0 ? (
                <div className={`rounded-2xl py-12 flex flex-col items-center gap-2 ring-1 ${dark ? "bg-slate-800 ring-slate-700" : "bg-white ring-slate-200"}`}>
                  <Star size={28} className={dark ? "text-slate-600" : "text-slate-300"} />
                  <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No reviews yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {recentReviews.map((rev, idx) => (
                    <div key={rev._id || idx} className={`rounded-2xl p-5 ring-1 transition-all hover:-translate-y-0.5 cursor-default ${
                      dark ? "bg-slate-800 ring-slate-700" : "bg-white ring-slate-200"
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                          dark ? "bg-slate-700 text-amber-400" : "bg-amber-50 text-amber-600"
                        }`}>
                          {(rev.patientName || rev.name || "?")[0]?.toUpperCase()}
                        </div>
                        <Stars rating={rev.rating || 0} />
                      </div>
                      <p className={`text-sm font-semibold mb-1 ${dark ? "text-white" : "text-slate-800"}`}>
                        {rev.patientName || rev.name || "Anonymous"}
                      </p>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {rev.comment || rev.review || "No comment."}
                      </p>
                      {rev.createdAt && (
                        <p className={`text-[10px] mt-2.5 ${dark ? "text-slate-600" : "text-slate-300"}`}>
                          {new Date(rev.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Quick actions ── */}
            <div className="fade-up fade-up-6">
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Quick Actions</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Add Case Study",    sub: "Upload before/after",  icon: Images,        color: "from-sky-500 to-cyan-400",      href: "/dashboard/addPicture"         },
                  { label: "View Appointments", sub: "Manage bookings",       icon: CalendarCheck, color: "from-violet-500 to-purple-400", href: "/dashboard/manageAppointments" },
                  { label: "Manage Gallery",    sub: "Edit published cases",  icon: Eye,           color: "from-emerald-500 to-teal-400",  href: "/dashboard/manageGallery"      },
                  { label: "View Reviews",      sub: "Patient feedback",      icon: Star,          color: "from-amber-500 to-orange-400",  href: "/dashboard/manageReviews"      },
                ].map(({ label, sub, icon: Icon, color, href }) => (
                  <a key={label} href={href} className={`rounded-2xl p-5 flex flex-col gap-3 ring-1 transition-all hover:-translate-y-1 hover:shadow-lg group ${
                    dark ? "bg-slate-800 ring-slate-700 hover:shadow-slate-900/50" : "bg-white ring-slate-200 hover:shadow-slate-200"
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color} shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>{label}</p>
                      <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
