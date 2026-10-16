import { Phone } from "lucide-react";
import { useDoctor } from "../../Context/DoctorContext.jsx";

export const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
const BADGES = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-[#a7ecd6] text-[#063d33]",
  Completed: "bg-green-200 text-green-800",
  Cancelled: "bg-rose-200 text-rose-800",
};
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function AppointmentCard({ a }) {
  const { profile, updateStatus } = useDoctor();
  const doc = a.doctor || a.docData || profile || {};

  return (
    <article className="rounded-[14px] border border-[#dbeee7] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
      <div className="flex gap-3">
        <img
          src={doc.image || "/doctor.png"}
          alt=""
          className="h-[58px] w-[58px] shrink-0 rounded-full border-[3px] border-[#d8f6ec] bg-[#bff0df] object-cover"
        />
        <div>
          <h3 className="text-xl font-bold leading-tight">{a.patientName || a.userData?.name}</h3>
          <small className="mt-1 block text-[13px] text-[#3d7d6c]">
            {a.age || a.userData?.age} yrs · {a.gender || a.userData?.gender}
          </small>
          <p className="mt-3.5 text-sm font-bold">{doc.name}</p>
          <small className="block text-[13px] text-[#3d7d6c]">{doc.speciality}</small>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#0b8062]">
            <Phone size={14} /> {a.phone || a.userData?.phone}
          </p>
        </div>
      </div>

      <div className="mt-[22px] flex justify-between text-[17px] font-bold">
        <span>{fmtDate(a.date || a.slotDate)}</span>
        <span>{a.time || a.slotTime}</span>
      </div>
      <p className="mt-6 text-right text-sm font-bold">₹{a.fees || a.amount}</p>

      <div className="mt-3.5 flex items-center justify-end gap-2.5">
        <span className={`rounded-full px-3.5 py-1 text-[13px] font-bold ${BADGES[a.status] || ""}`}>{a.status}</span>
        <select
          value={a.status}
          onChange={(e) => updateStatus(a._id, e.target.value)}
          className="min-w-[114px] cursor-pointer rounded-full border-[1.5px] border-[#7fd3bb] bg-white px-2.5 py-1.5 text-sm"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </article>
  );
}