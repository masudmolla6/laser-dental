// components/DashboardSkeleton.jsx
// Full-shell loading skeleton for DashboardLayout — mirrors the sidebar +
// topbar + content structure so the layout doesn't "pop in" once auth resolves.

const ToothSVG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z" />
  </svg>
);

// ── One skeleton nav-link row ────────────────────────────────────────────
const SkeletonLink = ({ width = "w-28" }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
    <div className="w-8 h-8 rounded-lg bg-white/8 flex-shrink-0 animate-pulse" />
    <div className={`h-3 ${width} rounded-full bg-white/8 animate-pulse`} />
  </div>
);

// ── One skeleton nav group (label + a few links) ────────────────────────
const SkeletonGroup = ({ linkCount = 1, widths = [] }) => (
  <div>
    <div className="w-16 h-2 rounded-full bg-white/10 mb-2.5 ml-3 animate-pulse" />
    <div className="flex flex-col gap-0.5">
      {Array.from({ length: linkCount }).map((_, i) => (
        <SkeletonLink key={i} width={widths[i] || "w-28"} />
      ))}
    </div>
  </div>
);

const DashboardSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ── Sidebar skeleton ── */}
      <aside
        className="hidden lg:flex sticky top-0 left-0 h-screen w-64 flex-col
          bg-gradient-to-b from-[#0a1628] via-[#0c2340] to-[#0f2d52]
          border-r border-white/5"
        style={{ minHeight: "100dvh" }}
      >
        {/* Brand + user */}
        <div className="px-4 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
          {/* Brand row — real, not skeleton, so the app feels alive immediately */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-sky-500 to-indigo-600 animate-pulse">
              <ToothSVG size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold leading-tight">Laser Dental</p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium">
                Admin Panel
              </p>
            </div>
          </div>

          {/* User card skeleton */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/[0.07]">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex-shrink-0 animate-pulse" />
            <div className="min-w-0 flex-1 flex flex-col gap-1.5">
              <div className="w-20 h-2.5 rounded-full bg-white/10 animate-pulse" />
              <div className="w-28 h-2 rounded-full bg-white/8 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Nav groups skeleton — mirrors real group/link counts roughly */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4">
          <SkeletonGroup linkCount={1} widths={["w-24"]} />
          <SkeletonGroup linkCount={2} widths={["w-20", "w-28"]} />
          <SkeletonGroup linkCount={2} widths={["w-24", "w-28"]} />
          <SkeletonGroup linkCount={1} widths={["w-32"]} />
          <SkeletonGroup linkCount={1} widths={["w-28"]} />
          <SkeletonGroup linkCount={1} widths={["w-24"]} />
          <SkeletonGroup linkCount={1} widths={["w-28"]} />
        </nav>

        {/* Footer skeleton */}
        <div className="px-3 py-4 border-t border-white/5 flex flex-col gap-0.5 flex-shrink-0">
          <SkeletonLink width="w-24" />
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex-shrink-0 animate-pulse" />
            <div className="w-14 h-3 rounded-full bg-white/8 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar skeleton */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-sky-500 to-indigo-600 animate-pulse">
                <ToothSVG size={14} />
              </div>
              <div className="w-20 h-3 rounded-full bg-slate-200 animate-pulse" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse" />
        </header>

        {/* Page content skeleton — generic card placeholders */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="w-44 h-6 rounded-lg bg-slate-200 mb-2 animate-pulse" />
                <div className="w-60 h-3.5 rounded-full bg-slate-100 animate-pulse" />
              </div>
              <div className="w-32 h-10 rounded-xl bg-slate-200 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse"
                >
                  <div className="w-24 h-5 rounded-full bg-slate-200 mb-4" />
                  <div className="w-3/4 h-5 rounded bg-slate-200 mb-3" />
                  <div className="w-full h-3.5 rounded bg-slate-100 mb-2" />
                  <div className="w-2/3 h-3.5 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
