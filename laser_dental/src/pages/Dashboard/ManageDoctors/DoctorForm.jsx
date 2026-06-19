// pages/Dashboard/ManageDoctors/DoctorForm.jsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  UserRound, GraduationCap, Image as ImageIcon, Quote, FileText,
  Plus, Trash2, ArrowLeft, Save, Loader2, ToggleLeft, ToggleRight,
  Star, MapPin, Sparkles, Award, X, Users,
} from "lucide-react";
import { iconMap, iconOptions, getIcon } from "../../../utils/iconMap";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useDoctorsSecure from "../../../hooks/useDoctorsSecure";
import useBranchesSecure from "../../../hooks/useBranchesSecure";

// ── Field wrapper — same as BranchForm ──────────────────────────────────────
const Field = ({ label, icon: Icon, error, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-sky-500" />}
      {label}
      {required && <span className="text-red-400 text-[10px]">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5">
        <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
          !
        </span>
        {error}
      </p>
    )}
  </div>
);

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2";
const inputCls = (err) =>
  `${inputBase} ${
    err
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-sky-400 focus:ring-sky-400/20"
  }`;

// Preset color pairs for specialization chips (color + light bg)
const SPEC_COLORS = [
  { color: "#0ea5e9", bg: "#e0f2fe" },
  { color: "#ec4899", bg: "#fce7f3" },
  { color: "#8b5cf6", bg: "#ede9fe" },
  { color: "#10b981", bg: "#d1fae5" },
  { color: "#f59e0b", bg: "#fef3c7" },
  { color: "#ef4444", bg: "#fee2e2" },
];

// ── Tag input (for degrees — free text chips, press Enter to add) ──────────
const TagInput = ({ value = [], onChange, placeholder }) => {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputCls(false) + " flex-1"}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 rounded-xl bg-sky-50 text-sky-600 font-bold text-xs hover:bg-sky-100 transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-col gap-2 mt-2.5">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center justify-between gap-1.5 text-xs font-medium pl-3 pr-1.5 py-2 rounded-xl bg-slate-100 text-slate-600"
            >
              <span className="leading-relaxed">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="w-5 h-5 rounded-full hover:bg-slate-300 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Icon picker — small dropdown grid showing all available iconKeys ───────
const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIcon(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-sky-300 transition-colors flex-shrink-0"
      >
        <SelectedIcon size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-2 p-2 rounded-xl bg-white border border-slate-200 shadow-lg grid grid-cols-5 gap-1 w-56">
            {iconOptions.map((key) => {
              const Ico = iconMap[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    value === key ? "bg-sky-100 text-sky-600" : "text-slate-500 hover:bg-slate-100"
                  }`}
                  title={key}
                >
                  <Ico size={15} />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
const DoctorForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [allDoctors, , refetchDoctors] = useDoctorsSecure();
  const [allBranches] = useBranchesSecure();

  const existingDoctor = isEditMode
    ? allDoctors.find((d) => d._id === id)
    : null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      title: "",
      photo: "",
      bio: "",
      quote: "",
      degrees: [],
      specializations: [{ iconKey: "stethoscope", label: "", color: SPEC_COLORS[0].color, bg: SPEC_COLORS[0].bg }],
      achievements: [{ iconKey: "award", text: "" }],
      branchSlugs: [],
      yearsExperience: "",
      patientsCount: "",
      isFeatured: false,
      isActive: true,
    },
  });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specializations" });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });

  const watchedName = watch("name");
  const watchedTitle = watch("title");
  const watchedPhoto = watch("photo");
  const watchedIsActive = watch("isActive");
  const watchedIsFeatured = watch("isFeatured");
  const watchedBranchSlugs = watch("branchSlugs") || [];

  // Pre-fill form when editing
  useEffect(() => {
    if (existingDoctor) {
      reset({
        name: existingDoctor.name || "",
        slug: existingDoctor.slug || "",
        title: existingDoctor.title || "",
        photo: existingDoctor.photo || "",
        bio: existingDoctor.bio || "",
        quote: existingDoctor.quote || "",
        degrees: existingDoctor.degrees || [],
        specializations: existingDoctor.specializations?.length
          ? existingDoctor.specializations
          : [{ iconKey: "stethoscope", label: "", color: SPEC_COLORS[0].color, bg: SPEC_COLORS[0].bg }],
        achievements: existingDoctor.achievements?.length
          ? existingDoctor.achievements
          : [{ iconKey: "award", text: "" }],
        branchSlugs: existingDoctor.branchSlugs || [],
        yearsExperience: existingDoctor.yearsExperience ?? "",
        patientsCount: existingDoctor.patientsCount ?? "",
        isFeatured: existingDoctor.isFeatured ?? false,
        isActive: existingDoctor.isActive ?? true,
      });
    }
  }, [existingDoctor, reset]);

  // Auto-generate slug from name (only when adding, not editing)
  const handleNameChange = (e) => {
    setValue("name", e.target.value);
    if (!isEditMode) {
      const autoSlug = e.target.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", autoSlug);
    }
  };

  const toggleBranch = (slug) => {
    const current = watchedBranchSlugs;
    if (current.includes(slug)) {
      setValue("branchSlugs", current.filter((s) => s !== slug));
    } else {
      setValue("branchSlugs", [...current, slug]);
    }
  };

  const onSubmit = async (data) => {
    // Drop empty rows before saving (e.g. user left a spec/achievement blank)
    const payload = {
      ...data,
      specializations: data.specializations.filter((s) => s.label?.trim()),
      achievements: data.achievements.filter((a) => a.text?.trim()),
      yearsExperience: Number.isFinite(data.yearsExperience) ? data.yearsExperience : 0,
      patientsCount: Number.isFinite(data.patientsCount) ? data.patientsCount : 0,
    };

    try {
      if (isEditMode) {
        const res = await axiosSecure.patch(`/doctors/${id}`, payload);
        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Doctor Updated",
            text: `${data.name}'s profile has been updated successfully.`,
            confirmButtonColor: "#0284c7",
          });
          refetchDoctors();
          navigate("/dashboard/manageDoctors");
        }
      } else {
        const res = await axiosSecure.post("/doctors", payload);
        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Doctor Added",
            text: `${data.name} has been added successfully.`,
            confirmButtonColor: "#0284c7",
          });
          refetchDoctors();
          navigate("/dashboard/manageDoctors");
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: err?.response?.data?.message || "Failed to save doctor. Please try again.",
        confirmButtonColor: "#0284c7",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/dashboard/manageDoctors")}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-sky-300 hover:text-sky-600 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              {isEditMode ? "Edit Doctor" : "Add New Doctor"}
            </h1>
            <p className="text-sm text-slate-400">
              {isEditMode
                ? `Updating profile for ${existingDoctor?.name || "doctor"}`
                : "Create a new doctor profile"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          noValidate
        >
          <div className="p-6 md:p-8 space-y-6">

            {/* Status toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-700">Profile Status</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {watchedIsActive ? "Visible on website" : "Hidden from website"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue("isActive", !watchedIsActive)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                    watchedIsActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {watchedIsActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  {watchedIsActive ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-700">Featured</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {watchedIsFeatured ? "Shown on Home page" : "Not on Home page"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue("isFeatured", !watchedIsFeatured)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                    watchedIsFeatured
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Star size={14} fill={watchedIsFeatured ? "currentColor" : "none"} />
                  {watchedIsFeatured ? "Featured" : "Not featured"}
                </button>
              </div>
            </div>

            {/* Name + Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Doctor Name" icon={UserRound} required error={errors.name?.message}>
                <input
                  {...register("name", { required: "Doctor name is required" })}
                  onChange={handleNameChange}
                  className={inputCls(!!errors.name)}
                  type="text"
                  placeholder="e.g. Dr. Fatema Khanam"
                />
              </Field>
              <Field label="Slug (used in URL)" icon={UserRound} required error={errors.slug?.message}>
                <input
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: { value: /^[a-z0-9-]+$/, message: "Only lowercase letters, numbers and hyphens" },
                  })}
                  className={inputCls(!!errors.slug)}
                  type="text"
                  placeholder="dr-fatema-khanam"
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-[10px] text-slate-400">
                    Slug can't be changed after creation — it's used in the profile URL.
                  </p>
                )}
              </Field>
            </div>

            {/* Title */}
            <Field label="Title / Designation" icon={Award} required error={errors.title?.message}>
              <input
                {...register("title", { required: "Title is required" })}
                className={inputCls(!!errors.title)}
                type="text"
                placeholder="e.g. Chief Dental Surgeon & Laser Specialist"
              />
            </Field>

            {/* Years of experience + Patients treated */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Years of Experience" icon={Award} error={errors.yearsExperience?.message}>
                <input
                  {...register("yearsExperience", {
                    min: { value: 0, message: "Must be a positive number" },
                    valueAsNumber: true,
                  })}
                  className={inputCls(!!errors.yearsExperience)}
                  type="number"
                  min="0"
                  placeholder="e.g. 15"
                />
                <p className="text-[10px] text-slate-400">Shown as "15+ Years of Experience" on the website</p>
              </Field>
              <Field label="Patients Treated" icon={Users} error={errors.patientsCount?.message}>
                <input
                  {...register("patientsCount", {
                    min: { value: 0, message: "Must be a positive number" },
                    valueAsNumber: true,
                  })}
                  className={inputCls(!!errors.patientsCount)}
                  type="number"
                  min="0"
                  placeholder="e.g. 1200"
                />
                <p className="text-[10px] text-slate-400">Shown as "1,200+ Patients" on the website</p>
              </Field>
            </div>

            {/* Photo URL */}
            <Field label="Photo URL" icon={ImageIcon} error={errors.photo?.message}>
              <input
                {...register("photo")}
                className={inputCls(false)}
                type="url"
                placeholder="https://..."
              />
              <p className="text-[10px] text-slate-400">Leave blank to show a placeholder avatar</p>
            </Field>

            {/* Branches — multi-select checkbox */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <MapPin size={12} className="text-sky-500" />
                Branches this doctor sits at
              </label>
              {allBranches?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allBranches.map((branch) => {
                    const selected = watchedBranchSlugs.includes(branch.slug);
                    return (
                      <button
                        key={branch.slug}
                        type="button"
                        onClick={() => toggleBranch(branch.slug)}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold border-2 transition-all flex items-center gap-1.5 ${
                          selected
                            ? "bg-sky-50 border-sky-300 text-sky-600"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <MapPin size={11} />
                        {branch.name || branch.area}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No branches found — add a branch first under Manage Branches.
                </p>
              )}
            </div>

            {/* Degrees */}
            <Field label="Degrees & Certifications" icon={GraduationCap}>
              <TagInput
                value={watch("degrees") || []}
                onChange={(v) => setValue("degrees", v)}
                placeholder="e.g. BDS — Dhaka Dental College — press Enter"
              />
            </Field>

            {/* Bio */}
            <Field label="Biography" icon={FileText} error={errors.bio?.message}>
              <textarea
                {...register("bio")}
                className={inputCls(false) + " resize-none"}
                placeholder="A short professional background of the doctor..."
                rows={4}
              />
            </Field>

            {/* Quote */}
            <Field label="Personal Quote (optional)" icon={Quote} error={errors.quote?.message}>
              <textarea
                {...register("quote")}
                className={inputCls(false) + " resize-none"}
                placeholder="A short, warm quote from the doctor..."
                rows={2}
              />
            </Field>

            {/* Specializations */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-sky-500" />
                Specializations
              </label>
              <div className="space-y-2.5">
                {specFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2.5 items-start">
                    <IconPicker
                      value={watch(`specializations.${index}.iconKey`)}
                      onChange={(key) => setValue(`specializations.${index}.iconKey`, key)}
                    />
                    <input
                      {...register(`specializations.${index}.label`)}
                      className={inputCls(false) + " flex-1"}
                      placeholder="e.g. Laser Dentistry"
                    />
                    <div className="flex gap-1.5 pt-1 flex-shrink-0">
                      {SPEC_COLORS.map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => {
                            setValue(`specializations.${index}.color`, c.color);
                            setValue(`specializations.${index}.bg`, c.bg);
                          }}
                          className={`w-6 h-6 rounded-full flex-shrink-0 transition-all ${
                            watch(`specializations.${index}.color`) === c.color
                              ? "ring-2 ring-offset-1 ring-slate-400 scale-110"
                              : ""
                          }`}
                          style={{ background: c.color }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      disabled={specFields.length === 1}
                      className="w-11 h-11 flex-shrink-0 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  appendSpec({ iconKey: "stethoscope", label: "", color: SPEC_COLORS[0].color, bg: SPEC_COLORS[0].bg })
                }
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Plus size={14} /> Add specialization
              </button>
            </div>

            {/* Achievements */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Award size={12} className="text-sky-500" />
                Achievements
              </label>
              <div className="space-y-2.5">
                {achievementFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2.5 items-center">
                    <IconPicker
                      value={watch(`achievements.${index}.iconKey`)}
                      onChange={(key) => setValue(`achievements.${index}.iconKey`, key)}
                    />
                    <input
                      {...register(`achievements.${index}.text`)}
                      className={inputCls(false) + " flex-1"}
                      placeholder="e.g. 1,200+ successful treatments"
                    />
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      disabled={achievementFields.length === 1}
                      className="w-11 h-11 flex-shrink-0 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => appendAchievement({ iconKey: "award", text: "" })}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Plus size={14} /> Add achievement
              </button>
            </div>

            {/* Live preview */}
            {watchedName && (
              <div className="rounded-2xl p-4 border border-sky-100 bg-sky-50/60 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#0c2340] to-[#0f2d52] flex items-center justify-center flex-shrink-0">
                  {watchedPhoto ? (
                    <img src={watchedPhoto} alt={watchedName} className="w-full h-full object-cover object-top" />
                  ) : (
                    <UserRound size={22} className="text-white/30" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600 mb-0.5">
                    Preview
                  </p>
                  <p className="text-sm font-bold text-slate-800">{watchedName}</p>
                  <p className="text-xs text-slate-500">{watchedTitle}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 md:px-8 py-5 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/manageDoctors")}
              className="px-5 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 text-slate-600 hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-500 shadow-md shadow-sky-200 hover:brightness-105 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={15} /> {isEditMode ? "Save Changes" : "Add Doctor"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
