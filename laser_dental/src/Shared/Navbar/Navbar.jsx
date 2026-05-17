import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";
import useCheckAdmin from "../../hooks/useCheckAdmin";

// ── Icons ──────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

// ── Main Navbar ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [admin] = useCheckAdmin();
  const { user, logOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar bg change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogOut = async () => {
    try {
      await logOut();
      setMobileOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .nav-font { font-family: 'DM Sans', sans-serif; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .nav-animate   { animation: slideDown 0.35s ease forwards; }
        .mob-overlay   { animation: fadeIn 0.25s ease forwards; }
        .mob-panel     { animation: slideRight 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        .nav-link-item {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          padding: 6px 2px;
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #38bdf8;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link-item:hover { color: #fff; }
        .nav-link-item:hover::after { width: 100%; }
        .nav-link-item.active { color: #fff; }
        .nav-link-item.active::after { width: 100%; background: #38bdf8; }
      `}</style>

      <div className="sticky top-0 z-50 nav-font nav-animate">

        {/* ── Top info bar ────────────────────────────────────────────────── */}
        <div className="bg-[#0c2340] text-white/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 h-10 text-[12px]">

            {/* Left */}
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open Now
              </span>
              <span className="hidden sm:flex items-center gap-1.5 text-white/60">
                <LocationIcon />
                Dhaka, Bangladesh · 2 Branches
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-white/60">
                <ClockIcon />
                Sat – Thu: 9AM – 10PM
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <a
                href="tel:01745565435"
                className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors font-medium"
              >
                <PhoneIcon />
                01745565435
              </a>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── Main navbar ─────────────────────────────────────────────────── */}
        <div
          className="transition-all duration-300"
          style={{
            background: scrolled
              ? "rgba(9, 20, 45, 0.97)"
              : "rgba(9, 20, 45, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.25)" : "none",
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `nav-link-item${isActive ? " active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {user && admin && (
                <NavLink
                  to="/dashboard/adminHome"
                  className={({ isActive }) =>
                    `nav-link-item${isActive ? " active" : ""}`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/appointment"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-200 active:scale-95 group"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                  boxShadow: "0 4px 18px rgba(14,165,233,0.4)",
                }}
              >
                Book Appointment
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight />
                </span>
              </Link>

              {user ? (
                <button
                  onClick={handleLogOut}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200 active:scale-95"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200 active:scale-95"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="mob-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div
            className="mob-panel fixed top-0 left-0 bottom-0 z-50 w-[300px] flex flex-col"
            style={{
              background: "linear-gradient(160deg, #09142d 0%, #0c1f3d 100%)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Status pill */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-semibold">Open Now · 2 Locations</span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="px-4 flex-1">
              {navLinks.map(({ to, label }, i) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    }`
                  }
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {label}
                  <ArrowRight />
                </NavLink>
              ))}

              {user && admin && (
                <NavLink
                  to="/dashboard/adminHome"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <DashboardIcon />
                    Dashboard
                  </span>
                  <ArrowRight />
                </NavLink>
              )}
            </nav>

            {/* Contact quick actions */}
            <div className="px-6 py-4 border-t border-white/10 space-y-2">
              <a
                href="tel:01745565435"
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors py-2"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
                  <PhoneIcon />
                </div>
                01745565435
              </a>
              <a
                href="https://wa.me/8801745565435"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors py-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                WhatsApp Us
              </a>
            </div>

            {/* CTA buttons */}
            <div className="px-6 pb-8 pt-3 space-y-2.5">
              <Link
                to="/appointment"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-sm font-bold transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                  boxShadow: "0 4px 18px rgba(14,165,233,0.4)",
                }}
              >
                Book Appointment
                <ArrowRight />
              </Link>

              {user ? (
                <button
                  onClick={handleLogOut}
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-all active:scale-95"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-2xl text-sm font-semibold text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-all active:scale-95"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
