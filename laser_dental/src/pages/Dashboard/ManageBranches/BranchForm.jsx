// pages/Dashboard/Branches/BranchForm.jsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Building2, MapPin, Phone, Link2, Clock, Plus, Trash2,
  ArrowLeft, Save, Loader2, ToggleLeft, ToggleRight, CalendarOff,
  Palette, Landmark, Bus, ShieldCheck, X,
} from "lucide-react";
import { BRANCH_COLOR_SCHEMES, getBranchColors } from "../../../utils/branchColors";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useBranchesSecure from "../../../hooks/useBranchesSecure";

// ── Field wrapper ────────────────────────────────────────────────────────
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

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ── Tag input (for amenities / transport — free text chips) ────────────────
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
        <div className="flex flex-wrap gap-2 mt-2.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-xs font-medium pl-3 pr-1.5 py-1.5 rounded-full bg-slate-100 text-slate-600"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="w-4 h-4 rounded-full hover:bg-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const BranchForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [allBranches, , refetch] = useBranchesSecure();

  const existingBranch = isEditMode
    ? allBranches.find((b) => b._id === id)
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
      area: "",
      city: "Dhaka",
      address: "",
      phone: "",
      whatsapp: "",
      mapLink: "",
      mapEmbedSrc: "",
      landmark: "",
      colorScheme: "sky",
      isActive: true,
      hours: [{ label: "Saturday – Thursday", morning: "", evening: "" }],
      closedDays: ["Friday"],
      transport: [],
      amenities: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "hours" });
  const watchedClosedDays = watch("closedDays") || [];
  const watchedIsActive = watch("isActive");
  const watchedName = watch("name");
  const watchedArea = watch("area");
  const watchedColorScheme = watch("colorScheme");
  const watchedTransport = watch("transport") || [];
  const watchedAmenities = watch("amenities") || [];

  // Pre-fill form when editing
  useEffect(() => {
    if (existingBranch) {
      reset({
        name: existingBranch.name || "",
        slug: existingBranch.slug || "",
        area: existingBranch.area || "",
        city: existingBranch.city || "Dhaka",
        address: existingBranch.address || "",
        phone: existingBranch.phone || "",
        whatsapp: existingBranch.whatsapp || "",
        mapLink: existingBranch.mapLink || "",
        mapEmbedSrc: existingBranch.mapEmbedSrc || "",
        landmark: existingBranch.landmark || "",
        colorScheme: existingBranch.colorScheme || "sky",
        isActive: existingBranch.isActive ?? true,
        hours: existingBranch.hours?.length
          ? existingBranch.hours
          : [{ label: "Saturday – Thursday", morning: "", evening: "" }],
        closedDays: existingBranch.closedDays?.length
          ? existingBranch.closedDays
          : ["Friday"],
        transport: existingBranch.transport || [],
        amenities: existingBranch.amenities || [],
      });
    }
  }, [existingBranch, reset]);

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

  const toggleClosedDay = (day) => {
    const current = watchedClosedDays;
    if (current.includes(day)) {
      setValue("closedDays", current.filter((d) => d !== day));
    } else {
      setValue("closedDays", [...current, day]);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        const res = await axiosSecure.patch(`/branches/${id}`, data);
        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Branch Updated",
            text: `${data.name} has been updated successfully.`,
            confirmButtonColor: "#0284c7",
          });
          refetch();
          navigate("/dashboard/manageBranches");
        }
      } else {
        const res = await axiosSecure.post("/branches", data);
        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Branch Added",
            text: `${data.name} has been added successfully.`,
            confirmButtonColor: "#0284c7",
          });
          refetch();
          navigate("/dashboard/manageBranches");
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: err?.response?.data?.message || "Failed to save branch. Please try again.",
        confirmButtonColor: "#0284c7",
      });
    }
  };

  const previewColors = getBranchColors(watchedColorScheme);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/dashboard/manageBranches")}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-sky-300 hover:text-sky-600 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              {isEditMode ? "Edit Branch" : "Add New Branch"}
            </h1>
            <p className="text-sm text-slate-400">
              {isEditMode
                ? `Updating details for ${existingBranch?.name || "branch"}`
                : "Create a new clinic location"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          noValidate
        >
          <div className="p-6 md:p-8 space-y-6">

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-700">Branch Status</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {watchedIsActive
                    ? "Visible on website & appointment form"
                    : "Hidden from website & appointment form"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setValue("isActive", !watchedIsActive)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  watchedIsActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {watchedIsActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {watchedIsActive ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Name + Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Branch Name" icon={Building2} required error={errors.name?.message}>
                <input
                  {...register("name", { required: "Branch name is required" })}
                  onChange={handleNameChange}
                  className={inputCls(!!errors.name)}
                  type="text"
                  placeholder="e.g. Branch 3"
                />
              </Field>
              <Field label="Slug (used internally)" icon={Link2} required error={errors.slug?.message}>
                <input
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: { value: /^[a-z0-9-]+$/, message: "Only lowercase letters, numbers and hyphens" },
                  })}
                  className={inputCls(!!errors.slug)}
                  type="text"
                  placeholder="branch3"
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-[10px] text-slate-400">
                    Slug can't be changed after creation — it's linked to existing appointments.
                  </p>
                )}
              </Field>
            </div>

            {/* Color scheme */}
            <Field label="Brand Color" icon={Palette}>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(BRANCH_COLOR_SCHEMES).map(([key, c]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue("colorScheme", key)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      watchedColorScheme === key ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""
                    }`}
                    style={{ background: `linear-gradient(135deg, ${c.color}, ${c.colorDark})` }}
                    title={key}
                  />
                ))}
              </div>
            </Field>

            {/* Area + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Area" icon={MapPin} required error={errors.area?.message}>
                <input
                  {...register("area", { required: "Area is required" })}
                  className={inputCls(!!errors.area)}
                  type="text"
                  placeholder="e.g. Dhanmondi"
                />
              </Field>
              <Field label="City" icon={MapPin} error={errors.city?.message}>
                <input
                  {...register("city")}
                  className={inputCls(!!errors.city)}
                  type="text"
                  placeholder="Dhaka"
                />
              </Field>
            </div>

            {/* Full Address + Landmark */}
            <Field label="Full Address" icon={MapPin} error={errors.address?.message}>
              <textarea
                {...register("address")}
                className={inputCls(false) + " resize-none"}
                placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                rows={2}
              />
            </Field>
            <Field label="Landmark (optional)" icon={Landmark} error={errors.landmark?.message}>
              <input
                {...register("landmark")}
                className={inputCls(false)}
                type="text"
                placeholder="e.g. Near City Hospital"
              />
            </Field>

            {/* Phone + WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Phone Number" icon={Phone} required error={errors.phone?.message}>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^01[3-9]\d{8}$/, message: "Enter a valid BD number (01XXXXXXXXX)" },
                  })}
                  className={inputCls(!!errors.phone)}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                />
              </Field>
              <Field label="WhatsApp Number (optional)" icon={Phone} error={errors.whatsapp?.message}>
                <input
                  {...register("whatsapp")}
                  className={inputCls(false)}
                  type="tel"
                  placeholder="8801XXXXXXXXX"
                />
                <p className="text-[10px] text-slate-400">Leave blank to auto-derive from phone number</p>
              </Field>
            </div>

            {/* Map links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Google Maps Link" icon={Link2} error={errors.mapLink?.message}>
                <input
                  {...register("mapLink")}
                  className={inputCls(false)}
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                />
                <p className="text-[10px] text-slate-400">Used for the "Get Directions" button</p>
              </Field>
              <Field label="Map Embed URL (optional)" icon={Link2} error={errors.mapEmbedSrc?.message}>
                <input
                  {...register("mapEmbedSrc")}
                  className={inputCls(false)}
                  type="url"
                  placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-[10px] text-slate-400">
                  Leave blank to show a styled placeholder instead of a live map
                </p>
              </Field>
            </div>

            {/* Operating Hours */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-sky-500" />
                Operating Hours
              </label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
                    <div className="flex gap-2.5">
                      <input
                        {...register(`hours.${index}.label`, { required: true })}
                        className={inputCls(false) + " flex-1"}
                        placeholder="e.g. Saturday – Thursday"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="w-11 h-11 flex-shrink-0 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        {...register(`hours.${index}.morning`)}
                        className={inputCls(false)}
                        placeholder="🌅 Morning e.g. 10AM–2PM"
                      />
                      <input
                        {...register(`hours.${index}.evening`)}
                        className={inputCls(false)}
                        placeholder="🌙 Evening e.g. 5PM–9PM"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 pl-1">
                      Leave either field blank if the branch only runs one shift that day
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ label: "Saturday – Thursday", morning: "", evening: "" })}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
              >
                <Plus size={14} /> Add another schedule row
              </button>
            </div>

            {/* Closed days */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CalendarOff size={12} className="text-sky-500" />
                Closed Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const selected = watchedClosedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleClosedDay(day)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border-2 transition-all ${
                        selected
                          ? "bg-red-50 border-red-300 text-red-600"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <Field label="Facilities / Amenities" icon={ShieldCheck}>
              <TagInput
                value={watchedAmenities}
                onChange={(v) => setValue("amenities", v)}
                placeholder="e.g. Free parking — press Enter"
              />
            </Field>

            {/* Transport */}
            <Field label="Getting There (Transport)" icon={Bus}>
              <TagInput
                value={watchedTransport}
                onChange={(v) => setValue("transport", v)}
                placeholder="e.g. Bus stop nearby — press Enter"
              />
            </Field>

            {/* Live preview */}
            {watchedName && (
              <div
                className="rounded-xl p-4 border"
                style={{ background: previewColors.colorBg + "60", borderColor: previewColors.color + "30" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: previewColors.colorDark }}>
                  Preview — Branch Badge
                </p>
                <span
                  className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${previewColors.color}, ${previewColors.colorDark})` }}
                >
                  {watchedName}
                </span>
                <p className="text-sm font-bold text-slate-800 mt-2">
                  {watchedName}{watchedArea ? `, ${watchedArea}` : ""}
                </p>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 md:px-8 py-5 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/manageBranches")}
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
                <><Save size={15} /> {isEditMode ? "Save Changes" : "Add Branch"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
