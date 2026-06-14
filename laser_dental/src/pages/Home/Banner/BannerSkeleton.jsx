const BannerSkeleton = () => {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        height: "90vh",
        minHeight: 540,
        maxHeight: 860,
        background: "linear-gradient(135deg, #050f23 0%, #0a1628 100%)",
        padding: "0 clamp(24px, 8vw, 80px)",
      }}
    >
      <style>{`
        @keyframes skeletonSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes skeletonBreathe {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
        .skel-block {
          animation: skeletonBreathe 2s ease-in-out infinite;
        }
        .skel-base {
          background: rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .skel-base::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 40%,
            rgba(255, 255, 255, 0.11) 50%,
            rgba(255, 255, 255, 0.06) 60%,
            transparent 100%
          );
          animation: skeletonSweep 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Tooth watermark — right side */}
      <div
        style={{
          position: "absolute",
          right: 0, top: 0, bottom: 0,
          width: "50%",
          background: "linear-gradient(to left, rgba(255,255,255,0.025), transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 130,
          opacity: 0.04,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        🦷
      </div>

      {/* Dot pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.025,
          pointerEvents: "none",
        }}
      />

      {/* ── Skeleton content block ── */}
      <div
        className="skel-block"
        style={{
          maxWidth: 500,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          zIndex: 1,
        }}
      >
        {/* Tag pill */}
        <div
          className="skel-base"
          style={{
            height: 30,
            width: 164,
            borderRadius: 999,
            background: "rgba(14,165,233,0.1)",
            border: "1px solid rgba(14,165,233,0.12)",
          }}
        />

        {/* Heading — 2 lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="skel-base" style={{ height: 54, width: "100%", borderRadius: 12 }} />
          <div
            className="skel-base"
            style={{
              height: 46,
              width: "72%",
              borderRadius: 12,
              background: "rgba(129,140,248,0.08)",
            }}
          />
        </div>

        {/* Subtitle — 2 lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div className="skel-base" style={{ height: 14, width: "96%", borderRadius: 6 }} />
          <div className="skel-base" style={{ height: 14, width: "76%", borderRadius: 6 }} />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            className="skel-base"
            style={{
              height: 46,
              width: 172,
              borderRadius: 999,
              background: "rgba(14,165,233,0.13)",
            }}
          />
          <div
            className="skel-base"
            style={{
              height: 46,
              width: 124,
              borderRadius: 999,
              background: "rgba(18,140,126,0.1)",
            }}
          />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 0,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 7,
                paddingRight: i < 2 ? 28 : 0,
                marginRight: i < 2 ? 28 : 0,
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <div className="skel-base" style={{ height: 16, width: 44, borderRadius: 5 }} />
              <div className="skel-base" style={{ height: 10, width: 70, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom dots */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          zIndex: 1,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="skel-base"
            style={{
              width: i === 0 ? 28 : 8,
              height: 8,
              borderRadius: 999,
            }}
          />
        ))}
      </div>

      {/* Slide counter placeholder */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: "clamp(24px, 4vw, 64px)",
          zIndex: 1,
        }}
      >
        <div className="skel-base" style={{ height: 12, width: 36, borderRadius: 4 }} />
      </div>
    </div>
  );
};

export default BannerSkeleton;
