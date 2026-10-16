import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  UserCog,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../Context/Authcontext.jsx";

const NAV_LINKS = [
  {
    to: "/doctor/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/doctor/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
  {
    to: "/doctor/profile",
    label: "Edit Profile",
    icon: UserCog,
  },
];

const DoctorNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/doctor/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const linkClasses = (active) =>
    `flex items-center gap-2.5 rounded-xl px-4 py-2.5
    text-sm font-semibold transition-all duration-200 ${
      active
        ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
        : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/doctor/dashboard"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
            <Stethoscope size={24} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
              Medi<span className="text-teal-600">Care</span>
            </h1>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
              DOCTOR PORTAL
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.to);
            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={linkClasses(active)}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Logout */}
        <button
          type="button"
          onClick={logout}
          className="hidden items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-all hover:border-rose-200 hover:bg-rose-100 md:flex"
        >
          <LogOut size={17} />
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded bg-current" />
              <span className="h-0.5 w-5 rounded bg-current" />
              <span className="h-0.5 w-5 rounded bg-current" />
            </span>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden sm:px-6">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={linkClasses(active)}
                >
                  <Icon size={19} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="my-1 border-t border-slate-100" />

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default DoctorNavbar;
