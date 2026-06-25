import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import {
  Video,
  Loader2,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ToggleLeft,
  ToggleRight,
  Repeat,
  Volume2,
  VolumeX,
  PlayCircle as AutoplayIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_cloudinary_cloud_name;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_cloudinary_upload_preset;

// ── Field wrapper ──────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, required, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-sky-500" />}
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";

// ── Toggle row (Active / Autoplay / Muted / Loop) ───────────────────────────
const ToggleRow = ({ label, sub, icon: Icon, value, onChange, activeColor = "emerald" }) => {
  const colorMap = {
    emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
    sky: { bg: "bg-sky-100", text: "text-sky-700" },
  };
  const c = colorMap[activeColor];
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white text-slate-400 border border-slate-200">
            <Icon size={16} />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-slate-700">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
          value ? `${c.bg} ${c.text}` : "bg-slate-200 text-slate-500"
        }`}
      >
        {value ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
        {value ? "On" : "Off"}
      </button>
    </div>
  );
};

// ── Video uploader box ───────────────────────────────────────────────────────
const VideoUploader = ({ preview, uploading, progress, onSelect }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Video File</span>
      {preview && !uploading && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={9} /> Uploaded
        </span>
      )}
    </div>
    <label
      className={`relative flex flex-col items-center justify-center h-56 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200 ${
        preview ? "border-sky-300" : "border-slate-200 hover:border-sky-400 hover:bg-sky-50/50"
      } ${uploading ? "pointer-events-none" : ""}`}
    >
      {preview ? (
        <video
          src={preview}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          autoPlay
          playsInline
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-sky-400">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-50">
            <Video size={22} />
          </div>
          <span className="text-xs font-medium text-slate-500">Click to upload a video</span>
          <span className="text-[10px] text-slate-300">MP4, WEBM, MOV</span>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3">
          <Loader2 size={26} className="animate-spin text-white" />
          <span className="text-white text-xs font-semibold">Uploading... {progress}%</span>
          <div className="w-2/3 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!uploading && preview && (
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Upload size={11} /> Change video
          </span>
        </div>
      )}

      <input
        type="file"
        accept="video/*"
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
        }}
      />
    </label>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
const VideoUpload = () => {
  const axiosSecure = useAxiosSecure();
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      videoUrl: "",
      thumbnailUrl: "",
      cloudinaryPublicId: "",
      isActive: true,
      autoplay: true,
      muted: true,
      loop: true,
    },
  });

  const watchedIsActive = watch("isActive");
  const watchedAutoplay = watch("autoplay");
  const watchedMuted = watch("muted");
  const watchedLoop = watch("loop");
  const watchedVideoUrl = watch("videoUrl");

  // ── Upload helper — uploads directly to Cloudinary (unsigned preset) ──────
  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        return reject(new Error("Cloudinary cloud name or upload preset is missing"));
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Using XHR directly (instead of axios) so we can track upload progress easily
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
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

  // ── File selected → upload immediately ─────────────────────────────────
  const handleFileSelect = async (file) => {
    setUploading(true);
    setProgress(0);
    try {
      const data = await uploadToCloudinary(file);

      // Cloudinary auto-generates a thumbnail by swapping the video
      // extension for .jpg on the same public path
      const autoThumbnail = data.secure_url.replace(/\.[^/.]+$/, ".jpg");

      setValue("videoUrl", data.secure_url);
      setValue("thumbnailUrl", autoThumbnail);
      setValue("cloudinaryPublicId", data.public_id);
      setPreview(data.secure_url);

      Swal.fire({
        icon: "success",
        title: "Video uploaded",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err.message || "Could not upload the video. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  // ── Submit → save metadata to MongoDB ──────────────────────────────────
  const onSubmit = async (data) => {
    if (!data.videoUrl) {
      return Swal.fire({ icon: "warning", title: "Please upload a video first" });
    }

    setSaving(true);
    try {
      const payload = {
        title: data.title.trim(),
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
        isActive: data.isActive,
        autoplay: data.autoplay,
        muted: data.muted,
        loop: data.loop,
      };

      await axiosSecure.post("/videos", payload);

      Swal.fire({
        icon: "success",
        title: "Video Added!",
        text: "Successfully saved to the database.",
        confirmButtonColor: "#0ea5e9",
      });

      reset();
      setPreview("");
      setProgress(0);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: err?.response?.data?.message || "Failed to save video",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-sky-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Video CMS</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">Add Hero Video</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload a video to replace the text panel in the Home page Hero section.
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.07)" }}>

          {/* top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

          <div className="grid lg:grid-cols-5 gap-0">

            {/* ── LEFT: Form (3/5) ── */}
            <div className="lg:col-span-3 p-7 md:p-9 border-r border-slate-100">
              <h2 className="font-semibold text-slate-700 text-sm mb-6 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-sky-500" />
                Video Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* Video uploader */}
                <VideoUploader
                  preview={preview}
                  uploading={uploading}
                  progress={progress}
                  onSelect={handleFileSelect}
                />

                {/* Title */}
                <Field label="Title / Caption (optional)" icon={FileText}>
                  <input
                    {...register("title")}
                    placeholder="e.g. Laser Dental Point — Clinic Tour"
                    className={inputCls}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    For your own reference in the admin panel — not shown publicly.
                  </p>
                </Field>

                {/* Playback toggles */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <PlayCircle size={11} className="text-sky-500" /> Playback Settings
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ToggleRow
                      label="Autoplay"
                      sub="Plays automatically on load"
                      icon={AutoplayIcon}
                      value={watchedAutoplay}
                      onChange={(v) => setValue("autoplay", v)}
                      activeColor="sky"
                    />
                    <ToggleRow
                      label="Muted"
                      sub="Required for autoplay to work"
                      icon={watchedMuted ? VolumeX : Volume2}
                      value={watchedMuted}
                      onChange={(v) => setValue("muted", v)}
                      activeColor="sky"
                    />
                    <ToggleRow
                      label="Loop"
                      sub="Restarts automatically when it ends"
                      icon={Repeat}
                      value={watchedLoop}
                      onChange={(v) => setValue("loop", v)}
                      activeColor="sky"
                    />
                    <ToggleRow
                      label="Active in Hero"
                      sub="Shown on the live website right now"
                      value={watchedIsActive}
                      onChange={(v) => setValue("isActive", v)}
                      activeColor="emerald"
                    />
                  </div>
                  {watchedAutoplay && !watchedMuted && (
                    <p className="text-[11px] text-amber-600 mt-2 flex items-center gap-1.5">
                      <AlertCircle size={11} />
                      Most browsers block autoplay with sound. Keep "Muted" on if Autoplay is on.
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving || uploading || !watchedVideoUrl}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-lg shadow-sky-200"
                >
                  {saving ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Video size={16} /> Save Video</>
                  )}
                </button>
              </form>
            </div>

            {/* ── RIGHT: Preview (2/5) ── */}
            <div className="lg:col-span-2 p-7 md:p-9 bg-slate-50 flex flex-col gap-5">
              <h2 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-violet-500" />
                Hero Preview
              </h2>

              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Video Preview</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                </div>
                {preview ? (
                  <video
                    src={preview}
                    className="w-full h-48 object-cover"
                    muted={watchedMuted}
                    loop={watchedLoop}
                    autoPlay={watchedAutoplay}
                    playsInline
                    controls={!watchedAutoplay}
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-300">
                    <Video size={28} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 flex flex-col gap-2 text-xs text-slate-400">
                <p className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider mb-1">Tips</p>
                <p>• Use a 16:9 or vertical video, under 30 seconds works best</p>
                <p>• Keep file size small (under 15–20MB) for fast loading</p>
                <p>• Turning this video "Active" will replace whichever video is currently live</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
