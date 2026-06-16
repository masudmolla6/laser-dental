// pages/Services/AllServices.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, X, ChevronRight, Clock, ArrowRight,
  Sparkles, Zap, Anchor, AlignCenter, HeartPulse, Smile,
  Grid3X3, LayoutList, Tag, Star
} from "lucide-react";
import useServices from "../../../hooks/useServices";

// ── Icon Map ──────────────────────────────────────────────────────────────
const ICON_MAP = {
  zap: Zap,
  anchor: Anchor,
  alignCenter: AlignCenter,
  sparkles: Sparkles,
  heartPulse: HeartPulse,
  smile: Smile,
};

// ── Color Scheme Map ──────────────────────────────────────────────────────
const COLOR_MAP = {
  sky: {
    bg: "bg-sky-50", text: "text-sky-600", badge: "bg-sky-100", badgeText: "text-sky-700",
    gradient: "from-sky-600 to-sky-400", hover: "hover:border-sky-200",
    glow: "shadow-sky-100", btnGrad: "from-sky-600 to-sky-500",
  },
  emerald: {
    bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-100", badgeText: "text-emerald-700",
    gradient: "from-emerald-600 to-emerald-400", hover: "hover:border-emerald-200",
    glow: "shadow-emerald-100", btnGrad: "from-emerald-600 to-emerald-500",
  },
  violet: {
    bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-100", badgeText: "text-violet-700",
    gradient: "from-violet-600 to-violet-400", hover: "hover:border-violet-200",
    glow: "shadow-violet-100", btnGrad: "from-violet-600 to-violet-500",
  },
  orange: {
    bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-100", badgeText: "text-orange-700",
    gradient: "from-orange-600 to-orange-400", hover: "hover:border-orange-200",
    glow: "shadow-orange-100", btnGrad: "from-orange-600 to-orange-500",
  },
  red: {
    bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100", badgeText: "text-red-700",
    gradient: "from-red-600 to-red-400", hover: "hover:border-red-200",
    glow: "shadow-red-100", btnGrad: "from-red-600 to-red-500",
  },
  amber: {
    bg: "bg-amber-50", text: "text-amber-600", badge: "bg-amber-100", badgeText: "text-amber-700",
    gradient: "from-amber-600 to-amber-400", hover: "hover:border-amber-200",
    glow: "shadow-amber-100", btnGrad: "from-amber-600 to-amber-500",
  },
};

// ── Skeleton ──────────────────────────────────────────────────────────────
const AllServicesSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20 px-4 md:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-32 h-4 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="w-96 h-12 bg-slate-200 rounded-xl mx-auto mb-4 animate-pulse" />
        <div className="w-64 h-5 bg-slate-200 rounded-lg mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-slate-200 rounded-xl" />
              <div className="w-20 h-5 bg-slate-200 rounded-full" />
            </div>
            <div className="w-3/4 h-6 bg-slate-200 rounded mb-2" />
            <div className="w-full h-4 bg-slate-100 rounded mb-2" />
            <div className="w-2/3 h-4 bg-slate-100 rounded mb-4" />
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="w-20 h-6 bg-slate-200 rounded" />
              <div className="w-16 h-4 bg-slate-100 rounded" />
            </div>
            <div className="w-full h-10 bg-slate-200 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Grid Service Card ─────────────────────────────────────────────────────
const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = ICON_MAP[service.iconKey] || Sparkles;
  const colors = COLOR_MAP[service.colorScheme] || COLOR_MAP.sky;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${
        isHovered ? `shadow-xl ${colors.glow} -translate-y-1.5 border-transparent` : "shadow-sm hover:shadow-md"
      } ${colors.hover}`}
    >
      {/* Top gradient bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r transition-all duration-500 ${
          isHovered ? colors.gradient : "from-slate-100 to-slate-100"
        }`}
      />

      <div className="p-6">
        {/* Icon + Tag */}
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-110 rotate-3 shadow-md" : ""
            }`}
          >
            <Icon size={24} className={colors.text} />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.badge} ${colors.badgeText}`}
          >
            {service.tag || "Standard"}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-lg font-bold mb-2 line-clamp-1 transition-colors duration-200 ${
            isHovered ? colors.text : "text-slate-800"
          }`}
        >
          {service.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
          {service.shortDesc}
        </p>

        {/* Price + Duration */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Starting from</p>
            <p className={`text-xl font-black ${colors.text}`}>{service.price}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1">
              <Clock size={10} /> Duration
            </p>
            <p className="text-sm font-semibold text-slate-700">{service.duration}</p>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-500`}
          >
            <Tag size={8} /> {service.category}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/services/${service._id}`}
          className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
            isHovered
              ? `bg-gradient-to-r ${colors.btnGrad} text-white shadow-lg`
              : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600"
          }`}
        >
          View Details
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${isHovered ? "translate-x-0.5" : ""}`}
          />
        </Link>
      </div>
    </div>
  );
};

// ── List Service Card ─────────────────────────────────────────────────────
const ServiceListCard = ({ service }) => {
  const Icon = ICON_MAP[service.iconKey] || Sparkles;
  const colors = COLOR_MAP[service.colorScheme] || COLOR_MAP.sky;

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-transparent hover:-translate-y-0.5 ${colors.hover}`}
    >
      <div className={`h-0.5 w-full bg-gradient-to-r ${colors.gradient}`} />
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Icon */}
        <div
          className={`w-14 h-14 flex-shrink-0 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
        >
          <Icon size={24} className={colors.text} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`text-base font-bold text-slate-800 group-hover:${colors.text} transition-colors line-clamp-1`}>
              {service.title}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.badge} ${colors.badgeText} flex-shrink-0`}
            >
              {service.tag || "Standard"}
            </span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1 mb-2">{service.shortDesc}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {service.duration}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={11} /> {service.category}
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
          <div className="sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">From</p>
            <p className={`text-lg font-black ${colors.text}`}>{service.price}</p>
          </div>
          <Link
            to={`/services/${service._id}`}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 bg-gradient-to-r ${colors.btnGrad} text-white shadow-md hover:brightness-105 transition-all active:scale-95 whitespace-nowrap`}
          >
            View Details <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const AllServices = () => {
  // FIX: useServices returns [services, isLoading, refetch, error] — destructure correctly
  const [services, isLoading] = useServices();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [viewMode, setViewMode] = useState("grid");

  // Filter services based on category and search
  const filteredServices = useMemo(() => {
    let filtered = services;
    if (activeCategory !== "All") {
      filtered = filtered.filter((s) => s.category === activeCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDesc?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [services, activeCategory, searchTerm]);

  // Get unique categories from actual data
  const availableCategories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [services]);

  const visibleServices = filteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredServices.length;

  const handleFilterChange = (category) => {
    setActiveCategory(category);
    setVisibleCount(9);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(9);
  };

  if (isLoading) return <AllServicesSkeleton />;

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Hero ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
              Our Treatments
            </span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Comprehensive{" "}
            <span className="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
              Dental Care
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
            Explore our complete range of dental treatments designed to give you a healthy, confident smile.
          </p>
        </div>

        {/* ── Toolbar: Stats + View Toggle ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
              <Star size={14} className="text-sky-600" />
            </div>
            <span className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-bold text-slate-800">{visibleServices.length}</span> of{" "}
              <span className="font-bold text-slate-800">{filteredServices.length}</span> treatments
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all text-sm flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-sky-600 font-medium"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid view"
            >
              <Grid3X3 size={15} />
              <span className="hidden sm:inline text-xs">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all text-sm flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-sky-600 font-medium"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="List view"
            >
              <LayoutList size={15} />
              <span className="hidden sm:inline text-xs">List</span>
            </button>
          </div>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search treatments, categories..."
                className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setVisibleCount(9);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {availableCategories.map((cat) => {
              const count =
                cat === "All"
                  ? services.length
                  : services.filter((s) => s.category === cat).length;
              if (count === 0 && cat !== "All") return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    activeCategory === cat
                      ? "bg-sky-600 text-white shadow-md shadow-sky-200 scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Empty State ── */}
        {filteredServices.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No treatments found</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
                setVisibleCount(9);
              }}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors text-sm shadow-md shadow-sky-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Services Grid / List ── */}
        {filteredServices.length > 0 && (
          <>
            <div
              className={`grid gap-5 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {visibleServices.map((service) =>
                viewMode === "grid" ? (
                  <ServiceCard key={service._id} service={service} />
                ) : (
                  <ServiceListCard key={service._id} service={service} />
                )
              )}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="group px-8 py-3.5 bg-white border-2 border-sky-200 text-sky-600 rounded-xl font-semibold text-sm hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg hover:shadow-sky-200"
                >
                  Load More Treatments
                  <ChevronRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}

            {/* All shown */}
            {!hasMore && filteredServices.length > 6 && (
              <p className="text-center text-slate-400 text-sm mt-10">
                ✓ You've seen all {filteredServices.length} treatments
              </p>
            )}
          </>
        )}

        {/* ── CTA Banner ── */}
        <div className="mt-24 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900 via-indigo-900 to-violet-900" />
          {/* decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-sky-500/10 -translate-x-1/2 -translate-y-1/2 blur-3xl" />

          <div className="relative z-10 p-10 md:p-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300 mb-3">
              Ready to Transform Your Smile?
            </p>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
              Book Your Appointment Today
            </h2>
            <p className="text-sky-200 text-sm mb-10 max-w-md mx-auto">
              Get a professional consultation and personalized treatment plan from our specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-sky-900 rounded-xl font-bold text-sm hover:bg-sky-50 transition-all active:scale-95 shadow-lg group"
              >
                Book Appointment
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/25 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllServices;
