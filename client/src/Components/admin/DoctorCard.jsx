import { useState } from "react";
import { ChevronDown, IndianRupee, Star, Trash2, Users } from "lucide-react";
import { formatCount, getInitials } from "../../utils/format";

function Avatar({ doctor }) {
  if (!doctor.image) {
    return (
      <div className="w-20 h-20 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xl
                      flex items-center justify-center shrink-0">
        {getInitials(doctor.name)}
      </div>
    );
  }
  return (
    <img src={doctor.image} alt={doctor.name}
         className="w-20 h-20 rounded-xl object-cover bg-emerald-50 shrink-0" />
  );
}

function StatusBadge({ available }) {
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-semibold
                      ${available ? "text-emerald-600" : "text-red-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${available ? "bg-emerald-500" : "bg-red-500"}`} />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

export default function DoctorCard({ doctor, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${doctor.name}? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      await onDelete(doctor._id);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete doctor");
      setDeleting(false);
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-emerald-100 p-4 font-serif
                        shadow-[0_6px_24px_rgba(16,185,129,0.10)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.18)]
                        transition-shadow">
      <div className="flex gap-4">
        <Avatar doctor={doctor} />

        <div className="flex-1 min-w-0">
          {/* Name, status, rating, expand toggle */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-emerald-900 truncate">{doctor.name}</h3>
                <StatusBadge available={doctor.available} />
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                {doctor.specialization} • {doctor.experience} years
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 text-xs text-slate-600">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                {doctor.rating ?? "–"}
              </span>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Hide details" : "Show details"}
                className="text-slate-500 hover:text-emerald-600"
              >
                <ChevronDown size={18} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Patients, delete, fees */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Users size={14} /> {formatCount(doctor.patients)}
            </span>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 size={13} /> {deleting ? "Deleting..." : "Delete"}
            </button>

            <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
              Fees :
              <span className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-600 text-emerald-700">
                <IndianRupee size={11} />
              </span>
              {doctor.fees}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable details (only renders fields that exist) */}
      {expanded && (
        <dl className="mt-4 pt-4 border-t border-emerald-100 grid gap-2 text-xs text-slate-600">
          {doctor.about && <div><dt className="font-semibold text-emerald-900">About</dt><dd>{doctor.about}</dd></div>}
          {doctor.degree && <div><dt className="font-semibold text-emerald-900">Degree</dt><dd>{doctor.degree}</dd></div>}
          {doctor.email && <div><dt className="font-semibold text-emerald-900">Email</dt><dd>{doctor.email}</dd></div>}
          {!doctor.about && !doctor.degree && !doctor.email && <p>No extra details added.</p>}
        </dl>
      )}
    </article>
  );
}