import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Stethoscope, ListChecks, Phone, Check } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../Context/Authcontext";

// Services have no doctor-style schedule, so a generic set of clinic slots is
// offered for every date — swap this for a real availability system later if needed.
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

const SummaryRow = ({ label, value, valueClass = "text-teal-800" }) => (
  <div className="flex justify-between gap-4 text-sm py-1">
    <span className="text-slate-600">{label}:</span>
    <span className={`font-semibold text-right ${valueClass}`}>{value}</span>
  </div>
);

const emptyForm = { fullName: "", mobile: "", age: "", gender: "", email: "" };
const todayStr = () => new Date().toISOString().split("T")[0];

const ServiceDetailepage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data.service);
      } catch (err) {
        setLoadError(err.response?.status === 404 ? "Service not found" : "Could not load this service");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isPatient = user?.role === "patient";
  const ready = isPatient && date && time;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/appointments", {
        
        serviceId: service._id,
        date,
        time,
        patientDetails: {
          fullName: form.fullName,
          mobile: form.mobile,
          age: Number(form.age),
          gender: form.gender,
          email: form.email || undefined,
        },
        paymentMethod,
      });
      clg("Appointment booked successfully:", res.data.appointment);
      setBooked(res.data.appointment);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book this service");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-slate-500 py-24">Loading service...</p>;
  if (loadError) return <p className="text-center text-rose-600 py-24">{loadError}</p>;

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
    hint = "Only patient accounts can book services.";
  } else if (!date || !time) {
    hint = "Choose a date and time to continue.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-6 py-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Left: image */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-teal-100 to-emerald-50 h-72 lg:h-full flex items-center justify-center">
          {service.image?.url ? (
            <img src={service.image.url} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <Stethoscope className="w-20 h-20 text-teal-500" />
          )}
        </div>

        {/* Right: details + summary */}
        <div>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-500 inline-block px-5 py-2 rounded-xl mb-5">
            {service.name}
          </h1>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
            <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-2">
              <Stethoscope className="w-4 h-4" /> About This Service
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
          </div>

          <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-5 py-2 text-lg font-bold text-emerald-700 mb-4">
            ₹{service.price}
          </span>

          {service.preTestInstructions?.length > 0 && (
            <div className="mb-4">
              <h3 className="flex items-center gap-2 font-bold text-teal-800 mb-2">
                <ListChecks className="w-4 h-4" /> Pre-Test Instructions
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {service.preTestInstructions.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {booked ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Booking confirmed</h3>
              <p className="text-sm text-slate-600 mt-1">
                {service.name} · {booked.date} · {booked.time}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <h3 className="font-bold text-emerald-800 mb-3">Booking Summary</h3>
              <SummaryRow label="Name" value={form.fullName || "Not filled"} />
              <SummaryRow label="Mobile" value={form.mobile || "Not filled"} />
              <SummaryRow label="Age" value={form.age || "Not filled"} />
              <SummaryRow label="Gender" value={form.gender || "Not filled"} />
              <SummaryRow label="Date" value={date} />
              <SummaryRow label="Time" value={time || "Not selected"} />
              <SummaryRow label="Payment" value={paymentMethod === "online" ? "Online" : "Cash"} />
              <SummaryRow label="Price" value={`₹${service.price}`} valueClass="text-rose-600" />
            </div>
          )}
        </div>
      </div>

      {/* Your Details form */}
      {!booked && (
        <div className="max-w-5xl mx-auto mt-8">
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-teal-800 mb-6">
              <Phone className="w-5 h-5" /> Your Details
            </h2>

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                <input required value={form.fullName} onChange={setField("fullName")} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile (10 digits) *</label>
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={form.mobile}
                  onChange={setField("mobile")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Age *</label>
                <input required type="number" min="0" max="120" value={form.age} onChange={setField("age")} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender *</label>
                <select required value={form.gender} onChange={setField("gender")} className={inputClass}>
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
                <input
                  required
                  type="date"
                  min={todayStr()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Time *</label>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        time === slot
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-teal-200 bg-white text-teal-800 hover:border-teal-400"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <span className="text-sm text-slate-600 mr-1">Payment:</span>
                {["online", "cash"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
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
                <p className="sm:col-span-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!ready || submitting}
                className="sm:col-span-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold text-sm py-3 transition-colors"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>

              {hint && <p className="sm:col-span-2 text-xs text-slate-500 text-center">{hint}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailepage;