import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useReviewsSecure from "../../../hooks/useReviewsSecure";
import {
  Star, CheckCircle2, XCircle, Trash2, Eye,
  Search, Filter, RefreshCw, Loader2, X,
  Sparkles, ChevronDown, Package, MessageSquare
} from "lucide-react";
import Swal from "sweetalert2";

// ── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:  { label: "Pending",  bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
  approved: { label: "Approved", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-500"     },
};

// ── Star display ──────────────────────────────────────────────────────────
const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={12}
        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
    ))}
  </div>
);

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
const DetailModal = ({ item, onClose, onApprove, onReject, onDelete, updating }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-lg">Review Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">ID: {item._id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 flex flex-col gap-5">

          {/* Patient */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: item.avatarBg || "#e0f2fe", color: item.avatarColor || "#0369a1" }}
            >
              {item.initials}
            </div>
            <div>
              <p className="font-bold text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.treatment}</p>
              <div className="mt-1.5">
                <StarDisplay rating={item.rating} />
              </div>
            </div>
            <div className="ml-auto">
              <StatusBadge status={item.status} />
            </div>
          </div>

          {/* Review text */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Review</p>
            <p className="text-sm text-slate-700 leading-relaxed">"{item.review}"</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Submitted</p>
              <p className="text-sm font-semibold text-slate-700">{item.date}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Rating</p>
              <p className="text-sm font-bold text-amber-600">{item.rating} / 5 ★</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            {item.status !== "approved" && (
              <button
                onClick={() => onApprove(item._id)}
                disabled={updating}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Approve
              </button>
            )}
            {item.status !== "rejected" && (
              <button
                onClick={() => onReject(item._id)}
                disabled={updating}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Reject
              </button>
            )}
            <button
              onClick={() => onDelete(item._id, item.name)}
              className="py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 flex items-center gap-2"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main ManageReviews ────────────────────────────────────────────────────
const ManageReviews = () => {
  const axiosSecure  = useAxiosSecure();
  const queryClient  = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("");
  const [search,       setSearch]       = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [updating,     setUpdating]     = useState(false);

  // ✅ useReviewsSecure hook — /reviews (admin, all statuses)
  const [reviews, isLoading, refetch] = useReviewsSecure(statusFilter);

  // ── Client-side search ────────────────────────────────────────────────
  const filtered = reviews.filter((r) =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.treatment?.toLowerCase().includes(search.toLowerCase()) ||
    r.review?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = {
    total:    reviews.length,
    pending:  reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  // ── Status update ─────────────────────────────────────────────────────
  const handleStatusUpdate = async (id, status) => {
    setUpdating(true);
    try {
      await axiosSecure.patch(`/reviews/${id}`, { status });
      queryClient.invalidateQueries(["admin-reviews"]);
      setSelectedItem((prev) => prev ? { ...prev, status } : null);
      Swal.fire({
        icon: "success",
        title: status === "approved" ? "Approved! ✅" : "Rejected",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "Failed to update review", "error");
    } finally {
      setUpdating(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
      setSelectedItem(null);
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    },
    onError: () => Swal.fire("Error", "Failed to delete", "error"),
  });

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Delete this review?",
      text: `Review by "${name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-7">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-sky-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Reviews</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">Manage Reviews</h1>
            <p className="text-slate-400 text-sm mt-1">Approve or reject patient reviews before they go live.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* ── Stats — clickable filter ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",    value: stats.total,    color: "from-sky-500 to-indigo-500",   bg: "bg-sky-50",     text: "text-sky-600"     },
            { label: "Pending",  value: stats.pending,  color: "from-amber-400 to-orange-400", bg: "bg-amber-50",   text: "text-amber-600"   },
            { label: "Approved", value: stats.approved, color: "from-emerald-500 to-teal-400", bg: "bg-emerald-50", text: "text-emerald-600" },
            { label: "Rejected", value: stats.rejected, color: "from-red-400 to-rose-400",     bg: "bg-red-50",     text: "text-red-500"     },
          ].map(({ label, value, color, bg, text }) => (
            <div
              key={label}
              onClick={() => setStatusFilter(label === "Total" ? "" : label.toLowerCase())}
              className={`rounded-2xl p-4 ${bg} border border-white shadow-sm flex items-center gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                (label === "Total" ? statusFilter === "" : statusFilter === label.toLowerCase())
                  ? "ring-2 ring-offset-1 ring-sky-400"
                  : ""
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
              placeholder="Search by name, treatment or review text..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <p className="text-sm text-slate-400 ml-auto">
            <span className="font-semibold text-slate-600">{filtered.length}</span> results
          </p>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-100 py-24 flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-sky-500" />
            <p className="text-slate-400 text-sm">Loading reviews...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 py-24 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <MessageSquare size={28} className="text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-semibold">No reviews found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
            </div>
          </div>
        )}

        {/* ── Reviews grid ── */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                {/* Color top bar by status */}
                <div className={`h-1 w-full ${
                  review.status === "approved" ? "bg-emerald-400" :
                  review.status === "rejected" ? "bg-red-400" :
                  "bg-amber-400"
                }`} />

                <div className="p-5 flex flex-col gap-4">
                  {/* Patient row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: review.avatarBg || "#e0f2fe", color: review.avatarColor || "#0369a1" }}
                    >
                      {review.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{review.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{review.treatment}</p>
                    </div>
                    <StatusBadge status={review.status} />
                  </div>

                  {/* Stars */}
                  <StarDisplay rating={review.rating} />

                  {/* Review text */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    "{review.review}"
                  </p>

                  {/* Date */}
                  <p className="text-[10px] text-slate-400">{review.date}</p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {/* View */}
                    <button
                      onClick={() => setSelectedItem(review)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                      title="View full review"
                    >
                      <Eye size={13} />
                    </button>

                    {/* Approve */}
                    {review.status !== "approved" && (
                      <button
                        onClick={() => handleStatusUpdate(review._id, "approved")}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 size={12} /> Approve
                      </button>
                    )}

                    {/* Reject */}
                    {review.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusUpdate(review._id, "rejected")}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(review._id, review.name)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
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
          onApprove={(id) => handleStatusUpdate(id, "approved")}
          onReject={(id)  => handleStatusUpdate(id, "rejected")}
          onDelete={handleDelete}
          updating={updating}
        />
      )}
    </div>
  );
};

export default ManageReviews;
