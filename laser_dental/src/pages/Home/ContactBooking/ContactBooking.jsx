import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

// ── Icons ──────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const WhatsAppIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const LocationIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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
  { id: "branch1", label: "Branch 1 — Location TBD" },
  { id: "branch2", label: "Branch 2 — Location TBD" },
];

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM",  "5:00 PM",  "6:00 PM",
  "7:00 PM",  "8:00 PM",  "9:00 PM",
];

const today = new Date().toISOString().split("T")[0];

// ── Reusable Field wrapper ─────────────────────────────────────────────────
const Field = ({ label, icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
      {icon && <span className="text-sky-500">{icon}</span>}
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" opacity=".2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

const inputBase =
  "w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2";

const inputClass = (hasError) =>
  `${inputBase} ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
      : "border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
  }`;

// ── Booking Form (react-hook-form) ─────────────────────────────────────────
const BookingForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      location: "",
      date: "",
      time: "",
      message: "",
    },
  });

  const selectedTime = watch("time");

  const onSubmit = async (data) => {
    console.log(data);
    // TODO: replace with your actual API call
    // e.g. await axios.post("/api/appointments", data)
    await new Promise((r) => setTimeout(r, 1400));
    setSubmittedData(data);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
    setSubmittedData(null);
  };

  // ── Success screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="px-8 py-16 flex flex-col items-center text-center gap-4">
        <div className="text-emerald-500 animate-bounce">
          <CheckCircleIcon />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Appointment Requested!
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Thank you, <strong>{submittedData.name}</strong>! We've received your request
            and will call or WhatsApp you at{" "}
            <strong>{submittedData.phone}</strong> to confirm your slot.
          </p>
        </div>
        <div className="mt-2 flex flex-col items-center gap-1 text-xs text-gray-400">
          <span>📍 {LOCATIONS.find(l => l.id === submittedData.location)?.label}</span>
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

      {/* Row 1 — Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name" icon={<UserIcon />} error={errors.name?.message}>
          <input
            {...register("name", { required: "Name is required" })}
            className={inputClass(!!errors.name)}
            type="text"
            placeholder="Your full name"
          />
        </Field>

        <Field label="Phone Number" icon={<PhoneIcon />} error={errors.phone?.message}>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^01[3-9]\d{8}$/,
                message: "Enter a valid BD number (01XXXXXXXXX)",
              },
            })}
            className={inputClass(!!errors.phone)}
            type="tel"
            placeholder="01XXXXXXXXX"
          />
        </Field>
      </div>

      {/* Row 2 — Service + Branch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Service" error={errors.service?.message}>
          <div className="relative">
            <select
              {...register("service", { required: "Please select a service" })}
              className={inputClass(!!errors.service) + " pr-10 cursor-pointer appearance-none"}
            >
              <option value="">Select a service</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <ChevronDown />
            </div>
          </div>
        </Field>

        <Field label="Branch" icon={<LocationIcon size={15} />} error={errors.location?.message}>
          <div className="relative">
            <select
              {...register("location", { required: "Please select a branch" })}
              className={inputClass(!!errors.location) + " pr-10 cursor-pointer appearance-none"}
            >
              <option value="">Select a branch</option>
              {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <ChevronDown />
            </div>
          </div>
        </Field>
      </div>

      {/* Date */}
      <Field label="Preferred Date" icon={<CalendarIcon />} error={errors.date?.message}>
        <input
          {...register("date", { required: "Please select a date" })}
          className={inputClass(!!errors.date)}
          type="date"
          min={today}
        />
      </Field>

      {/* Time slots — controlled via Controller */}
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
          className={inputClass(false) + " resize-none"}
          placeholder="Any special request or concern..."
          rows={3}
        />
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-1"
        style={{
          background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
          boxShadow: "0 6px 24px rgba(14,165,233,0.4)",
        }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending Request...
          </>
        ) : (
          <>
            Confirm Appointment
            <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        We'll confirm your slot via phone or WhatsApp within 30 minutes.
      </p>
    </form>
  );
};

// ── Main Page Component ────────────────────────────────────────────────────
const ContactBooking = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .shimmer {
          background: linear-gradient(90deg, #0284c7 0%, #6366f1 50%, #0284c7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
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
            We're Here For <span className="shimmer">Your Smile</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Book an appointment, call us directly, or drop a message on WhatsApp — we'll get back to you within minutes.
          </p>
        </div>
      </section>

      {/* ── Quick contact cards ───────────────────────────────────────────── */}
      <section className="px-5 md:px-10 -mt-8 relative z-10 mb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">

          <a href="tel:01745565435"
            className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sky-600 group-hover:scale-110 transition-transform"
              style={{ background: "#e0f2fe" }}>
              <PhoneIcon />
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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600 group-hover:scale-110 transition-transform"
              style={{ background: "#dcfce7" }}>
              <WhatsAppIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">WhatsApp</p>
              <p className="text-sm font-bold text-gray-800">Chat with us</p>
              <p className="text-xs text-emerald-500 font-medium mt-0.5">Usually replies in minutes</p>
            </div>
          </a>

          <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 border border-gray-100"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-600"
              style={{ background: "#ede9fe" }}>
              <LocationIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">2 Locations</p>
              <p className="text-sm font-bold text-gray-800">Both in Dhaka</p>
              <p className="text-xs text-gray-400 mt-0.5">Branch 1 & Branch 2</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ────────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form — 3/5 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.07)" }}>
              <div className="px-8 py-6 border-b border-gray-100"
                style={{ background: "linear-gradient(135deg, #f0f9ff, #f5f3ff)" }}>
                <h2 className="font-display text-xl font-bold text-gray-900">Book an Appointment</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the form below — we'll confirm within 30 minutes.</p>
              </div>
              <BookingForm />
            </div>
          </div>

          {/* Sidebar — 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* WhatsApp */}
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
                  <WhatsAppIcon />
                </div>
                <h3 className="font-display text-lg font-bold mb-1">Chat on WhatsApp</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Send us a message any time — our team responds within minutes, even for quick questions.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-sm font-semibold">
                Start a conversation <ArrowRight />
              </div>
            </a>

            {/* Call */}
            <a href="tel:01745565435"
              className="bg-white rounded-3xl p-6 flex flex-col gap-4 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                <PhoneIcon />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">Call Us Directly</h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  Prefer talking? Our team is available 6 days a week.
                </p>
                <p className="text-sky-600 font-bold text-lg">01745565435</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-600">
                Tap to call <ArrowRight />
              </div>
            </a>

            {/* Hours */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col gap-5"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h3 className="font-display text-lg font-bold text-gray-900">Clinic Hours</h3>
              {[
                { branch: "Branch 1", area: "Location TBD", color: "#0ea5e9", times: ["Sat–Thu: 10AM–2PM", "Sat–Thu: 5PM–9PM"] },
                { branch: "Branch 2", area: "Location TBD", color: "#8b5cf6", times: ["Sat–Thu: 3PM–9PM"] },
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
                      <ClockIcon />
                      {t}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 ml-1">
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
};

export default ContactBooking;
