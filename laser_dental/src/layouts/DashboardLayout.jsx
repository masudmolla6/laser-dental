import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  ImagePlus,
  Images,
  Image,
  GalleryVertical,
  LogOut,
  Home,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { NavLink, Outlet } from "react-router-dom";

// ── Tooth SVG ──────────────────────────────────────────────────────────────
const ToothSVG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z" />
  </svg>
);

const adminLinks = [
  { name: "Admin Home",    path: "/dashboard/adminHome",    icon: LayoutDashboard, color: "#0ea5e9" },
  { name: "Control Panel", path: "/dashboard/controlPanel", icon: Settings,        color: "#8b5cf6" },
  { name: "Add Banner",    path: "/dashboard/addBanner",    icon: ImagePlus,       color: "#10b981" },
  { name: "Manage Banners",path: "/dashboard/manageBanners",icon: Images,          color: "#f59e0b" },
  { name: "Add Picture",   path: "/dashboard/addPicture",   icon: Image,           color: "#ec4899" },
  { name: "Manage Gallery",path: "/dashboard/manageGallery",icon: GalleryVertical, color: "#6366f1" },
];

const sharedLinks = [
  { name: "Back to Website", path: "/", icon: Home, color: "#94a3b8" },
];

const DashboardLayout = () => {
  const { user, logOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white animate-pulse"
            style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}>
            <ToothSVG size={24} />
          </div>
          <p className="text-white/50 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const linksToRender = user?.email === "masudmolla2937@gmail.com" ? adminLinks : [];

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: "#f1f5f9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: all 0.18s ease;
          position: relative;
        }
        .sidebar-link:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.9);
        }
        .sidebar-link.active {
          background: rgba(255,255,255,0.1);
          color: #fff;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
        .sidebar-link .link-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.18s ease;
        }
        .sidebar-link:hover .link-icon,
        .sidebar-link.active .link-icon {
          transform: scale(1.08);
        }
        .sidebar-link .chevron {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.18s, transform 0.18s;
          transform: translateX(-4px);
        }
        .sidebar-link:hover .chevron,
        .sidebar-link.active .chevron {
          opacity: 1;
          transform: translateX(0);
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .sidebar-anim { animation: fadeSlideRight 0.35s ease both; }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-80 flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          background: "linear-gradient(160deg, #0a1628 0%, #0c2340 60%, #0f2d52 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Brand header ──────────────────────────────────────────── */}
        <div
          className="px-5 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}
            >
              <ToothSVG size={18} />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Laser Dental
              </p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium">
                Admin Panel
              </p>
            </div>
            {/* Mobile close */}
            <button
              className="lg:hidden ml-auto text-white/40 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* User card */}
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user?.photoURL || "https://i.ibb.co/2kR8z2Q/user.png"}
                alt="avatar"
                className="w-9 h-9 rounded-xl object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.12)" }}
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ background: "#22c55e", borderColor: "#0c2340" }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-white/40 text-[10px] truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 flex flex-col gap-1">

          {/* Section label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 px-3 mb-2">
            Management
          </p>

          {linksToRender.map((link, i) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className="link-icon"
                  style={{ background: link.color + "22", color: link.color }}
                >
                  <Icon size={15} />
                </div>
                <span>{link.name}</span>
                <ChevronRight size={13} className="chevron" />
              </NavLink>
            );
          })}
        </nav>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div
          className="px-3 py-4 flex-shrink-0 flex flex-col gap-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {sharedLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <div className="link-icon" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                  <Icon size={15} />
                </div>
                <span>{link.name}</span>
                <ChevronRight size={13} className="chevron" />
              </NavLink>
            );
          })}

          <button
            onClick={logOut}
            className="sidebar-link w-full text-left"
            style={{ color: "rgba(248,113,113,0.7)" }}
          >
            <div className="link-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
              <LogOut size={15} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0 sticky top-0 z-30"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #0284c7, #6366f1)" }}
              >
                <ToothSVG size={14} />
              </div>
              <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                Dashboard
              </span>
            </div>
          </div>

          <img
            src={user?.photoURL || "https://i.ibb.co/2kR8z2Q/user.png"}
            alt="avatar"
            className="w-8 h-8 rounded-xl object-cover"
            style={{ border: "2px solid #e2e8f0" }}
          />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
