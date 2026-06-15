import { useState } from "react";
import {
  Zap, Anchor, AlignCenter, Sparkles,
  HeartPulse, Smile, ArrowRight, Clock, Phone, Loader2, ImagePlus
} from "lucide-react";
import { Link } from "react-router-dom";
import useServices from "../../../hooks/useServices";
import ServicesSkeleton from "./ServicesSkeleton";

// ── Icon map ──────────────────────────────────────────────────────────────
const ICON_MAP = {
  zap:         Zap,
  anchor:      Anchor,
  alignCenter: AlignCenter,
  sparkles:    Sparkles,
  heartPulse:  HeartPulse,
  smile:       Smile,
};

// ── Color scheme map ──────────────────────────────────────────────────────
const COLOR_MAP = {
  sky:     {
    iconBg: "bg-sky-100",     iconColor: "text-sky-700",
    tagBg: "bg-sky-100",      tagColor: "text-sky-700",
    accent: "bg-sky-700",     barColor: "from-sky-600 to-sky-400",
    priceColor: "text-sky-700", borderHover: "hover:border-sky-300",
    descBorder: "border-sky-300",
  },
  emerald: {
    iconBg: "bg-emerald-100", iconColor: "text-emerald-700",
    tagBg: "bg-emerald-100",  tagColor: "text-emerald-700",
    accent: "bg-emerald-700", barColor: "from-emerald-600 to-emerald-400",
    priceColor: "text-emerald-700", borderHover: "hover:border-emerald-300",
    descBorder: "border-emerald-300",
  },
  violet:  {
    iconBg: "bg-violet-100",  iconColor: "text-violet-700",
    tagBg: "bg-violet-100",   tagColor: "text-violet-700",
    accent: "bg-violet-700",  barColor: "from-violet-600 to-violet-400",
    priceColor: "text-violet-700", borderHover: "hover:border-violet-300",
    descBorder: "border-violet-300",
  },
  orange:  {
    iconBg: "bg-orange-100",  iconColor: "text-orange-700",
    tagBg: "bg-orange-100",   tagColor: "text-orange-700",
    accent: "bg-orange-700",  barColor: "from-orange-600 to-orange-400",
    priceColor: "text-orange-700", borderHover: "hover:border-orange-300",
    descBorder: "border-orange-300",
  },
  red:     {
    iconBg: "bg-red-100",     iconColor: "text-red-700",
    tagBg: "bg-red-100",      tagColor: "text-red-700",
    accent: "bg-red-700",     barColor: "from-red-600 to-red-400",
    priceColor: "text-red-700", borderHover: "hover:border-red-300",
    descBorder: "border-red-300",
  },
  amber:   {
    iconBg: "bg-amber-100",   iconColor: "text-amber-700",
    tagBg: "bg-amber-100",    tagColor: "text-amber-700",
    accent: "bg-amber-700",   barColor: "from-amber-600 to-amber-400",
    priceColor: "text-amber-700", borderHover: "hover:border-amber-300",
    descBorder: "border-amber-300",
  },
};

const CATEGORIES = ["All", "Cosmetic", "Restorative", "Orthodontics", "Preventive"];

// ── Service Card ──────────────────────────────────────────────────────────
const ServiceCard = ({ service }) => {
  const [hovered, setHovered] = useState(false);
  const Icon   = ICON_MAP[service.iconKey]    || Sparkles;
  const colors = COLOR_MAP[service.colorScheme] || COLOR_MAP.sky;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col rounded-3xl overflow-hidden border border-gray-200 bg-white
        transition-all duration-300 cursor-pointer shadow-sm
        hover:-translate-y-1.5 hover:shadow-xl ${colors.borderHover}`}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r transition-all duration-300
        ${hovered ? colors.barColor : "from-transparent to-transparent"}`} />

      <div className="flex flex-col gap-5 p-7 flex-1">

        {/* Icon + tag */}
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
            transition-transform duration-300 ${colors.iconBg} ${colors.iconColor}
            ${hovered ? "scale-110 -rotate-6" : ""}`}>
            <Icon size={24} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${colors.tagBg} ${colors.tagColor}`}>
              {service.tag}
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {service.category}
            </span>
          </div>
        </div>

        {/* Title + shortDesc */}
        <div>
          <h3 className={`text-lg font-bold mb-1.5 leading-snug transition-colors duration-300
            ${hovered ? colors.priceColor : "text-gray-900"}`}>
            {service.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{service.shortDesc}</p>
        </div>

        {/* Hover full description */}
        <div className={`overflow-hidden transition-all duration-500
          ${hovered ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
          <p className={`text-sm text-gray-600 leading-relaxed border-l-2 pl-3 ${colors.iconColor} ${colors.descBorder}`}>
            {service.description}
          </p>
        </div>

        <div className="flex-1" />

        {/* Footer */}
        <div className={`flex items-center justify-between pt-5 mt-auto border-t
          ${hovered ? "border-gray-200" : "border-gray-100"}`}>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5 flex items-center gap-1">
              <Clock size={10} /> Duration
            </p>
            <p className="text-sm font-semibold text-gray-700">{service.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Starting from</p>
            <p className={`text-base font-bold ${colors.priceColor}`}>{service.price}</p>
          </div>
        </div>
      </div>

      {/* CTA — shown on hover */}
      <div className={`px-7 pb-6 transition-all duration-300
        ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <Link
          to="/appointment"
          className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white
            flex items-center justify-center gap-2 transition-all active:scale-95
            ${colors.accent} hover:opacity-90`}
        >
          Book This Service
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// ── Main Services ─────────────────────────────────────────────────────────
const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [services, isLoading] = useServices();

  console.log(services);

  const filtered = activeCategory === "All"
    ? services
    : services.filter((s) => s.category === activeCategory);

  // available categories from actual data
  const availableCategories = CATEGORIES.filter(
    (cat) => cat === "All" || services.some((s) => s.category === cat)
  );

  return (
    <section className="min-h-screen bg-slate-50 py-24 px-4 md:px-8">

      {/* BG blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,#0369a1,transparent)" }} />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle,#7e22ce,transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-sky-700" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Our Services</span>
            <div className="w-8 h-px bg-sky-700" />
          </div>
          <h1
            className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Advanced Care for
            <br />
            <span className="bg-gradient-to-r from-sky-700 to-violet-700 bg-clip-text text-transparent">
              Your Perfect Smile
            </span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            From routine checkups to full smile makeovers — every treatment at
            Laser Dental Point is delivered with precision, comfort, and care.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                ${activeCategory === cat
                  ? "bg-sky-700 text-white border-sky-700 shadow-lg shadow-sky-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-sky-300 hover:text-sky-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <ServicesSkeleton count={6} />}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-32 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <ImagePlus size={28} className="text-slate-300" />
            </div>
            <p className="text-gray-500 font-semibold">No services found</p>
          </div>
        )}

        {/* Cards grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Trust strip */}
        <div className="mt-20 rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y-2 md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { num: "15+",    label: "Years of Experience"  },
              { num: "1,200+", label: "Happy Patients"       },
              { num: "1",      label: "Expert Doctor"        },
              { num: "100%",   label: "Sterilized Equipment" },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-2 md:py-0 md:px-6">
                <span className="text-3xl font-black text-gray-900 tracking-tight">{num}</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-8 rounded-3xl overflow-hidden relative p-10 md:p-14 text-center bg-gradient-to-br from-sky-900 to-indigo-900">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
            style={{ background: "radial-gradient(circle,#fff,transparent)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 -translate-x-1/3 translate-y-1/3"
            style={{ background: "radial-gradient(circle,#7e22ce,transparent)" }} />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-3">Book an appointment</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
              Ready for a healthier smile?
            </h2>
            <p className="text-blue-200 text-sm mb-8 max-w-md mx-auto">
              Walk in or call us — our team is here 6 days a week to help you feel comfortable and confident.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-sky-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors active:scale-95 group"
              >
                Book Appointment
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="tel:01745565435"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 text-white rounded-2xl font-semibold text-sm hover:bg-white/10 transition-colors active:scale-95"
              >
                <Phone size={15} />
                01745565435
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
