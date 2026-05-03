import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";
import useCheckAdmin from "../../hooks/useCheckAdmin";

const Navbar = () => {

  const [admin] = useCheckAdmin();
  const { user, logOut } = useAuth();

  console.log(admin);

  const handleLogOUt = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error(err);
    }
  };

  // Drawer close function
  const closeDrawer = () => {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.checked = false;
  };

  const navItems = (
    <>
      {/* Home */}
      <li className="text-center">
        <NavLink
          to="/"
          onClick={closeDrawer}
          className={({ isActive }) =>
            isActive ? "font-semibold text-primary border-b-2" : ""
          }
        >
          Home
        </NavLink>
      </li>

      {/* Admin Dashboard */}
      {
        user && admin &&(
          <li className="text-center">
            <NavLink
              to="/dashboard/adminHome"
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive ? "font-semibold text-primary border-b-2" : ""
              }
            >
              Dashboard
            </NavLink>
          </li>
        )
      }

      {/* Contact */}
      <li className="text-center">
        <NavLink
          to="/contact"
          onClick={closeDrawer}
          className={({ isActive }) =>
            isActive ? "font-semibold text-primary border-b-2" : ""
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky top-0 z-50">

      {/* 🔥 Top Info Bar */}
      <div className="h-16 flex justify-between items-center px-10 bg-black/10 backdrop-blur-md text-white">
        <h2 className="text-gray-800 text-lg md:text-xl">
          masudmolla2937@gmail.com
        </h2>
        <h2 className="text-gray-800 text-lg md:text-xl">
          Contact No: <span className="text-cyan-100">01745565435</span>
        </h2>
      </div>

      {/* Drawer */}
      <div className="drawer drawer-start">

        {/* Drawer Toggle */}
        <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

        {/* Main Content */}
        <div className="drawer-content">

          {/* 🔥 Navbar */}
          <div className="navbar h-16 bg-black/20 backdrop-blur-md text-white px-4 md:px-10">

            {/* Mobile Hamburger */}
            <div className="navbar-start lg:hidden">
              <label htmlFor="mobile-drawer" className="btn btn-ghost text-xl">
                ☰
              </label>
            </div>

            {/* Logo */}
            <div className="navbar-center lg:navbar-start">
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal gap-3">
                {navItems}
              </ul>
            </div>

            {/* Auth Button */}
            <div className="navbar-end hidden lg:flex">
              {
                user ? (
                  <button
                    onClick={handleLogOUt}
                    className="btn btn-primary rounded-full"
                  >
                    LogOut
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="btn btn-primary rounded-full"
                  >
                    Login
                  </Link>
                )
              }
            </div>
          </div>
        </div>

        {/* 🔥 Drawer Side (Mobile Menu) */}
        <div className="drawer-side z-40 text-center">

          {/* Overlay (Corrected) */}
          <label
            htmlFor="mobile-drawer"
            className="drawer-overlay"
            style={{
              top: "8rem",
              height: "calc(100% - 8rem)"
            }}
          ></label>

          {/* Drawer Panel */}
          <ul
            className="menu p-4 w-72 bg-black/60 text-white flex flex-col justify-between"
            style={{
              position: "absolute",
              top: "8rem",
              height: "calc(100% - 8rem)"
            }}
          >
            {/* Nav Items */}
            <div className="space-y-2">
              {navItems}
            </div>

            {/* Auth Button */}
            <div className="mt-6">
              {
                user ? (
                  <button
                    onClick={() => {
                      handleLogOUt();
                      closeDrawer();
                    }}
                    className="btn btn-primary w-full rounded-full"
                  >
                    LogOut
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="btn btn-primary w-full rounded-full"
                  >
                    Login
                  </Link>
                )
              }
            </div>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default Navbar;