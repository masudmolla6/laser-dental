import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ImagePlus,
  Type,
  AlignLeft,
  AlignRight,
  Link2,
  MousePointerClick,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const IMG_BB_KEY = import.meta.env.VITE_image_host_key;

// ── Field wrapper ──────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-sky-500" />}
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const inputCls = (hasErr) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-slate-50 outline-none transition-all duration-200 placeholder-slate-400 focus:bg-white focus:ring-2 ${
    hasErr
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
  }`;

// ── Main Component ─────────────────────────────────────────────────────────
const AddBanner = () => {
  const [preview, setPreview] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues: { align: "left" } });

  const watchTitle    = watch("title", "");
  const watchAccent   = watch("accentTitle", "");
  const watchSubtitle = watch("subtitle", "");
  const watchBtnText  = watch("buttonText", "");
  const watchAlign    = watch("align", "left");

  // ── Image change ──────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", e.target.files, { shouldValidate: true });
    clearErrors("image");
    setPreview(URL.createObjectURL(file));
  };

  // ── Mutation ──────────────────────────────────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: async (bannerData) => {
      const res = await axiosSecure.post("/banners", bannerData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Banner Added!",
        text: "The new banner slide is now live.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      });
      reset();
      setPreview("");
    },
    onError: (err) => {
      console.error("Backend error:", err?.response?.data || err.message);
      Swal.fire({
        title: "Upload Failed",
        text: err?.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  // ── Submit ────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      // Debug logs
      const token = localStorage.getItem("access-token");
      console.log("Token:", token ? "exists ✅" : "MISSING ❌");
      console.log("ImgBB key:", IMG_BB_KEY ? "exists ✅" : "MISSING ❌");

      const imageFile = data.image?.[0];
      if (!imageFile) {
        return Swal.fire("Error", "Image is required", "error");
      }
      if (!IMG_BB_KEY) {
        return Swal.fire("Error", "ImgBB API key missing in .env", "error");
      }

      // 1. ImgBB upload
      const formData = new FormData();
      formData.append("image", imageFile);
      console.log("Uploading to ImgBB...");

      const imageRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMG_BB_KEY}`,
        formData,
        { timeout: 15000 }
      );

      const imageUrl = imageRes.data?.data?.display_url;
      if (!imageUrl) {
        return Swal.fire("Error", "ImgBB did not return image URL", "error");
      }
      console.log("ImgBB done:", imageUrl);

      // 2. Banner object
      const bannerInfo = {
        title:       data.title,
        accentTitle: data.accentTitle,
        subtitle:    data.subtitle,
        image:       imageUrl,
        buttonText:  data.buttonText,
        buttonLink:  data.buttonLink,
        align:       data.align,
        isActive:    true,
        order:       Date.now(),
      };
      console.log("Sending to backend:", bannerInfo);

      // 3. Backend
      mutate(bannerInfo);

    } catch (error) {
      console.error("Submit error:", error?.response?.data || error.message);
      if (error.code === "ECONNABORTED") {
        Swal.fire("Timeout", "ImgBB upload timed out. Check your internet.", "error");
      } else {
        Swal.fire("Failed", error?.response?.data?.message || error.message, "error");
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-slate-100 p-4 md:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .preview-text-shadow { text-shadow: 0 2px 12px rgba(0,0,0,0.5); }
      `}</style>

      <div className="max-w-5xl mx-auto fade-up">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-sky-500" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">
              Banner Manager
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800">
            Add New Banner Slide
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload an image and fill in the details — your homepage carousel will update automatically.
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl overflow-hidden border border-slate-100"
          style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.07)" }}
        >
          <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, #0284c7, #6366f1, #0ea5e9)" }}
          />

          <div className="grid lg:grid-cols-2 gap-0">

            {/* LEFT: Form */}
            <div className="p-7 md:p-9 border-r border-slate-100">
              <h2 className="font-semibold text-slate-700 text-base mb-6 flex items-center gap-2"> 
                <div className="w-1 h-5 rounded-full bg-sky-500" />
                Slide Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                <Field label="Main Title" icon={Type} error={errors.title?.message}>
                  <input
                    placeholder="e.g. Laser-Powered"
                    className={inputCls(!!errors.title)}
                    {...register("title", { required: "Title is required" })}
                  />
                </Field>

                <Field label="Accent Title (gradient text)" icon={Sparkles} error={errors.accentTitle?.message}>
                  <input
                    placeholder="e.g. Dental Care"
                    className={inputCls(!!errors.accentTitle)}
                    {...register("accentTitle", { required: "Accent title is required" })}
                  />
                </Field>

                <Field label="Subtitle / Description" error={errors.subtitle?.message}>
                  <textarea
                    placeholder="Short description shown below the heading..."
                    rows={3}
                    className={inputCls(!!errors.subtitle) + " resize-none"}
                    {...register("subtitle", { required: "Subtitle is required" })}
                  />
                </Field>

                <Field label="Banner Image" icon={ImagePlus} error={errors.image?.message}>
                  <label
                    htmlFor="bannerImage"
                    className="relative flex flex-col items-center justify-center h-56 rounded-xl cursor-pointer overflow-hidden transition-all duration-200 border-2 border-dashed hover:border-sky-400 hover:bg-sky-50"
                    style={{
                      borderColor: errors.image ? "#f87171" : "#cbd5e1",
                      background: preview ? "transparent" : "#f8fafc",
                    }}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImagePlus size={28} />
                        <span className="text-xs font-medium">Click to upload image</span>
                        <span className="text-[10px] text-slate-300">
                          PNG, JPG, WEBP — recommended 1920×1080
                        </span>
                      </div>
                    )}
                    {preview && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full">
                          Change Image
                        </span>
                      </div>
                    )}
                    <input
                      id="bannerImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Button Text" icon={MousePointerClick} error={errors.buttonText?.message}>
                    <input
                      placeholder="e.g. Book Now"
                      className={inputCls(!!errors.buttonText)}
                      {...register("buttonText", { required: "Required" })}
                    />
                  </Field>
                  <Field label="Button Link" icon={Link2} error={errors.buttonLink?.message}>
                    <input
                      placeholder="/appointment"
                      className={inputCls(!!errors.buttonLink)}
                      {...register("buttonLink", { required: "Required" })}
                    />
                  </Field>
                </div>

                <Field label="Text Alignment">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: "left",  Ic: AlignLeft,  label: "Left" },
                      { val: "right", Ic: AlignRight, label: "Right" },
                    ].map(({ val, Ic, label }) => {
                      const selected = watchAlign === val;
                      return (
                        <label
                          key={val}
                          className="flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                          style={{
                            borderColor: selected ? "#0ea5e9" : "#e2e8f0",
                            background:  selected ? "#f0f9ff" : "#f8fafc",
                          }}
                        >
                          <input
                            type="radio"
                            value={val}
                            className="hidden"
                            {...register("align")}
                          />
                          <Ic size={16} className={selected ? "text-sky-500" : "text-slate-400"} />
                          <span className={`text-sm font-semibold ${selected ? "text-sky-600" : "text-slate-500"}`}>
                            {label}
                          </span>
                          {selected && <CheckCircle2 size={14} className="text-sky-500 ml-auto" />}
                        </label>
                      );
                    })}
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{
                    background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                    boxShadow: "0 6px 20px rgba(14,165,233,0.38)",
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus size={16} />
                      Add Banner Slide
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="p-7 md:p-9 bg-slate-50">
              <h2 className="font-semibold text-slate-700 text-base mb-6 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-purple-500" />
                Live Preview
              </h2>

              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-slate-200 shadow-inner">
                {preview ? (
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="banner preview"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <ImagePlus size={36} className="mx-auto mb-2 opacity-40" />
                      <p className="text-xs">Upload an image to preview</p>
                    </div>
                  </div>
                )}

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      watchAlign === "right"
                        ? "linear-gradient(to left, rgba(5,15,35,0.88) 0%, rgba(5,15,35,0.5) 50%, rgba(5,15,35,0.1) 100%)"
                        : "linear-gradient(to right, rgba(5,15,35,0.88) 0%, rgba(5,15,35,0.5) 50%, rgba(5,15,35,0.1) 100%)",
                  }}
                />

                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div
                  className="absolute inset-0 flex items-center p-7"
                  style={{ justifyContent: watchAlign === "right" ? "flex-end" : "flex-start" }}
                >
                  <div className="text-white max-w-[75%]">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                      style={{
                        background: "rgba(14,165,233,0.2)",
                        border: "1px solid rgba(14,165,233,0.4)",
                        color: "#38bdf8",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      Laser Dental Point
                    </div>

                    <h2
                      className="preview-text-shadow leading-tight mb-2"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.4rem, 3vw, 2rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {watchTitle || <span className="text-white/30">Main Title</span>}
                      {watchTitle && <br />}
                      <span
                        style={{
                          background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: watchAccent ? "transparent" : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {watchAccent || "Accent Title"}
                      </span>
                    </h2>

                    <p className="text-white/60 text-xs leading-relaxed mb-4 preview-text-shadow line-clamp-3">
                      {watchSubtitle || "Subtitle will appear here..."}
                    </p>

                    <div
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                        boxShadow: "0 4px 12px rgba(14,165,233,0.4)",
                      }}
                    >
                      {watchBtnText || "Button Text"}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-3">
                This is a live preview of how the slide will look on your homepage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
