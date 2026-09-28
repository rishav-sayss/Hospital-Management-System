import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Clock, Check } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../Context/Authcontext";

// Local-time "YYYY-MM-DD" (toISOString() would shift the date because it uses UTC)
const toDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// "2026-02-16" -> local Date (new Date("2026-02-16") would be parsed as UTC)
const parseDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const inputClass =
  "w-full rounded-full border border-teal-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

const SummaryRow = ({ label, value, valueClass = "text-teal-800" }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-slate-600">{label}:</span>
    <span className={`font-semibold text-right ${valueClass}`}>{value}</span>
  </div>
);

const emptyForm = { fullName: "", age: "", mobile: "", gender: "", email: "" };

const BookingSection = ({ doctor }) => {
  const { user } = useAuth();
  const doctorName = doctor.user?.name || "Doctor";

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null); // holds the appointment once booking succeeds

  // Dates the doctor has opened up. Past dates are hidden so nobody books yesterday.
  const loadDates = async () => {
    try {
      const res = await api.get(`/doctor/${doctor._id}/available-dates`);
      const today = toDateStr(new Date());
      setDates(res.data.dates.filter((d) => d >= today).sort());
    } catch {
      setDates([]);
    }
  };

  // Only the unbooked slots for the chosen date come back from the API
  const loadSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const res = await api.get(`/doctor/${doctor._id}/available-slots`, { params: { date } });
      setSlots(res.data.slots);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadDates();
  }, [doctor._id]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(""); // a time from the previous date no longer applies
    setError("");
    loadSlots(date);
  };

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isPatient = user?.role === "patient";
  const ready = isPatient && selectedDate && selectedTime;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/appointments", {
        doctorId: doctor._id,
        date: selectedDate,
        time: selectedTime,
        patientDetails: {
          fullName: form.fullName,
          age: Number(form.age),
          mobile: form.mobile,
          gender: form.gender,
          email: form.email || undefined, // optional field — leave it out when empty
        },
        paymentMethod,
      });
      setBooked(res.data.appointment);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book the appointment");
      // The slot may have just been taken by someone else, so refresh what's on offer
      setSelectedTime("");
      loadSlots(selectedDate);
      loadDates();
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBooked(null);
    setForm(emptyForm);
    setSelectedTime("");
    setError("");
    if (selectedDate) loadSlots(selectedDate);
    loadDates();
  };

  const longDate = (str) =>
    parseDate(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  // Hint shown under the Confirm button explaining why it's disabled
  let hint = null;
  if (!user) {
    hint = (
      <>
        Please{" "}
        <Link to="/login" className="text-teal-700 font-medium underline">
          log in
        </Link>{" "}
        as a patient to book.
      </>
    );
  } else if (!isPatient) {
    hint = "Only patient accounts can book appointments.";
  } else if (!selectedDate || !selectedTime) {
    hint = "Select a date and time to continue.";
  }

  return (
    <section id="book" className="max-w-5xl mx-auto px-6 mt-8 scroll-mt-24">
      <div className="rounded-3xl bg-white shadow-lg shadow-teal-900/5 border border-slate-100 p-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-teal-700 mb-6">
          <CalendarCheck className="w-6 h-6" /> Book Your Appointment
        </h2>

        {booked ? (
          <div className="text-center py-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Appointment booked</h3>
            <p className="text-slate-600 mt-2">
              {doctorName} · {longDate(booked.date)} · {booked.time}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Status: {booked.status}. The doctor will confirm it shortly.
            </p>
            <button
              onClick={resetBooking}
              className="mt-6 rounded-full border border-teal-200 px-6 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
            >
              Book another slot
            </button>
          </div>
        ) : doctor.isAvailable === false ? (
          <p className="text-slate-600">This doctor is not accepting bookings right now.</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            {/* Left: date + patient details */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-3">
                  <CalendarCheck className="w-4 h-4" /> Select Date
                </h3>

                {dates.length === 0 ? (
                  <p className="text-sm text-slate-500">No upcoming dates available for this doctor.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {dates.map((date) => {
                      const dt = parseDate(date);
                      const active = date === selectedDate;
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => handleSelectDate(date)}
                          className={`w-[72px] rounded-full border py-3 text-center transition-colors ${
                            active
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-teal-100 bg-white text-slate-700 hover:border-teal-300"
                          }`}
                        >
                          <span className="block text-xs">
                            {dt.toLocaleDateString("en-IN", { weekday: "short" })}
                          </span>
                          <span className="block text-xl font-bold leading-tight">{dt.getDate()}</span>
                          <span className="block text-xs">
                            {dt.toLocaleDateString("en-IN", { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-teal-100 p-5">
                <h3 className="font-bold text-teal-800 mb-4">Patient Details</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    aria-label="Full name"
                    placeholder="Full Name"
                    required
                    value={form.fullName}
                    onChange={setField("fullName")}
                    className={inputClass}
                  />
                  <input
                    aria-label="Age"
                    placeholder="Age"
                    type="number"
                    min="0"
                    max="120"
                    required
                    value={form.age}
                    onChange={setField("age")}
                    className={inputClass}
                  />
                  <input
                    aria-label="Mobile number"
                    placeholder="Mobile Number (10 digits)"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Enter a 10 digit mobile number"
                    required
                    value={form.mobile}
                    onChange={setField("mobile")}
                    className={inputClass}
                  />
                  <select
                    aria-label="Gender"
                    required
                    value={form.gender}
                    onChange={setField("gender")}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    aria-label="Email"
                    placeholder="Email (optional - for receipts)"
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    className={`${inputClass} sm:col-span-2`}
                  />
                </div>
              </div>
            </div>

            {/* Right: time slots + booking summary */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-3">
                  <Clock className="w-4 h-4" /> Available Time Slots
                </h3>

                {!selectedDate ? (
                  <p className="text-sm text-slate-500">Select a date to see available time slots.</p>
                ) : loadingSlots ? (
                  <p className="text-sm text-slate-500">Loading slots...</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-slate-500">No time slots for this date.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          time === selectedTime
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-teal-200 bg-white text-teal-800 hover:border-teal-400"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 space-y-3">
                <SummaryRow label="Selected Doctor" value={doctorName} />
                <SummaryRow label="Doctor Speciality" value={doctor.specialization} />
                <SummaryRow label="Selected Date" value={selectedDate ? longDate(selectedDate) : "Not selected"} />
                <SummaryRow label="Selected Time" value={selectedTime || "Not selected"} />
                <SummaryRow label="Consultation Fee" value={`₹${doctor.consultationFee}`} valueClass="text-rose-600" />

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-600 mr-1">Payment:</span>
                  {["cash", "online"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-full border px-4 py-1 text-xs font-semibold capitalize transition-colors ${
                        paymentMethod === method
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-teal-200 bg-white text-teal-800"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!ready || submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:text-slate-500 text-white text-sm font-semibold py-3 transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>

                {hint && <p className="text-xs text-slate-500 text-center">{hint}</p>}
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default BookingSection;