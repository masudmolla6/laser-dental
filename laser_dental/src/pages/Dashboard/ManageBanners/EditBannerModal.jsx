import { useState } from "react";
import axios from "axios";
import {
  X,
  Save,
  Loader2,
  ImagePlus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Type,
  Sparkles,
  MousePointerClick,
  Link2,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const IMG_BB_KEY = import.meta.env.VITE_image_host_key;

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";

const Field = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-sky-500" />}
      {label}
    </label>
    {children}
  </div>
);

// ── Edit modal — inline edit, with optional image replacement ──────────────
const EditBannerModal = ({ banner, onCancel, onSaved }) => {
  const axiosSecure = useAxiosSecure();

  const [title, setTitle] = useState(banner.title || "");
  const [accentTitle, setAccentTitle] = useState(banner.accentTitle || "");
  const [subtitle, setSubtitle] = useState(banner.subtitle || "");
  const [buttonText, setButtonText] = useState(banner.buttonText || "");
  const [buttonLink, setButtonLink] = useState(banner.buttonLink || "");
  const [align, setAlign] = useState(banner.align || "left");

  const [preview, setPreview] = useState(banner.image);
  const [newImageUrl, setNewImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Upload helper — same as AddBanner.jsx ──────────────────────────────
  const handleReplaceImage = async (file) => {
    if (!IMG_BB_KEY) {
      return Swal.fire({ icon: "error", title: "Upload key missing", text: "ImgBB API key is not configured." });
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMG_BB_KEY}`,
        formData,
        { timeout: 15000 }
      );

      const url = res.data?.data?.display_url;
      if (!url) throw new Error("ImgBB did not return an image URL");

      setNewImageUrl(url);
      setPreview(url);
      Swal.fire({ icon: "success", title: "New image uploaded", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("ImgBB upload error:", err);
      Swal.fire({ icon: "error", title: "Upload failed", text: err.message || "Could not upload the image." });
    } finally {
      setUploading(false);
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim() || !accentTitle.trim() || !subtitle.trim()) {
      return Swal.fire({ icon: "warning", title: "Title, accent title and subtitle are required" });
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        accentTitle: accentTitle.trim(),
        subtitle: subtitle.trim(),
        buttonText: buttonText.trim(),
        buttonLink: buttonLink.trim(),
        align,
      };
      if (newImageUrl) {
        payload.image = newImageUrl;
      }

      await axiosSecure.patch(`/banners/${banner._id}`, payload);

      Swal.fire({ icon: "success", title: "Banner updated", timer: 1300, showConfirmButton: false });
      onSaved();
    } catch (err) {
      console.error("Update banner error:", err);
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
              <ImagePlus size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">Edit Banner</h3>
              <p className="text-xs text-slate-400">Update slide details or replace the image</p>
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

          {/* Image preview / replace */}
          <Field label="Banner Image">
            <label
              className={`relative flex items-center justify-center h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
                uploading ? "pointer-events-none" : "border-slate-200 hover:border-sky-300"
              }`}
            >
              <img src={preview} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
              {!uploading && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Upload size={11} /> Replace image
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin text-white" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleReplaceImage(file);
                }}
              />
            </label>
            {newImageUrl && (
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 size={11} /> New image ready — will replace the old one when saved
              </p>
            )}
          </Field>

          {/* Title + Accent title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Main Title" icon={Type}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Laser-Powered"
                className={inputCls}
              />
            </Field>
            <Field label="Accent Title (gradient text)" icon={Sparkles}>
              <input
                value={accentTitle}
                onChange={(e) => setAccentTitle(e.target.value)}
                placeholder="e.g. Dental Care"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Subtitle */}
          <Field label="Subtitle / Description">
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Short description shown below the heading..."
              rows={3}
              className={inputCls + " resize-none"}
            />
          </Field>

          {/* Button text + link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Button Text" icon={MousePointerClick}>
              <input
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g. Book Now"
                className={inputCls}
              />
            </Field>
            <Field label="Button Link" icon={Link2}>
              <input
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                placeholder="/appointment"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Alignment */}
          <Field label="Text Alignment">
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "left", Ic: AlignLeft, label: "Left" },
                { val: "right", Ic: AlignRight, label: "Right" },
              ].map(({ val, Ic, label }) => {
                const selected = align === val;
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAlign(val)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all"
                    style={{
                      borderColor: selected ? "#0ea5e9" : "#e2e8f0",
                      background: selected ? "#f0f9ff" : "#f8fafc",
                    }}
                  >
                    <Ic size={16} className={selected ? "text-sky-500" : "text-slate-400"} />
                    <span className={`text-sm font-semibold ${selected ? "text-sky-600" : "text-slate-500"}`}>
                      {label}
                    </span>
                    {selected && <CheckCircle2 size={14} className="text-sky-500 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </Field>
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

export default EditBannerModal;