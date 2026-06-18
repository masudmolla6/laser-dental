// pages/Appointment/AppointmentPage.jsx
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, Link } from "react-router-dom";
import { getBranchColors } from "../../utils/branchColors";
import Swal from "sweetalert2";
import {
  Phone, MessageCircle, MapPin, Clock, User, Calendar,
  CheckCircle2, ArrowRight, ChevronDown, Loader2,
  Stethoscope, Shield, Star, ChevronLeft, Sparkles,
  BadgeCheck, HeartPulse, Smile, Mail, X, AlertCircle,
} from "lucide-react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useBranches from "../../hooks/useBranches";

// ── Constants ──────────────────────────────────────────────────────────────
const SERVICES = [
  "Laser Teeth Whitening",
  "Dental Implants",
  "Braces & Aligners",
  "Scaling & Polishing",
  "Root Canal Treatment",
  "Smile Makeover",
  "Tooth Extraction",
  "Dental Checkup",
  "Orthodontic Consultation",
  "Gum Treatment",
  "Pediatric Dentistry",
  "Other",
];

const BRANCH_COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]; // fallback only, prefer getBranchColors(branch.colorScheme)

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM",  "5:00 PM",  "6:00 PM",
  "7:00 PM",  "8:00 PM",  "9:00 PM",
];

const TRUST_POINTS = [
  { icon: Shield,      text: "Free consultation included"   },
  { icon: BadgeCheck,  text: "Confirmed within 30 minutes"   },
  { icon: HeartPulse,  text: "Modern, pain-free procedures"  },
  { icon: Star,        text: "4.9★ rated by 500+ patients"   },
];

const today = new Date().toISOString().split("T")[0];

// ── Helpers ────────────────────────────────────────────────────────────────
const inputBase =
  "w-full px-4 py-3.5 rounded-xl border bg-slate-50/80 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2";
const inputCls = (err) =>
  `${inputBase} ${
    err
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
      : "border-slate-200 focus:border-sky-400 focus:ring-sky-400/20"
  }`;

// ── Field wrapper ──────────────────────────────────────────────────────────
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

// ── Step Indicator ─────────────────────────────────────────────────────────
const StepBar = ({ current }) => {
  const steps = ["Your Info", "Treatment & Branch", "Date & Time"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                    : active
                    ? "bg-sky-600 text-white shadow-md shadow-sky-200 scale-110"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap ${
                  active ? "text-sky-600" : done ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${
                  done ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Multi-Step Booking Form ────────────────────────────────────────────────
const AppointmentForm = ({ preSelectedService, branches, branchesLoading }) => {
  const axiosPublic = useAxiosPublic();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      service: preSelectedService || "",
      location: "",
      date: "",
      time: "",
      message: "",
    },
  });

  // Pre-fill service from ServiceDetails navigation state
  useEffect(() => {
    if (preSelectedService) {
      setValue("service", preSelectedService);
    }
  }, [preSelectedService, setValue]);

  const watchedLocation = watch("location");
  const watchedTime = watch("time");
  const watchedDate = watch("date");

  const stepFields = [
    ["name", "phone"],
    ["service", "location"],
    ["date", "time"],
  ];

  const handleNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    try {
      const res = await axiosPublic.post("/appointments", data);
      if (res.data?.success) {
        setSubmittedData(data);
        setSubmitted(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: res.data?.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#0284c7",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text:
          err?.response?.data?.message ||
          "Failed to book appointment. Please try again.",
        confirmButtonColor: "#0284c7",
      });
    }
  };

  const handleReset = () => {
    reset();
    setStep(0);
    setSubmitted(false);
    setSubmittedData(null);
  };

  // ── Success Screen ───────────────────────────────────────────────────
  if (submitted && submittedData) {
    const branch = branches.find((b) => b.slug === submittedData.location);
    return (
      <div className="py-14 px-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
            <Sparkles size={14} className="text-sky-500" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Appointment Requested!
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
          Thank you,{" "}
          <strong className="text-slate-700">{submittedData.name}</strong>! We've
          received your request and will call or WhatsApp you at{" "}
          <strong className="text-sky-600">{submittedData.phone}</strong> to
          confirm your slot.
        </p>

        <div className="w-full max-w-sm bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Booking Summary
          </p>
          {[
            { label: "Treatment", value: submittedData.service },
            { label: "Branch", value: branch?.name || branch?.area || submittedData.location },
            { label: "Date", value: submittedData.date },
            { label: "Time", value: submittedData.time },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{label}</span>
              <span className="font-semibold text-slate-700">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-4 py-2.5 rounded-full mb-6">
          <Clock size={13} />
          We'll confirm within 30 minutes
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={handleReset}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-sky-600 border-2 border-sky-200 hover:bg-sky-50 transition-colors"
          >
            Book Another
          </button>
          <Link
            to="/"
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-sky-500 text-center hover:brightness-105 transition-all shadow-md shadow-sky-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Form Steps ───────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="px-7 pt-7 pb-2">
        <StepBar current={step} />
      </div>

      <div className="px-7 pb-7">

        {/* ── Step 0: Personal Info ── */}
        {step === 0 && (
          <div className="space-y-5 animate-fadeUp">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-0.5">
                Your contact details
              </h3>
              <p className="text-sm text-slate-400">
                We'll use this to confirm your appointment.
              </p>
            </div>

            <Field label="Full Name" icon={User} required error={errors.name?.message}>
              <input
                {...register("name", { required: "Full name is required" })}
                className={inputCls(!!errors.name)}
                type="text"
                placeholder="e.g. Rahim Uddin"
                autoComplete="name"
              />
            </Field>

            <Field label="Phone Number" icon={Phone} required error={errors.phone?.message}>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: "Enter a valid BD number (01XXXXXXXXX)",
                  },
                })}
                className={inputCls(!!errors.phone)}
                type="tel"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
              />
            </Field>

            <Field label="Message (Optional)" error={errors.message?.message}>
              <textarea
                {...register("message")}
                className={inputCls(false) + " resize-none"}
                placeholder="Any special concern or request..."
                rows={3}
              />
            </Field>
          </div>
        )}

        {/* ── Step 1: Service & Branch ── */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeUp">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-0.5">
                Treatment & branch
              </h3>
              <p className="text-sm text-slate-400">
                Select what you need and the nearest branch.
              </p>
            </div>

            <Field label="Treatment Needed" required error={errors.service?.message}>
              <div className="relative">
                <select
                  {...register("service", { required: "Please select a treatment" })}
                  className={inputCls(!!errors.service) + " pr-10 cursor-pointer appearance-none"}
                >
                  <option value="">Select a treatment</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </Field>

            {/* Branch Cards — dynamic from DB */}
            <Field label="Preferred Branch" icon={MapPin} required error={errors.location?.message}>
              {branchesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : branches.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-1">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  No branches available right now. Please call us directly.
                </div>
              ) : (
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Please select a branch" }}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      {branches.map((loc) => {
                        const selected = field.value === loc.slug;
                        const colors = getBranchColors(loc.colorScheme);
                        const firstHour = loc.hours?.[0];
                        return (
                          <button
                            key={loc._id}
                            type="button"
                            onClick={() => field.onChange(loc.slug)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              selected
                                ? "border-sky-400 bg-sky-50 shadow-md shadow-sky-100"
                                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                            }`}
                          >
                            {selected && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle2 size={16} className="text-sky-500" />
                              </div>
                            )}
                            <div
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2"
                              style={{ background: colors.color + "18", color: colors.colorDark }}
                            >
                              {loc.name}
                            </div>
                            <p className="font-bold text-slate-800 text-sm">
                              {loc.area}, {loc.city || "Dhaka"}
                            </p>
                            {firstHour && (
                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                <Clock size={10} />
                                {firstHour.label || firstHour.days}:{" "}
                                {[firstHour.morning, firstHour.evening].filter(Boolean).join(" · ") || firstHour.time}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              )}
            </Field>
          </div>
        )}

        {/* ── Step 2: Date & Time ── */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeUp">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-0.5">
                Pick a date & time
              </h3>
              <p className="text-sm text-slate-400">
                Choose your preferred slot — we'll confirm availability.
              </p>
            </div>

            <Field label="Preferred Date" icon={Calendar} required error={errors.date?.message}>
              <input
                {...register("date", { required: "Please select a date" })}
                className={inputCls(!!errors.date)}
                type="date"
                min={today}
              />
            </Field>

            <Field label="Preferred Time Slot" icon={Clock} required error={errors.time?.message}>
              <Controller
                name="time"
                control={control}
                rules={{ required: "Please select a time slot" }}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => field.onChange(slot)}
                        className={`py-3 rounded-xl text-xs font-bold border-2 transition-all duration-150 ${
                          field.value === slot
                            ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200 scale-[1.02]"
                            : "border-slate-200 text-slate-600 bg-slate-50 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              />
            </Field>

            {watchedDate && watchedTime && (
              <div className="bg-gradient-to-br from-sky-50 to-violet-50 rounded-xl p-4 border border-sky-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600 mb-2">
                  Your Booking Summary
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date</span>
                    <span className="font-semibold text-slate-700">{watchedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time</span>
                    <span className="font-semibold text-slate-700">{watchedTime}</span>
                  </div>
                  {watchedLocation && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Branch</span>
                      <span className="font-semibold text-slate-700">
                        {branches.find((l) => l.slug === watchedLocation)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="flex gap-3 mt-7">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={15} /> Back
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] bg-gradient-to-r from-sky-600 to-sky-500 shadow-lg shadow-sky-200 hover:brightness-105 group"
            >
              Continue
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-sky-600 to-violet-600 shadow-lg shadow-sky-200 hover:brightness-105 group"
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="animate-spin" /> Sending Request...</>
              ) : (
                <>Confirm Appointment <CheckCircle2 size={15} /></>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Step {step + 1} of 3 •{" "}
          {step === 0
            ? "Next: choose your treatment"
            : step === 1
            ? "Next: pick a date & time"
            : "We'll confirm via phone within 30 min"}
        </p>
      </div>
    </form>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const AppointmentPage = () => {
  const location = useLocation();
  const { serviceTitle } = location.state || {};
  const [branches, branchesLoading] = useBranches();

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.35s ease forwards; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #38bdf8 0%, #a78bfa 50%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.5; cursor: pointer;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeUp { animation: none; }
          .shimmer-text   { animation: none; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden pt-24 pb-20 px-5 md:px-10"
        style={{ background: "linear-gradient(155deg, #080f1e 0%, #0c1e3b 55%, #0f2952 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)" }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fadeUp">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-sky-500/25 bg-sky-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
              Book an Appointment
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
            Your Smile Deserves <span className="shimmer-text">Expert Care</span>
          </h1>

          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10">
            Book an appointment in under 2 minutes — no account needed. Our
            team confirms every slot within 30 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-white/60 font-medium">
                <Icon size={13} className="text-sky-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Contact Cards ── */}
      <section className="px-5 md:px-10 -mt-7 relative z-10 mb-14">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={`tel:${branches[0]?.phone || "01745565435"}`}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-100 text-sky-600 group-hover:scale-110 transition-transform">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Call Us</p>
              <p className="text-sm font-bold text-slate-800">{branches[0]?.phone || "01745565435"}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Sat–Thu, 10AM–9PM</p>
            </div>
          </a>

          <a
            href="https://wa.me/8801745565435"
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
              <p className="text-sm font-bold text-slate-800">Chat with us</p>
              <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Replies in minutes</p>
            </div>
          </a>

          <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border border-slate-100 shadow-sm">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-100 text-violet-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                {branchesLoading ? "Loading..." : `${branches.length} Location${branches.length !== 1 ? "s" : ""}`}
              </p>
              <p className="text-sm font-bold text-slate-800">
                {branchesLoading
                  ? "..."
                  : branches.map((b) => b.area).join(" & ") || "Coming soon"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across Dhaka</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content: Form + Sidebar ── */}
      <section className="px-5 md:px-10 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Form (3/5) ── */}
          <div className="lg:col-span-3">
            {serviceTitle && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl mb-4 text-sm">
                <div className="flex items-center gap-2 text-sky-700">
                  <BadgeCheck size={15} className="text-sky-500 flex-shrink-0" />
                  <span><strong>{serviceTitle}</strong> pre-selected from Services</span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-100">
              <div className="px-7 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-sky-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                    <Calendar size={18} className="text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Book an Appointment</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      3 quick steps — confirmed within 30 minutes
                    </p>
                  </div>
                </div>
              </div>

              <AppointmentForm
                preSelectedService={serviceTitle}
                branches={branches}
                branchesLoading={branchesLoading}
              />
            </div>
          </div>

          {/* ── Sidebar (2/5) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            <a
              href="https://wa.me/8801745565435"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl p-6 flex flex-col gap-4 text-white relative overflow-hidden hover:-translate-y-1 transition-all duration-300 group"
              style={{
                background: "linear-gradient(135deg, #128c7e 0%, #075e54 100%)",
                boxShadow: "0 8px 32px rgba(7,94,84,0.3)",
              }}
            >
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -top-5 -left-5 w-24 h-24 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} />
                </div>
                <h3 className="text-lg font-bold mb-1">Chat on WhatsApp</h3>
                <p className="text-white/65 text-sm leading-relaxed">
                  Send us a message any time — our team responds within minutes, even for quick questions.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                Start a conversation <ArrowRight size={14} />
              </div>
            </a>

            {/* Clinic hours — dynamic */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Clock size={16} className="text-sky-500" />
                Clinic Hours
              </h3>
              {branchesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : branches.length === 0 ? (
                <p className="text-sm text-slate-400">No branch info available right now.</p>
              ) : (
                <div className="space-y-5">
                  {branches.map((loc) => {
                    const colors = getBranchColors(loc.colorScheme);
                    return (
                      <div key={loc._id}>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{ background: colors.color + "15", color: colors.colorDark }}
                          >
                            {loc.name}
                          </span>
                          <span className="text-xs text-slate-400">{loc.area}, {loc.city || "Dhaka"}</span>
                        </div>
                        {loc.hours?.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-600 mb-1 ml-1">
                            <Clock size={12} className="text-slate-400" />
                            {h.label || h.days}:{" "}
                            {[h.morning, h.evening].filter(Boolean).join(" · ") || h.time}
                          </div>
                        ))}
                        {loc.closedDays?.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-red-400 font-medium mt-1.5 ml-1">
                            <X size={12} /> {loc.closedDays.join(", ")}: Closed
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Why choose us */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star size={15} className="text-amber-400" />
                Why Patients Choose Us
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Shield,      text: "Modern sterilized equipment"   },
                  { icon: HeartPulse,  text: "Pain-free procedures"          },
                  { icon: BadgeCheck,  text: "10+ years experienced doctors" },
                  { icon: Stethoscope, text: "Personalized treatment plans"  },
                  { icon: Smile,       text: "500+ happy patients"           },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-sky-600" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor teaser */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-black text-base shadow-lg">
                  DR
                </div>
                <div>
                  <h4 className="font-bold text-sm">Dr. Masud Rana</h4>
                  <p className="text-xs text-slate-400">BDS, PGD Cosmetic Dentistry</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-amber-400 text-[11px]">★</span>
                    ))}
                    <span className="text-[10px] text-slate-500 ml-1">5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                10+ years of experience. Over 2,000 successful procedures including implants, whitening, and smile makeovers.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${branches[0]?.phone || "01745565435"}`}
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-sky-300 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                    <Phone size={13} />
                  </div>
                  {branches[0]?.phone || "01745565435"}
                </a>
                <a
                  href="mailto:info@laserdental.com"
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-sky-300 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                    <Mail size={13} />
                  </div>
                  info@laserdental.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;
