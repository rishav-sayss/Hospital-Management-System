import {
  User,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Users,
  CheckCircle2,
  Star,
  IndianRupee,
  CalendarDays,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Camera,
} from "lucide-react";
import { useAuth } from "../../Context/Authcontext.jsx";
import { useDoctorProfile } from "../../Hooks/Docter/usedocterprofile.js";

// text-base on mobile (stops iOS auto-zoom on focus), text-sm from sm: up
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white sm:py-2.5 sm:text-sm";
const readOnlyClass =
  "w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-500 sm:py-2.5 sm:text-sm";

// One Personal Information field: icon + label + an input or a read-only value
const Field = ({ icon: Icon, label, children }) => (
  <div className="min-w-0">
    <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-teal-800">
      <Icon className="h-4 w-4 shrink-0" /> {label}
    </label>
    {children}
  </div>
);

const StatPill = ({ icon: Icon, iconClass, label, value }) => (
  <div className="flex min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 sm:px-4">
    <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
    <div className="min-w-0 text-left leading-tight">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="truncate text-sm font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const DoctorEditProfile = () => {
  const { user } = useAuth();
  const {
    doctor,
    form,
    about,
    setAbout,
    isAvailable,
    loading,
    error,
    saving,
    saved,
    uploadingPhoto,
    setField,
    toggleAvailable,
    saveProfile,
    resetToServer,
    changePhoto,
    schedule,
    newDate,
    setNewDate,
    newSlotTimes,
    setSlotTimeInput,
    scheduleBusy,
    handleAddDate,
    handleDeleteDate,
    handleAddSlot,
    handleDeleteSlot,
  } = useDoctorProfile();

  if (loading) return <p className="py-24 text-center text-slate-500">Loading your profile...</p>;
  if (error && !doctor) return <p className="py-24 text-center text-rose-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        {/* Profile header */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:rounded-3xl">
          <div className="h-24 bg-gradient-to-r from-teal-600 to-emerald-500 sm:h-28" />
          <div className="-mt-12 px-4 pb-6 sm:-mt-14 sm:px-8 sm:pb-8">
            {/* Mobile: stacked + centered. sm and up: avatar/name left, toggle right */}
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-end sm:gap-4">
                {/* Click the photo (or the camera badge) to pick a new one — uploads right away */}
                <label className="group relative h-24 w-24 shrink-0 cursor-pointer sm:h-28 sm:w-28">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => changePhoto(e.target.files?.[0])}
                  />
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-teal-100 ring-4 ring-white">
                    {doctor.image?.url ? (
                      <img src={doctor.image.url} alt={user?.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-teal-600" />
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/30">
                    {uploadingPhoto && <span className="text-xs font-medium text-white">Uploading...</span>}
                  </div>
                  <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white ring-2 ring-white">
                    <Camera className="h-4 w-4" />
                  </span>
                </label>
                <div className="min-w-0 pb-1">
                  <h1 className="break-words text-xl font-bold text-teal-800 sm:text-2xl">{user?.name}</h1>
                  <p className="text-sm text-slate-500">
                    {doctor.specialization} · {doctor.location || "No location set"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isAvailable}
                onClick={toggleAvailable}
                className={`flex w-full items-center justify-between gap-3 rounded-full py-1.5 pl-4 pr-1.5 text-sm font-semibold transition-colors sm:w-auto sm:justify-start ${
                  isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {isAvailable ? "Available" : "Not Available"}
                {/* The actual sliding switch — circle moves right when on */}
                <span
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    isAvailable ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      isAvailable ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>

            {/* 2x2 grid on phones, one wrapping row from sm: up */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <StatPill icon={Users} iconClass="text-teal-600" label="Patients" value={doctor.totalPatients} />
              <StatPill icon={CheckCircle2} iconClass="text-emerald-600" label="Success" value={`${doctor.successRate}%`} />
              <StatPill icon={Star} iconClass="text-amber-500" label="Rating" value={`${doctor.rating}/5`} />
              <StatPill icon={IndianRupee} iconClass="text-rose-500" label="Fee" value={doctor.consultationFee} />
            </div>
          </div>
        </div>

        <form
          onSubmit={saveProfile}
          className="space-y-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:space-y-8 sm:rounded-3xl sm:p-6 lg:p-8"
        >
          {/* Personal Information */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-teal-800 sm:mb-5 sm:text-xl">
              <User className="h-5 w-5" /> Personal Information
            </h2>

            {/* 1 col phone → 2 col tablet → 3 col laptop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              <Field icon={User} label="Name">
                <input value={form.name} onChange={setField("name")} className={inputClass} />
              </Field>
              <Field icon={Briefcase} label="Specialization">
                <input value={form.specialization} onChange={setField("specialization")} className={inputClass} />
              </Field>
              <Field icon={Clock} label="Experience">
                <input type="number" min="0" inputMode="numeric" value={form.experience} onChange={setField("experience")} className={inputClass} />
              </Field>

              <Field icon={GraduationCap} label="Qualifications">
                <input value={form.qualifications} onChange={setField("qualifications")} className={inputClass} />
              </Field>
              <Field icon={MapPin} label="Location">
                <input value={form.location} onChange={setField("location")} className={inputClass} />
              </Field>
              <Field icon={Users} label="Patients">
                {/* Not editable here — totalPatients is tracked by the system, not set by the doctor */}
                <input value={doctor.totalPatients} disabled className={readOnlyClass} />
              </Field>

              <Field icon={CheckCircle2} label="Success">
                <input value={doctor.successRate} disabled className={readOnlyClass} />
              </Field>
              <Field icon={Star} label="Rating (out of 5)">
                <input value={doctor.rating} disabled className={readOnlyClass} />
              </Field>
              <Field icon={IndianRupee} label="Fee (INR)">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={form.consultationFee}
                  onChange={setField("consultationFee")}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* About */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-teal-800 sm:text-xl">
              <Briefcase className="h-5 w-5" /> About
            </h2>
            <textarea
              rows={4}
              maxLength={500}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full resize-none rounded-xl border border-teal-200 px-4 py-3 text-base text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
            />
            <p className="mt-1 text-right text-xs text-slate-400">{about.length}/500</p>
          </div>

          {/* Schedule & Availability */}
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-teal-800 sm:text-xl">
                <CalendarDays className="h-5 w-5" /> Schedule &amp; Availability
              </h2>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:flex-none sm:py-2 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddDate}
                  disabled={!newDate || scheduleBusy}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:bg-slate-300 sm:py-2"
                >
                  <Plus className="h-4 w-4" /> Add Date
                </button>
              </div>
            </div>

            {schedule.length === 0 ? (
              <p className="text-sm text-slate-500">No dates added yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {schedule.map((day) => (
                  <div key={day.date} className="rounded-xl border border-teal-100 bg-teal-50/40 p-3 sm:p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{day.date}</p>
                        <p className="text-xs text-teal-700">{day.slots.length} slot(s)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDate(day.date)}
                        disabled={scheduleBusy}
                        aria-label={`Delete ${day.date}`}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {day.slots.map((slot) => (
                        <div
                          key={slot.time}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                        >
                          <span className={slot.isBooked ? "text-slate-400" : "text-slate-800"}>
                            {slot.time} {slot.isBooked && "(booked)"}
                          </span>
                          {!slot.isBooked && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSlot(day.date, slot.time)}
                              disabled={scheduleBusy}
                              aria-label={`Delete slot ${slot.time}`}
                              className="px-2 py-1 text-rose-500 hover:text-rose-700 disabled:opacity-40"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="flex items-center gap-2">
                        <input
                          placeholder="e.g. 11:00 AM"
                          value={newSlotTimes[day.date] || ""}
                          onChange={(e) => setSlotTimeInput(day.date, e.target.value)}
                          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:py-1.5 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSlot(day.date)}
                          disabled={scheduleBusy || !newSlotTimes[day.date]}
                          aria-label="Add slot"
                          className="shrink-0 rounded-lg bg-teal-100 p-2.5 text-teal-700 disabled:opacity-40 sm:p-2"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          {saved && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Profile saved.
            </p>
          )}

          {/* Mobile: full-width stacked buttons (Save on top). sm and up: one row */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-slate-500 sm:text-left">Make changes and save your profile</p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetToServer}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-teal-200 px-5 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 sm:w-auto sm:py-2.5"
              >
                <RotateCcw className="h-4 w-4" /> Reset to Server
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:bg-teal-400 sm:w-auto sm:py-2.5"
              >
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorEditProfile;