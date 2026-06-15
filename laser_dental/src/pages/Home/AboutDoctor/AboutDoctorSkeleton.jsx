// ── AboutDoctorSkeleton.jsx ──────────────────────────────────────────────
// Premium shimmer skeleton for the full AboutDoctor page.
// Usage: swap the entire <AboutDoctor /> with <AboutDoctorSkeleton />
//        while your data / auth / fetch is resolving.

// ── Base shimmer block ────────────────────────────────────────────────────
const Sk = ({ w = "100%", h = 14, r = 8, dark = false, style = {} }) => (
  <div
    className={dark ? "sk-dark" : "sk"}
    style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
  />
);

// ── Inline style injection (runs once) ───────────────────────────────────
const SkeletonStyles = () => (
  <style>{`
    @keyframes sk-shimmer {
      0%   { background-position: -700px 0; }
      100% { background-position:  700px 0; }
    }
    .sk {
      background: linear-gradient(90deg, #ebebeb 25%, #d6d6d6 50%, #ebebeb 75%);
      background-size: 700px 100%;
      animation: sk-shimmer 1.6s infinite linear;
    }
    .sk-dark {
      background: linear-gradient(90deg, #1b2b42 25%, #243350 50%, #1b2b42 75%);
      background-size: 700px 100%;
      animation: sk-shimmer 1.6s infinite linear;
    }
  `}</style>
);

// ── Floating badge (white bubble) ─────────────────────────────────────────
const FloatingBubble = ({ style }) => (
  <div
    className="absolute bg-white rounded-2xl p-3 flex flex-col gap-2"
    style={{ boxShadow: "0 10px 32px rgba(0,0,0,0.14)", ...style }}
  >
    <Sk w={52} h={28} />
    <Sk w={64} h={9} />
    <Sk w={56} h={9} />
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO (dark)
// ──────────────────────────────────────────────────────────────────────────
const HeroSkeleton = () => (
  <section
    className="relative overflow-hidden py-20 px-5 md:px-10"
    style={{ background: "linear-gradient(155deg, #080f1e 0%, #0c1e3a 55%, #101d35 100%)" }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        {/* Photo card */}
        <div className="flex justify-center order-1 lg:order-none">
          <div className="relative">
            {/* Main card */}
            <Sk dark w={288} h={420} r={36} />

            {/* Certified badge */}
            <div className="absolute top-4 left-4">
              <Sk dark w={120} h={24} r={999} />
            </div>

            {/* Floating: years */}
            <div
              className="absolute -bottom-5 -left-8 bg-white rounded-2xl flex flex-col gap-2 px-4 py-3.5"
              style={{ boxShadow: "0 10px 32px rgba(0,0,0,0.16)" }}
            >
              <Sk w={52} h={32} />
              <Sk w={60} h={9} />
              <Sk w={50} h={9} />
            </div>

            {/* Floating: rating */}
            <div
              className="absolute -top-5 -right-8 bg-white rounded-2xl flex flex-col gap-2 px-4 py-3.5"
              style={{ boxShadow: "0 10px 32px rgba(0,0,0,0.14)" }}
            >
              <Sk w={72} h={11} r={4} />
              <Sk w={56} h={14} />
              <Sk w={68} h={9} />
            </div>

            {/* Floating: patients */}
            <div
              className="absolute -bottom-5 -right-6 bg-white rounded-2xl flex flex-col gap-2 px-4 py-3.5"
              style={{ boxShadow: "0 10px 32px rgba(0,0,0,0.14)" }}
            >
              <Sk w={60} h={28} />
              <Sk w={52} h={9} />
            </div>
          </div>
        </div>

        {/* Text block */}
        <div className="flex flex-col gap-5">
          {/* Label */}
          <div className="flex items-center gap-3">
            <Sk dark w={24} h={1} />
            <Sk dark w={110} h={10} r={4} />
          </div>

          {/* Name + title */}
          <div className="flex flex-col gap-3">
            <Sk dark w="72%" h={44} r={10} />
            <Sk dark w="50%" h={14} r={5} />
          </div>

          {/* Degrees */}
          <div className="flex flex-col gap-3">
            {[85, 90, 78].map((pct, i) => (
              <div key={i} className="flex items-center gap-3">
                <Sk dark w={20} h={20} r={999} style={{ flexShrink: 0 }} />
                <Sk dark w={`${pct}%`} h={11} r={4} />
              </div>
            ))}
          </div>

          {/* Bio lines */}
          <div className="flex flex-col gap-2 pl-4" style={{ borderLeft: "2px solid rgba(14,165,233,0.2)" }}>
            {[100, 96, 88, 60].map((pct, i) => (
              <Sk key={i} dark w={`${pct}%`} h={11} r={4} />
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 pt-2">
            <Sk dark w={164} h={46} r={16} />
            <Sk dark w={120} h={46} r={16} />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 — SPECIALIZATIONS (white)
// ──────────────────────────────────────────────────────────────────────────
const SpecializationsSkeleton = () => (
  <section className="py-24 px-5 md:px-10 bg-white">
    <div className="max-w-6xl mx-auto">

      {/* Section header */}
      <div className="text-center mb-14 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Sk w={28} h={1} />
          <Sk w={60} h={10} r={999} />
          <Sk w={28} h={1} />
        </div>
        <Sk w={280} h={32} r={10} />
        <Sk w={220} h={12} />
      </div>

      {/* Spec cards — 6 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 flex flex-col items-center gap-3"
            style={{ background: "#f8fafc", border: "1.5px solid #e5e7eb" }}
          >
            <Sk w={44} h={44} r={12} />
            <Sk w="70%" h={10} r={4} />
          </div>
        ))}
      </div>

      {/* Achievements — 2×3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-5 py-4"
            style={{ background: "#f8fafc", border: "0.5px solid #e2e5ec" }}
          >
            <Sk w={28} h={28} r={10} style={{ flexShrink: 0 }} />
            <Sk h={12} r={4} style={{ flex: 1 }} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────────────
// SECTION 3 — STATS + STORY (light bg)
// ──────────────────────────────────────────────────────────────────────────
const StatsStorySkeleton = () => (
  <section className="py-24 px-5 md:px-10 bg-[#f7f9fc]">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* 2×2 stat cards */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: "#fff", border: "0.5px solid #e5e7eb" }}
            >
              <Sk w={36} h={36} r={12} />
              <Sk w="75%" h={38} r={8} />
              <Sk w="60%" h={12} />
              <Sk w="50%" h={10} />
            </div>
          ))}
        </div>

        {/* Story + quote */}
        <div className="flex flex-col gap-4">
          <Sk w={90} h={10} r={4} />
          <Sk w="65%" h={26} r={8} />
          {[100, 95, 85, 100, 90, 75].map((pct, i) => (
            <Sk key={i} w={`${pct}%`} h={11} r={4} />
          ))}

          {/* Quote card */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-3 mt-2"
            style={{
              background: "#eef6ff",
              borderLeft: "4px solid #bae0f8",
              borderRadius: "0 14px 14px 0",
            }}
          >
            {[100, 92, 68].map((pct, i) => (
              <Sk key={i} w={`${pct}%`} h={10} r={4} />
            ))}
            <div className="flex items-center gap-2.5 mt-1">
              <Sk w={28} h={28} r={999} style={{ flexShrink: 0 }} />
              <Sk w={130} h={10} r={4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────────────
// SECTION 4 — LOCATIONS (white)
// ──────────────────────────────────────────────────────────────────────────
const LocationsSkeleton = () => (
  <section className="py-24 px-5 md:px-10 bg-white">
    <div className="max-w-6xl mx-auto">

      {/* Section header */}
      <div className="text-center mb-14 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Sk w={28} h={1} />
          <Sk w={44} h={10} r={999} />
          <Sk w={28} h={1} />
        </div>
        <Sk w={220} h={30} r={10} />
        <Sk w={240} h={12} />
      </div>

      {/* Two location cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-3xl overflow-hidden"
            style={{ border: "0.5px solid #e5e7eb" }}
          >
            {/* Card header */}
            <div
              className="px-7 py-6 flex items-start justify-between"
              style={{ background: "#f8fafc", borderBottom: "0.5px solid #e8eaf0" }}
            >
              <div className="flex flex-col gap-2.5">
                <Sk w={80} h={20} r={999} />
                <Sk w={160} h={18} r={6} />
                <Sk w={100} h={12} r={4} />
              </div>
              <Sk w={48} h={48} r={14} />
            </div>

            {/* Card body */}
            <div className="px-7 py-6 flex flex-col gap-5">

              {/* Address row */}
              <div className="flex items-start gap-3.5">
                <Sk w={32} h={32} r={10} style={{ flexShrink: 0 }} />
                <div className="flex flex-col gap-2 flex-1">
                  <Sk w={55} h={9} r={3} />
                  <Sk w="90%" h={11} r={4} />
                  <Sk w="70%" h={11} r={4} />
                </div>
              </div>

              {/* Phone row */}
              <div className="flex items-center gap-3.5">
                <Sk w={32} h={32} r={10} style={{ flexShrink: 0 }} />
                <div className="flex flex-col gap-2 flex-1">
                  <Sk w={40} h={9} r={3} />
                  <Sk w={110} h={13} r={4} />
                </div>
              </div>

              {/* Schedule row */}
              <div className="flex items-start gap-3.5">
                <Sk w={32} h={32} r={10} style={{ flexShrink: 0, marginTop: 2 }} />
                <div className="flex flex-col gap-3 flex-1">
                  <Sk w={60} h={9} r={3} />
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="flex items-center justify-between gap-2">
                      <Sk w="50%" h={10} r={4} />
                      <Sk w={90} h={22} r={999} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="grid grid-cols-2 gap-2.5 pt-4"
                style={{ borderTop: "0.5px solid #f0f0f0" }}
              >
                <Sk h={42} r={14} />
                <Sk h={42} r={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────────────
// SECTION 5 — FINAL CTA (dark)
// ──────────────────────────────────────────────────────────────────────────
const CtaSkeleton = () => (
  <section className="py-16 px-5 md:px-10 bg-[#f7f9fc]">
    <div className="max-w-3xl mx-auto">
      <div
        className="rounded-[2rem] px-8 py-16 flex flex-col items-center gap-4"
        style={{ background: "linear-gradient(155deg, #080f1e 0%, #0c1e3a 100%)" }}
      >
        <Sk dark w={120} h={10} r={4} />
        <Sk dark w="70%" h={34} r={10} />
        <Sk dark w="55%" h={28} r={10} />
        <Sk dark w="60%" h={12} r={4} style={{ marginTop: 8 }} />
        <Sk dark w="48%" h={12} r={4} />
        <div className="flex gap-3 mt-4">
          <Sk dark w={160} h={46} r={16} />
          <Sk dark w={128} h={46} r={16} />
        </div>
      </div>
    </div>
  </section>
);

// ──────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ──────────────────────────────────────────────────────────────────────────
const AboutDoctorSkeleton = () => (
  <div className="min-h-screen bg-[#f7f9fc]">
    <SkeletonStyles />
    <HeroSkeleton />
    <SpecializationsSkeleton />
    <StatsStorySkeleton />
    <LocationsSkeleton />
    <CtaSkeleton />
  </div>
);

export default AboutDoctorSkeleton;
