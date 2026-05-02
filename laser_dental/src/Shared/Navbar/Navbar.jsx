import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";
import useCheckAdmin from "../../hooks/useCheckAdmin";

const Navbar = () => {

  const [admin, refetch]=useCheckAdmin();
  console.log(admin);

  const {user,logOut}=useAuth();
  // console.log(user);

  const handleLogOUt=async()=>{
    await logOut();
  }

  // Drawer close function
  const closeDrawer = () => {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.checked = false;
  };
const navItems = (
  <>
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

    {/* 🔥 Login / Logout */}
    <li className="text-center">
      {
        user ? (
          <button onClick={handleLogOUt}>Logout</button>
        ) : (
          <NavLink
            to="/login"
            onClick={closeDrawer}
            className={({ isActive }) =>
              isActive ? "font-semibold text-primary border-b-2" : ""
            }
          >
            Login
          </NavLink>
        )
      }
    </li>

    {/* 🔥 Dashboard ONLY ADMIN */}
    {
      user && admin && (
        <li>
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

    <li>
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

    <div className=" sticky top-0 z-30 bg-black/10 backdrop-blur-md text-white">
        <div className="h-16 flex justify-between w-full items-center px-10 py-2">
          <h2 className="text-gray-800 text-2xl">masudmolla2937@gmail.com</h2>
          <h2 className="text-gray-800 text-2xl">Contact No: <span className="text-cyan-100">01745565435</span></h2>
        </div>
        <div className="drawer drawer-start">


          {/* Drawer Toggle */}
          <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

          {/* Page Content */}
          <div className="drawer-content">

            {/* NAVBAR */}
            <div className="navbar sticky top-0 z-30 h-16 bg-black/20 backdrop-blur-md text-white">

              {/* Mobile Hamburger */}
              <div className="navbar-start lg:hidden">
                <label htmlFor="mobile-drawer" className="btn btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
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
                <ul className="menu menu-horizontal gap-2">
                  {navItems}
                </ul>
              </div>

              {/* Desktop CTA */}
              <div className="navbar-end hidden lg:flex">
                <Link
                  to="/appointment"
                  className="btn btn-primary rounded-full"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* DRAWER SIDE (Mobile Menu) */}
          <div className="drawer-side z-40">

            {/* 🔥 Overlay (navbar এর নিচ থেকে start) */}
            <label
              htmlFor="mobile-drawer"
              className="drawer-overlay"
              style={{ top: "4rem", height: "calc(100% - 4rem)" }}
            ></label>

            {/* 🔥 Drawer panel (navbar height নিচ থেকে start) */}
            <ul
              className="menu p-4 w-72 bg-black/60 text-white text-center"
              style={{
                position: "absolute",
                top: "8rem",
                height: "calc(100% - 8rem)"
              }}
            >
              {navItems}

              <div className="mt-6">
                <Link
                  to="/appointment"
                  onClick={closeDrawer}
                  className="btn btn-primary w-full rounded-full"
                >
                  Book Appointment
                </Link>
              </div>
            </ul>
          </div>
        </div>
    </div>

  );
};

export default Navbar;