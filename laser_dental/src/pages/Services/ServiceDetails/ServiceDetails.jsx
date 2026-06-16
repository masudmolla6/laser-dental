// pages/Services/ServiceDetails.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, Tag, Calendar, CheckCircle2, Star,
  Phone, Mail, MapPin, Shield, Award, ThumbsUp, Heart,
  Share2, ChevronRight, Loader2, AlertCircle, X
} from "lucide-react";
import useService from "../../../hooks/useService";
import useServices from "../../../hooks/useServices";
;

// ── Skeleton Component ─────────────────────────────────────────────────
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
      </div>
    </div>
  </div>
);

const BenefitItem = ({ text }) => (
  <div className="flex items-start gap-3">
    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
    <span className="text-slate-600 text-sm">{text}</span>
  </div>
);

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const [service, isLoading, error] = useService(id);
  
//   console.log(service);


  const [allServices] = useServices();

  const benefits = [
    "Painless procedure with modern technology",
    "Experienced dental specialists",
    "100% sterilized equipment",
    "Affordable pricing & EMI options",
    "Free follow-up consultation",
    "Insurance claim assistance"
  ];

  const relatedServices = allServices
    ?.filter(s => s._id !== id && s.category === service?.category)
    .slice(0, 3) || [];

  if (isLoading) return <ServiceDetailsSkeleton />;

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Service Not Found</h2>
          <p className="text-slate-500 mb-8">Sorry, we couldn't find the service you're looking for.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all"
          >
            <ArrowLeft size={18} /> Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const colorMap = {
    sky: { primary: "sky", gradient: "from-sky-600 to-sky-400", light: "bg-sky-50", text: "text-sky-600" },
    emerald: { primary: "emerald", gradient: "from-emerald-600 to-emerald-400", light: "bg-emerald-50", text: "text-emerald-600" },
    violet: { primary: "violet", gradient: "from-violet-600 to-violet-400", light: "bg-violet-50", text: "text-violet-600" },
    orange: { primary: "orange", gradient: "from-orange-600 to-orange-400", light: "bg-orange-50", text: "text-orange-600" },
    red: { primary: "red", gradient: "from-red-600 to-red-400", light: "bg-red-50", text: "text-red-600" },
    amber: { primary: "amber", gradient: "from-amber-600 to-amber-400", light: "bg-amber-50", text: "text-amber-600" },
  };
  const colors = colorMap[service.colorScheme] || colorMap.sky;

  const shareUrl = window.location.href;

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-sky-300 hover:text-sky-600 transition-all mb-6 shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />
          <div className="p-8 md:p-10">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${colors.light} ${colors.text}`}>
                  {service.tag || "Premium Service"}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                  {service.category}
                </span>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-sm hover:bg-slate-100 transition-colors"
                >
                  <Share2 size={14} /> Share
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-slate-100 p-2 z-10">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setShowShareMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
              {service.title}
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
              {service.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <Clock size={18} className={colors.text} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</p>
                  <p className="text-sm font-semibold text-slate-700">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <Tag size={18} className={colors.text} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starting From</p>
                  <p className={`text-xl font-black ${colors.text}`}>{service.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.light} flex items-center justify-center`}>
                  <Calendar size={18} className={colors.text} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Booking</p>
                  <p className="text-sm font-semibold text-slate-700">Same day available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg ${colors.light} flex items-center justify-center`}>
                  <ThumbsUp size={16} className={colors.text} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Why Choose This Treatment?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, idx) => (
                  <BenefitItem key={idx} text={benefit} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Treatment Process</h2>
              <div className="space-y-4">
                {[
                  { step: "01", title: "Initial Consultation", desc: "Our specialist will examine your teeth and discuss your goals." },
                  { step: "02", title: "Treatment Planning", desc: "We create a personalized treatment plan with transparent pricing." },
                  { step: "03", title: "Procedure Day", desc: "Comfortable, painless treatment using modern technology." },
                  { step: "04", title: "Follow-up Care", desc: "Post-treatment care instructions and free follow-up visit." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${colors.light} flex items-center justify-center font-bold ${colors.text} flex-shrink-0`}>
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "Is the treatment painful?", a: "Most patients report minimal to no discomfort. We use advanced numbing techniques and sedation options if needed." },
                  { q: "How long do results last?", a: "With proper care, results can last 1-3 years. We'll provide complete aftercare instructions." },
                  { q: "Does insurance cover this?", a: "We accept most major insurance plans. Our team will help verify your coverage." },
                ].map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-slate-700 mb-2 flex items-start gap-2">
                      <span className="text-sky-500">Q:</span> {faq.q}
                    </h3>
                    <p className="text-sm text-slate-500 pl-5">
                      <span className="text-emerald-500">A:</span> {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-lg">
              <div className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center mb-4`}>
                <Calendar size={22} className={colors.text} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Book This Service</h3>
              <p className="text-sm text-slate-500 mb-4">Ready to transform your smile?</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Treatment</span>
                  <span className="font-semibold text-slate-700">{service.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className={`font-bold ${colors.text}`}>{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-700">{service.duration}</span>
                </div>
              </div>

              <Link
                to="/appointment"
                state={{ serviceId: service._id, serviceTitle: service.title, servicePrice: service.price }}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r ${colors.gradient} shadow-lg hover:brightness-105`}
              >
                Book Appointment
                <ChevronRight size={15} />
              </Link>
              
              <p className="text-[10px] text-slate-400 text-center mt-4">
                ✓ Free consultation • ✓ No hidden fees
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                Specialist Doctor
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-lg">
                  DR
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Dr. Masud Rana</h4>
                  <p className="text-xs text-slate-400">BDS, PGD (Cosmetic Dentistry)</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                10+ years of experience in cosmetic and restorative dentistry.
              </p>
              <button className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                Know more <ChevronRight size={12} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-slate-300 mb-4">Talk to our treatment coordinator</p>
              <a href="tel:01745565435" className="flex items-center gap-3 text-sm mb-3 hover:text-sky-300 transition-colors">
                <Phone size={14} /> 01745565435
              </a>
              <a href="mailto:info@laserdental.com" className="flex items-center gap-3 text-sm hover:text-sky-300 transition-colors">
                <Mail size={14} /> info@laserdental.com
              </a>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Related Services</h2>
              <Link to="/services" className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((related) => (
                <Link
                  key={related._id}
                  to={`/services/${related._id}`}
                  className="group bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <h3 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors mb-2">
                    {related.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{related.shortDesc}</p>
                  <p className="text-sm font-bold text-slate-700 mt-3">{related.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServiceDetails;