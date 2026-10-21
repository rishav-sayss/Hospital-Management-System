import { ShieldCheck, Activity, Stethoscope } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Secure Access", text: "Role-based login with protected medical data." },
  { icon: Activity, title: "Real-time Management", text: "Monitor hospital activity and patient flow." },
  { icon: Stethoscope, title: "Medical Dashboard", text: "Clean, fast, and doctor-friendly interface." },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 text-center border border-emerald-100
                    shadow-[0_10px_40px_rgba(16,185,129,0.12)]">
      <img src="https://imgs.search.brave.com/7zAcZ7ZMyJL15qw7I17-170qnFQNcJw5qY6cmhQ3snc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yL21lZGljYXJl/LW1lZGljYWwtcHVi/bGljLWNsaW5pYy1z/ZXJ2aWNlXzEwOTM5/MjQtNDE2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA" alt="" className="w-20 h-20 mx-auto mb-6 rounded-full" />
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-emerald-950">
        Welcome to MediCare Admin Panel
      </h1>
      <p className="text-slate-500 mt-3 max-w-xl mx-auto">
        Manage hospital operations, doctors, staff, patient records, and system settings from a centralized control panel.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
            <Icon size={20} className="text-emerald-600 mb-2" />
            <h3 className="font-bold text-emerald-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}