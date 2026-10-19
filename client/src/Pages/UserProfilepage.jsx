import { User, Mail, ShieldCheck, LogOut, Save, Lock } from "lucide-react";
import { useAuth } from "../Context/Authcontext.jsx";
import { useUserProfile } from "../Hooks/Useruseprofile.js";

const ROLE_BADGE = {
  admin: "bg-rose-100 text-rose-700",
  doctor: "bg-teal-100 text-teal-700",
  patient: "bg-emerald-100 text-emerald-700",
  receptionist: "bg-amber-100 text-amber-700",
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white";

const UserProfilepage = () => {
  const { logout } = useAuth();
  const {
    user,
    name,
    setName,
    savingName,
    nameSaved,
    nameError,
    saveName,
    passwordForm,
    setPasswordField,
    savingPassword,
    passwordSaved,
    passwordError,
    savePassword,
  } = useUserProfile();

  if (!user) return null; // ProtectedRoute handles the redirect — this is just a safety net

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-100 flex items-center justify-center text-xl sm:text-2xl font-bold text-teal-700 shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{user.name}</h1>
              <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 mt-2 rounded-full px-3 py-1 text-xs font-semibold ${ROLE_BADGE[user.role]}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> {cap(user.role)}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 text-sm font-medium px-4 py-2 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Edit name */}
        <form onSubmit={saveName} className="rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-teal-800 mb-4">
            <User className="w-5 h-5" /> Profile Details
          </h2>

          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />

          {nameError && <p className="text-sm text-rose-600 mt-3">{nameError}</p>}
          {nameSaved && <p className="text-sm text-emerald-600 mt-3">Name updated.</p>}

          <button
            type="submit"
            disabled={savingName}
            className="mt-5 flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
          >
            <Save className="w-4 h-4" /> {savingName ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Change password */}
        <form
          onSubmit={savePassword}
          className="rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-teal-800 mb-4">
            <Lock className="w-5 h-5" /> Change Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={setPasswordField("currentPassword")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={setPasswordField("newPassword")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={setPasswordField("confirmPassword")}
                className={inputClass}
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-rose-600 mt-3">{passwordError}</p>}
          {passwordSaved && <p className="text-sm text-emerald-600 mt-3">Password changed.</p>}

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-5 flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
          >
            <Lock className="w-4 h-4" /> {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfilepage;