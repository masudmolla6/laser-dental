import { useState } from "react";
import {
  Video,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Plus,
  X,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Upload,
  Volume2,
  VolumeX,
  Repeat,
  PlayCircle,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useVideosSecure from "../../../hooks/useVideosSecure";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_cloudinary_cloud_name;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_cloudinary_upload_preset;

// ── Toggle row — shared between edit modal sections ─────────────────────────
const ToggleRow = ({ label, icon: Icon, value, onChange, activeColor = "sky" }) => {
  const colorMap = {
    emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
    sky: { bg: "bg-sky-100", text: "text-sky-700" },
  };
  const c = colorMap[activeColor];
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all w-full justify-between ${
        value ? `${c.bg} ${c.text}` : "bg-slate-100 text-slate-500"
      }`}
    >
      <span className="flex items-center gap-1.5">
        {Icon && <Icon size={13} />}
        {label}
      </span>
      <span>{value ? "On" : "Off"}</span>
    </button>
  );
};

// ── Delete confirmation modal ────────────────────────────────────────────────
const DeleteModal = ({ video, onCancel, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/55 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
        <AlertTriangle size={22} />
      </div>
      <h3 className="font-display text-lg font-bold text-slate-900 mb-1.5">
        Delete this video?
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        {video?.title || "This video"} will be permanently removed from the database.
        The file will remain on Cloudinary storage but won't be shown on the website.
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

// ── Edit modal — inline edit, with optional video file replacement ─────────
const EditVideoModal = ({ video, onCancel, onSaved }) => {
  const axiosSecure = useAxiosSecure();
  const [title, setTitle] = useState(video.title || "");
  const [isActive, setIsActive] = useState(video.isActive ?? false);
  const [autoplay, setAutoplay] = useState(video.autoplay ?? true);
  const [muted, setMuted] = useState(video.muted ?? true);
  const [loop, setLoop] = useState(video.loop ?? true);

  const [preview, setPreview] = useState(video.videoUrl);
  const [newVideoUrl, setNewVideoUrl] = useState(null);
  const [newThumbnailUrl, setNewThumbnailUrl] = useState(null);
  const [newPublicId, setNewPublicId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        return reject(new Error("Cloudinary cloud name or upload preset is missing"));
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Cloudinary upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  };

  const handleReplaceVideo = async (file) => {
    setUploading(true);
    setProgress(0);
    try {
      const data = await uploadToCloudinary(file);
      const autoThumbnail = data.secure_url.replace(/\.[^/.]+$/, ".jpg");
      setNewVideoUrl(data.secure_url);
      setNewThumbnailUrl(autoThumbnail);
      setNewPublicId(data.public_id);
      setPreview(data.secure_url);
      Swal.fire({ icon: "success", title: "New video uploaded", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      Swal.fire({ icon: "error", title: "Upload failed", text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        isActive,
        autoplay,
        muted,
        loop,
      };
      if (newVideoUrl) {
        payload.videoUrl = newVideoUrl;
        payload.thumbnailUrl = newThumbnailUrl;
        payload.cloudinaryPublicId = newPublicId;
      }

      await axiosSecure.patch(`/videos/${video._id}`, payload);

      Swal.fire({ icon: "success", title: "Video updated", timer: 1300, showConfirmButton: false });
      onSaved();
    } catch (err) {
      console.error("Update video error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
              <Pencil size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">Edit Video</h3>
              <p className="text-xs text-slate-400">Update details or replace the video file</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

          {/* Video preview / replace */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Video</span>
            <label
              className={`relative flex items-center justify-center h-44 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
                uploading ? "pointer-events-none" : "border-slate-200 hover:border-sky-300"
              }`}
            >
              <video
                src={preview}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
              {!uploading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Upload size={11} /> Replace video
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={22} className="animate-spin text-white" />
                  <span className="text-white text-xs font-semibold">{progress}%</span>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleReplaceVideo(file);
                }}
              />
            </label>
            {newVideoUrl && (
              <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={11} /> New video ready — will replace the old one when saved
              </p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Title / Caption
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Laser Dental Point — Clinic Tour"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2.5">
            <ToggleRow label="Autoplay" icon={PlayCircle} value={autoplay} onChange={setAutoplay} />
            <ToggleRow label="Muted" icon={muted ? VolumeX : Volume2} value={muted} onChange={setMuted} />
            <ToggleRow label="Loop" icon={Repeat} value={loop} onChange={setLoop} />
            <ToggleRow label="Active in Hero" icon={Star} value={isActive} onChange={setIsActive} activeColor="emerald" />
          </div>
          {isActive && !video.isActive && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1.5 -mt-1">
              <AlertTriangle size={11} />
              Activating this will automatically deactivate whichever video is currently live.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:brightness-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Video card ────────────────────────────────────────────────────────────────
const VideoCard = ({ video, onToggleActive, onEditClick, onDeleteClick, togglingId }) => {
  const [hovering, setHovering] = useState(false);
  const isToggling = togglingId === video._id;

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${video.isActive ? "border-emerald-200" : "border-slate-200 opacity-80"}`}
    >
      {/* Active/Inactive badge */}
      <div
        className={`absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm
          ${video.isActive ? "bg-emerald-500/95 text-white" : "bg-slate-500/95 text-white"}`}
      >
        {video.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
        {video.isActive ? "Live in Hero" : "Hidden"}
      </div>

      {/* Video / thumbnail preview — plays on hover */}
      <div
        className="h-48 w-full bg-gradient-to-br from-[#0c2340] to-[#0f2d52] relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {hovering ? (
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video size={40} className="text-white/20" />
          </div>
        )}
        {!hovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <PlayCircle size={22} className="text-white" />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display font-bold text-slate-900 text-sm leading-tight mb-1 truncate">
          {video.title || "Untitled video"}
        </h3>

        {/* Playback flags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500">
            <PlayCircle size={10} /> {video.autoplay ? "Autoplay" : "Manual"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500">
            {video.muted ? <VolumeX size={10} /> : <Volume2 size={10} />} {video.muted ? "Muted" : "Sound"}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500">
            <Repeat size={10} /> {video.loop ? "Loop" : "Once"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onEditClick(video)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors"
          >
            <Pencil size={13} />
            Edit
          </button>

          <button
            onClick={() => onToggleActive(video)}
            disabled={isToggling || video.isActive}
            title={video.isActive ? "This video is already live" : "Make this video live in the Hero"}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60
              ${video.isActive
                ? "text-emerald-600 bg-emerald-50 cursor-not-allowed"
                : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}
          >
            {isToggling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Star size={13} fill={video.isActive ? "currentColor" : "none"} />
            )}
            {video.isActive ? "Active" : "Make Active"}
          </button>

          <button
            onClick={() => onDeleteClick(video)}
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
const VideoCardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-4 w-2/3 bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-9 w-full bg-slate-100 rounded-xl mt-2" />
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const ManageVideos = () => {
  const [videos, isLoading, refetch] = useVideosSecure();
  const axiosSecure = useAxiosSecure();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const handleMakeActive = async (video) => {
    setTogglingId(video._id);
    try {
      await axiosSecure.patch(`/videos/${video._id}`, { isActive: true });
      await refetch();
      Swal.fire({
        icon: "success",
        title: "This video is now live in the Hero",
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
      await axiosSecure.delete(`/videos/${deleteTarget._id}`);
      await refetch();
      setDeleteTarget(null);
      Swal.fire({
        icon: "success",
        title: "Video deleted",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete video error:", error);
      Swal.fire({ icon: "error", title: "Failed to delete video" });
    } finally {
      setDeleting(false);
    }
  };

  const totalCount = videos?.length || 0;
  const activeVideo = (videos || []).find((v) => v.isActive);

  return (
    <div className="min-h-screen bg-slate-50 px-5 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                <Video size={14} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
                Hero Video
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              Manage Videos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {totalCount} total ·{" "}
              {activeVideo ? (
                <span className="text-emerald-600 font-semibold">"{activeVideo.title || "Untitled"}" is live</span>
              ) : (
                <span className="text-amber-600 font-semibold">No video is currently active</span>
              )}
            </p>
          </div>

          <Link
            to="/dashboard/videoUpload"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-br from-sky-600 to-indigo-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} />
            Upload Video
          </Link>
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl bg-white border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <Video size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-700 mb-1">No videos yet</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-5">
              Upload your first video to show it in the Home page Hero section.
            </p>
            <Link
              to="/dashboard/videoUpload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors"
            >
              <Plus size={15} />
              Upload Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onToggleActive={handleMakeActive}
                onEditClick={setEditTarget}
                onDeleteClick={setDeleteTarget}
                togglingId={togglingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {editTarget && (
        <EditVideoModal
          video={editTarget}
          onCancel={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            refetch();
          }}
        />
      )}

      {/* ── Delete modal ── */}
      {deleteTarget && (
        <DeleteModal
          video={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default ManageVideos;
