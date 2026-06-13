import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarPlus,
  Phone,
  MessageCircle,
  Plus,
  X,
} from "lucide-react";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const itemStyle = (bg, shadow) => ({
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: bg,
    boxShadow: shadow,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    textDecoration: "none",
    transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), filter 0.15s",
  });

  const chipStyle = {
    background: "#ffffff",
    color: "#111827",
    fontSize: "12.5px",
    fontWeight: 500,
    padding: "6px 16px",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
    whiteSpace: "nowrap",
    transition: "box-shadow 0.18s, transform 0.15s",
    cursor: "default",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const hoverScale = (e) => (e.currentTarget.style.transform = "scale(1.13)");
  const resetScale = (e) => (e.currentTarget.style.transform = "scale(1)");
  const hoverChip  = (e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)"; e.currentTarget.style.transform = "translateX(-3px)"; };
  const resetChip  = (e) => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateX(0)"; };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        right: "28px",
        bottom: "32px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      {/* ── Sub buttons ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "11px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Appointment */}
        <div style={rowStyle}>
          <span
            style={chipStyle}
            onMouseEnter={hoverChip}
            onMouseLeave={resetChip}
          >
            Book Appointment
          </span>
          <Link
            to="/appointment"
            style={itemStyle("#1a56db", "0 4px 18px rgba(26,86,219,0.42)")}
            onMouseEnter={hoverScale}
            onMouseLeave={resetScale}
            aria-label="Book Appointment"
            title="Book Appointment"
          >
            <CalendarPlus size={22} color="#ffffff" strokeWidth={2} />
          </Link>
        </div>

        {/* Call */}
        <div style={rowStyle}>
          <span
            style={chipStyle}
            onMouseEnter={hoverChip}
            onMouseLeave={resetChip}
          >
            Call Us Now
          </span>
          <a
            href="tel:+8801XXXXXXXXX"
            style={itemStyle("#059669", "0 4px 18px rgba(5,150,105,0.42)")}
            onMouseEnter={hoverScale}
            onMouseLeave={resetScale}
            aria-label="Call Us"
            title="Call Us"
          >
            <Phone size={22} color="#ffffff" strokeWidth={2} />
          </a>
        </div>

        {/* WhatsApp */}
        <div style={rowStyle}>
          <span
            style={chipStyle}
            onMouseEnter={hoverChip}
            onMouseLeave={resetChip}
          >
            WhatsApp Chat
          </span>
          <a
            href="https://wa.me/8801XXXXXXXXX"
            target="_blank"
            rel="noreferrer"
            style={itemStyle("#25d366", "0 4px 18px rgba(37,211,102,0.38)")}
            onMouseEnter={hoverScale}
            onMouseLeave={resetScale}
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <MessageCircle size={22} color="#ffffff" strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* ── Main toggle button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: open ? "#dc2626" : "#1a56db",
          boxShadow: open
            ? "0 4px 22px rgba(220,38,38,0.45)"
            : "0 4px 22px rgba(26,86,219,0.45)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition:
            "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), background 0.22s, box-shadow 0.22s",
        }}
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        aria-expanded={open}
      >
        {/* Pulse ring — only when closed */}
        {!open && (
          <span
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              border: "2.5px solid rgba(26,86,219,0.4)",
              animation: "fabRingPulse 2s ease-out infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Notification badge — only when closed */}
        {!open && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-2px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
              animation: "badgeBounce 1.4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          >
            3
          </span>
        )}

        {open ? (
          <X size={26} color="#ffffff" strokeWidth={2.2} />
        ) : (
          <Plus size={26} color="#ffffff" strokeWidth={2.2} />
        )}
      </button>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fabRingPulse {
          0%   { transform: scale(1);    opacity: 0.8; }
          70%  { transform: scale(1.6);  opacity: 0;   }
          100% { transform: scale(1.6);  opacity: 0;   }
        }
        @keyframes badgeBounce {
          0%, 100% { transform: scale(1);   }
          50%       { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default FloatingContact;
