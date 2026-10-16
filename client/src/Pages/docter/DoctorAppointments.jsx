import { useMemo, useState } from "react";
import { Search, Calendar, Phone, X } from "lucide-react";
import api from "../../api/axios";
import { useDoctor } from "../../Context/DoctorContext.jsx";
import { STATUSES } from "../../Components/Docter/AppointmentCard.jsx";

const BADGES = {
  Pending: "bg-[#fdf1c4] text-amber-800",
  Confirmed: "bg-[#a7ecd6] text-[#063d33]",
  Completed: "bg-[#bff0df] text-[#0b6b53]",
  Cancelled: "bg-[#fde2e4] text-rose-700",
};
const LOCKED = ["Completed", "Cancelled"]; // inka status/reschedule nahi badal sakte
const dateOf = (a) => a.date || a.slotDate;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const to12h = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

function PatientCard({ a, onReschedule }) {
  const { profile, updateStatus } = useDoctor();
  const doc = a.doctor?.name ? a.doctor : profile || {};
  const p = a.patient || a.patientInfo || a.patientDetails || a.userData || a.user || {};
  // alag-alag schema names ke liye fallbacks
  const pick = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== "");
  const name = pick(a.patientName, a.name, p.name);
  const age = pick(a.age, a.patientAge, p.age);
  const gender = pick(a.gender, a.patientGender, p.gender);
  const phone = pick(a.phone, a.patientPhone, a.mobile, a.contact, p.phone, p.mobile);
  const fees = pick(a.fees, a.amount, a.fee, a.price, doc.fees, profile?.fees);
  const photo = pick(doc.image, doc.photo, doc.profileImage, doc.avatar);
  const [imgFailed, setImgFailed] = useState(false);
  const locked = LOCKED.includes(a.status);

  return (
    <article className="rounded-2xl border border-[#e3efea] bg-white p-4 shadow-[0_4px_14px_rgba(11,128,98,0.12)]">
      <div className="flex gap-3">
        {photo && !imgFailed ? (
          <img src={photo} alt="" onError={() => setImgFailed(true)} className="h-[58px] w-[58px] shrink-0 rounded-full border-[3px] border-[#d8f6ec] bg-[#bff0df] object-cover" />
        ) : (
          <div className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border-[3px] border-[#d8f6ec] bg-[#bff0df] text-lg font-bold text-[#0b6b53]">
            {(doc.name || "D").replace(/^Dr\.?\s*/i, "").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold leading-tight text-[#0b4f40]">{name}</h3>
          <small className="mt-1 block text-[13px] text-[#3d7d6c]">{age ?? "—"} yrs · {gender ?? "—"}</small>
          <p className="mt-2 text-sm font-bold">{doc.name}</p>
          <small className="block text-[13px] text-[#3d7d6c]">{doc.specialization}</small>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[17px] font-bold">
        <Calendar size={16} className="text-[#0b8062]" /> {fmtDate(dateOf(a))} : {a.time || a.slotTime}
      </p>
      <p className="mt-3 text-sm font-bold">₹{fees ?? "—"}</p>
      <p className="mt-3 flex items-center gap-2 text-sm text-[#0b8062]"><Phone size={14} /> {phone ?? "—"}</p>

      <div className="mt-3 flex items-center gap-2.5">
        <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${BADGES[a.status] || ""}`}>{a.status}</span>
        <select
          value={a.status}
          disabled={locked}
          onChange={(e) => updateStatus(a._id, e.target.value)}
          className="min-w-[110px] cursor-pointer rounded-full border-[1.5px] border-[#7fd3bb] bg-white px-2.5 py-1 text-sm disabled:cursor-not-allowed disabled:border-[#e3efea] disabled:text-gray-400"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          disabled={locked}
          onClick={() => onReschedule(a)}
          className="rounded-full border-[1.5px] border-[#7fd3bb] bg-white px-4 py-1.5 text-sm font-semibold text-[#0b4f40] hover:bg-[#e9faf3] disabled:cursor-not-allowed disabled:border-[#e3efea] disabled:text-gray-400 disabled:hover:bg-white"
        >
          Reschedule
        </button>
      </div>
    </article>
  );
}

function RescheduleModal({ appt, onClose, onDone }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      // route apne backend ke hisaab se badlo
      await api.put(`/appointments/${appt._id}/reschedule`, { date, time: to12h(time) });
      await onDone();
      onClose();
    } catch (e2) {
      setErr(e2.response?.data?.message || "Could not reschedule. Please try again.");
      setSaving(false);
    }
  };

  const inp = "w-full rounded-full border-[1.5px] border-[#7fd3bb] px-4 py-2.5 outline-none focus:border-[#0b8062]";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Reschedule</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <p className="mb-4 text-sm text-[#3d7d6c]">{appt.patientName || appt.patient?.name || appt.userData?.name}</p>
        <label className="mb-3 block text-sm font-semibold">New date
          <input type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} className={inp} />
        </label>
        <label className="mb-4 block text-sm font-semibold">New time
          <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={inp} />
        </label>
        {err && <p className="mb-3 text-sm text-rose-600">{err}</p>}
        <button disabled={saving} className="w-full rounded-full bg-[#0b8062] py-2.5 font-bold text-white hover:bg-[#096b52] disabled:opacity-60">
          {saving ? "Saving…" : "Confirm"}
        </button>
      </form>
    </div>
  );
}

export default function DoctorAppointments() {
  const { appointments, loading, fetchAppointments } = useDoctor();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [target, setTarget] = useState(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return appointments
      .filter((a) => status === "All" || a.status === status)
      .filter((a) => !term || (a.patientName || a.patient?.name || a.userData?.name || "").toLowerCase().includes(term))
      .sort((x, y) => new Date(dateOf(y) || 0) - new Date(dateOf(x) || 0)); // latest upar
  }, [appointments, q, status]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between   gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Appointments</h1>
          <p className="text-sm text-[#3d7d6c]">Latest at top — search by patient name</p>
        </div>
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border-[1.5px] border-[#7fd3bb] bg-white px-4 py-2.5 sm:w-[380px] sm:flex-none">
            <Search size={16} className="text-[#0b8062]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient name" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border-[1.5px] border-[#7fd3bb] bg-white px-4 py-2.5 text-sm">
            {["All", ...STATUSES].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="py-20 text-center text-[#3d7d6c]">Loading appointments…</p>
      ) : list.length === 0 ? (
        <p className="py-20 text-center text-[#3d7d6c]">No appointments found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((a) => <PatientCard key={a._id} a={a} onReschedule={setTarget} />)}
        </div>
      )}

      {target && <RescheduleModal appt={target} onClose={() => setTarget(null)} onDone={fetchAppointments} />}
    </>
  );
}