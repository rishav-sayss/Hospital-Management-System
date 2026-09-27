import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Doctors" },
  { to: "/services", label: "Services" },
  { to: "/appointments", label: "Appointments" },
  { to: "/contact", label: "Contact" },
];

// Where each role's logged-in "dashboard" link should go — update these paths
// once the actual dashboard routes exist
const DASHBOARD_ROUTE = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/patient/appointments",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-lg">
            🩺
          </div>
          <div>
            <p className="text-lg font-bold text-teal-700 leading-none">MediCare</p>
            <p className="text-[11px] text-slate-400 leading-none mt-1">Healthcare Solutions</p>
          </div>
        </Link>

        {/* Center pill nav — desktop only */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 rounded-full px-2 py-1.5 border border-slate-100">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive(link.to) ? "text-teal-700" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side actions — desktop only */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to={DASHBOARD_ROUTE[user.role] || "/"}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
              >
                {user.name.split(" ")[0]}'s Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
              >
                Doctor Admin
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-slate-700 text-2xl leading-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium ${isActive(link.to) ? "text-teal-700" : "text-slate-600"}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={DASHBOARD_ROUTE[user.role] || "/"} className="text-sm font-medium text-slate-700">
                  {user.name.split(" ")[0]}'s Dashboard
                </Link>
                <button onClick={logout} className="text-sm font-medium text-teal-700 text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-teal-700">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;