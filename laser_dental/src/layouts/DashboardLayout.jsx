import { useState } from "react";
import {
  LayoutDashboard,
  ImagePlus,
  Images,
  Image,
  GalleryVertical,
  LogOut,
  Home,
  Menu,
  X,
  ChevronRight,
  CalendarCheck,
  Star,
  Megaphone,
  LayoutTemplate,
  Stethoscope,
  Settings,
  Building2
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { NavLink, Outlet } from "react-router-dom";

const ToothSVG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
    <path d="M32 4C22 4 14 10 14 20c0 5 2 9 4 13l4 20c1 4 4 7 10 7s9-3 10-7l4-20c2-4 4-8 4-13 0-10-8-16-18-16z" />
  </svg>
);

// ── Nav groups ────────────────────────────────────────────────────────────
const adminGroups = [
  {
    label: "Overview",
    links: [
      {
        name: "Admin Home",
        path: "/dashboard/adminHome",
        Icon: LayoutDashboard,
        iconBg: "bg-sky-500/20",
        iconColor: "text-sky-400",
      },
    ],
  },
  {
    label: "Banner",
    links: [
      {
        name: "Add Banner",
        path: "/dashboard/addBanner",
        Icon: ImagePlus,
        iconBg: "bg-emerald-500/20",
        iconColor: "text-emerald-400",
      },
      {
        name: "Manage Banners",
        path: "/dashboard/manageBanners",
        Icon: LayoutTemplate,
        iconBg: "bg-teal-500/20",
        iconColor: "text-teal-400",
      },
    ],
  },
  {
    label: "Gallery",
    links: [
      {
        name: "Add Case Study",
        path: "/dashboard/addPicture",
        Icon: Image,
        iconBg: "bg-pink-500/20",
        iconColor: "text-pink-400",
      },
      {
        name: "Manage Gallery",
        path: "/dashboard/manageGallery",
        Icon: GalleryVertical,
        iconBg: "bg-indigo-500/20",
        iconColor: "text-indigo-400",
      },
    ],
  },
  {
    label: "Appointments",
    links: [
      {
        
        name: "Manage Appointments",
        path: "/dashboard/manageAppointments",
        Icon: CalendarCheck,
        iconBg: "bg-violet-500/20",
        iconColor: "text-violet-400",
      },
    ],
  },
  {
    label: "Reviews",
    links: [
      {
        name: "Manage Reviews",
        path: "/dashboard/manageReviews",
        Icon: Star,
        iconBg: "bg-amber-500/20",
        iconColor: "text-amber-400",
      },
    ],
  },
  {
    label: "Services",
    links: [
      {
        name: "Manage Services",
        path: "/dashboard/manageServices",
        Icon: Stethoscope,
        iconBg: "bg-rose-500/20",
        iconColor: "text-rose-400",
      },
    ],
  },
  {
    label: "Branches",
    links: [
      {
        name: "Manage Branches",
        path: "/dashboard/manageBranches",
        Icon: Building2,
        iconBg: "bg-cyan-500/20",
        iconColor: "text-cyan-400",
      },
    ],
  },
  {
    label: "Settings",
    links: [
      {
        name: "Admin Profile",
        path: "/dashboard/adminProfile",
        Icon: Settings,
        iconBg: "bg-slate-500/20",
        iconColor: "text-slate-400",
      },
    ],
  },
];

const sharedLinks = [
  { name: "Back to Website", path: "/", Icon: Home, iconBg: "bg-white/5", iconColor: "text-white/40" },
];

// ── Sidebar nav link ──────────────────────────────────────────────────────
const SidebarLink = ({ path, name, Icon, iconBg, iconColor, onClick }) => (
  <NavLink
    to={path}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
       ${isActive
         ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
         : "text-white/50 hover:bg-white/6 hover:text-white/90"
       }`
    }
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconBg || "bg-white/10"} ${iconColor || "text-white/60"}`}>
      <Icon size={15} />
    </div>
    <span className="flex-1 leading-tight">{name}</span>
    <ChevronRight
      size={13}
      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-white/40"
    />
  </NavLink>
);

// ── Main layout ───────────────────────────────────────────────────────────
const DashboardLayout = () => {
  const { user, logOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-sky-500 to-indigo-600 animate-pulse">
            <ToothSVG size={24} />
          </div>
          <p className="text-white/50 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const groups = user?.email === "masudmolla2937@gmail.com" ? adminGroups : [];

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col
          bg-gradient-to-b from-[#0a1628] via-[#0c2340] to-[#0f2d52]
          border-r border-white/5
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ minHeight: "100dvh" }}
      >

        {/* Brand + user */}
        <div className="px-4 pt-5 pb-4 border-b border-white/5 flex-shrink-0">

          {/* Brand row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-sky-500 to-indigo-600">
              <ToothSVG size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold font-display leading-tight">Laser Dental</p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium">Admin Panel</p>
            </div>
            <button
              className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/[0.07]">
            <div className="relative flex-shrink-0">
              <img
                src={user?.photoURL || "https://i.ibb.co/2kR8z2Q/user.png"}
                alt="avatar"
                className="w-9 h-9 rounded-xl object-cover border-2 border-white/10"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c2340]" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-white/35 text-[10px] truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav groups — scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4 scrollbar-hide">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 px-3 mb-1.5">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.links.map((link) => (
                  <SidebarLink
                    key={link.path}
                    {...link}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/5 flex flex-col gap-0.5 flex-shrink-0">
          {sharedLinks.map((link) => (
            <SidebarLink
              key={link.path}
              {...link}
              onClick={() => setSidebarOpen(false)}
            />
          ))}

          <button
            onClick={logOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full group mt-1"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-500/10 text-red-400 group-hover:scale-105 transition-transform duration-200">
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

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-sky-500 to-indigo-600">
                <ToothSVG size={14} />
              </div>
              <span className="font-bold text-slate-800 text-sm font-display">Dashboard</span>
            </div>
          </div>
          <img
            src={user?.photoURL || "https://i.ibb.co/2kR8z2Q/user.png"}
            alt="avatar"
            className="w-8 h-8 rounded-xl object-cover border-2 border-slate-200"
          />
        </header>

        {/* Page outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
