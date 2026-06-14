import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Loader2 } from "lucide-react";
import useBanners from "../../../hooks/useBanners";
import BannerSkeleton from "./BannerSkeleton";

const Banner = () => {
  const [banners, isLoading] = useBanners();

  const activeBanners = banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  if (isLoading) {
    return <BannerSkeleton></BannerSkeleton>
  }

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
          display: block;
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
          {activeBanners.map((slide, idx) => {
            const isRight = slide.align === "right";

            return (
              <div key={slide._id} className="banner-slide-root">

                {/* Background */}
                <div
                  className="banner-bg"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundPosition: slide.objectPosition || "center center",
                  }}
                />

                {/* Overlay — direction based on align */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: isRight
                      ? "linear-gradient(to left,  rgba(5,15,35,0.92) 0%, rgba(5,15,35,0.65) 45%, rgba(5,15,35,0.15) 100%)"
                      : "linear-gradient(to right, rgba(5,15,35,0.92) 0%, rgba(5,15,35,0.65) 45%, rgba(5,15,35,0.15) 100%)",
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
                    style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}
                  >
                    {/* ✅ text-align always left, max-width fixed */}
                    <div
                      className="text-white flex flex-col gap-5"
                      style={{
                        maxWidth: "540px",
                        width: "100%",
                        textAlign: "left",  /* ✅ always left — never center */
                        alignItems: "flex-start",
                      }}
                    >

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

                      {/* ✅ Heading — title & accentTitle font-size separated */}
                      <div className="slide-heading" style={{ margin: 0 }}>
                        {/* Main title — large */}
                        {slide.title && (
                          <h1
                            style={{
                              fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
                              fontWeight: 800,
                              lineHeight: 1.12,
                              letterSpacing: "-0.02em",
                              margin: 0,
                              color: "#fff",
                            }}
                          >
                            {slide.title}
                          </h1>
                        )}

                        {/* Accent title — slightly smaller so it never overflows */}
                        {slide.accentTitle && (
                          <span
                            className="shimmer-accent"
                            style={{
                              fontSize: "clamp(1.7rem, 3.8vw, 3rem)", /* ✅ smaller than title */
                              fontWeight: 800,
                              lineHeight: 1.15,
                              letterSpacing: "-0.02em",
                              marginTop: "4px",
                            }}
                          >
                            {slide.accentTitle}
                          </span>
                        )}
                      </div>

                      {/* Subtitle */}
                      {slide.subtitle && (
                        <p
                          className="slide-sub"
                          style={{
                            fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.75,
                            margin: 0,
                            maxWidth: "460px",
                            textAlign: "left", /* ✅ force left */
                          }}
                        >
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Buttons */}
                      <div
                        className="slide-btn"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "12px",
                          alignItems: "center",
                          justifyContent: "flex-start", /* ✅ always left */
                        }}
                      >
                        {slide.buttonLink && slide.buttonText && (
                          <Link
                            to={slide.buttonLink}
                            className="inline-flex items-center gap-2 font-bold text-sm transition-all duration-200 active:scale-95 group hover:brightness-110"
                            style={
                              slide.btnStyle === "outline"
                                ? {
                                    padding: "12px 28px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(8px)",
                                    border: "1.5px solid rgba(255,255,255,0.35)",
                                    color: "#fff",
                                    textDecoration: "none",
                                  }
                                : {
                                    padding: "12px 28px",
                                    borderRadius: "999px",
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

                        <a
                          href="https://wa.me/8801745565435"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 font-semibold text-sm transition-all duration-200 active:scale-95 hover:brightness-110"
                          style={{
                            padding: "12px 22px",
                            borderRadius: "999px",
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

                      {/* Stats */}
                      <div
                        className="slide-badge"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "0",
                          paddingTop: "20px",
                          borderTop: "1px solid rgba(255,255,255,0.12)",
                          justifyContent: "flex-start", /* ✅ always left */
                        }}
                      >
                        {[
                          { num: "1,200+", label: "Happy Patients"   },
                          { num: "15+",    label: "Years Experience" },
                          { num: "4.9★",   label: "Patient Rating"  },
                        ].map(({ num, label }, i) => (
                          <div
                            key={label}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              paddingRight: i < 2 ? "28px" : 0,
                              marginRight: i < 2 ? "28px" : 0,
                              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none",
                            }}
                          >
                            <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{num}</span>
                            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
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
                  className="absolute bottom-8 right-6 md:right-16 text-white/30 font-bold z-20"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.1em" }}
                >
                  0{idx + 1} / 0{activeBanners.length}
                </div>

              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
