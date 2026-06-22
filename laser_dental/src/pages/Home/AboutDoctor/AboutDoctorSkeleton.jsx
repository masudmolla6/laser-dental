import React from "react";

// ── Tiny shimmer block helper ────────────────────────────────────────────────
const Bar = ({ className = "", style = {} }) => (
  <div
    className={`animate-pulse rounded-lg bg-white/8 ${className}`}
    style={style}
  />
);

const AboutDoctorSkeleton = () => {
  return (
    <div style={{ background: "#06101f" }}>
      <div className="lg:flex">

        {/* ════════════════════════════════════════════════════════════════
            LEFT — photo panel skeleton
        ════════════════════════════════════════════════════════════════ */}
        <div
          className="relative w-full lg:w-[44%] flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(165deg, #0a1830 0%, #050c18 100%)",
            minHeight: "100vh",
          }}
        >
          <div className="absolute inset-0 animate-pulse bg-white/[0.03]" />

          {/* Bottom content block, mimics name/title/CTA area */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col gap-4">
            <Bar className="h-3 w-32" />
            <Bar className="h-9 w-3/4" />
            <Bar className="h-4 w-1/2" />
            <div className="flex items-center gap-2 mt-2">
              <Bar className="h-3 w-24" />
              <Bar className="h-6 w-44 rounded-full" />
            </div>
            <div className="flex gap-2.5 mt-2">
              <Bar className="h-11 w-40 rounded-xl" />
              <Bar className="h-11 w-28 rounded-xl" />
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <Bar className="h-7 w-32 rounded-full" />
            <Bar className="h-7 w-24 rounded-full" />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT — content skeleton
        ════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[56%] flex flex-col">

          {/* Stat strip */}
          <div className="px-6 md:px-12 pt-12 md:pt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl px-4 py-5 flex flex-col gap-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Bar className="h-4 w-4 rounded-md" />
                  <Bar className="h-6 w-12" />
                  <Bar className="h-2.5 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="px-6 md:px-12 pt-12 md:pt-16">
            <Bar className="h-3 w-20 mb-4" />
            <div className="flex flex-col gap-2.5">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-2/3" />
            </div>
          </div>

          {/* Specializations */}
          <div className="px-6 md:px-12 pt-12 md:pt-16">
            <Bar className="h-3 w-32 mb-5" />
            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Bar key={i} className="h-9 rounded-full" style={{ width: `${70 + (i % 3) * 20}px` }} />
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="px-6 md:px-12 pt-12 md:pt-16">
            <Bar className="h-3 w-28 mb-5" />
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Bar className="h-8 w-8 rounded-xl flex-shrink-0" />
                  <Bar className="h-3.5 flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Quote block */}
          <div className="px-6 md:px-12 pt-12 md:pt-16">
            <div
              className="rounded-3xl p-7 md:p-9 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-5/6" />
              <Bar className="h-4 w-2/3" />
              <div className="flex items-center gap-3 mt-3">
                <Bar className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Bar className="h-3 w-24" />
                  <Bar className="h-2.5 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA block */}
          <div className="px-6 md:px-12 py-12 md:py-16">
            <div
              className="rounded-3xl p-8 md:p-10 flex flex-col items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Bar className="h-4 w-4 rounded-full" />
              <Bar className="h-5 w-2/3" />
              <Bar className="h-3 w-1/2" />
              <div className="flex gap-2.5 mt-2">
                <Bar className="h-11 w-40 rounded-xl" />
                <Bar className="h-11 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDoctorSkeleton;
