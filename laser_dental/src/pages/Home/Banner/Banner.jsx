import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/8376318/pexels-photo-8376318.jpeg?auto=compress&cs=tinysrgb&w=1600",
    objectPosition: "center 20%",
    tag: "Advanced Technology",
    heading: "Laser-Powered",
    headingAccent: "Dental Care",
    sub: "Experience painless, precision-driven treatments with cutting-edge laser technology — all under one roof in Dhaka.",
    btnText: "Book Appointment",
    btnLink: "/appointment",
    btnStyle: "primary",
    align: "left",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/19438558/pexels-photo-19438558.jpeg?auto=compress&cs=tinysrgb&w=1600",
    objectPosition: "center center",
    tag: "Completely Pain-Free",
    heading: "Your Comfort,",
    headingAccent: "Our Priority",
    sub: "From routine cleanings to full smile makeovers — every procedure is designed to be gentle, safe, and stress-free.",
    btnText: "Explore Services",
    btnLink: "/services",
    btnStyle: "outline",
    align: "left",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/5207089/pexels-photo-5207089.jpeg?auto=compress&cs=tinysrgb&w=1600",
    objectPosition: "center 30%",
    tag: "15+ Years of Trust",
    heading: "One Doctor,",
    headingAccent: "Two Locations",
    sub: "Serving Dhaka from two convenient branches — consistent expert care from a single dedicated dental surgeon.",
    btnText: "Find a Location",
    btnLink: "/locations",
    btnStyle: "primary",
    align: "right",
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1600",
    objectPosition: "center 25%",
    tag: "Smile Transformation",
    heading: "Your Perfect",
    headingAccent: "Smile Awaits",
    sub: "Whitening, veneers, braces, implants — we offer a full range of cosmetic and restorative dental solutions.",
    btnText: "See Our Work",
    btnLink: "/services",
    btnStyle: "outline",
    align: "left",
  },
];

const Banner = () => {
  return (
    <div className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *{
          box-sizing:border-box;
        }

        /* ───────────────────────────────────────── */
        /* Carousel Dots */
        /* ───────────────────────────────────────── */

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
        }

        .premium-carousel .control-dots .dot.selected {
          width: 28px !important;
          border-radius: 999px !important;
          background: #fff !important;
        }

        /* ───────────────────────────────────────── */
        /* Arrows */
        /* ───────────────────────────────────────── */

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

        .premium-carousel:hover .control-arrow {
          opacity: 1 !important;
        }

        .premium-carousel .control-arrow:hover {
          background: rgba(255,255,255,0.22) !important;
        }

        .premium-carousel .control-prev.control-arrow {
          left: 20px !important;
        }

        .premium-carousel .control-next.control-arrow {
          right: 20px !important;
        }

        .premium-carousel .control-arrow::before {
          display: none !important;
        }

        .premium-carousel .control-prev.control-arrow::after {
          content: '';
          width: 10px;
          height: 10px;
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transform: rotate(45deg);
          margin-left: 4px;
        }

        .premium-carousel .control-next.control-arrow::after {
          content: '';
          width: 10px;
          height: 10px;
          border-right: 2px solid #fff;
          border-top: 2px solid #fff;
          transform: rotate(45deg);
          margin-right: 4px;
        }

        /* ───────────────────────────────────────── */
        /* Carousel Height Fix */
        /* ───────────────────────────────────────── */

        .premium-carousel,
        .premium-carousel .carousel,
        .premium-carousel .slider-wrapper,
        .premium-carousel .slider,
        .premium-carousel .slide {
          height: 90vh !important;
          min-height: 540px;
          max-height: 860px;
        }

        .premium-carousel .carousel .slide {
          background: transparent !important;
        }

        .banner-slide-root {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* ───────────────────────────────────────── */
        /* FIXED IMAGE BACKGROUND */
        /* ───────────────────────────────────────── */

        .banner-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          z-index: 0;
          transform: scale(1.02);
        }

        /* ───────────────────────────────────────── */
        /* Animations */
        /* ───────────────────────────────────────── */

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .slide-tag {
          animation: slideUp 0.6s ease 0.1s both;
        }

        .slide-heading {
          animation: slideUp 0.7s ease 0.25s both;
        }

        .slide-sub {
          animation: slideUp 0.7s ease 0.4s both;
        }

        .slide-btn {
          animation: slideUp 0.7s ease 0.55s both;
        }

        .slide-badge {
          animation: fadeIn 0.8s ease 0.7s both;
        }

        @keyframes shimmerText {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .shimmer-accent {
          background: linear-gradient(
            90deg,
            #38bdf8 0%,
            #818cf8 40%,
            #38bdf8 80%
          );

          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 3.5s linear infinite;
        }

        /* ───────────────────────────────────────── */
        /* Responsive */
        /* ───────────────────────────────────────── */

        @media (max-width: 768px) {
          .premium-carousel,
          .premium-carousel .carousel,
          .premium-carousel .slider-wrapper,
          .premium-carousel .slider,
          .premium-carousel .slide {
            height: 78vh !important;
            min-height: 620px;
          }

          .premium-carousel .control-arrow {
            display: none !important;
          }
        }
      `}</style>

      <div className="premium-carousel">
        <Carousel
          autoPlay
          infiniteLoop
          interval={3000}
          transitionTime={800}
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          swipeable
          emulateTouch
          stopOnHover
        >
          {SLIDES.map((slide) => (
            <div key={slide.id} className="banner-slide-root">
              
              {/* Background */}
              <div
                className="banner-bg"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundPosition: slide.objectPosition,
                }}
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    slide.align === "right"
                      ? "linear-gradient(to left, rgba(5,15,35,0.92) 0%, rgba(5,15,35,0.65) 45%, rgba(5,15,35,0.2) 100%)"
                      : "linear-gradient(to right, rgba(5,15,35,0.92) 0%, rgba(5,15,35,0.65) 45%, rgba(5,15,35,0.2) 100%)",
                }}
              />

              {/* Bottom Fade */}
              <div
                className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,15,35,0.6), transparent)",
                }}
              />

              {/* Dot Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] z-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center z-20">
                <div
                  className="w-full max-w-7xl mx-auto px-6 md:px-16"
                  style={{
                    display: "flex",
                    justifyContent:
                      slide.align === "right"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div
                    className="text-white flex flex-col gap-5"
                    style={{
                      maxWidth: "560px",
                      textAlign: "left",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {/* Tag */}
                    <div className="slide-tag">
                      <span
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                        style={{
                          background: "rgba(14,165,233,0.2)",
                          border: "1px solid rgba(14,165,233,0.4)",
                          color: "#38bdf8",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        {slide.tag}
                      </span>
                    </div>

                    {/* Heading */}
                    <div className="slide-heading">
                      <h1
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(2.2rem, 5vw, 4rem)",
                          fontWeight: 800,
                          lineHeight: 1.1,
                          letterSpacing: "-0.02em",
                          margin: 0,
                        }}
                      >
                        {slide.heading}
                        <br />
                        <span className="shimmer-accent">
                          {slide.headingAccent}
                        </span>
                      </h1>
                    </div>

                    {/* Sub */}
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
                      {slide.sub}
                    </p>

                    {/* Buttons */}
                    <div className="slide-btn flex flex-wrap gap-3 items-center">
                      <Link
                        to={slide.btnLink}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 active:scale-95 group"
                        style={
                          slide.btnStyle === "primary"
                            ? {
                                background:
                                  "linear-gradient(135deg, #0284c7, #0ea5e9)",
                                color: "#fff",
                                boxShadow:
                                  "0 6px 24px rgba(14,165,233,0.5)",
                                textDecoration: "none",
                              }
                            : {
                                background: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(8px)",
                                border:
                                  "1.5px solid rgba(255,255,255,0.35)",
                                color: "#fff",
                                textDecoration: "none",
                              }
                        }
                      >
                        {slide.btnText}

                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="group-hover:translate-x-1"
                          style={{ transition: "transform 0.2s" }}
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>

                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/8801745565435"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95"
                        style={{
                          background: "rgba(18,140,126,0.2)",
                          border:
                            "1.5px solid rgba(18,140,126,0.5)",
                          color: "#4ade80",
                          textDecoration: "none",
                        }}
                      >
                        WhatsApp
                      </a>
                    </div>

                    {/* Badges */}
                    <div
                      className="slide-badge flex flex-wrap items-center gap-4 pt-2"
                      style={{
                        borderTop:
                          "1px solid rgba(255,255,255,0.12)",
                        paddingTop: "16px",
                      }}
                    >
                      {[
                        {
                          num: "1,200+",
                          label: "Happy Patients",
                        },
                        {
                          num: "15+",
                          label: "Years Experience",
                        },
                        {
                          num: "4.9★",
                          label: "Patient Rating",
                        },
                      ].map(({ num, label }) => (
                        <div key={label} className="flex flex-col">
                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              color: "#fff",
                              fontFamily:
                                "'Playfair Display', serif",
                            }}
                          >
                            {num}
                          </span>

                          <span
                            style={{
                              fontSize: "0.65rem",
                              color:
                                "rgba(255,255,255,0.45)",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Number */}
              <div
                className="absolute bottom-8 right-6 md:right-16 text-white/30 font-bold z-20"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                }}
              >
                0{slide.id} / 0{SLIDES.length}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;