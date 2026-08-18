import { useState } from "react";
import { Link } from "react-router-dom";
import { getBranchColors } from "../../../utils/branchColors";
import useBranches from "../../../hooks/useBranches";

// ── Icons ──────────────────────────────────────────────────────────────────
const LocationIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const PhoneIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const NavigateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Skeleton (shown while branches load) ────────────────────────────────────
const LocationsSkeleton = () => (
  <div className="min-h-screen bg-[#f8fafc] py-20 px-5 md:px-10">
    <div className="max-w-5xl mx-auto flex flex-col gap-10">
      <div className="w-72 h-10 bg-slate-200 rounded-xl mx-auto animate-pulse" />
      {[1, 2].map((i) => (
        <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100">
          <div className="h-72 lg:h-auto min-h-[360px] bg-slate-100 animate-pulse" />
          <div className="bg-white p-8 flex flex-col gap-4">
            <div className="w-1/2 h-7 bg-slate-200 rounded animate-pulse" />
            <div className="w-full h-20 bg-slate-100 rounded-xl animate-pulse" />
            <div className="w-full h-20 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Empty state (no active branches) ────────────────────────────────────────
const LocationsEmpty = () => (
  <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-24 px-5">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
        <LocationIcon size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">No branches available right now</h2>
      <p className="text-gray-400 text-sm mb-6">
        Please call us directly and we'll guide you to the nearest clinic.
      </p>
      <a
        href="tel:01745565435"
        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
      >
        <PhoneIcon /> 01745565435
      </a>
    </div>
  </div>
);

// ── Map placeholder (shown when no real embed link is set) ─────────────────
const MapPlaceholder = ({ branch, colors, onNavigate }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${colors.colorBg} 0%, #f8fafc 100%)` }}
  >
    <div className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `linear-gradient(${colors.color} 1px, transparent 1px), linear-gradient(90deg, ${colors.color} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-px opacity-20" style={{ background: colors.color }} />
      <div className="absolute w-px h-full opacity-20" style={{ background: colors.color }} />
    </div>
    <div className="relative z-10 flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${colors.color}, ${colors.colorDark})` }}
        >
          <LocationIcon size={28} />
        </div>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: colors.colorDark }}
        />
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: colors.color }}
        />
      </div>
      <div className="text-center mt-2">
        <p className="font-bold text-gray-800 text-sm">{branch.name}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: colors.color }}>
          {branch.area}, {branch.city || "Dhaka"}
        </p>
        {branch.landmark && <p className="text-xs text-gray-400 mt-1">{branch.landmark}</p>}
      </div>
    </div>
    {branch.mapLink && (
      <button
        onClick={onNavigate}
        className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-lg transition-all active:scale-95 hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${colors.color}, ${colors.colorDark})` }}
      >
        <NavigateIcon />
        Open in Google Maps
      </button>
    )}
  </div>
);

// ── Single branch section ──────────────────────────────────────────────────
const BranchSection = ({ branch, reversed }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const colors = getBranchColors(branch.colorScheme);
  const useEmbed = Boolean(branch.mapEmbedSrc);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100"
      style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}>

      {/* Map side */}
      <div className={`relative h-72 lg:h-auto min-h-[360px] ${reversed ? "lg:order-2" : ""}`}>
        {useEmbed ? (
          <>
            {!mapLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
              </div>
            )}
            <iframe
              title={`${branch.name} Map`}
              src={branch.mapEmbedSrc}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />
          </>
        ) : (
          <MapPlaceholder
            branch={branch}
            colors={colors}
            onNavigate={() => window.open(branch.mapLink, "_blank")}
          />
        )}

        {/* Branch badge overlaid on map */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md text-white"
            style={{ background: `linear-gradient(135deg, ${colors.color}, ${colors.colorDark})` }}
          >
            {branch.name}
          </span>
        </div>
      </div>

      {/* Info side */}
      <div className={`bg-white p-8 flex flex-col gap-6 ${reversed ? "lg:order-1" : ""}`}>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
            <span className="text-xs font-semibold text-emerald-600">Open Now</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">{branch.name}</h2>
          <p className="font-semibold mt-0.5" style={{ color: colors.color }}>
            {branch.area}, {branch.city || "Dhaka"}
          </p>
        </div>

        {/* Address */}
        {branch.address && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: colors.colorBg, color: colors.color }}>
              <LocationIcon size={17} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Address</p>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{branch.address}</p>
              {branch.landmark && <p className="text-xs text-gray-400 mt-1">{branch.landmark}</p>}
            </div>
          </div>
        )}

        {/* Schedule */}
        {branch.hours?.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: colors.colorBg, color: colors.color }}>
              <ClockIcon size={17} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Schedule</p>
              <div className="flex flex-col gap-2">
                {branch.hours.map((s, i) => (
                  <div key={i} className="rounded-xl p-3 flex flex-col gap-1.5"
                    style={{ background: colors.colorBg + "99" }}>
                    <p className="text-xs font-semibold text-gray-600">{s.label || s.days}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.morning && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: colors.color + "18", color: colors.colorDark }}>
                          🌅 {s.morning}
                        </span>
                      )}
                      {s.evening && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: colors.color + "18", color: colors.colorDark }}>
                          🌙 {s.evening}
                        </span>
                      )}
                      {/* Fallback for the simple { days, time } shape used elsewhere */}
                      {!s.morning && !s.evening && s.time && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: colors.color + "18", color: colors.colorDark }}>
                          🕐 {s.time}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {branch.closedDays?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400 font-medium">
                      {branch.closedDays.join(", ")}: Closed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: colors.colorBg, color: colors.color }}>
            <PhoneIcon size={17} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Phone</p>
            <a href={`tel:${branch.phone}`}
              className="text-base font-bold hover:underline"
              style={{ color: colors.color }}>
              {branch.phone}
            </a>
          </div>
        </div>

        {/* Amenities */}
        {branch.amenities?.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Facilities</p>
            <div className="flex flex-wrap gap-2">
              {branch.amenities.map((a) => (
                <span key={a}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{ borderColor: colors.color + "30", color: colors.colorDark, background: colors.colorBg + "88" }}>
                  <span className="text-emerald-500"><CheckIcon /></span>
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transport */}
        {branch.transport?.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Getting There</p>
            <div className="flex flex-wrap gap-2">
              {branch.transport.map((t) => (
                <span key={t}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          <a href={branch.mapLink || "#"} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90 group"
            style={{
              background: `linear-gradient(135deg, ${colors.color}, ${colors.colorDark})`,
              boxShadow: `0 4px 16px ${colors.color}40`,
            }}>
            <NavigateIcon />
            Get Directions
            <span className="group-hover:translate-x-0.5 transition-transform"><ArrowRight /></span>
          </a>
          <a href={`https://wa.me/${branch.whatsapp || branch.phone}`} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-emerald-700 text-sm font-bold transition-all active:scale-95 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const Locations = () => {
  const [branches, isLoading] = useBranches();

  if (isLoading) return <LocationsSkeleton />;
  if (!branches || branches.length === 0) return <LocationsEmpty />;

  const branchCountLabel = branches.length === 1 ? "Our Location" : `Our ${branches.length} Locations`;
  const primaryPhone = branches[0]?.phone || "01745565435";

  return (
    <div className="min-h-screen bg-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .shimmer {
          background: linear-gradient(90deg, #0284c7 0%, #8b5cf6 50%, #0284c7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-20 pb-16 px-5 md:px-10"
        style={{ background: "linear-gradient(160deg, #09142d 0%, #0c2340 60%, #0f2d52 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-sky-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Find Us</span>
            <div className="w-8 h-px bg-sky-400" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            <span className="shimmer">{branchCountLabel}</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            One doctor, {branches.length} clinic{branches.length !== 1 ? "s" : ""} — all in Dhaka. Visit whichever branch is most convenient for you.
          </p>

          {/* Branch pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {branches.map((b) => {
              const colors = getBranchColors(b.colorScheme);
              return (
                <a key={b._id} href={`#${b.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all"
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: colors.color }} />
                  {b.name} · {b.area}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Quick stat strip ─────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 -mt-6 relative z-10 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            {[
              { icon: "🏥", value: String(branches.length), label: `Clinic${branches.length !== 1 ? "s" : ""} in Dhaka` },
              { icon: "👨‍⚕️", value: "1", label: "Dedicated Doctor" },
              { icon: "📅", value: "6 days", label: "Open per week" },
              { icon: "⚡", value: "30 min", label: "Appointment confirm" },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center px-4 py-1">
                <span className="text-xl mb-1">{icon}</span>
                <p className="font-display text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Branch sections ──────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          {branches.map((branch, i) => (
            <div key={branch._id} id={branch.slug}>
              <BranchSection branch={branch} reversed={i % 2 !== 0} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl px-8 py-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #09142d 0%, #0c2340 100%)" }}>
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400 mb-3">
                Ready to visit?
              </p>
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                Book your slot before you arrive
              </h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                Walk-ins are welcome, but booking ahead ensures your preferred time slot is reserved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/appointment"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 group"
                  style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)", boxShadow: "0 6px 24px rgba(14,165,233,0.45)" }}>
                  Book Appointment
                  <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
                </Link>
                <a href={`tel:${primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm border border-white/20 text-white/80 hover:bg-white/10 transition-all active:scale-95">
                  <PhoneIcon />
                  {primaryPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Locations;
