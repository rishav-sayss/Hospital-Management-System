// Shared chrome for auth pages — a branded left panel + a form panel on the right.
// Login and Register both use this so the "MediCare" look stays consistent
// and only the form content changes between them.
const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Branding panel — hidden on small screens, the form still stands alone fine there */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="cross" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M36 20h8v16h16v8H44v16h-8V44H20v-8h16z" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cross)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-xl">
              🩺
            </div>
            <span className="text-xl font-bold tracking-tight">MediCare</span>
          </div>

          <div className="max-w-sm">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Care that fits into your day, not around it.
            </h1>
            <p className="text-teal-50/80 text-base leading-relaxed">
              Book appointments, manage prescriptions, and reach your doctor —
              all from one place built for how healthcare actually works.
            </p>
          </div>

          <p className="text-sm text-teal-50/60">
            © {new Date().getFullYear()} MediCare Healthcare Solutions
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-2xl">🩺</span>
            <span className="text-lg font-bold text-teal-700">MediCare</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
          <p className="text-slate-500 text-sm mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;