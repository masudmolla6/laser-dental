// pages/Dashboard/Branches/ManageBranches.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Plus, MapPin, Phone, Clock, Pencil, Trash2, ToggleLeft,
  ToggleRight, Building2, CalendarOff, Loader2, AlertCircle,
  GripVertical,
} from "lucide-react";
import useBranchesSecure from "../../../hooks/useBranchesSecure";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// ── Skeleton ───────────────────────────────────────────────────────────────
const BranchesSkeleton = () => (
  <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-48 h-7 bg-slate-200 rounded mb-2 animate-pulse" />
          <div className="w-64 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="w-36 h-10 bg-slate-200 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
            <div className="w-24 h-5 bg-slate-200 rounded-full mb-4" />
            <div className="w-3/4 h-6 bg-slate-200 rounded mb-3" />
            <div className="w-full h-4 bg-slate-100 rounded mb-2" />
            <div className="w-2/3 h-4 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Branch Card ────────────────────────────────────────────────────────────
const BranchCard = ({ branch, onToggle, onDelete, isLast, togglingId, deletingId }) => {
  const isToggling = togglingId === branch._id;
  const isDeleting = deletingId === branch._id;

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
        branch.isActive
          ? "border-slate-100 shadow-sm hover:shadow-md"
          : "border-slate-200 opacity-70"
      }`}
    >
      {/* Top status bar */}
      <div
        className={`h-1 w-full ${
          branch.isActive
            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
            : "bg-slate-300"
        }`}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                branch.isActive ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">
                {branch.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {branch.area}, {branch.city || "Dhaka"}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0 ${
              branch.isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {branch.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Address */}
        {branch.address && (
          <div className="flex items-start gap-2 text-sm text-slate-500 mb-2.5">
            <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <span>{branch.address}</span>
          </div>
        )}

        {/* Phone */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2.5">
          <Phone size={14} className="text-slate-400 flex-shrink-0" />
          <span>{branch.phone}</span>
        </div>

        {/* Hours */}
        {branch.hours?.length > 0 && (
          <div className="space-y-1 mb-2.5">
            {branch.hours.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={14} className="text-slate-400 flex-shrink-0" />
                <span>{h.days}: {h.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Closed days */}
        {branch.closedDays?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-red-400 font-medium mb-4">
            <CalendarOff size={14} className="flex-shrink-0" />
            <span>Closed: {branch.closedDays.join(", ")}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <Link
            to={`/dashboard/editBranch/${branch._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 transition-colors"
          >
            <Pencil size={13} /> Edit
          </Link>

          <button
            onClick={() => onToggle(branch)}
            disabled={isToggling}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-colors disabled:opacity-60 ${
              branch.isActive
                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {isToggling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : branch.isActive ? (
              <ToggleLeft size={13} />
            ) : (
              <ToggleRight size={13} />
            )}
            {branch.isActive ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={() => onDelete(branch)}
            disabled={isLast || isDeleting}
            title={isLast ? "Can't delete the only remaining branch" : "Delete branch"}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-red-100 text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const ManageBranches = () => {
  const [branches, isLoading, refetch, error] = useBranchesSecure();
  const axiosSecure = useAxiosSecure();
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleToggle = async (branch) => {
    setTogglingId(branch._id);
    try {
      const res = await axiosSecure.patch(`/branches/${branch._id}`, {
        isActive: !branch.isActive,
      });
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: branch.isActive ? "Branch Deactivated" : "Branch Activated",
          text: branch.isActive
            ? `${branch.name} is now hidden from the appointment form.`
            : `${branch.name} is now visible on the appointment form.`,
          confirmButtonColor: "#0284c7",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Could not update branch status.",
        confirmButtonColor: "#0284c7",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (branch) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this branch?",
      html: `Are you sure you want to delete <strong>${branch.name}</strong>?<br/><span style="font-size:12px;color:#94a3b8">Existing appointments under this branch will keep their records.</span>`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(branch._id);
    try {
      const res = await axiosSecure.delete(`/branches/${branch._id}`);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: `${branch.name} has been removed.`,
          confirmButtonColor: "#0284c7",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err?.response?.data?.message || "Could not delete this branch.",
        confirmButtonColor: "#0284c7",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <BranchesSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              Manage Branches
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Add, edit, or deactivate clinic locations
            </p>
          </div>
          <Link
            to="/dashboard/addBranch"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-sky-500 shadow-md shadow-sky-200 hover:brightness-105 transition-all"
          >
            <Plus size={16} /> Add Branch
          </Link>
        </div>

        {/* Stats bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5 mb-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">
                {branches.filter((b) => b.isActive).length}
              </span>{" "}
              Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">
                {branches.filter((b) => !b.isActive).length}
              </span>{" "}
              Inactive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-slate-400" />
            <span className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">{branches.length}</span> Total
              Branches
            </span>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-3 text-red-600 mb-6">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm">Failed to load branches. Please refresh the page.</p>
          </div>
        )}

        {/* Empty state */}
        {!error && branches.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Building2 size={28} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No branches yet</h3>
            <p className="text-sm text-slate-400 mb-5">
              Add your first clinic location to get started
            </p>
            <Link
              to="/dashboard/addBranch"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors"
            >
              <Plus size={15} /> Add Branch
            </Link>
          </div>
        )}

        {/* Branch grid */}
        {branches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {branches.map((branch) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                onToggle={handleToggle}
                onDelete={handleDelete}
                isLast={branches.length <= 1}
                togglingId={togglingId}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}

        {/* Helper note */}
        <div className="mt-6 flex items-start gap-2.5 text-xs text-slate-400 bg-slate-100/60 rounded-xl p-4">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <p>
            Deactivating a branch hides it from the appointment booking form immediately,
            but doesn't affect existing appointment records. You can't delete the last
            remaining branch — add a new one first if you need to replace it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageBranches;
