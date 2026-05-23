import React, { useState } from "react";
import { Link } from "react-router-dom";

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
const BusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M7 18v-4m10 4v-4"/>
  </svg>
);
const ParkingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/>
  </svg>
);
const WheelchairIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="4" r="2"/><path d="M9 9h5l2 7H8"/><path d="M8 16a4 4 0 108 0"/>
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const BRANCHES = [
  {
    id: "branch1",
    label: "Branch 1",
    name: "Laser Dental Point",
    area: "Location TBD",
    fullAddress: "Full address here, Dhaka — 1XXX, Bangladesh",
    phone: "01745565435",
    whatsapp: "8801745565435",
    // Replace with real Google Maps embed src
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.2!2d90.4!3d23.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzAwLjAiTiA5MMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890",
    mapLink: "https://maps.google.com/?q=Dhaka+Bangladesh",
    color: "#0ea5e9",
    colorDark: "#0284c7",
    colorBg: "#e0f2fe",
    schedule: [
      { label: "Saturday – Thursday", morning: "10:00 AM – 2:00 PM", evening: "5:00 PM – 9:00 PM" },
    ],
    closed: "Friday",
    transport: ["Bus stop nearby", "Easy rickshaw access"],
    amenities: ["Free parking", "Wheelchair accessible", "AC waiting area"],
    landmark: "Near [Landmark TBD]",
  },
  {
    id: "branch2",
    label: "Branch 2",
    name: "Laser Dental Point",
    area: "Location TBD",
    fullAddress: "Full address here, Dhaka — 1XXX, Bangladesh",
    phone: "01745565435",
    whatsapp: "8801745565435",
    // Replace with real Google Maps embed src
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.2!2d90.35!3d23.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzAwLjAiTiA5MMKwMjEnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567891",
    mapLink: "https://maps.google.com/?q=Dhaka+Bangladesh",
    color: "#8b5cf6",
    colorDark: "#7c3aed",
    colorBg: "#ede9fe",
    schedule: [
      { label: "Saturday – Thursday", evening: "3:00 PM – 9:00 PM" },
    ],
    closed: "Friday",
    transport: ["Bus stop 5 min walk", "CNG available"],
    amenities: ["Street parking", "Ground floor", "AC waiting area"],
    landmark: "Near [Landmark TBD]",
  },
];

// ── Map placeholder (shown when real embed is unavailable) ─────────────────
const MapPlaceholder = ({ branch, onNavigate }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${branch.colorBg} 0%, #f8fafc 100%)` }}
  >
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `linear-gradient(${branch.color} 1px, transparent 1px), linear-gradient(90deg, ${branch.color} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
    {/* Roads */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-px opacity-20" style={{ background: branch.color }} />
      <div className="absolute w-px h-full opacity-20" style={{ background: branch.color }} />
    </div>
    {/* Pin */}
    <div className="relative z-10 flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${branch.color}, ${branch.colorDark})` }}
        >
          <LocationIcon size={28} />
        </div>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: branch.colorDark }}
        />
        {/* Pulse rings */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: branch.color }}
        />
      </div>
      <div className="text-center mt-2">
        <p className="font-bold text-gray-800 text-sm">{branch.name}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color: branch.color }}>{branch.area}</p>
        <p className="text-xs text-gray-400 mt-1">{branch.landmark}</p>
      </div>
    </div>
    {/* Navigate button */}
    <button
      onClick={onNavigate}
      className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-lg transition-all active:scale-95 hover:opacity-90"
      style={{ background: `linear-gradient(135deg, ${branch.color}, ${branch.colorDark})` }}
    >
      <NavigateIcon />
      Open in Google Maps
    </button>
    <p className="text-xs text-gray-400 relative z-10">
      Replace mapSrc with your Google Maps embed link
    </p>
  </div>
);

// ── Single branch section ──────────────────────────────────────────────────
const BranchSection = ({ branch, reversed }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useEmbed, setUseEmbed] = useState(false); // set true when real mapSrc is added

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100`}
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
              title={`${branch.label} Map`}
              src={branch.mapSrc}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />
          </>
        ) : (
          <MapPlaceholder branch={branch} onNavigate={() => window.open(branch.mapLink, "_blank")} />
        )}

        {/* Branch badge overlaid on map */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md text-white"
            style={{ background: `linear-gradient(135deg, ${branch.color}, ${branch.colorDark})` }}
          >
            {branch.label}
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
          <p className="font-semibold mt-0.5" style={{ color: branch.color }}>{branch.area}</p>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: branch.colorBg, color: branch.color }}>
            <LocationIcon size={17} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Address</p>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{branch.fullAddress}</p>
            <p className="text-xs text-gray-400 mt-1">{branch.landmark}</p>
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: branch.colorBg, color: branch.color }}>
            <ClockIcon size={17} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Schedule</p>
            <div className="flex flex-col gap-2">
              {branch.schedule.map((s, i) => (
                <div key={i} className="rounded-xl p-3 flex flex-col gap-1.5"
                  style={{ background: branch.colorBg + "99" }}>
                  <p className="text-xs font-semibold text-gray-600">{s.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.morning && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: branch.color + "18", color: branch.colorDark }}>
                        🌅 {s.morning}
                      </span>
                    )}
                    {s.evening && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: branch.color + "18", color: branch.colorDark }}>
                        🌙 {s.evening}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400 font-medium">{branch.closed}: Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: branch.colorBg, color: branch.color }}>
            <PhoneIcon size={17} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Phone</p>
            <a href={`tel:${branch.phone}`}
              className="text-base font-bold hover:underline"
              style={{ color: branch.color }}>
              {branch.phone}
            </a>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Facilities</p>
          <div className="flex flex-wrap gap-2">
            {branch.amenities.map((a) => (
              <span key={a}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{ borderColor: branch.color + "30", color: branch.colorDark, background: branch.colorBg + "88" }}>
                <span className="text-emerald-500"><CheckIcon /></span>
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          <a href={branch.mapLink} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90 group"
            style={{
              background: `linear-gradient(135deg, ${branch.color}, ${branch.colorDark})`,
              boxShadow: `0 4px 16px ${branch.color}40`,
            }}>
            <NavigateIcon />
            Get Directions
            <span className="group-hover:translate-x-0.5 transition-transform"><ArrowRight /></span>
          </a>
          <a href={`https://wa.me/${branch.whatsapp}`} target="_blank" rel="noreferrer"
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
  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
            Our <span className="shimmer">Two Locations</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            One doctor, two clinics — both in Dhaka. Visit whichever branch is most convenient for you.
          </p>

          {/* Branch pills */}
          <div className="flex justify-center gap-3 mt-8">
            {BRANCHES.map((b) => (
              <a key={b.id} href={`#${b.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all"
              >
                <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                {b.label} · {b.area}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick stat strip ─────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 -mt-6 relative z-10 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            {[
              { icon: "🏥", value: "2", label: "Clinics in Dhaka" },
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
          {BRANCHES.map((branch, i) => (
            <div key={branch.id} id={branch.id}>
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

export default Locations;
