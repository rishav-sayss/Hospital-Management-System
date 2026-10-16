import { useEffect, useState } from "react";
import { CalendarDays, IndianRupee, CheckCircle2, XCircle, Phone, RefreshCcw } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../Context/Authcontext.jsx";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-teal-100 text-teal-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// "2026-02-15" -> "15 Feb 2026"
const formatDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const StatCard = ({ icon: Icon, iconBg, label, value }) => (
  <div className="flex items-center justify-between rounded-2xl border border-teal-100 bg-white px-6 py-5 shadow-sm">
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const AppointmentCard = ({ appointment, onStatusChange, updatingId }) => {
  const { patientDetails } = appointment;

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 w-full">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
          {patientDetails.fullName[0]}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 leading-tight">{patientDetails.fullName}</h3>
          <p className="text-xs text-slate-500">
            {patientDetails.age} yrs · {cap(patientDetails.gender)}
          </p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-sm text-slate-600 mt-3">
        <Phone className="w-3.5 h-3.5 text-teal-600" /> {patientDetails.mobile}
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-slate-900 text-sm">{formatDate(appointment.date)}</span>
        <span className="font-semibold text-slate-700 text-sm">{appointment.time}</span>
      </div>

      <p className="text-slate-500 text-sm mt-1">₹{appointment.fee}</p>

      <div className="flex items-center gap-2 mt-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[appointment.status]}`}>
          {cap(appointment.status)}
        </span>
        <select
          value={appointment.status}
          disabled={updatingId === appointment._id}
          onChange={(e) => onStatusChange(appointment._id, e.target.value)}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {cap(s)}
            </option>
          ))}
        </select>
      </div>

      {/* No reschedule endpoint exists on the backend yet — this is a placeholder */}
      <button
        type="button"
        onClick={() => alert("Rescheduling isn't available yet.")}
        className="mt-3 w-full rounded-full border border-teal-200 text-teal-700 text-xs font-semibold py-1.5 hover:bg-teal-50 transition-colors"
      >
        Reschedule
      </button>
    </div>
  );
};

const PAGE_SIZE = 3;

const DoctorDashboard = () => {
  const { user } = useAuth();

  const [doctorId, setDoctorId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        api.get("/doctor/me"),
        api.get("/appointments/doctor"),
      ]);
      setDoctorId(profileRes.data.doctor._id);
      setAppointments(appointmentsRes.data.appointments);
    } catch {
      setError("Could not load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => (a._id === id ? res.data.appointment : a)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Earnings only count what's actually been paid, not just booked
  const totalEarnings = appointments.filter((a) => a.paymentStatus === "paid").reduce((sum, a) => sum + a.fee, 0);
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;

  const visibleAppointments = showAll ? appointments : appointments.slice(0, PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-teal-800 uppercase tracking-wide">
              {user?.name} — Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Showing appointments for doctor {doctorId || "..."}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{appointments.length} total</span>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading dashboard...</p>}
        {error && <p className="text-rose-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard
                icon={CalendarDays}
                iconBg="bg-teal-100 text-teal-700"
                label="Total Appointments"
                value={appointments.length}
              />
              <StatCard
                icon={IndianRupee}
                iconBg="bg-amber-100 text-amber-700"
                label="Total Earnings"
                value={`₹${totalEarnings}`}
              />
              <StatCard
                icon={CheckCircle2}
                iconBg="bg-emerald-100 text-emerald-700"
                label="Completed"
                value={completedCount}
              />
              <StatCard icon={XCircle} iconBg="bg-rose-100 text-rose-700" label="Cancelled" value={cancelledCount} />
            </div>

            <div className="rounded-3xl bg-white border border-teal-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-teal-800">Latest Appointments</h2>
                <span className="text-sm text-slate-500">{appointments.length} total</span>
              </div>

              {appointments.length === 0 ? (
                <p className="text-slate-500">No appointments yet.</p>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visibleAppointments.map((a) => (
                      <AppointmentCard
                        key={a._id}
                        appointment={a}
                        onStatusChange={handleStatusChange}
                        updatingId={updatingId}
                      />
                    ))}
                  </div>

                  {appointments.length > PAGE_SIZE && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setShowAll((v) => !v)}
                        className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
                      >
                        {showAll ? "Show less" : "Show more"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;