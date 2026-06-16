// pages/Services/ServiceDetails.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, Tag, Calendar, CheckCircle2,
  Phone, Mail, Award, ThumbsUp,
  Share2, ChevronRight, AlertCircle, Copy, Check,
  Sparkles, Zap, Anchor, AlignCenter, HeartPulse, Smile,
  ShieldCheck, BadgeCheck, ChevronDown
} from "lucide-react";
import useService from "../../../hooks/useService";
import useServices from "../../../hooks/useServices";

// ── Icon Map ───────────────────────────────────────────────────────────────
const ICON_MAP = {
  zap: Zap, anchor: Anchor, alignCenter: AlignCenter,
  sparkles: Sparkles, heartPulse: HeartPulse, smile: Smile,
};

// ── Skeleton ───────────────────────────────────────────────────────────────
const ServiceDetailsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      <div className="w-28 h-9 bg-slate-200 rounded-full mb-6 animate-pulse" />
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 mb-8">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="w-24 h-6 bg-slate-200 rounded-full animate-pulse" />
          <div className="w-20 h-8 bg-slate-200 rounded-full animate-pulse" />
        </div>
        <div className="w-3/4 h-10 bg-slate-200 rounded-lg mb-4 animate-pulse" />
        <div className="w-full h-20 bg-slate-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="w-16 h-3 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="w-24 h-5 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
              <div className="w-48 h-7 bg-slate-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="w-full h-12 bg-slate-100 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4" />
            <div className="w-40 h-6 bg-slate-200 rounded mb-2" />
            <div className="w-32 h-4 bg-slate-100 rounded mb-4" />
            <div className="w-full h-12 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── BenefitItem ────────────────────────────────────────────────────────────
const BenefitItem = ({ text }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group">
    <CheckCircle2 size={17} className="text-emerald-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
    <span className="text-slate-600 text-sm leading-relaxed">{text}</span>
  </div>
);

// ── FAQ Accordion Item ─────────────────────────────────────────────────────
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-700">{q}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // FIX: useService returns [service, isLoading, refetch, error] — was destructured wrong before
  const [service, isLoading, , error] = useService(id);

  // FIX: useServices also returns [services, isLoading, refetch, error]
  const [allServices] = useServices();

  const benefits = [
    "Painless procedure with modern technology",
    "Experienced dental specialists",
    "100% sterilized equipment",
    "Affordable pricing & EMI options",
    "Free follow-up consultation",
    "Insurance claim assistance",
  ];

  const relatedServices = allServices
    ?.filter((s) => s._id !== id && s.category === service?.category)
    .slice(0, 3) || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setShowShareMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <ServiceDetailsSkeleton />;

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Service Not Found</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Sorry, we couldn't find the service you're looking for.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all shadow-md shadow-sky-200"
          >
            <ArrowLeft size={16} /> Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const colorMap = {
    sky:     { gradient: "from-sky-600 to-sky-400",     light: "bg-sky-50",     text: "text-sky-600",     border: "border-sky-200",    btn: "from-sky-600 to-sky-500"    },
    emerald: { gradient: "from-emerald-600 to-emerald-400", light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", btn: "from-emerald-600 to-emerald-500" },
    violet:  { gradient: "from-violet-600 to-violet-400",  light: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200",  btn: "from-violet-600 to-violet-500"  },
    orange:  { gradient: "from-orange-600 to-orange-400",  light: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-200",  btn: "from-orange-600 to-orange-500"  },
    red:     { gradient: "from-red-600 to-red-400",        light: "bg-red-50",     text: "text-red-600",     border: "border-red-200",    btn: "from-red-600 to-red-500"     },
    amber:   { gradient: "from-amber-600 to-amber-400",    light: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",  btn: "from-amber-600 to-amber-500"   },
  };
  const colors = colorMap[service.colorScheme] || colorMap.sky;
  const Icon = ICON_MAP[service.iconKey] || Sparkles;

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back + Share row */}
        <div className="flex items-center justify-between mb-7">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-sky-300 hover:text-sky-600 transition-all shadow-sm"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Services
          </button>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all shadow-sm ${
                copied
                  ? "border-emerald-300 text-emerald-600 bg-emerald-50"
                  : "border-slate-200 text-slate-500 bg-white hover:border-sky-300 hover:text-sky-600"
              }`}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </button>
            {showShareMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-slate-100 p-2 z-20 min-w-[160px]">
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Copy size={13} /> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />
          <div className="p-8 md:p-10">
            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${colors.light} ${colors.text}`}
              >
                <BadgeCheck size={12} />
                {service.tag || "Premium Service"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                <Tag size={11} />
                {service.category}
              </span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-start gap-5 mb-4">
              <div
                className={`w-16 h-16 rounded-2xl ${colors.light} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <Icon size={28} className={colors.text} />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight pt-1">
                {service.title}
              </h1>
            </div>

            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-3xl">
              {service.description}
            </p>

            {/* Meta stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <Clock size={18} className={colors.text} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
                    Duration
                  </p>
                  <p className="text-sm font-semibold text-slate-700">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <Tag size={18} className={colors.text} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
                    Starting From
                  </p>
                  <p className={`text-2xl font-black ${colors.text}`}>{service.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <Calendar size={18} className={colors.text} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
                    Booking
                  </p>
                  <p className="text-sm font-semibold text-slate-700">Same day available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <ThumbsUp size={16} className={colors.text} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Why Choose This Treatment?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {benefits.map((benefit, idx) => (
                  <BenefitItem key={idx} text={benefit} />
                ))}
              </div>
            </div>

            {/* Treatment Process */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-9 h-9 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <ShieldCheck size={16} className={colors.text} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Treatment Process</h2>
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Initial Consultation",
                    desc: "Our specialist will examine your teeth and discuss your goals in detail.",
                  },
                  {
                    step: "02",
                    title: "Treatment Planning",
                    desc: "We create a personalized treatment plan with completely transparent pricing.",
                  },
                  {
                    step: "03",
                    title: "Procedure Day",
                    desc: "Comfortable, painless treatment using the latest modern technology.",
                  },
                  {
                    step: "04",
                    title: "Follow-up Care",
                    desc: "Post-treatment care instructions and a complimentary follow-up visit.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${colors.light} flex items-center justify-center font-black text-sm ${colors.text} flex-shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1 text-sm">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-5">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {[
                  {
                    q: "Is the treatment painful?",
                    a: "Most patients report minimal to no discomfort. We use advanced numbing techniques and offer sedation options for anxious patients.",
                  },
                  {
                    q: "How long do results last?",
                    a: "With proper care, results typically last 1–3 years. Our team will provide complete aftercare instructions to maximize longevity.",
                  },
                  {
                    q: "Does insurance cover this treatment?",
                    a: "We accept most major insurance plans. Our billing team will help verify your coverage before the procedure begins.",
                  },
                  {
                    q: "How do I prepare for my appointment?",
                    a: "Simply brush and floss before arriving. Avoid eating heavy meals 2 hours before if sedation is involved. Our team will guide you through any other preparations.",
                  },
                ].map((faq, idx) => (
                  <FaqItem key={idx} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-5">

            {/* Book CTA */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-lg">
              <div
                className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center mb-4`}
              >
                <Calendar size={22} className={colors.text} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Book This Service</h3>
              <p className="text-sm text-slate-500 mb-5">
                Ready to transform your smile?
              </p>

              <div className="space-y-2.5 mb-5 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Treatment</span>
                  <span className="font-semibold text-slate-700 text-right max-w-[150px] line-clamp-1">
                    {service.title}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Price</span>
                  <span className={`font-black text-base ${colors.text}`}>{service.price}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-700 font-medium">{service.duration}</span>
                </div>
              </div>

              <Link
                to="/appointment"
                state={{
                  serviceId: service._id,
                  serviceTitle: service.title,
                  servicePrice: service.price,
                }}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r ${colors.btn} shadow-lg hover:brightness-110 hover:shadow-xl group`}
              >
                Book Appointment
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-400" /> Free consultation
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-400" /> No hidden fees
                </span>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                <Award size={15} className="text-amber-500" />
                Specialist Doctor
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-base shadow-md`}
                >
                  DR
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Dr. Masud Rana</h4>
                  <p className="text-xs text-slate-400">BDS, PGD (Cosmetic Dentistry)</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-amber-400 text-[10px]">★</span>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                10+ years of experience in cosmetic and restorative dentistry with over 2,000 successful procedures.
              </p>
              <button className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
                View profile <ChevronRight size={11} />
              </button>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-1 text-sm">Need Help?</h3>
              <p className="text-xs text-slate-400 mb-5">
                Talk to our treatment coordinator
              </p>
              <a
                href="tel:01745565435"
                className="flex items-center gap-3 text-sm mb-3 text-slate-300 hover:text-sky-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <Phone size={14} />
                </div>
                01745565435
              </a>
              <a
                href="mailto:info@laserdental.com"
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-sky-300 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <Mail size={14} />
                </div>
                info@laserdental.com
              </a>
            </div>
          </div>
        </div>

        {/* ── Related Services ── */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Related Treatments</h2>
              <Link
                to="/services"
                className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium transition-colors"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.map((related) => {
                const RelIcon = ICON_MAP[related.iconKey] || Sparkles;
                const rc = colorMap[related.colorScheme] || colorMap.sky;
                return (
                  <Link
                    key={related._id}
                    to={`/services/${related._id}`}
                    className="group bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden relative"
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${rc.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${rc.light} flex items-center justify-center flex-shrink-0`}>
                        <RelIcon size={18} className={rc.text} />
                      </div>
                      <h3 className={`font-bold text-slate-800 group-hover:${rc.text} transition-colors text-sm leading-tight pt-1`}>
                        {related.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{related.shortDesc}</p>
                    <div className="flex items-center justify-between">
                      <p className={`text-base font-black ${rc.text}`}>{related.price}</p>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {related.duration}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServiceDetails;
