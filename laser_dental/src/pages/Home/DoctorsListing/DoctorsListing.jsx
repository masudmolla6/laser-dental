import { Link } from "react-router-dom";
import { useState } from "react";
import {
  UserRound, MapPin, GraduationCap, ArrowRight, Sparkles,
  Search, BadgeCheck, Star, ShieldCheck,
} from "lucide-react";
import useDoctors from "../../../hooks/useDoctors";
import useBranches from "../../../hooks/useBranches";

// ── Skeleton loader ──────────────────────────────────────────────────────────
const DoctorCardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 animate-pulse">
    <div className="h-64 bg-slate-200" />
    <div className="p-6 flex flex-col gap-3">
      <div className="h-5 w-2/3 bg-slate-200 rounded" />
      <div className="h-3.5 w-1/2 bg-slate-100 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-10 w-full bg-slate-100 rounded-xl mt-2" />
    </div>
  </div>
);

// ── Doctor card ──────────────────────────────────────────────────────────────
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
      className="doctor-card group relative rounded-3xl overflow-hidden bg-white border border-slate-100 flex flex-col"
    >
      {/* Featured ribbon */}
      {doctor.isFeatured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
          <Star size={10} fill="white" />
          Featured
        </div>
      )}

      {/* Verified badge */}
      {certifiedCount > 0 && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/95 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
          <ShieldCheck size={10} />
          Verified
        </div>
      )}

      {/* Photo */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#0c2340] to-[#0f2d52]">
        {doctor.photo ? (
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="doctor-card-img w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserRound size={56} className="text-white/20" />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-slate-900 text-lg leading-tight">
              {doctor.name}
            </h3>
            <BadgeCheck size={17} className="text-sky-500 flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-sky-600 text-sm font-semibold mt-1">{doctor.title}</p>
        </div>

        {/* Degrees count */}
        {normalizedDegrees.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <GraduationCap size={13} className="text-slate-400" />
            <span>{normalizedDegrees.length} qualification{normalizedDegrees.length > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Branch tags */}
        {branchNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {branchNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-semibold"
              >
                <MapPin size={10} />
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Bio preview */}
        {doctor.bio && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mt-1">
            {doctor.bio}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-sm font-bold text-sky-600 flex items-center gap-1.5">
            View Profile
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
          {doctor.yearsExperience > 0 && (
            <span className="text-[11px] font-semibold text-slate-400">
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
    <div className="min-h-screen bg-[#f7f9fc]">
      <style>{`
        .doctor-card {
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.35s ease;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
        }
        .doctor-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 60px -14px rgba(14,165,233,0.22);
          border-color: rgba(14,165,233,0.25);
        }
        .doctor-card-img {
          transition: transform 0.5s ease;
        }
        .doctor-card:hover .doctor-card-img {
          transform: scale(1.06);
        }
        .shimmer {
          background: linear-gradient(90deg, #0ea5e9 0%, #7c3aed 40%, #ec4899 70%, #0ea5e9 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 5s linear infinite;
        }
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* ── Hero header ── */}
      <section
        className="relative overflow-hidden pt-20 pb-16 px-5 md:px-10"
        style={{ background: "linear-gradient(155deg, #080f1e 0%, #0c1e3a 55%, #101d35 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Our Team</span>
            <div className="w-8 h-px bg-sky-400" />
          </div>
          <h1 className="font-display font-bold text-white text-[clamp(2rem,5vw,3.2rem)] leading-tight mb-4">
            Meet Our <span className="shimmer">Doctors</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
            Experienced, certified, and dedicated to giving you a smile you can trust.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:bg-white/15 focus:border-sky-400/50 transition-all backdrop-blur-sm"
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
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <UserRound size={28} />
              </div>
              <h3 className="font-display font-bold text-slate-700 text-lg mb-1">
                {doctors?.length === 0 ? "No doctors listed yet" : "No matching doctors"}
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                {doctors?.length === 0
                  ? "Check back soon — our team profiles are on the way."
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} branchMap={branchMap} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorsListing;
