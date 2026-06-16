// pages/Services/AllServices.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, X, ChevronRight, Clock, ArrowRight,
  Sparkles, Zap, Anchor, AlignCenter, HeartPulse, Smile,
  Loader2, Grid3X3, LayoutList, SlidersHorizontal
} from "lucide-react";
import useServices from "../../../hooks/useServices";


// ── Icon Map ──────────────────────────────────────────────────────────────
const ICON_MAP = {
  zap: Zap, anchor: Anchor, alignCenter: AlignCenter,
  sparkles: Sparkles, heartPulse: HeartPulse, smile: Smile,
};

// ── Color Scheme Map ──────────────────────────────────────────────────────
const COLOR_MAP = {
  sky: { bg: "bg-sky-50", text: "text-sky-600", badge: "bg-sky-100", badgeText: "text-sky-700", gradient: "from-sky-600 to-sky-400", hover: "hover:border-sky-200" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-100", badgeText: "text-emerald-700", gradient: "from-emerald-600 to-emerald-400", hover: "hover:border-emerald-200" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-100", badgeText: "text-violet-700", gradient: "from-violet-600 to-violet-400", hover: "hover:border-violet-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-100", badgeText: "text-orange-700", gradient: "from-orange-600 to-orange-400", hover: "hover:border-orange-200" },
  red: { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100", badgeText: "text-red-700", gradient: "from-red-600 to-red-400", hover: "hover:border-red-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", badge: "bg-amber-100", badgeText: "text-amber-700", gradient: "from-amber-600 to-amber-400", hover: "hover:border-amber-200" },
};

const CATEGORIES = ["All", "Cosmetic", "Restorative", "Orthodontics", "Preventive"];

// ── Skeleton Component ────────────────────────────────────────────────────
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
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
              <div className="w-20 h-5 bg-slate-200 rounded-full" />
            </div>
            <div className="w-3/4 h-6 bg-slate-200 rounded mb-2" />
            <div className="w-full h-4 bg-slate-100 rounded mb-2" />
            <div className="w-2/3 h-4 bg-slate-100 rounded mb-4" />
            <div className="flex justify-between items-center">
              <div className="w-20 h-4 bg-slate-200 rounded" />
              <div className="w-24 h-8 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Service Card Component ────────────────────────────────────────────────
const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = ICON_MAP[service.iconKey] || Sparkles;
  const colors = COLOR_MAP[service.colorScheme] || COLOR_MAP.sky;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colors.hover}`}
    >
      {/* Top gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r transition-all duration-300 ${isHovered ? colors.gradient : "from-transparent to-transparent"}`} />

      <div className="p-6">
        {/* Icon + Tag */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center transition-transform duration-300 ${isHovered ? "scale-110 rotate-6" : ""}`}>
            <Icon size={24} className={colors.text} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.badge} ${colors.badgeText}`}>
            {service.tag || "Standard"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
          {service.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
          {service.shortDesc}
        </p>

        {/* Price + Duration */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Starting from</p>
            <p className={`text-lg font-bold ${colors.text}`}>{service.price}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Clock size={10} /> Duration
            </p>
            <p className="text-sm font-semibold text-slate-600">{service.duration}</p>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {service.category}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/services/${service._id}`}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 border ${isHovered ? `border-${colors.text} bg-gradient-to-r ${colors.gradient} text-white shadow-md` : "border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600"}`}
        >
          View Details
          <ChevronRight size={14} className={`transition-transform ${isHovered ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
        </Link>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const AllServices = () => {
  const [services, isLoading] = useServices();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [viewMode, setViewMode] = useState("grid"); // grid / list

  // Filter services based on category and search
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(s => s.category === activeCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [services, activeCategory, searchTerm]);

  // Get unique categories from actual data
  const availableCategories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ["All", ...Array.from(cats)];
  }, [services]);

  const visibleServices = filteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredServices.length;

  // Reset visible count when filters change
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

        {/* ── Hero Section ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">Our Treatments</span>
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

        {/* ── Stats Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <Grid3X3 size={14} className="text-sky-600" />
              </div>
              <span className="text-sm text-slate-600">
                Showing <span className="font-bold text-slate-800">{visibleServices.length}</span> of{" "}
                <span className="font-bold text-slate-800">{filteredServices.length}</span> treatments
              </span>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-sky-600" : "text-slate-400"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-sky-600" : "text-slate-400"}`}
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Search + Filter Section ── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by treatment name, category..."
                className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const count = cat === "All" ? services.length : services.filter(s => s.category === cat).length;
              if (count === 0 && cat !== "All") return null;
              return (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {cat}
                  <span className={`ml-1.5 text-xs ${activeCategory === cat ? "text-white/80" : "text-slate-400"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Empty State ── */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No services found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Services Grid/List ── */}
        {filteredServices.length > 0 && (
          <>
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {visibleServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* ── Load More Button ── */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="group px-8 py-3.5 bg-white border-2 border-sky-200 text-sky-600 rounded-xl font-semibold text-sm hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg"
                >
                  Load More Services
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* ── Showing All Message ── */}
            {!hasMore && filteredServices.length > 6 && (
              <p className="text-center text-slate-400 text-sm mt-8">
                You've seen all {filteredServices.length} services
              </p>
            )}
          </>
        )}

        {/* ── CTA Banner ── */}
        <div className="mt-20 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900 to-indigo-900" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 -translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 p-10 md:p-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300 mb-3">
              Ready to Transform Your Smile?
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              Book Your Appointment Today
            </h2>
            <p className="text-sky-200 text-sm mb-8 max-w-md mx-auto">
              Get professional consultation and personalized treatment plan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-sky-900 rounded-xl font-bold text-sm hover:bg-sky-50 transition-all active:scale-95 group"
              >
                Book Appointment
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
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