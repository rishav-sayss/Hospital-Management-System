import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home, UserPlus, Users, CalendarDays, LayoutGrid,
  PlusSquare, List, CalendarCheck, LogOut,
} from "lucide-react";
import { useAuth } from "../../Context/Authcontext.jsx";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/add-doctor", label: "Add Doctor", icon: UserPlus },
  { to: "/admin/doctors", label: "List Doctors", icon: Users },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/service-dashboard", label: "Service Dashboard", icon: LayoutGrid },
  { to: "/admin/add-service", label: "Add Service", icon: PlusSquare },
  { to: "/admin/services", label: "List Services", icon: List },
  { to: "/admin/service-appointments", label: "Service Appointments", icon: CalendarCheck },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-white">
      <header className="fixed top-5 inset-x-0 z-50 px-6">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <img src="https://imgs.search.brave.com/7zAcZ7ZMyJL15qw7I17-170qnFQNcJw5qY6cmhQ3snc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yL21lZGljYXJl/LW1lZGljYWwtcHVi/bGljLWNsaW5pYy1z/ZXJ2aWNlXzEwOTM5/MjQtNDE2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA" alt="logo" className="w-11 h-11 rounded-full" />
            <div className="hidden lg:block leading-tight">
              <p className="font-serif text-xl font-bold text-emerald-800">MediCare</p>
              <p className="font-serif text-xs text-slate-500">Healthcare Solutions</p>
            </div>
          </div>

          {/* Floating pill nav */}
          <nav className="flex gap-1 bg-white rounded-2xl p-1.5 overflow-x-auto
                          shadow-[0_0_0_3px_rgba(110,231,183,0.45),0_12px_30px_rgba(16,185,129,0.18)]">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-xl font-serif text-[13px] whitespace-nowrap transition
                   ${isActive ? "bg-emerald-100/70 text-emerald-700" : "text-slate-600 hover:text-emerald-600"}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="shrink-0 flex items-center gap-2 rounded-full border border-emerald-700 text-emerald-800
                       px-5 py-1.5 font-serif text-sm hover:bg-emerald-700 hover:text-white transition"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-16">
        <Outlet />
      </main>
    </div>
  );
}