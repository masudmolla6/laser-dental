import React, { useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  User,
  Heart,
  Settings,
  CreditCard,
  Users,
  PlusCircle,
  Package,
  BarChart3,
  Home,
  Menu,
  LogOut,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { NavLink, Outlet } from "react-router-dom";



const DashboardLayout = () => {
  const { user, logOut, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if(loading){
    return <p>Loading</p>
  }

//   const userLinks = [
//     { name: "User Home", path: "/dashboard/userHome", icon: <LayoutDashboard size={18} /> },
//     { name: "Profile", path: "/dashboard/profile", icon: <User size={18} /> },
//     { name: "My Cart", path: "/dashboard/myCart", icon: <ShoppingCart size={18} /> },
//     { name: "My Orders", path: "/dashboard/myOrders", icon: <ClipboardList size={18} /> },
//     { name: "Wishlist", path: "/dashboard/wishlist", icon: <Heart size={18} /> },
//     { name: "Payment History", path: "/dashboard/userPaymentHistory", icon: <CreditCard size={18} /> },
//     { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
//   ];

  const adminLinks = [
    { name: "Admin Home", path: "/dashboard/adminHome", icon: <LayoutDashboard size={18} /> },
    { name: "Manage Users", path: "/dashboard/manageUsers", icon: <Users size={18} /> },
    { name: "Add Product", path: "/dashboard/addProducts", icon: <PlusCircle size={18} /> },
    { name: "Manage Products", path: "/dashboard/manageProducts", icon: <Package size={18} /> },
    { name: "Manage Orders", path: "/dashboard/manageOrders", icon: <ClipboardList size={18} /> },
    { name: "Analytics", path: "/dashboard/analytics", icon: <BarChart3 size={18} /> },
  ];

  const sharedLinks = [{ name: "Home", path: "/", icon: <Home size={18} /> }];

  const linksToRender = user.email=="masudmolla2937@gmail.com" && adminLinks;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md 
        border-r border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={user?.photoURL || "https://i.ibb.co/2kR8z2Q/user.png"}
                  alt="User"
                  className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              </div>

              <h2 className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user?.displayName || "Admin"}
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-40">
                {user?.email}
              </p>
            </div>
          </div>

          {/* NAV + FOOTER */}
          <div className="flex flex-col justify-between flex-1 overflow-hidden">

            {/* NAVIGATION */}
            <nav className="mt-6 space-y-1 px-4 overflow-y-auto custom-scrollbar">
              {linksToRender.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-500"
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* FOOTER */}
            <div className="border-t border-gray-200 dark:border-gray-800 py-4 px-4 space-y-2 bg-white dark:bg-gray-900">
              
              {sharedLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-500"
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}

              <button
                onClick={logOut}
                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-red-600 transition-colors duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MOBILE TOP BAR */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-md z-40 flex items-center justify-between px-5 py-3">
        
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
            Dashboard
          </h2>
        </div>

        <img
          src={user?.photoURL || "https://i.ibb.co/Y2bRZLk/user.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-indigo-500 object-cover"
        />
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full mt-14 lg:mt-0 lg:px-10 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-2 min-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;