import { Link, useLocation } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  CalendarDays,
  LayoutGrid,
  FilePlus2,
  List,
  CalendarCheck2,
} from "lucide-react";
import { useAuth } from "../../Context/Authcontext.jsx";

const NAV_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/doctors/add", label: "Add Doctor", icon: UserPlus },
  { to: "/admin/doctors", label: "List Doctors", icon: Users },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/service-dashboard", label: "Service Dashboard", icon: LayoutGrid },
  { to: "/admin/services/add", label: "Add Service", icon: FilePlus2 },
  { to: "/admin/services", label: "List Services", icon: List },
  { to: "/admin/service-appointments", label: "Service Appointments", icon: CalendarCheck2 },
];

const AdminNavbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/admin/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-lg">
            🩺
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-bold text-teal-700 leading-none">MediCare</p>
            <p className="text-[11px] text-slate-400 leading-none mt-1">Healthcare Solutions</p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 bg-slate-50 rounded-full px-2 py-1.5 border border-slate-100 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const active = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <link.icon className="w-3.5 h-3.5" /> {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="shrink-0 rounded-full bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Below xl, the nav drops to a horizontally scrollable row so no links get hidden */}
      <nav className="xl:hidden flex items-center gap-2 px-4 pb-3 overflow-x-auto">
        {NAV_LINKS.map((link) => {
          const active = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                active ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-600"
              }`}
            >
              <link.icon className="w-3.5 h-3.5" /> {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default AdminNavbar;