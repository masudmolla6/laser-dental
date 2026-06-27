import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  AlignLeft,
  AlignRight,
  Trash2,
  Pencil,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const BannerCard = ({ banner, refetch, onEditClick }) => {
  const axiosSecure = useAxiosSecure();
  const [imgError,   setImgError]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // ── Delete ───────────────────────────────────────────────────────────
  const handleDelete = () => {
    Swal.fire({
      title: "Delete this banner?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      setIsDeleting(true);
      try {
        await axiosSecure.delete(`/banners/${banner._id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          icon: "success",
          confirmButtonColor: "#0ea5e9",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", err?.response?.data?.message || "Delete failed", "error");
      } finally {
        setIsDeleting(false);
      }
    });
  };

  // ── Toggle ───────────────────────────────────────────────────────────
  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await axiosSecure.patch(`/banners/${banner._id}`, {
        isActive: !banner.isActive,
      });
      refetch();
    } catch (err) {
      console.error("Toggle error:", err);
      Swal.fire("Error", err?.response?.data?.message || "Toggle failed", "error");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border transition-all duration-200"
      style={{
        borderColor: banner.isActive ? "#bae6fd" : "#e2e8f0",
        boxShadow: banner.isActive
          ? "0 4px 20px rgba(14,165,233,0.08)"
          : "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      {/* Image */}
      <div className="relative h-44 bg-slate-100">
        {!imgError ? (
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AlertCircle size={28} className="text-slate-300" />
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              banner.align === "right"
                ? "linear-gradient(to left, rgba(5,15,35,0.7) 0%, transparent 60%)"
                : "linear-gradient(to right, rgba(5,15,35,0.7) 0%, transparent 60%)",
          }}
        />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              background: banner.isActive ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.25)",
              border: `1px solid ${banner.isActive ? "rgba(34,197,94,0.4)" : "rgba(148,163,184,0.3)"}`,
              color: banner.isActive ? "#4ade80" : "#94a3b8",
            }}
          >
            {banner.isActive ? "● Active" : "○ Inactive"}
          </span>
        </div>

        {/* Align badge */}
        <div className="absolute top-3 right-3">
          <span
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
            }}
          >
            {banner.align === "right" ? (
              <><AlignRight size={10} /> Right</>
            ) : (
              <><AlignLeft size={10} /> Left</>
            )}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 text-sm leading-tight">
            {banner.title}{" "}
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(90deg, #0284c7, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {banner.accentTitle}
            </span>
          </h3>
          <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {banner.subtitle}
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <span className="text-xs font-semibold text-slate-600">{banner.buttonText}</span>
          <span className="text-slate-300">→</span>
          <span className="text-xs text-sky-500 truncate">{banner.buttonLink}</span>
        </div>

        <p className="text-[11px] text-slate-400 mb-4">
          Added:{" "}
          {new Date(banner.createdAt).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEditClick(banner)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-sky-200 text-sky-600 bg-sky-50 hover:bg-sky-100 transition-all active:scale-95"
          >
            <Pencil size={13} />
          </button>

          <button
            onClick={handleToggle}
            disabled={isToggling}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 disabled:opacity-50"
            style={
              banner.isActive
                ? { borderColor: "#fca5a5", color: "#ef4444", background: "#fef2f2" }
                : { borderColor: "#86efac", color: "#16a34a", background: "#f0fdf4" }
            }
          >
            {isToggling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : banner.isActive ? (
              <><ToggleRight size={14} /> Deactivate</>
            ) : (
              <><ToggleLeft size={14} /> Activate</>
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;