import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, CreditCard, Bell, X } from "lucide-react";
import api from "../api/axios";

const STATUS_STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-teal-200 bg-teal-50 text-teal-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// "2026-02-15" -> "15 Feb 2026" (built from parts so the date doesn't shift with timezone)
const formatDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// The rounded date / time rows inside a card
const Pill = ({ icon: Icon, children }) => (
  <div className="flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-50/70 px-4 py-2 text-sm text-slate-800">
    <Icon className="w-4 h-4 text-teal-700" /> {children}
  </div>
);

// Payment + status badges shown at the bottom of every card
const Badges = ({ appointment }) => (
  <div className="flex flex-wrap justify-center gap-2 mt-4">
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
      <CreditCard className="w-3.5 h-3.5" />
      {cap(appointment.paymentMethod)} · {cap(appointment.paymentStatus)}
    </span>
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[appointment.status]}`}
    >
      <Bell className="w-3.5 h-3.5" />
      {cap(appointment.status)}
    </span>
  </div>
);

// Shown on every card — only actually cancels when the status still allows it
const CancelButton = ({ appointment, onCancel, cancellingId }) => {
  if (!CANCELLABLE_STATUSES.includes(appointment.status)) return null;

  return (
    <button
      onClick={() => onCancel(appointment._id)}
      disabled={cancellingId === appointment._id}
      className="mt-4 flex items-center justify-center gap-1.5 mx-auto rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50 text-xs font-semibold px-4 py-1.5 transition-colors"
    >
      <X className="w-3.5 h-3.5" />
      {cancellingId === appointment._id ? "Cancelling..." : "Cancel Booking"}
    </button>
  );
};

const DoctorAppointmentCard = ({ appointment, onCancel, cancellingId }) => {
  const { doctor } = appointment;
  const name = doctor.user?.name || "Doctor";
  // "Dr. Emily Rodriguez" -> "ER" (shown when the doctor has no photo)
  const initials = name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="rounded-3xl bg-white border border-teal-100 shadow-sm p-5 text-center">
      <div className="mx-auto w-24 h-24 rounded-full ring-4 ring-teal-300 bg-teal-100 overflow-hidden flex items-center justify-center">
        {doctor.image?.url ? (
          <img src={doctor.image.url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-teal-700">{initials}</span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">{name}</h3>
      <p className="text-sm text-teal-700">{doctor.specialization}</p>

      <div className="mt-4 space-y-2">
        <Pill icon={CalendarDays}>{formatDate(appointment.date)}</Pill>
        <Pill icon={Clock}>{appointment.time}</Pill>
      </div>

      <Badges appointment={appointment} />
      <CancelButton appointment={appointment} onCancel={onCancel} cancellingId={cancellingId} />
    </div>
  );
};

const ServiceAppointmentCard = ({ appointment, onCancel, cancellingId }) => (
  <div className="rounded-3xl bg-white border border-teal-100 shadow-sm p-5 text-center">
    <h3 className="text-lg font-bold text-slate-900">{appointment.service?.name || "Service"}</h3>
    <p className="text-sm text-teal-700">₹{appointment.fee}</p>

    <div className="mt-4 space-y-2">
      <Pill icon={CalendarDays}>{formatDate(appointment.date)}</Pill>
      <Pill icon={Clock}>{appointment.time}</Pill>
    </div>

    <Badges appointment={appointment} />
    <CancelButton appointment={appointment} onCancel={onCancel} cancellingId={cancellingId} />
  </div>
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/me");
        setAppointments(res.data.appointments);
      } catch {
        setError("Could not load your appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    setCancellingId(id);
    try {
      const res = await api.patch(`/appointments/${id}/cancel`);
      // Swap in the updated appointment (now status: "cancelled") without a full refetch
      setAppointments((prev) => prev.map((a) => (a._id === id ? res.data.appointment : a)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel this appointment");
    } finally {
      setCancellingId(null);
    }
  };

  // One list from the API, split by what was booked
  const doctorAppointments = appointments.filter((a) => a.doctor);
  const serviceAppointments = appointments.filter((a) => a.service);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 to-white px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-16">
        <section>
          <h1 className="text-3xl font-bold text-teal-800 text-center mb-10">Your Doctor Appointments</h1>

          {loading && <p className="text-center text-slate-500">Loading your appointments...</p>}
          {error && <p className="text-center text-rose-600">{error}</p>}

          {!loading && !error && doctorAppointments.length === 0 && (
            <p className="text-center text-slate-500">
              No doctor appointments yet.{" "}
              <Link to="/doctors" className="text-teal-700 font-medium underline">
                Find a doctor
              </Link>
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorAppointments.map((a) => (
              <DoctorAppointmentCard key={a._id} appointment={a} onCancel={handleCancel} cancellingId={cancellingId} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-teal-800 text-center mb-10">Your Booked Services</h2>

          {!loading && !error && serviceAppointments.length === 0 && (
            <p className="text-center text-teal-700">No service bookings found.</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceAppointments.map((a) => (
              <ServiceAppointmentCard key={a._id} appointment={a} onCancel={handleCancel} cancellingId={cancellingId} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Appointments;