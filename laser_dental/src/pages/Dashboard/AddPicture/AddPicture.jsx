import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import {
  ImagePlus,
  Loader2,
  Sparkles,
  User,
  Stethoscope,
  Tag,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const IMG_BB_KEY = import.meta.env.VITE_image_host_key;

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
const selectCls = inputCls + " cursor-pointer appearance-none";

// ── Image uploader box ─────────────────────────────────────────────────────
const ImageUploader = ({ label, fieldName, preview, register, setValue, accent = "sky" }) => {
  const accentMap = {
    sky:     { border: "border-sky-300",     bg: "bg-sky-50",     hover: "hover:border-sky-400 hover:bg-sky-50/80",     icon: "text-sky-400",     badge: "bg-sky-100 text-sky-600"     },
    emerald: { border: "border-emerald-300", bg: "bg-emerald-50", hover: "hover:border-emerald-400 hover:bg-emerald-50/80", icon: "text-emerald-400", badge: "bg-emerald-100 text-emerald-600" },
    violet:  { border: "border-violet-300",  bg: "bg-violet-50",  hover: "hover:border-violet-400 hover:bg-violet-50/80",  icon: "text-violet-400",  badge: "bg-violet-100 text-violet-600"  },
  };
  const a = accentMap[accent];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {preview && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${a.badge}`}>
            <CheckCircle2 size={9} /> Uploaded
          </span>
        )}
      </div>
      <label
        className={`relative flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200 ${preview ? a.border : `border-slate-200 ${a.hover}`}`}
      >
        {preview ? (
          <>
            <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt={label} />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Upload size={11} /> Change
              </span>
            </div>
          </>
        ) : (
          <div className={`flex flex-col items-center gap-2 ${a.icon}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.bg}`}>
              <ImagePlus size={22} />
            </div>
            <span className="text-xs font-medium text-slate-500">Click to upload</span>
            <span className="text-[10px] text-slate-300">PNG, JPG, WEBP</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setValue(fieldName, e.target.files);
          }}
          {...register(fieldName)}
        />
      </label>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const AddPicture = () => {
  const axiosSecure = useAxiosSecure();
  const [preview, setPreview]   = useState({ mainImage: "", beforeImage: "", afterImage: "" });
  const [loading, setLoading]   = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { gender: "Male", category: "" },
  });

  // ── Upload helper ─────────────────────────────────────────────────────
  const uploadToImgBB = async (files) => {
    const file = files?.[0] || files;
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMG_BB_KEY}`,
      formData,
      { timeout: 20000 }
    );
    return res.data?.data?.display_url || "";
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (!IMG_BB_KEY) return Swal.fire("Error", "ImgBB API key missing", "error");
    setLoading(true);
    try {
      const [mainUrl, beforeUrl, afterUrl] = await Promise.all([
        uploadToImgBB(data.mainImage),
        uploadToImgBB(data.beforeImage),
        uploadToImgBB(data.afterImage),
      ]);

      const payload = {
        title:       data.title,
        category:    data.category,
        description: data.description,
        images:      { main: mainUrl, before: beforeUrl, after: afterUrl },
        patientInfo: {
          id:     data.patientId,
          age:    Number(data.age),
          gender: data.gender,
        },
        treatmentInfo: {
          name:     data.treatment,
          duration: data.duration,
          sessions: Number(data.sessions),
        },
        tags:      data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        status:    "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await axiosSecure.post("/gallery", payload);

      Swal.fire({ icon: "success", title: "Case Study Added!", text: "Successfully published to gallery.", confirmButtonColor: "#0ea5e9" });
      reset();
      setPreview({ mainImage: "", beforeImage: "", afterImage: "" });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-sky-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">Gallery CMS</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">Add New Case Study</h1>
          <p className="text-slate-400 text-sm mt-1">Upload before/after treatment photos with patient and treatment details.</p>
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
                Case Study Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* Title + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Title" icon={FileText} required error={errors.title?.message}>
                    <input
                      placeholder="e.g. Smile Makeover"
                      className={inputCls}
                      {...register("title", { required: "Title is required" })}
                    />
                  </Field>
                  <Field label="Category" icon={Tag} required error={errors.category?.message}>
                    <div className="relative">
                      <select
                        className={selectCls}
                        {...register("category", { required: "Category is required" })}
                      >
                        <option value="">Select...</option>
                        {["Whitening", "Implant", "Braces", "Root Canal", "Scaling", "Cosmetic", "Other"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                {/* Images */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <ImagePlus size={11} className="text-sky-500" /> Treatment Photos
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Main Photo",   field: "mainImage",   accent: "sky"     },
                      { label: "Before Photo", field: "beforeImage", accent: "emerald" },
                      { label: "After Photo",  field: "afterImage",  accent: "violet"  },
                    ].map(({ label, field, accent }) => (
                      <div key={field} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                          {preview[field] && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                              accent === "sky" ? "bg-sky-100 text-sky-600" :
                              accent === "emerald" ? "bg-emerald-100 text-emerald-600" :
                              "bg-violet-100 text-violet-600"
                            }`}>
                              <CheckCircle2 size={8} /> Done
                            </span>
                          )}
                        </div>
                        <label className={`relative flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200 ${
                          preview[field]
                            ? accent === "sky" ? "border-sky-300" : accent === "emerald" ? "border-emerald-300" : "border-violet-300"
                            : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"
                        }`}>
                          {preview[field] ? (
                            <>
                              <img src={preview[field]} className="absolute inset-0 w-full h-full object-cover" alt={label} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] font-semibold bg-black/50 px-2 py-1 rounded-full">Change</span>
                              </div>
                            </>
                          ) : (
                            <div className={`flex flex-col items-center gap-1.5 ${
                              accent === "sky" ? "text-sky-400" : accent === "emerald" ? "text-emerald-400" : "text-violet-400"
                            }`}>
                              <ImagePlus size={20} />
                              <span className="text-[10px] text-slate-400 font-medium">Upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setValue(field, e.target.files, { shouldValidate: true });
                              setPreview((p) => ({ ...p, [field]: URL.createObjectURL(file) }));
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient info */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <User size={11} className="text-sky-500" /> Patient Info
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Patient ID">
                      <input {...register("patientId")} placeholder="P-001" className={inputCls} />
                    </Field>
                    <Field label="Age">
                      <input {...register("age")} type="number" placeholder="28" className={inputCls} />
                    </Field>
                    <Field label="Gender">
                      <div className="relative">
                        <select {...register("gender")} className={selectCls}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Treatment info */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Stethoscope size={11} className="text-sky-500" /> Treatment Info
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Field label="Treatment Name">
                        <input {...register("treatment")} placeholder="Laser Whitening" className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Sessions">
                      <input {...register("sessions")} type="number" placeholder="3" className={inputCls} />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Duration">
                      <input {...register("duration")} placeholder="e.g. 2 weeks" className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* Description */}
                <Field label="Description" icon={FileText}>
                  <textarea
                    {...register("description")}
                    placeholder="Brief summary of the treatment and outcome..."
                    rows={3}
                    className={inputCls + " resize-none"}
                  />
                </Field>

                {/* Tags */}
                <Field label="Tags" icon={Tag}>
                  <input
                    {...register("tags")}
                    placeholder="whitening, cosmetic, painless (comma separated)"
                    className={inputCls}
                  />
                </Field>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 shadow-lg shadow-sky-200"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                  ) : (
                    <><ImagePlus size={16} /> Publish Case Study</>
                  )}
                </button>
              </form>
            </div>

            {/* ── RIGHT: Preview (2/5) ── */}
            <div className="lg:col-span-2 p-7 md:p-9 bg-slate-50 flex flex-col gap-5">
              <h2 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-violet-500" />
                Image Preview
              </h2>

              {/* Main */}
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Main Photo</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                </div>
                {preview.mainImage ? (
                  <img src={preview.mainImage} className="w-full h-40 object-cover" alt="main" />
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-300">
                    <ImagePlus size={28} />
                  </div>
                )}
              </div>

              {/* Before / After side by side */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "beforeImage", label: "Before", color: "bg-emerald-400" },
                  { key: "afterImage",  label: "After",  color: "bg-violet-400"  },
                ].map(({ key, label, color }) => (
                  <div key={key} className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                    </div>
                    {preview[key] ? (
                      <img src={preview[key]} className="w-full h-28 object-cover" alt={label} />
                    ) : (
                      <div className="h-28 flex items-center justify-center text-slate-300">
                        <ImagePlus size={20} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 flex flex-col gap-2 text-xs text-slate-400">
                <p className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider mb-1">Tips</p>
                <p>• Use high resolution images (min 800×600)</p>
                <p>• Before/after should be same angle</p>
                <p>• Main image will be shown in gallery grid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPicture;
