import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import {
  Calendar, Phone, MapPin, Clock, User, Filter,
  Search, Trash2, ChevronDown, Loader2, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, Activity,
  Sparkles, X, Eye, Package
} from "lucide-react";
import Swal from "sweetalert2";
import useAppointmentsSecure from "../../../hooks/useAppointmentsSecure,jsx";

// ── Constants ─────────────────────────────────────────────────────────────
const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const STATUS_CONFIG = {
  pending:   { label: "Pending",   bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   icon: AlertCircle  },
  confirmed: { label: "Confirmed", bg: "bg-sky-100",     text: "text-sky-700",     dot: "bg-sky-500",     icon: CheckCircle2 },
  completed: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", icon: Activity     },
  cancelled: { label: "Cancelled", bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-500",     icon: XCircle      },
};

const LOCATIONS = {
  branch1: "Branch 1 — Mirpur-10",
  branch2: "Branch 2 — Uttara",
};

// ── Status badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────
const DetailModal = ({ item, onClose, onStatusChange, updating }) => {
  if (!item) return null;
  const c = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const Icon = c.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-lg">Appointment Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">ID: {item._id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 flex flex-col gap-5">

          {/* Patient info */}
          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Info</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">
                {item.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                <a href={`tel:${item.phone}`} className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1">
                  <Phone size={10} /> {item.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Appointment info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Activity,  label: "Service",  value: item.service                            },
              { icon: MapPin,    label: "Branch",   value: LOCATIONS[item.location] || item.location },
              { icon: Calendar,  label: "Date",     value: item.date                               },
              { icon: Clock,     label: "Time",     value: item.time                               },
            ].map(({ icon: Ic, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Ic size={11} className="text-slate-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{value || "—"}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          {item.message && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Message</p>
              <p className="text-sm text-slate-600 leading-relaxed">{item.message}</p>
            </div>
          )}

          {/* Current status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-500">Current Status:</p>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-[10px] text-slate-400">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}
            </p>
          </div>

          {/* Change status buttons */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Change Status</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.filter((s) => s !== item.status).map((s) => {
                const conf = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(item._id, s)}
                    disabled={updating}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${conf.bg} ${conf.text} hover:opacity-80`}
                  >
                    {updating ? <Loader2 size={12} className="animate-spin mx-auto" /> : `→ ${conf.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main ManageAppointments ────────────────────────────────────────────────
const ManageAppointments = () => {
  const axiosSecure  = useAxiosSecure();
  const queryClient  = useQueryClient();

  const [statusFilter,   setStatusFilter]   = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [search,         setSearch]         = useState("");
  const [selectedItem,   setSelectedItem]   = useState(null);
  const [updating,       setUpdating]       = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────
  const [appointments, isLoading, refetch] = useAppointmentsSecure({
    status:   statusFilter,
    location: locationFilter,
  });

  // ── Client-side search filter ─────────────────────────────────────────
  const filtered = appointments.filter((a) =>
    !search ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.phone?.includes(search) ||
    a.service?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = {
    total:     appointments.length,
    pending:   appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-appointments"]);
      setSelectedItem(null);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    },
    onError: () => Swal.fire("Error", "Failed to delete", "error"),
  });

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Delete this appointment?",
      text: `"${name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  // ── Status change ─────────────────────────────────────────────────────
  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      await axiosSecure.patch(`/appointments/${id}`, { status });
      queryClient.invalidateQueries(["admin-appointments"]);
      // update selected item locally for modal
      setSelectedItem((prev) => prev ? { ...prev, status } : null);
      Swal.fire({ icon: "success", title: `Marked as ${status}!`, timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Appointments</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">Manage Appointments</h1>
            <p className="text-slate-400 text-sm mt-1">View, filter, and update all patient appointments.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total",     value: stats.total,     color: "from-sky-500 to-indigo-500",   bg: "bg-sky-50",     text: "text-sky-600"     },
            { label: "Pending",   value: stats.pending,   color: "from-amber-400 to-orange-400", bg: "bg-amber-50",   text: "text-amber-600"   },
            { label: "Confirmed", value: stats.confirmed, color: "from-sky-500 to-cyan-400",     bg: "bg-sky-50",     text: "text-sky-600"     },
            { label: "Completed", value: stats.completed, color: "from-emerald-500 to-teal-400", bg: "bg-emerald-50", text: "text-emerald-600" },
            { label: "Cancelled", value: stats.cancelled, color: "from-red-400 to-rose-400",     bg: "bg-red-50",     text: "text-red-500"     },
          ].map(({ label, value, color, bg, text }) => (
            <div
              key={label}
              onClick={() => setStatusFilter(label === "Total" ? "" : label.toLowerCase())}
              className={`rounded-2xl p-4 ${bg} border border-white shadow-sm flex items-center gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                (label === "Total" ? statusFilter === "" : statusFilter === label.toLowerCase()) ? "ring-2 ring-offset-1 ring-sky-400" : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Package size={15} className="text-white" />
              </div>
              <div>
                <p className={`text-xl font-black leading-none ${text}`}>{value}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{label}</p>
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
              placeholder="Search by name, phone, or service..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 transition-all cursor-pointer appearance-none"
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Location filter */}
          <div className="relative">
            <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 transition-all cursor-pointer appearance-none"
            >
              <option value="">All Branches</option>
              <option value="branch1">Branch 1 — Mirpur-10</option>
              <option value="branch2">Branch 2 — Uttara</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Result count */}
          <p className="text-sm text-slate-400 ml-auto">
            <span className="font-semibold text-slate-600">{filtered.length}</span> results
          </p>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-24 flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-sky-500" />
            <p className="text-slate-400 text-sm">Loading appointments...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-24 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Calendar size={28} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-semibold">No appointments found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        {!isLoading && filtered.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Patient</span>
              <span>Service</span>
              <span>Branch</span>
              <span>Date & Time</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filtered.map((appt, idx) => (
              <div
                key={appt._id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors ${
                  idx !== filtered.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {/* Patient */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-xs flex-shrink-0">
                    {appt.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{appt.name}</p>
                    <a href={`tel:${appt.phone}`} className="text-[10px] text-sky-500 hover:underline flex items-center gap-0.5">
                      <Phone size={9} /> {appt.phone}
                    </a>
                  </div>
                </div>

                {/* Service */}
                <p className="text-xs font-medium text-slate-600 truncate">{appt.service}</p>

                {/* Branch */}
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                  <p className="text-xs text-slate-500 truncate">{LOCATIONS[appt.location] || appt.location}</p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-xs font-semibold text-slate-700">{appt.date}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={9} /> {appt.time}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={appt.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedItem(appt)}
                    className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 flex items-center justify-center text-sky-600 transition-colors"
                    title="View Details"
                  >
                    <Eye size={13} />
                  </button>

                  {/* Quick status dropdown */}
                  <div className="relative group">
                    <button
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                      title="Change Status"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-20 overflow-hidden hidden group-hover:block min-w-[130px]">
                      {STATUSES.filter((s) => s !== appt.status).map((s) => {
                        const conf = STATUS_CONFIG[s];
                        return (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(appt._id, s)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${conf.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                            {conf.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(appt._id, appt.name)}
                    className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
};

export default ManageAppointments;
