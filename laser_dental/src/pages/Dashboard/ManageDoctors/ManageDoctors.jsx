import { useState } from "react";
import {
  UserRound,
  Pencil,
  Trash2,
  MapPin,
  Star,
  BadgeCheck,
  Eye,
  EyeOff,
  Plus,
  Search,
  X,
  AlertTriangle,
  Loader2,
  GraduationCap,
  FileBadge,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useBranchesSecure from "../../../hooks/useBranchesSecure";
import useDoctorsSecure from "../../../hooks/useDoctorsSecure";


// ── Tiny stat chip used inside each doctor card ─────────────────────────────
const StatChip = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
    <Icon size={12} style={{ color }} />
    <span className="text-[11px] font-semibold text-slate-600">{value}</span>
    <span className="text-[10px] text-slate-400">{label}</span>
  </div>
);

// ── Delete confirmation modal ────────────────────────────────────────────────
const DeleteModal = ({ doctor, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
        <AlertTriangle size={22} />
      </div>
      <h3 className="font-display text-lg font-bold text-slate-900 mb-1.5">
        Delete {doctor?.name}?
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        This doctor's profile will be permanently removed from the website.
        This action can't be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={14} />}
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Doctor card ──────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, branchMap, onToggleActive, onDeleteClick, togglingId }) => {
  const branchNames = (doctor.branchSlugs || [])
    .map((slug) => branchMap[slug] || slug)
    .filter(Boolean);

  const isToggling = togglingId === doctor._id;

  // Count how many degrees actually have a certificate image uploaded
  const totalDegrees = doctor.degrees?.length || 0;
  const certifiedDegrees = (doctor.degrees || []).filter(
    (d) => d?.certificateImage?.trim()
  ).length;

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${doctor.isActive ? "border-slate-200" : "border-slate-200 opacity-70"}`}
    >
      {/* Featured ribbon */}
      {doctor.isFeatured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/95 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
          <Star size={10} fill="white" />
          Featured
        </div>
      )}

      {/* Active/Inactive badge */}
      <div
        className={`absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm
          ${doctor.isActive ? "bg-emerald-500/95 text-white" : "bg-slate-500/95 text-white"}`}
      >
        {doctor.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
        {doctor.isActive ? "Live" : "Hidden"}
      </div>

      {/* Photo */}
      <div className="h-48 w-full bg-gradient-to-br from-[#0c2340] to-[#0f2d52] relative overflow-hidden">
        {doctor.photo ? (
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserRound size={48} className="text-white/20" />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-slate-900 text-base leading-tight">
            {doctor.name}
          </h3>
          <BadgeCheck size={16} className="text-sky-500 flex-shrink-0 mt-0.5" />
        </div>
        <p className="text-xs font-semibold text-sky-600 mb-3">{doctor.title}</p>

        {/* Degrees count + certificate indicator */}
        {totalDegrees > 0 && (
          <div className="flex items-center gap-3 mb-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <GraduationCap size={12} className="text-slate-400" />
              <span>{totalDegrees} qualification{totalDegrees > 1 ? "s" : ""}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 ${
                certifiedDegrees === totalDegrees
                  ? "text-emerald-600"
                  : certifiedDegrees > 0
                  ? "text-amber-600"
                  : "text-slate-400"
              }`}
              title={`${certifiedDegrees} of ${totalDegrees} have a certificate photo uploaded`}
            >
              <FileBadge size={12} />
              <span>{certifiedDegrees}/{totalDegrees} certified</span>
            </div>
          </div>
        )}

        {/* Branch tags */}
        {branchNames.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {branchNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-semibold"
              >
                <MapPin size={10} />
                {name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 italic mb-4">No branch assigned</p>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <StatChip icon={Star} label="specs" value={doctor.specializations?.length || 0} color="#f59e0b" />
          <StatChip icon={BadgeCheck} label="wins" value={doctor.achievements?.length || 0} color="#10b981" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <Link
            to={`/dashboard/editDoctor/${doctor._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors"
          >
            <Pencil size={13} />
            Edit
          </Link>

          <button
            onClick={() => onToggleActive(doctor)}
            disabled={isToggling}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60
              ${doctor.isActive
                ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}
          >
            {isToggling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : doctor.isActive ? (
              <EyeOff size={13} />
            ) : (
              <Eye size={13} />
            )}
            {doctor.isActive ? "Hide" : "Show"}
          </button>

          <button
            onClick={() => onDeleteClick(doctor)}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex-shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton loader ──────────────────────────────────────────────────────────
const DoctorCardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-4 w-2/3 bg-slate-200 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-9 w-full bg-slate-100 rounded-xl mt-2" />
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const ManageDoctors = () => {
  const [doctors, isLoading, refetch] = useDoctorsSecure();
  const [branches] = useBranchesSecure();
  const axiosSecure = useAxiosSecure();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | active | inactive
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // slug -> name map, for showing readable branch names on the card
  const branchMap = (branches || []).reduce((acc, b) => {
    acc[b.slug] = b.name || b.area;
    return acc;
  }, {});

  const filteredDoctors = (doctors || []).filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && doc.isActive) ||
      (filterStatus === "inactive" && !doc.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = async (doctor) => {
    setTogglingId(doctor._id);
    try {
      await axiosSecure.patch(`/doctors/${doctor._id}`, {
        isActive: !doctor.isActive,
      });
      await refetch();
      Swal.fire({
        icon: "success",
        title: !doctor.isActive ? "Doctor is now live" : "Doctor hidden from site",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Toggle active error:", error);
      Swal.fire({ icon: "error", title: "Something went wrong" });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosSecure.delete(`/doctors/${deleteTarget._id}`);
      await refetch();
      setDeleteTarget(null);
      Swal.fire({
        icon: "success",
        title: "Doctor deleted",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete doctor error:", error);
      Swal.fire({ icon: "error", title: "Failed to delete doctor" });
    } finally {
      setDeleting(false);
    }
  };

  const totalCount = doctors?.length || 0;
  const activeCount = (doctors || []).filter((d) => d.isActive).length;
  const featuredCount = (doctors || []).filter((d) => d.isFeatured).length;

  return (
    <div className="min-h-screen bg-slate-50 px-5 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                <UserRound size={14} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
                Doctors
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              Manage Doctors
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {totalCount} total · {activeCount} live · {featuredCount} featured
            </p>
          </div>

          <Link
            to="/dashboard/addDoctor"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-br from-sky-600 to-indigo-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} />
            Add Doctor
          </Link>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or title..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-colors
                  ${filterStatus === status
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl bg-white border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <UserRound size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-700 mb-1">
              {totalCount === 0 ? "No doctors yet" : "No matching doctors"}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mb-5">
              {totalCount === 0
                ? "Add your first doctor profile to get started."
                : "Try a different search term or filter."}
            </p>
            {totalCount === 0 && (
              <Link
                to="/dashboard/addDoctor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors"
              >
                <Plus size={15} />
                Add Doctor
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                branchMap={branchMap}
                onToggleActive={handleToggleActive}
                onDeleteClick={setDeleteTarget}
                togglingId={togglingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Delete modal ── */}
      {deleteTarget && (
        <DeleteModal
          doctor={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default ManageDoctors;
