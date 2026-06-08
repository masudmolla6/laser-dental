import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Loader2 } from "lucide-react";
import useBanners from "../../../hooks/useBanners";

const Banner = () => {
  const [banners, isLoading] = useBanners();

  // isActive true গুলো order অনুযায়ী sort
  const activeBanners = banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center bg-[#050f23]"
        style={{ height: "90vh", minHeight: 540 }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-sky-400" />
          <p className="text-white/40 text-sm tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  // ── No active banners fallback ────────────────────────────────────────
  if (!activeBanners.length) {
    return (
      <div className="w-full flex items-center justify-center bg-[#050f23]"
        style={{ height: "90vh", minHeight: 540 }}>
        <p className="text-white/30 text-sm">No active banners.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        * { box-sizing: border-box; }

        /* ── Dots ── */
        .premium-carousel .control-dots {
          bottom: 24px !important;
          z-index: 20;
        }
        .premium-carousel .control-dots .dot {
          width: 8px !important;
          height: 8px !important;
          background: rgba(255,255,255,0.4) !important;
          box-shadow: none !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
          opacity: 1 !important;
          border-radius: 999px !important;
        }
        .premium-carousel .control-dots .dot.selected {
          width: 28px !important;
          background: #fff !important;
        }

        /* ── Arrows ── */
        .premium-carousel .control-arrow {
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 48px !important;
          height: 48px !important;
          background: rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 50% !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          opacity: 0 !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 30 !important;
        }
        .premium-carousel:hover .control-arrow { opacity: 1 !important; }
        .premium-carousel .control-arrow:hover  { background: rgba(255,255,255,0.22) !important; }
        .premium-carousel .control-prev.control-arrow { left: 20px !important; }
        .premium-carousel .control-next.control-arrow { right: 20px !important; }
        .premium-carousel .control-arrow::before { display: none !important; }
        .premium-carousel .control-prev.control-arrow::after {
          content: '';
          width: 10px; height: 10px;
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transform: rotate(45deg);
          margin-left: 4px;
        }
        .premium-carousel .control-next.control-arrow::after {
          content: '';
          width: 10px; height: 10px;
          border-right: 2px solid #fff;
          border-top: 2px solid #fff;
          transform: rotate(45deg);
          margin-right: 4px;
        }

        /* ── Heights ── */
        .premium-carousel,
        .premium-carousel .carousel,
        .premium-carousel .slider-wrapper,
        .premium-carousel .slider,
        .premium-carousel .slide {
          height: 90vh !important;
          min-height: 540px;
          max-height: 860px;
        }
        .premium-carousel .carousel .slide { background: transparent !important; }

        .banner-slide-root {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .banner-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          z-index: 0;
          transform: scale(1.02);
          transition: transform 8s ease;
        }

        /* ── Animations ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .slide-tag     { animation: slideUp 0.6s ease 0.10s both; }
        .slide-heading { animation: slideUp 0.7s ease 0.25s both; }
        .slide-sub     { animation: slideUp 0.7s ease 0.40s both; }
        .slide-btn     { animation: slideUp 0.7s ease 0.55s both; }
        .slide-badge   { animation: fadeIn  0.8s ease 0.70s both; }

        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-accent {
          background: linear-gradient(90deg, #38bdf8 0%, #818cf8 40%, #38bdf8 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 3.5s linear infinite;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .premium-carousel,
          .premium-carousel .carousel,
          .premium-carousel .slider-wrapper,
          .premium-carousel .slider,
          .premium-carousel .slide {
            height: 78vh !important;
            min-height: 620px;
          }
          .premium-carousel .control-arrow { display: none !important; }
        }
      `}</style>

      <div className="premium-carousel">
        <Carousel
          autoPlay
          infiniteLoop
          interval={4000}
          transitionTime={800}
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          swipeable
          emulateTouch
          stopOnHover
        >
          {activeBanners.map((slide, idx) => (
            <div key={slide._id} className="banner-slide-root">

              {/* Background image */}
              <div
                className="banner-bg"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundPosition: slide.objectPosition || "center center",
                }}
              />

              {/* Dark overlay — direction based on align */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: slide.align === "right"
                    ? "linear-gradient(to left,  rgba(5,15,35,0.92) 0%, rgba(5,15,35,0.65) 45%, rgba(5,15,35,0.2) 100%)"
                    : "linear-gradient(to right, rgba(5,15,35,0.92) 0%, rgba(5,15,35,0.65) 45%, rgba(5,15,35,0.2) 100%)",
                }}
              />

              {/* Bottom fade */}
              <div
                className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
                style={{ background: "linear-gradient(to top, rgba(5,15,35,0.6), transparent)" }}
              />

              {/* Dot pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] z-10"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* ── Content ── */}
              <div className="absolute inset-0 flex items-center z-20">
                <div
                  className="w-full max-w-7xl mx-auto px-6 md:px-16 flex"
                  style={{ justifyContent: slide.align === "right" ? "flex-end" : "flex-start" }}
                >
                  <div className="text-white flex flex-col gap-5" style={{ maxWidth: "560px" }}>

                    {/* Tag */}
                    {slide.tag && (
                      <div className="slide-tag">
                        <span
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                          style={{
                            background: "rgba(14,165,233,0.2)",
                            border: "1px solid rgba(14,165,233,0.4)",
                            color: "#38bdf8",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                          {slide.tag}
                        </span>
                      </div>
                    )}

                    {/* Heading */}
                    <div className="slide-heading">
                      <h1
                        className="font-display"
                        style={{
                          fontSize: "clamp(2.2rem, 5vw, 4rem)",
                          fontWeight: 800,
                          lineHeight: 1.1,
                          letterSpacing: "-0.02em",
                          margin: 0,
                        }}
                      >
                        {slide.title}
                        <br />
                        <span className="shimmer-accent">{slide.accentTitle}</span>
                      </h1>
                    </div>

                    {/* Subtitle */}
                    <p
                      className="slide-sub"
                      style={{
                        fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.75,
                        margin: 0,
                        maxWidth: "460px",
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className="slide-btn flex flex-wrap gap-3 items-center">
                      {slide.buttonLink && slide.buttonText && (
                        <Link
                          to={slide.buttonLink}
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 active:scale-95 group hover:brightness-110"
                          style={
                            slide.btnStyle === "outline"
                              ? {
                                  background: "rgba(255,255,255,0.1)",
                                  backdropFilter: "blur(8px)",
                                  border: "1.5px solid rgba(255,255,255,0.35)",
                                  color: "#fff",
                                  textDecoration: "none",
                                }
                              : {
                                  background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                                  color: "#fff",
                                  boxShadow: "0 6px 24px rgba(14,165,233,0.5)",
                                  textDecoration: "none",
                                }
                          }
                        >
                          {slide.buttonText}
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      )}

                      {/* WhatsApp button — always shown */}
                      <a
                        href="https://wa.me/8801745565435"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 hover:brightness-110"
                        style={{
                          background: "rgba(18,140,126,0.2)",
                          border: "1.5px solid rgba(18,140,126,0.5)",
                          color: "#4ade80",
                          textDecoration: "none",
                        }}
                      >
                        <MessageCircle size={15} />
                        WhatsApp
                      </a>
                    </div>

                    {/* Stats badges */}
                    <div
                      className="slide-badge flex flex-wrap items-center gap-5 pt-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      {[
                        { num: "1,200+", label: "Happy Patients"    },
                        { num: "15+",    label: "Years Experience"  },
                        { num: "4.9★",   label: "Patient Rating"   },
                      ].map(({ num, label }) => (
                        <div key={label} className="flex flex-col">
                          <span className="font-display text-base font-bold text-white">{num}</span>
                          <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide counter */}
              <div
                className="absolute bottom-8 right-6 md:right-16 text-white/30 font-bold z-20 font-display"
                style={{ fontSize: "0.75rem", letterSpacing: "0.1em" }}
              >
                0{idx + 1} / 0{activeBanners.length}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
