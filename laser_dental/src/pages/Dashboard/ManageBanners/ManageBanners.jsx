import { ImagePlus, Sparkles } from "lucide-react";
import useBanners from "../../../hooks/useBanners";
import BannerCard from "./BannerCard";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <ImagePlus size={28} className="text-slate-300" />
    </div>
    <h3 className="font-semibold text-slate-700 text-base mb-1">No banners yet</h3>
    <p className="text-slate-400 text-sm">Add your first banner slide from the Add Banner page.</p>
  </div>
);

const ManageBanners = () => {
  const [banners, isLoading, refetch] = useBanners();

  const activeCount   = banners.filter((b) => b.isActive).length;
  const inactiveCount = banners.length - activeCount;

  return (
    <div
      className="min-h-screen bg-slate-100 p-4 md:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">
                Banner Manager
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">
              Manage Banners
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Control which slides appear on your homepage carousel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { label: "Total",    value: banners.length, color: "#0ea5e9", bg: "#e0f2fe" },
              { label: "Active",   value: activeCount,    color: "#16a34a", bg: "#f0fdf4" },
              { label: "Inactive", value: inactiveCount,  color: "#94a3b8", bg: "#f1f5f9" },
            ].map(({ label, value, color, bg }) => (
              <div
                key={label}
                className="flex flex-col items-center px-4 py-2.5 rounded-2xl"
                style={{ background: bg, border: `1px solid ${color}30` }}
              >
                <span className="text-xl font-black" style={{ color }}>{value}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className="bg-white rounded-3xl overflow-hidden border border-slate-100"
          style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}
        >
          <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, #0284c7, #6366f1, #0ea5e9)" }}
          />

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-slate-100">
                    <div className="h-44 bg-slate-100 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-2/3 bg-slate-100 animate-pulse rounded" />
                      <div className="h-3 bg-slate-100 animate-pulse rounded" />
                      <div className="h-3 w-4/5 bg-slate-100 animate-pulse rounded" />
                      <div className="h-9 bg-slate-100 animate-pulse rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : banners.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map((banner) => (
                  <BannerCard
                    key={banner._id}
                    banner={banner}
                    refetch={refetch}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBanners;
