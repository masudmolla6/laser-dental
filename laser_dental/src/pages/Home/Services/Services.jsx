import { useState } from "react";
import {
  Zap,
  Anchor,
  AlignCenter,
  Sparkles,
  HeartPulse,
  Smile,
  ArrowRight,
  Clock,
  Tag,
} from "lucide-react";

const SERVICES = [
  {
    id: 1,
    Icon: Zap,
    category: "Cosmetic",
    title: "Laser Teeth Whitening",
    shortDesc: "Brighten your smile up to 8 shades in a single session.",
    description:
      "Our advanced laser whitening system uses medical-grade technology to safely remove deep stains caused by coffee, tea, and aging. The procedure is painless, fast, and delivers immediate, dramatic results.",
    duration: "60 min",
    price: "৳ 4,500",
    highlight: true,
    tag: "Most Popular",
    color: "#e0f2fe",
    accent: "#0369a1",
  },
  {
    id: 2,
    Icon: Anchor,
    category: "Restorative",
    title: "Dental Implants",
    shortDesc: "Permanent tooth replacement that looks and feels natural.",
    description:
      "Titanium implants fused with your jawbone give you a lifetime solution for missing teeth. We use digital imaging for precise placement and craft each crown to match your natural teeth perfectly.",
    duration: "2–3 sessions",
    price: "৳ 35,000",
    highlight: false,
    tag: "Premium",
    color: "#f0fdf4",
    accent: "#166534",
  },
  {
    id: 3,
    Icon: AlignCenter,
    category: "Orthodontics",
    title: "Braces & Aligners",
    shortDesc: "Straighten your teeth with modern, comfortable solutions.",
    description:
      "From traditional metal braces to virtually invisible clear aligners, we offer personalized orthodontic treatment plans for teens and adults. Our orthodontists use 3D digital scans for precise treatment planning.",
    duration: "12–24 months",
    price: "From ৳ 18,000",
    highlight: false,
    tag: "Customized",
    color: "#fdf4ff",
    accent: "#7e22ce",
  },
  {
    id: 4,
    Icon: Sparkles,
    category: "Preventive",
    title: "Scaling & Polishing",
    shortDesc: "Professional cleaning for healthier gums and fresher breath.",
    description:
      "Our ultrasonic scaling removes tartar buildup above and below the gumline, followed by a professional polishing that removes surface stains. Recommended every 6 months to prevent gum disease.",
    duration: "45 min",
    price: "৳ 1,800",
    highlight: false,
    tag: "Routine Care",
    color: "#fff7ed",
    accent: "#c2410c",
  },
  {
    id: 5,
    Icon: HeartPulse,
    category: "Restorative",
    title: "Root Canal Treatment",
    shortDesc: "Save your natural tooth from infection, painlessly.",
    description:
      "Modern root canal therapy is virtually painless. We remove infected pulp, sterilize the canal with laser technology, and seal it with a biocompatible material — often completed in a single visit.",
    duration: "60–90 min",
    price: "৳ 8,000",
    highlight: false,
    tag: "Laser Assisted",
    color: "#fef2f2",
    accent: "#b91c1c",
  },
  {
    id: 6,
    Icon: Smile,
    category: "Cosmetic",
    title: "Smile Makeover",
    shortDesc: "A complete transformation tailored to your face and goals.",
    description:
      "Combining veneers, whitening, contouring, and bonding, our smile makeover is a fully personalized cosmetic plan. We use digital smile design to show you your results before a single procedure begins.",
    duration: "3–5 sessions",
    price: "From ৳ 55,000",
    highlight: false,
    tag: "Signature",
    color: "#fffbeb",
    accent: "#92400e",
  },
];

const CATEGORIES = ["All", "Cosmetic", "Restorative", "Orthodontics", "Preventive"];

const ServiceCard = ({ service, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer"
      style={{
        animationDelay: `${index * 80}ms`,
        borderColor: hovered ? service.accent + "55" : "#e5e7eb",
        boxShadow: hovered
          ? `0 20px 60px -12px ${service.accent}22, 0 0 0 1px ${service.accent}33`
          : "0 1px 3px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        background: "#fff",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full transition-all duration-500"
        style={{
          background: hovered
            ? `linear-gradient(90deg, ${service.accent}, ${service.accent}88)`
            : "transparent",
        }}
      />

      {/* Card body */}
      <div className="flex flex-col gap-5 p-7 flex-1">
        {/* Icon + tag row */}
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300"
            style={{
              backgroundColor: service.color,
              color: service.accent,
              transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
            }}
          >
            {service.Icon && <service.Icon size={24} />}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                backgroundColor: service.color,
                color: service.accent,
              }}
            >
              {service.tag}
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {service.category}
            </span>
          </div>
        </div>

        {/* Title & short desc */}
        <div>
          <h3
            className="text-lg font-bold text-gray-900 mb-1.5 leading-snug transition-colors duration-300"
            style={{ color: hovered ? service.accent : "#111827" }}
          >
            {service.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{service.shortDesc}</p>
        </div>

        {/* Description — reveals on hover */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? "120px" : "0px", opacity: hovered ? 1 : 0 }}
        >
          <p className="text-sm text-gray-600 leading-relaxed border-l-2 pl-3"
            style={{ borderColor: service.accent + "66" }}>
            {service.description}
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-5 mt-auto"
          style={{ borderTop: `1px solid ${hovered ? service.accent + "33" : "#f3f4f6"}` }}
        >
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5 flex items-center gap-1">
              <Clock size={10} /> Duration
            </p>
            <p className="text-sm font-semibold text-gray-700">{service.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">
              Starting from
            </p>
            <p className="text-base font-bold" style={{ color: service.accent }}>
              {service.price}
            </p>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div
        className="px-7 pb-6 transition-all duration-500"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}
      >
        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
          style={{ backgroundColor: service.accent, color: "#fff" }}
        >
          Book This Service
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section className="min-h-screen bg-[#f9fafb] py-24 px-4 md:px-8">
      {/* ── Background decorative blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #0369a1, transparent)" }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #7e22ce, transparent)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-[#0369a1]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0369a1]">
              Our Services
            </span>
            <div className="w-8 h-px bg-[#0369a1]" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-[1.1] mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Advanced Care for
            <br />
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #0369a1 0%, #7e22ce 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Perfect Smile
            </span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            From routine checkups to full smile makeovers — every treatment at
            Laser Dental Point is delivered with precision, comfort, and care.
          </p>
        </div>

        {/* ── Category filter pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border"
              style={
                activeCategory === cat
                  ? {
                      background: "#0369a1",
                      color: "#fff",
                      borderColor: "#0369a1",
                      boxShadow: "0 4px 14px rgba(3,105,161,0.35)",
                    }
                  : {
                      background: "#fff",
                      color: "#6b7280",
                      borderColor: "#e5e7eb",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Service cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* ── Bottom trust strip ── */}
        <div className="mt-20 rounded-3xl bg-white border border-gray-100 p-8 md:p-10"
          style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.05)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "15+", label: "Years of Experience" },
              { num: "1,200+", label: "Happy Patients" },
              { num: "12", label: "Expert Doctors" },
              { num: "100%", label: "Sterilized Equipment" },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-gray-900" style={{ letterSpacing: "-0.03em" }}>
                  {num}
                </span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA banner ── */}
        <div
          className="mt-8 rounded-3xl overflow-hidden relative p-10 md:p-14 text-center"
          style={{
            background: "linear-gradient(135deg, #0c4a6e 0%, #1e1b4b 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff, transparent)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #7e22ce, transparent)", transform: "translate(-30%, 30%)" }} />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-3">
              Book an appointment
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
              Ready for a healthier smile?
            </h2>
            <p className="text-blue-200 text-sm mb-8 max-w-md mx-auto">
              Walk in or call us — our team is here 6 days a week to help you feel comfortable and confident.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/appointment"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0c4a6e] rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors duration-200 active:scale-95 group">
                Book Appointment
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="tel:01745565435"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white rounded-2xl font-semibold text-sm hover:bg-white/10 transition-colors duration-200 active:scale-95">
                <Tag size={15} />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
