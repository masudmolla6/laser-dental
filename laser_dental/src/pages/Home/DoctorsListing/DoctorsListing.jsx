import { Link } from "react-router-dom";
import { useState } from "react";
import {
  UserRound, MapPin, GraduationCap, ArrowRight, Search,
  BadgeCheck, Star, ShieldCheck, Award,
} from "lucide-react";
import useDoctors from "../../../hooks/useDoctors";
import useBranches from "../../../hooks/useBranches";

/*
  DESIGN CONCEPT C — "Framed Mosaic"
  ------------------------------------------------------------------
  Continues the DoctorDetails "Centered Award Profile" language:
    --navy #06101F / --navy-2 #0B1A2E / --navy-3 #101F38
    --sky  #38BDF8 (trust accent)   --gold #E8BE72 (premium accent)
  Type: Playfair Display (display) + DM Sans (body) — same as
  index.css, no extra font imports.

  Signature elements
    · Each doctor card sits inside a gold hairline frame with a
      clipped gold corner tab — echoes a framed certificate/award.
    · Featured doctors get a gold ribbon; verified doctors get a
      small teal-gold seal instead of a generic badge.
  ------------------------------------------------------------------
*/

// ── Skeleton loader ──────────────────────────────────────────────────────────
const DoctorCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: "var(--navy-2)", border: "1px solid var(--hair)" }}>
    <div className="h-64 animate-pulse" style={{ background: "var(--navy-3)" }} />
    <div className="p-6 flex flex-col gap-3">
      <div className="h-5 w-2/3 rounded animate-pulse" style={{ background: "var(--navy-3)" }} />
      <div className="h-3.5 w-1/2 rounded animate-pulse" style={{ background: "var(--navy-3)" }} />
      <div className="h-3 w-full rounded animate-pulse" style={{ background: "var(--navy-3)" }} />
      <div className="h-10 w-full rounded-xl mt-2 animate-pulse" style={{ background: "var(--navy-3)" }} />
    </div>
  </div>
);

// ── Doctor card — framed mosaic tile ────────────────────────────────────────
const DoctorCard = ({ doctor, branchMap }) => {
  const branchNames = (doctor.branchSlugs || [])
    .map((slug) => branchMap[slug])
    .filter(Boolean);

  const normalizedDegrees = (doctor.degrees || []).map((d) =>
    typeof d === "string" ? { title: d, certificateImage: "" } : d
  );
  const certifiedCount = normalizedDegrees.filter((d) => d.certificateImage).length;

  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="doctor-frame group relative rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "var(--navy-2)", border: "1px solid rgba(232,190,114,0.28)" }}
    >
      {/* Gold corner tab */}
      <div className="doctor-frame-tab absolute -top-0.5 -left-0.5 z-20 w-9 h-9" style={{ background: "var(--gold)", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />

      {/* Featured ribbon */}
      {doctor.isFeatured && (
        <div
          className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full font-body text-[10px] font-bold uppercase tracking-wide"
          style={{ background: "var(--gold)", color: "var(--navy)" }}
        >
          <Star size={10} fill="var(--navy)" />
          Featured
        </div>
      )}

      {/* Verified seal */}
      {certifiedCount > 0 && (
        <div
          className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full font-body text-[10px] font-bold uppercase tracking-wide"
          style={{ background: "rgba(6,16,31,0.65)", border: "1px solid rgba(56,189,248,0.5)", color: "var(--sky)", backdropFilter: "blur(4px)" }}
        >
          <ShieldCheck size={10} />
          Verified
        </div>
      )}

      {/* Photo */}
      <div className="relative h-64 w-full overflow-hidden" style={{ background: "linear-gradient(155deg, #101F38, #0B1A2E)" }}>
        {doctor.photo ? (
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="doctor-frame-img w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserRound size={56} style={{ color: "rgba(255,255,255,0.15)" }} />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, var(--navy-2), transparent)" }} />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-lg leading-tight" style={{ color: "var(--ink)" }}>
              {doctor.name}
            </h3>
            <BadgeCheck size={17} style={{ color: "var(--sky)" }} className="flex-shrink-0 mt-0.5" />
          </div>
          <p className="font-mono text-[11px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: "var(--gold)" }}>{doctor.title}</p>
        </div>

        {/* Degrees count */}
        {normalizedDegrees.length > 0 && (
          <div className="flex items-center gap-1.5 font-body text-xs" style={{ color: "var(--ink-45)" }}>
            <GraduationCap size={13} style={{ color: "var(--ink-45)" }} />
            <span>{normalizedDegrees.length} qualification{normalizedDegrees.length > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Branch tags */}
        {branchNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {branchNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-body text-[11px] font-semibold"
                style={{ background: "var(--sky-dim)", color: "var(--sky)" }}
              >
                <MapPin size={10} />
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Bio preview */}
        {doctor.bio && (
          <p className="font-body text-xs leading-relaxed line-clamp-2 mt-1" style={{ color: "var(--ink-45)" }}>
            {doctor.bio}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--hair)" }}>
          <span className="font-body text-sm font-bold flex items-center gap-1.5" style={{ color: "var(--gold)" }}>
            View Profile
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
          {doctor.yearsExperience > 0 && (
            <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--ink-45)" }}>
              {doctor.yearsExperience}+ yrs exp.
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const DoctorsListing = () => {
  const [doctors, isLoading] = useDoctors();
  const [branches] = useBranches();
  const [searchTerm, setSearchTerm] = useState("");

  const branchMap = (branches || []).reduce((acc, b) => {
    acc[b.slug] = b.name || b.area;
    return acc;
  }, {});

  const filteredDoctors = (doctors || []).filter(
    (d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--navy)" }}>
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

        .stage-glow {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(56,189,248,0.14) 0%, transparent 60%),
            radial-gradient(40% 35% at 85% 20%, rgba(232,190,114,0.10) 0%, transparent 60%);
        }
        .dot-field {
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .doctor-frame {
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .doctor-frame:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 56px -16px rgba(232,190,114,0.28);
          border-color: rgba(232,190,114,0.6) !important;
        }
        .doctor-frame-img { transition: transform 0.5s ease; }
        .doctor-frame:hover .doctor-frame-img { transform: scale(1.06); }
        .doctor-frame-tab { transition: transform 0.3s ease; }
        .doctor-frame:hover .doctor-frame-tab { transform: scale(1.15); }

        .search-input::placeholder { color: rgba(255,255,255,0.35); }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ── Hero header ── */}
      <section className="relative overflow-hidden pt-20 pb-16 px-5 md:px-10 stage-glow">
        <div className="absolute inset-0 dot-field opacity-60 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px" style={{ background: "var(--gold)", opacity: 0.6 }} />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>Our Team</span>
            <div className="w-8 h-px" style={{ background: "var(--gold)", opacity: 0.6 }} />
          </div>
          <h1 className="font-display font-bold text-[clamp(2rem,5vw,3.2rem)] leading-tight mb-4" style={{ color: "var(--ink)" }}>
            Meet Our Doctors
          </h1>
          <p className="font-body text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "var(--ink-45)" }}>
            Experienced, certified, and dedicated to giving you a smile you can trust.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-45)" }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or specialty..."
              className="search-input font-body w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
              style={{ background: "var(--navy-2)", border: "1px solid var(--hair)", color: "var(--ink)" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(232,190,114,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--hair)"; }}
            />
          </div>
        </div>
      </section>

      {/* ── Doctor grid ── */}
      <section className="px-5 md:px-10 py-16">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 3 }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--navy-2)", color: "var(--ink-45)" }}>
                <UserRound size={28} />
              </div>
              <h3 className="font-display font-bold text-lg mb-1" style={{ color: "var(--ink)" }}>
                {doctors?.length === 0 ? "No doctors listed yet" : "No matching doctors"}
              </h3>
              <p className="font-body text-sm max-w-xs" style={{ color: "var(--ink-45)" }}>
                {doctors?.length === 0
                  ? "Check back soon — our team profiles are on the way."
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className={`grid gap-7 ${filteredDoctors.length === 1 ? "grid-cols-1 justify-items-center" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className={filteredDoctors.length === 1 ? "w-full max-w-sm" : "contents"}>
                  <DoctorCard doctor={doctor} branchMap={branchMap} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorsListing;