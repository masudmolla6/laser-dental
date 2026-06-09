import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import {
  Phone, MessageCircle, MapPin, Clock, User, Calendar,
  CheckCircle2, ArrowRight, ChevronDown, Loader2
} from "lucide-react";

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
  "Other",
];

const LOCATIONS = [
  { id: "branch1", label: "Branch 1 — Mirpur-10, Dhaka" },
  { id: "branch2", label: "Branch 2 — Uttara, Dhaka"    },
];

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM",  "5:00 PM",  "6:00 PM",
  "7:00 PM",  "8:00 PM",  "9:00 PM",
];

const today = new Date().toISOString().split("T")[0];

// ── Field wrapper ──────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon size={13} className="text-sky-500" />}
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <span className="w-3 h-3 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold flex-shrink-0">!</span>
        {error}
      </p>
    )}
  </div>
);

const inputBase = "w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2";
const inputCls  = (err) => `${inputBase} ${err ? "border-red-300 focus:border-red-400 focus:ring-red-400/20" : "border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"}`;

// ── Booking Form ───────────────────────────────────────────────────────────
const BookingForm = () => {
  const axiosPublic = useAxiosPublic();
  const [submitted,      setSubmitted]      = useState(false);
  const [submittedData,  setSubmittedData]  = useState(null);

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", phone: "", service: "", location: "", date: "", time: "", message: "" },
  });

  // ── Submit → POST /appointments ───────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const res = await axiosPublic.post("/appointments", data);
      if (res.data?.success) {
        setSubmittedData(data);
        setSubmitted(true);
      } else {
        Swal.fire("Error", res.data?.message || "Something went wrong", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to book appointment. Please try again.",
        "error"
      );
    }
  };

  const handleReset = () => { reset(); setSubmitted(false); setSubmittedData(null); };

  // ── Success screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="px-8 py-16 flex flex-col items-center text-center gap-4">
        <div className="text-emerald-500">
          <CheckCircle2 size={52} strokeWidth={1.5} className="animate-bounce" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Appointment Requested!</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Thank you, <strong>{submittedData.name}</strong>! We've received your request and will call
            or WhatsApp you at <strong>{submittedData.phone}</strong> to confirm your slot.
          </p>
        </div>
        <div className="mt-2 flex flex-col items-center gap-1.5 text-xs text-gray-400">
          <span>📍 {LOCATIONS.find((l) => l.id === submittedData.location)?.label}</span>
          <span>🗓 {submittedData.date} at {submittedData.time}</span>
          <span>🦷 {submittedData.service}</span>
        </div>
        <button
          onClick={handleReset}
          className="mt-3 px-6 py-2.5 rounded-xl text-sm font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors"
        >
          Book Another
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 flex flex-col gap-5" noValidate>

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name" icon={User} error={errors.name?.message}>
          <input
            {...register("name", { required: "Name is required" })}
            className={inputCls(!!errors.name)}
            type="text"
            placeholder="Your full name"
          />
        </Field>
        <Field label="Phone Number" icon={Phone} error={errors.phone?.message}>
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
      </div>

      {/* Service + Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Service" error={errors.service?.message}>
          <div className="relative">
            <select
              {...register("service", { required: "Please select a service" })}
              className={inputCls(!!errors.service) + " pr-10 cursor-pointer appearance-none"}
            >
              <option value="">Select a service</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Branch" icon={MapPin} error={errors.location?.message}>
          <div className="relative">
            <select
              {...register("location", { required: "Please select a branch" })}
              className={inputCls(!!errors.location) + " pr-10 cursor-pointer appearance-none"}
            >
              <option value="">Select a branch</option>
              {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>
      </div>

      {/* Date */}
      <Field label="Preferred Date" icon={Calendar} error={errors.date?.message}>
        <input
          {...register("date", { required: "Please select a date" })}
          className={inputCls(!!errors.date)}
          type="date"
          min={today}
        />
      </Field>

      {/* Time slots */}
      <Field label="Preferred Time" error={errors.time?.message}>
        <Controller
          name="time"
          control={control}
          rules={{ required: "Please select a time slot" }}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => field.onChange(slot)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                    field.value === slot
                      ? "bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-200"
                      : "border-gray-200 text-gray-600 bg-gray-50 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        />
      </Field>

      {/* Message */}
      <Field label="Message (optional)">
        <textarea
          {...register("message")}
          className={inputCls(false) + " resize-none"}
          placeholder="Any special request or concern..."
          rows={3}
        />
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-1 bg-gradient-to-r from-sky-600 to-sky-400 shadow-lg shadow-sky-200"
      >
        {isSubmitting ? (
          <><Loader2 size={16} className="animate-spin" /> Sending Request...</>
        ) : (
          <>Confirm Appointment <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        We'll confirm your slot via phone or WhatsApp within 30 minutes.
      </p>
    </form>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const ContactBooking = () => (
  <div className="min-h-screen bg-[#f8fafc]">
    <style>{`
      .shimmer-text {
        background: linear-gradient(90deg, #0284c7 0%, #6366f1 50%, #0284c7 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s linear infinite;
      }
      @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .fade-up { animation: fadeUp 0.6s ease forwards; }
      input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
    `}</style>

    {/* ── Hero header ── */}
    <section
      className="relative overflow-hidden pt-20 pb-16 px-5 md:px-10"
      style={{ background: "linear-gradient(160deg, #09142d 0%, #0c2340 60%, #0f2d52 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10 fade-up">
        <div className="inline-flex items-center gap-2 mb-5">
          <div className="w-8 h-px bg-sky-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Book an Appointment</span>
          <div className="w-8 h-px bg-sky-400" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          We're Here For <span className="shimmer-text">Your Smile</span>
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Book an appointment, call us directly, or drop a message on WhatsApp — we'll get back to you within minutes.
        </p>
      </div>
    </section>

    {/* ── Quick contact cards ── */}
    <section className="px-5 md:px-10 -mt-8 relative z-10 mb-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">

        <a href="tel:01745565435"
          className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-sky-100 text-sky-600 group-hover:scale-110 transition-transform">
            <Phone size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Call Us</p>
            <p className="text-sm font-bold text-gray-800">01745565435</p>
            <p className="text-xs text-gray-400 mt-0.5">Sat – Thu, 9AM – 10PM</p>
          </div>
        </a>

        <a href="https://wa.me/8801745565435" target="_blank" rel="noreferrer"
          className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
            <MessageCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">WhatsApp</p>
            <p className="text-sm font-bold text-gray-800">Chat with us</p>
            <p className="text-xs text-emerald-500 font-medium mt-0.5">Usually replies in minutes</p>
          </div>
        </a>

        <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 border border-gray-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-violet-100 text-violet-600">
            <MapPin size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">2 Locations</p>
            <p className="text-sm font-bold text-gray-800">Both in Dhaka</p>
            <p className="text-xs text-gray-400 mt-0.5">Branch 1 & Branch 2</p>
          </div>
        </div>
      </div>
    </section>

    {/* ── Form + Sidebar ── */}
    <section className="px-5 md:px-10 pb-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Form — 3/5 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.07)" }}>
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-br from-sky-50 to-violet-50">
              <h2 className="font-display text-xl font-bold text-gray-900">Book an Appointment</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the form below — we'll confirm within 30 minutes.</p>
            </div>
            <BookingForm />
          </div>
        </div>

        {/* Sidebar — 2/5 */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* WhatsApp card */}
          <a href="https://wa.me/8801745565435" target="_blank" rel="noreferrer"
            className="rounded-3xl p-6 flex flex-col gap-4 text-white relative overflow-hidden hover:-translate-y-1 transition-all duration-300 group"
            style={{
              background: "linear-gradient(135deg, #128c7e 0%, #075e54 100%)",
              boxShadow: "0 6px 30px rgba(7,94,84,0.35)",
            }}>
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle size={22} />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">Chat on WhatsApp</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Send us a message any time — our team responds within minutes, even for quick questions.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-sm font-semibold">
              Start a conversation <ArrowRight size={15} />
            </div>
          </a>

          {/* Call card */}
          <a href="tel:01745565435"
            className="bg-white rounded-3xl p-6 flex flex-col gap-4 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Phone size={22} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-1">Call Us Directly</h3>
              <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                Prefer talking? Our team is available 6 days a week.
              </p>
              <p className="text-sky-600 font-bold text-lg">01745565435</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-600">
              Tap to call <ArrowRight size={15} />
            </div>
          </a>

          {/* Hours card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col gap-5"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 className="font-display text-lg font-bold text-gray-900">Clinic Hours</h3>
            {[
              { branch: "Branch 1", area: "Mirpur-10, Dhaka", color: "#0ea5e9", times: ["Sat–Thu: 10AM–2PM", "Sat–Thu: 5PM–9PM"] },
              { branch: "Branch 2", area: "Uttara, Dhaka",    color: "#8b5cf6", times: ["Sat–Thu: 3PM–9PM"]                      },
            ].map((loc) => (
              <div key={loc.branch}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ background: loc.color + "15", color: loc.color }}>
                    {loc.branch}
                  </span>
                  <span className="text-xs text-gray-400">{loc.area}</span>
                </div>
                {loc.times.map((t) => (
                  <div key={t} className="flex items-center gap-2 ml-1 mb-1 text-sm text-gray-600">
                    <Clock size={14} className="text-gray-400 flex-shrink-0" /> {t}
                  </div>
                ))}
                <div className="flex items-center gap-2 ml-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-red-400 ml-[9px]" />
                  <span className="text-sm text-red-400 font-medium">Friday: Closed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ContactBooking;
