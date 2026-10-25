import { X, CalendarDays, Plus, UserPlus } from "lucide-react";
import { useAdminCreateDoctor } from "../../Hooks/Docter/useadmincreatedocter.js";

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

const AdminAddDoctor = () => {
  const {
    form,
    setField,
    isAvailable,
    setIsAvailable,
    imageFile,
    imagePreview,
    handleImageChange,
    removeImage,
    scheduleSlots,
    addSlot,
    removeSlot,
    slotDate,
    setSlotDate,
    slotHour,
    setSlotHour,
    slotMinute,
    setSlotMinute,
    slotPeriod,
    setSlotPeriod,
    submitting,
    error,
    success,
    submit,
  } = useAdminCreateDoctor();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-teal-800 mb-6">
          <UserPlus className="w-6 h-6" /> Add Doctor
        </h1>

        <form onSubmit={submit} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Upload Profile Image */}
          <div>
            <p className="text-sm text-slate-600 mb-2">Upload Profile Image</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
                Choose File {imageFile ? imageFile.name : "No file chosen"}
              </label>

              {imagePreview && (
                <div className="relative w-14 h-14 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-200" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fields grid — two columns matching the screenshot pairing */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Dr. Full Name" required value={form.name} onChange={setField("name")} className={inputClass} />
            <input
              placeholder="Specialization"
              required
              value={form.specialization}
              onChange={setField("specialization")}
              className={inputClass}
            />

            <input placeholder="Location" value={form.location} onChange={setField("location")} className={inputClass} />
            <input
              placeholder="Experience (years)"
              type="number"
              min="0"
              value={form.experience}
              onChange={setField("experience")}
              className={inputClass}
            />

            <input
              placeholder="Qualifications"
              value={form.qualifications}
              onChange={setField("qualifications")}
              className={inputClass}
            />
            <input
              placeholder="Consultation Fee"
              type="number"
              min="0"
              required
              value={form.consultationFee}
              onChange={setField("consultationFee")}
              className={inputClass}
            />

            <input
              placeholder="Rating (out of 5)"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={setField("rating")}
              className={inputClass}
            />
            <input
              placeholder="Patients"
              type="number"
              min="0"
              value={form.totalPatients}
              onChange={setField("totalPatients")}
              className={inputClass}
            />

            <input
              placeholder="Success Rate (%)"
              type="number"
              min="0"
              max="100"
              value={form.successRate}
              onChange={setField("successRate")}
              className={inputClass}
            />
            <input
              placeholder="doctor@gmail.com"
              type="email"
              required
              value={form.email}
              onChange={setField("email")}
              className={inputClass}
            />

            <input
              placeholder="Doctor Password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={setField("password")}
              className={inputClass}
            />
            <select
              value={isAvailable ? "available" : "unavailable"}
              onChange={(e) => setIsAvailable(e.target.value === "available")}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="unavailable">Not Available</option>
            </select>
          </div>

          <textarea
            placeholder="About doctor"
            rows={3}
            value={form.about}
            onChange={setField("about")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
          />

          {/* Add Schedule Slots */}
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-5">
            <h2 className="flex items-center gap-2 font-bold text-teal-800 mb-4">
              <CalendarDays className="w-4 h-4" /> Add Schedule Slots
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <select value={slotHour} onChange={(e) => setSlotHour(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <select value={slotMinute} onChange={(e) => setSlotMinute(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select value={slotPeriod} onChange={(e) => setSlotPeriod(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              <button
                type="button"
                onClick={addSlot}
                disabled={!slotDate}
                className="flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-sm font-semibold px-4 py-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            </div>

            {scheduleSlots.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {scheduleSlots.map((slot, i) => (
                  <span
                    key={`${slot.date}-${slot.time}-${i}`}
                    className="flex items-center gap-2 rounded-full bg-white border border-teal-200 px-3 py-1.5 text-xs font-medium text-teal-800"
                  >
                    {slot.date} · {slot.time}
                    <button type="button" onClick={() => removeSlot(i)} className="text-rose-500 hover:text-rose-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              Doctor created successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm py-3 transition-colors"
          >
            {submitting ? "Creating..." : "Create Doctor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddDoctor;