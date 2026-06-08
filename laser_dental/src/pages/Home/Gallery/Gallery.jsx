import { useState } from "react";
import useGallery from "../../../hooks/useGallery";
import { Search, Filter, X, Eye, ChevronRight, Loader2, ImagePlus } from "lucide-react";

// ── Category filter list ──────────────────────────────────────────────────
const CATEGORIES = ["All", "Whitening", "Implant", "Braces", "Root Canal", "Scaling", "Cosmetic", "Other"];

// ── Before/After Modal ────────────────────────────────────────────────────
const CaseModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Color bar */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500 rounded-t-3xl" />

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 text-sky-600 mb-2 inline-block">
              {item.category}
            </span>
            <h3 className="font-display font-bold text-slate-800 text-xl leading-tight mt-1">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0 ml-4"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-6">
          {/* Main image */}
          {item.images?.main && (
            <div className="rounded-2xl overflow-hidden">
              <img src={item.images.main} alt={item.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Before / After */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Before & After</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Before", src: item.images?.before, color: "from-emerald-500 to-teal-400" },
                { label: "After",  src: item.images?.after,  color: "from-violet-500 to-purple-400" },
              ].map(({ label, src, color }) => (
                <div key={label} className="rounded-2xl overflow-hidden border border-slate-100">
                  <div className={`h-1 bg-gradient-to-r ${color}`} />
                  <p className="text-[10px] font-bold uppercase text-slate-400 px-3 py-2 bg-slate-50">{label}</p>
                  {src ? (
                    <img src={src} alt={label} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-slate-200 bg-slate-50">
                      <ImagePlus size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-50 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2">Treatment</p>
              <p className="text-sm font-semibold text-slate-700">{item.treatmentInfo?.name || "—"}</p>
              <p className="text-xs text-slate-400 mt-1">{item.treatmentInfo?.sessions} sessions · {item.treatmentInfo?.duration}</p>
            </div>
            <div className="bg-violet-50 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-2">Patient</p>
              <p className="text-sm font-semibold text-slate-700">{item.patientInfo?.gender}, {item.patientInfo?.age} yrs</p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="text-[11px] px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────
const GalleryCard = ({ item, onView }) => (
  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 cursor-pointer">

    {/* Main image */}
    <div className="relative h-52 overflow-hidden bg-slate-100">
      {item.images?.main ? (
        <img
          src={item.images.main}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-200">
          <ImagePlus size={32} />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          onClick={() => onView(item)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-800 text-sm font-bold shadow-lg hover:bg-sky-50 transition-colors"
        >
          <Eye size={14} /> View Case
        </button>
      </div>

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/90 text-white backdrop-blur-sm">
          {item.category}
        </span>
      </div>
    </div>

    {/* Before / After mini thumbnails */}
    <div className="grid grid-cols-2 gap-0 h-20">
      {[
        { src: item.images?.before, label: "Before" },
        { src: item.images?.after,  label: "After"  },
      ].map(({ src, label }) => (
        <div key={label} className="relative overflow-hidden bg-slate-50">
          {src ? (
            <img src={src} alt={label} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-200">
              <ImagePlus size={14} />
            </div>
          )}
          <div className="absolute bottom-1 left-1.5">
            <span className="text-[9px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Body */}
    <div className="p-5">
      <h3 className="font-display font-bold text-slate-800 text-base leading-tight mb-1.5 line-clamp-1">
        {item.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
        {item.description || "No description provided."}
      </p>

      {/* Treatment info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-500 font-medium">{item.treatmentInfo?.name || "—"}</span>
        </div>
        <button
          onClick={() => onView(item)}
          className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-colors"
        >
          Details <ChevronRight size={11} />
        </button>
      </div>
    </div>
  </div>
);

// ── Main Gallery ──────────────────────────────────────────────────────────
const Gallery = () => {
  const [gallery, isLoading] = useGallery();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [selectedItem,   setSelectedItem]   = useState(null);
  const [visibleCount,   setVisibleCount]   = useState(9);

  // ── Filter ──────────────────────────────────────────────────────────
  const filtered = gallery.filter((item) => {
    const matchCat    = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = !search
      || item.title?.toLowerCase().includes(search.toLowerCase())
      || item.category?.toLowerCase().includes(search.toLowerCase())
      || item.treatmentInfo?.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="min-h-screen bg-[#f7f9fc] py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500">Our Work</span>
            <div className="w-8 h-px bg-sky-400" />
          </div>
          <h2
            className="font-display font-bold text-gray-900 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
          >
            Patient{" "}
            <span style={{
              background: "linear-gradient(90deg, #0ea5e9 0%, #7c3aed 40%, #ec4899 70%, #0ea5e9 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Transformations
            </span>
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Real results from real patients — before and after treatments performed at Laser Dental Point.
          </p>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(9); }}
              placeholder="Search treatments..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="text-sm text-slate-400 flex items-center sm:ml-auto">
            <span className="font-semibold text-slate-600">{filtered.length}</span>&nbsp;case{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* ── Category pills ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? gallery.length : gallery.filter((g) => g.category === cat).length;
            if (cat !== "All" && count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(9); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {cat}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-sky-500" />
            <p className="text-slate-400 text-sm">Loading gallery...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-32 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <ImagePlus size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold">No results found</p>
            <p className="text-slate-400 text-sm">Try a different category or search term.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="text-sky-500 text-sm font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {!isLoading && visible.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visible.map((item) => (
                <GalleryCard key={item._id} item={item} onView={setSelectedItem} />
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((p) => p + 6)}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-sky-600 to-sky-400 shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:brightness-105 transition-all active:scale-95"
                >
                  Load More
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Case Modal ── */}
      {selectedItem && (
        <CaseModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
};

export default Gallery;
