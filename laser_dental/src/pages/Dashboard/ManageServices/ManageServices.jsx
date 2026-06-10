import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Zap, Anchor, AlignCenter, Sparkles, HeartPulse, Smile,
  Pencil, Eye, EyeOff, Loader2, X, Check, RefreshCw,
  Clock, Tag, FileText, DollarSign, ToggleLeft, ToggleRight
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useServicesSecure from "../../../hooks/useServicesSecure";

// ── Icon map (iconKey → lucide component) ─────────────────────────────────
const ICON_MAP = {
  zap:         Zap,
  anchor:      Anchor,
  alignCenter: AlignCenter,
  sparkles:    Sparkles,
  heartPulse:  HeartPulse,
  smile:       Smile,
};

// ── Color scheme map ──────────────────────────────────────────────────────
const COLOR_MAP = {
  sky:     { iconBg: "bg-sky-100",     iconColor: "text-sky-700",     badge: "bg-sky-100 text-sky-700",     bar: "from-sky-600 to-sky-400"     },
  emerald: { iconBg: "bg-emerald-100", iconColor: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700", bar: "from-emerald-600 to-emerald-400" },
  violet:  { iconBg: "bg-violet-100",  iconColor: "text-violet-700",  badge: "bg-violet-100 text-violet-700",  bar: "from-violet-600 to-violet-400"  },
  orange:  { iconBg: "bg-orange-100",  iconColor: "text-orange-700",  badge: "bg-orange-100 text-orange-700",  bar: "from-orange-600 to-orange-400"  },
  red:     { iconBg: "bg-red-100",     iconColor: "text-red-700",     badge: "bg-red-100 text-red-700",     bar: "from-red-600 to-red-400"     },
  amber:   { iconBg: "bg-amber-100",   iconColor: "text-amber-700",   badge: "bg-amber-100 text-amber-700",   bar: "from-amber-600 to-amber-400"   },
};

// ── Edit Modal ────────────────────────────────────────────────────────────
const EditModal = ({ item, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    title:     item.title     || "",
    shortDesc: item.shortDesc || "",
    description: item.description || "",
    price:     item.price     || "",
    duration:  item.duration  || "",
    tag:       item.tag       || "",
    isActive:  item.isActive  ?? true,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const colors = COLOR_MAP[item.colorScheme] || COLOR_MAP.sky;
  const Icon   = ICON_MAP[item.iconKey] || Sparkles;

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.iconBg} ${colors.iconColor}`}>
              <Icon size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800">Edit Service</h3>
              <p className="text-xs text-slate-400">{item.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-7 flex flex-col gap-4">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={10} className="text-sky-500" /> Title
            </label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Service title" />
          </div>

          {/* Short desc */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={10} className="text-sky-500" /> Short Description
            </label>
            <input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} className={inputCls} placeholder="One-liner shown on card" />
          </div>

          {/* Full desc */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={10} className="text-sky-500" /> Full Description
            </label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls + " resize-none"} placeholder="Detailed description shown on hover" />
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={10} className="text-sky-500" /> Price
              </label>
              <input value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="৳ 4,500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={10} className="text-sky-500" /> Duration
              </label>
              <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} placeholder="60 min" />
            </div>
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={10} className="text-sky-500" /> Badge Tag
            </label>
            <input value={form.tag} onChange={(e) => set("tag", e.target.value)} className={inputCls} placeholder="Most Popular, Premium, etc." />
          </div>

          {/* isActive toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-700">Show on Website</p>
              <p className="text-xs text-slate-400 mt-0.5">Inactive services won't appear on the homepage</p>
            </div>
            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                form.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {form.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </div>

          {/* Note about locked fields */}
          <p className="text-[11px] text-slate-400 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            🔒 Icon and color scheme are fixed and cannot be changed from here.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
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

// ── Main ManageServices ───────────────────────────────────────────────────
const ManageServices = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editItem,  setEditItem]  = useState(null);
  const [saving,    setSaving]    = useState(false);

  const [services, isLoading, refetch] = useServicesSecure();

  // ── Toggle active ─────────────────────────────────────────────────────
  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => axiosSecure.patch(`/services/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries(["admin-services"]),
    onError: () => Swal.fire("Error", "Failed to update", "error"),
  });

  // ── Save edit ─────────────────────────────────────────────────────────
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      await axiosSecure.patch(`/services/${editItem._id}`, payload);
      queryClient.invalidateQueries(["admin-services"]);
      setEditItem(null);
      Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update service", "error");
    } finally {
      setSaving(false);
    }
  };

  const activeCount   = services.filter((s) => s.isActive).length;
  const inactiveCount = services.filter((s) => !s.isActive).length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Services CMS</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">Manage Services</h1>
            <p className="text-slate-400 text-sm mt-1">Edit service details and control visibility on the website.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Services", value: services.length, bg: "bg-sky-50",     text: "text-sky-600",     grad: "from-sky-500 to-indigo-500"   },
            { label: "Active",         value: activeCount,     bg: "bg-emerald-50", text: "text-emerald-600", grad: "from-emerald-500 to-teal-400"  },
            { label: "Inactive",       value: inactiveCount,   bg: "bg-amber-50",   text: "text-amber-600",   grad: "from-amber-400 to-orange-400"  },
          ].map(({ label, value, bg, text, grad }) => (
            <div key={label} className={`rounded-2xl p-5 ${bg} border border-white shadow-sm flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0`}>
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className={`text-2xl font-black ${text}`}>{value}</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Note ── */}
        <div className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 text-sm text-sky-700 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <p>
            You can edit <strong>title, description, price, duration, and tag</strong> for each service.
            Toggle <strong>Active/Inactive</strong> to show or hide a service on the website.
            Icon and color are fixed.
          </p>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-100 py-24 flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-sky-500" />
            <p className="text-slate-400 text-sm">Loading services...</p>
          </div>
        )}

        {/* ── Services list ── */}
        {!isLoading && (
          <div className="flex flex-col gap-4">
            {services.map((service) => {
              const Icon   = ICON_MAP[service.iconKey]   || Sparkles;
              const colors = COLOR_MAP[service.colorScheme] || COLOR_MAP.sky;

              return (
                <div
                  key={service._id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    service.isActive ? "border-slate-200" : "border-slate-200 opacity-60"
                  }`}
                >
                  {/* Color top bar */}
                  <div className={`h-1 bg-gradient-to-r ${colors.bar}`} />

                  <div className="p-5 flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.iconBg} ${colors.iconColor}`}>
                      <Icon size={22} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-sm">{service.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                          {service.tag}
                        </span>
                        {!service.isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{service.shortDesc}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <Clock size={10} className="text-slate-400" /> {service.duration}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{service.price}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{service.category}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Toggle active */}
                      <button
                        onClick={() => toggleActive.mutate({ id: service._id, isActive: !service.isActive })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          service.isActive
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title={service.isActive ? "Hide from website" : "Show on website"}
                      >
                        {service.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                        {service.isActive ? "Active" : "Hidden"}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditItem(service)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
};

export default ManageServices;