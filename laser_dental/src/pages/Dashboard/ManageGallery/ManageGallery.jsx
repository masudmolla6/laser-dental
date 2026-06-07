import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Trash2, Pencil, Eye, EyeOff, Search, Filter,
  ImagePlus, Loader2, X, Check, ChevronDown,
  LayoutGrid, List, Sparkles, AlertTriangle,
  Tag, User, Clock, RefreshCw, Package
} from "lucide-react";
import Swal from "sweetalert2";

// ── Status badge ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
    status === "published"
      ? "bg-emerald-100 text-emerald-600"
      : "bg-amber-100 text-amber-600"
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
    {status}
  </span>
);

// ── Category badge ────────────────────────────────────────────────────────
const CatBadge = ({ cat }) => (
  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-600">
    {cat}
  </span>
);

// ── Edit Modal ────────────────────────────────────────────────────────────
const EditModal = ({ item, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    title:       item.title       || "",
    category:    item.category    || "",
    description: item.description || "",
    status:      item.status      || "published",
    tags:        Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
    "treatmentInfo.name":     item.treatmentInfo?.name     || "",
    "treatmentInfo.duration": item.treatmentInfo?.duration || "",
    "treatmentInfo.sessions": item.treatmentInfo?.sessions || "",
    "patientInfo.age":        item.patientInfo?.age        || "",
    "patientInfo.gender":     item.patientInfo?.gender     || "Male",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const payload = {
      title:       form.title,
      category:    form.category,
      description: form.description,
      status:      form.status,
      tags:        form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      treatmentInfo: {
        name:     form["treatmentInfo.name"],
        duration: form["treatmentInfo.duration"],
        sessions: Number(form["treatmentInfo.sessions"]),
      },
      patientInfo: {
        ...item.patientInfo,
        age:    Number(form["patientInfo.age"]),
        gender: form["patientInfo.gender"],
      },
    };
    onSave(payload);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-lg">Edit Case Study</h3>
            <p className="text-xs text-slate-400 mt-0.5">ID: {item._id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-7 flex flex-col gap-5">

          {/* Image preview row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Main",   src: item.images?.main,   dot: "bg-sky-400"     },
              { label: "Before", src: item.images?.before, dot: "bg-emerald-400" },
              { label: "After",  src: item.images?.after,  dot: "bg-violet-400"  },
            ].map(({ label, src, dot }) => (
              <div key={label} className="rounded-2xl overflow-hidden border border-slate-100">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-slate-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">{label}</span>
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                </div>
                {src ? (
                  <img src={src} alt={label} className="w-full h-24 object-cover" />
                ) : (
                  <div className="h-24 flex items-center justify-center text-slate-200">
                    <ImagePlus size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Title + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Case title" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls + " cursor-pointer"}>
                {["Whitening", "Implant", "Braces", "Root Canal", "Scaling", "Cosmetic", "Other"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <div className="flex gap-3">
              {["published", "draft"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    form.status === s
                      ? s === "published"
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {s === "published" ? "✓ Published" : "⊘ Draft"}
                </button>
              ))}
            </div>
          </div>

          {/* Patient + Treatment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User size={10} className="text-sky-500" /> Patient
              </p>
              <input value={form["patientInfo.age"]} onChange={(e) => set("patientInfo.age", e.target.value)} className={inputCls} placeholder="Age" type="number" />
              <select value={form["patientInfo.gender"]} onChange={(e) => set("patientInfo.gender", e.target.value)} className={inputCls + " cursor-pointer"}>
                {["Male", "Female", "Other"].map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={10} className="text-sky-500" /> Treatment
              </p>
              <input value={form["treatmentInfo.name"]} onChange={(e) => set("treatmentInfo.name", e.target.value)} className={inputCls} placeholder="Treatment name" />
              <div className="grid grid-cols-2 gap-2">
                <input value={form["treatmentInfo.sessions"]} onChange={(e) => set("treatmentInfo.sessions", e.target.value)} className={inputCls} placeholder="Sessions" type="number" />
                <input value={form["treatmentInfo.duration"]} onChange={(e) => set("treatmentInfo.duration", e.target.value)} className={inputCls} placeholder="Duration" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls + " resize-none"} placeholder="Treatment summary..." />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={10} className="text-sky-500" /> Tags
            </label>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} placeholder="whitening, cosmetic (comma separated)" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-sky-200"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Image preview modal ───────────────────────────────────────────────────
const PreviewModal = ({ item, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-display font-bold text-slate-800">{item.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <CatBadge cat={item.category} />
            <StatusBadge status={item.status} />
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
          <X size={15} className="text-slate-500" />
        </button>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {/* Main image */}
        {item.images?.main && (
          <img src={item.images.main} alt="main" className="w-full h-52 object-cover rounded-2xl" />
        )}
        {/* Before / After */}
        <div className="grid grid-cols-2 gap-3">
          {[{ label: "Before", src: item.images?.before }, { label: "After", src: item.images?.after }].map(({ label, src }) => (
            <div key={label} className="rounded-xl overflow-hidden border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1.5 border-b border-slate-100 bg-slate-50">{label}</p>
              {src ? (
                <img src={src} alt={label} className="w-full h-32 object-cover" />
              ) : (
                <div className="h-32 flex items-center justify-center text-slate-200"><ImagePlus size={20} /></div>
              )}
            </div>
          ))}
        </div>
        {/* Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Patient</p>
            <p className="text-slate-700 font-medium">{item.patientInfo?.gender}, {item.patientInfo?.age} yrs</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Treatment</p>
            <p className="text-slate-700 font-medium">{item.treatmentInfo?.name || "—"}</p>
          </div>
        </div>
        {item.description && (
          <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
        )}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// ── Main ManageGallery ────────────────────────────────────────────────────
const ManageGallery = () => {
  const axiosSecure  = useAxiosSecure();
  const queryClient  = useQueryClient();

  const [search,     setSearch]     = useState("");
  const [filterCat,  setFilterCat]  = useState("");
  const [filterStat, setFilterStat] = useState("");
  const [viewMode,   setViewMode]   = useState("grid"); // grid | list
  const [editItem,   setEditItem]   = useState(null);
  const [previewItem,setPreviewItem]= useState(null);
  const [saving,     setSaving]     = useState(false);

  // ── Fetch all (admin — includes drafts) ──────────────────────────────
  const { data: gallery = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/gallery");
      return res.data.gallery;
    },
  });

  // ── Delete mutation ───────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-gallery"]);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    },
    onError: () => Swal.fire("Error", "Failed to delete", "error"),
  });

  // ── Status toggle mutation ────────────────────────────────────────────
  const toggleStatus = useMutation({
    mutationFn: ({ id, status }) => axiosSecure.patch(`/gallery/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(["admin-gallery"]),
  });

  // ── Update mutation ───────────────────────────────────────────────────
  const updateMutation = async (id, payload) => {
    setSaving(true);
    try {
      await axiosSecure.patch(`/gallery/${id}`, payload);
      queryClient.invalidateQueries(["admin-gallery"]);
      setEditItem(null);
      Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete confirm ────────────────────────────────────────────────────
  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Delete this case study?",
      text: `"${title}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  // ── Filtered list ─────────────────────────────────────────────────────
  const filtered = gallery.filter((item) => {
    const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat  || item.category === filterCat;
    const matchStat   = !filterStat || item.status   === filterStat;
    return matchSearch && matchCat && matchStat;
  });

  const categories = [...new Set(gallery.map((g) => g.category).filter(Boolean))];

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = {
    total:     gallery.length,
    published: gallery.filter((g) => g.status === "published").length,
    draft:     gallery.filter((g) => g.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Gallery CMS</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">Manage Gallery</h1>
            <p className="text-slate-400 text-sm mt-1">Control all case studies — publish, edit, or remove.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Cases",  value: stats.total,     color: "from-sky-500 to-indigo-500",    bg: "bg-sky-50",     text: "text-sky-600"     },
            { label: "Published",    value: stats.published, color: "from-emerald-500 to-teal-500",  bg: "bg-emerald-50", text: "text-emerald-600" },
            { label: "Drafts",       value: stats.draft,     color: "from-amber-400 to-orange-400",  bg: "bg-amber-50",   text: "text-amber-600"   },
          ].map(({ label, value, color, bg, text }) => (
            <div key={label} className={`rounded-2xl p-5 ${bg} border border-white shadow-sm flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Package size={17} className="text-white" />
              </div>
              <div>
                <p className={`text-2xl font-display font-black ${text}`}>{value}</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 transition-all cursor-pointer appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStat}
              onChange={(e) => setFilterStat(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 transition-all cursor-pointer appearance-none pr-8"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-sky-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-sky-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between -mt-3">
          <p className="text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{gallery.length}</span> case studies
          </p>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-24 flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-sky-500" />
            <p className="text-slate-400 text-sm font-medium">Loading gallery...</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-24 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <ImagePlus size={28} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-semibold">No case studies found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or add a new case study.</p>
            </div>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!isLoading && filtered.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {item.images?.main ? (
                    <img src={item.images.main} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <ImagePlus size={32} />
                    </div>
                  )}
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                      title="Preview"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => setEditItem(item)}
                      className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="w-9 h-9 rounded-xl bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 flex items-center justify-center text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-1">{item.title}</h3>
                    <CatBadge cat={item.category} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{item.description || "No description provided."}</p>

                  {/* Before/After thumbnails */}
                  <div className="flex gap-2 mb-4">
                    {[{ src: item.images?.before, label: "Before" }, { src: item.images?.after, label: "After" }].map(({ src, label }) => (
                      <div key={label} className="flex-1 rounded-xl overflow-hidden border border-slate-100 h-16">
                        {src ? (
                          <img src={src} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200 text-[9px] font-medium">{label}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleStatus.mutate({ id: item._id, status: item.status === "published" ? "draft" : "published" })}
                      className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                        item.status === "published"
                          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {item.status === "published" ? <><EyeOff size={11} /> Unpublish</> : <><Eye size={11} /> Publish</>}
                    </button>
                    <button
                      onClick={() => setEditItem(item)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {!isLoading && filtered.length > 0 && viewMode === "list" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Case Study</span>
              <span>Category</span>
              <span>Status</span>
              <span>Treatment</span>
              <span>Actions</span>
            </div>

            {filtered.map((item, idx) => (
              <div
                key={item._id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors ${idx !== filtered.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                {/* Title + image */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    {item.images?.main ? (
                      <img src={item.images.main} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <ImagePlus size={14} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.description?.slice(0, 50) || "—"}</p>
                  </div>
                </div>

                {/* Category */}
                <div><CatBadge cat={item.category} /></div>

                {/* Status */}
                <div><StatusBadge status={item.status} /></div>

                {/* Treatment */}
                <div>
                  <p className="text-xs font-medium text-slate-600 truncate">{item.treatmentInfo?.name || "—"}</p>
                  <p className="text-[10px] text-slate-400">{item.treatmentInfo?.sessions ? `${item.treatmentInfo.sessions} sessions` : ""}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPreviewItem(item)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors" title="Preview">
                    <Eye size={13} />
                  </button>
                  <button onClick={() => setEditItem(item)} className="w-8 h-8 rounded-xl bg-sky-100 hover:bg-sky-200 flex items-center justify-center text-sky-600 transition-colors" title="Edit">
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => toggleStatus.mutate({ id: item._id, status: item.status === "published" ? "draft" : "published" })}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${item.status === "published" ? "bg-amber-100 hover:bg-amber-200 text-amber-600" : "bg-emerald-100 hover:bg-emerald-200 text-emerald-600"}`}
                    title={item.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {item.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => handleDelete(item._id, item.title)} className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 transition-colors" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {editItem    && <EditModal item={editItem}    onClose={() => setEditItem(null)}    onSave={(payload) => updateMutation(editItem._id, payload)} saving={saving} />}
      {previewItem && <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />}
    </div>
  );
};

export default ManageGallery;
