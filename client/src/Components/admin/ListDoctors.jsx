import { useState } from "react";
import { Search, Star, Users, Trash2, ChevronDown, User, UsersRound } from "lucide-react";
import { useAdminDoctorList } from "../../Hooks/Admin/UseAdmindoctorList.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

const DoctorCard = ({ doctor, onDelete, deleting }) => {
  const [expanded, setExpanded] = useState(false);
  const name = doctor.user?.name || "Doctor";

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full bg-teal-100 overflow-hidden flex items-center justify-center shrink-0">
          {doctor.image?.url ? (
            <img src={doctor.image.url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-teal-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 truncate">{name}</h3>
            <span
              className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${
                doctor.isAvailable ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${doctor.isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
              {doctor.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {doctor.specialization} · {doctor.experience} years
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {doctor.rating}
            </span>
            <button onClick={() => setExpanded((v) => !v)} className="text-slate-400 hover:text-slate-600">
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-1">
          <p>
            <span className="font-medium text-slate-700">Qualifications:</span> {doctor.qualifications || "—"}
          </p>
          <p>
            <span className="font-medium text-slate-700">Location:</span> {doctor.location || "—"}
          </p>
          <p>
            <span className="font-medium text-slate-700">About:</span> {doctor.about || "—"}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" /> Patients {doctor.totalPatients}
        </span>
        <button
          onClick={() => onDelete(doctor._id)}
          disabled={deleting}
          className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" /> {deleting ? "Deleting..." : "Delete"}
        </button>
        <span className="text-sm font-bold text-slate-900">Fees : ₹{doctor.consultationFee}</span>
      </div>
    </div>
  );
};

const AdminListDoctors = () => {
  const {
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    clearFilters,
    visibleDoctors,
    totalCount,
    remainingCount,
    showMore,
    deletingId,
    removeDoctor,
  } = useAdminDoctorList();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <UsersRound className="w-6 h-6 text-teal-700 mt-0.5" />
            <div>
              <h1 className="text-xl font-bold text-teal-800">Find a Doctor</h1>
              <p className="text-sm text-slate-500">Search by name or specialization</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors, specialization"
                className="rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              onClick={clearFilters}
              className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === f.value
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-slate-500">Loading doctors...</p>}
        {error && <p className="text-rose-600">{error}</p>}
        {!loading && !error && totalCount === 0 && <p className="text-slate-500">No doctors match your filters.</p>}

        <div className="grid sm:grid-cols-2 gap-5">
          {visibleDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onDelete={removeDoctor}
              deleting={deletingId === doctor._id}
            />
          ))}
        </div>

        {remainingCount > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={showMore}
              className="rounded-full border border-teal-200 text-teal-700 text-sm font-semibold px-6 py-2.5 hover:bg-teal-50 transition-colors"
            >
              Show more ({remainingCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListDoctors;