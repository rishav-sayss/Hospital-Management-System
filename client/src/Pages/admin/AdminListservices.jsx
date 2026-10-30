import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Check, Pencil, Trash2, RotateCcw, Stethoscope } from "lucide-react";
import { useAdminServiceList } from "../../Hooks/Admin/useAdminserviceList.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

const ServiceCard = ({ service, busy, onRemove, onRestore }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-teal-50 overflow-hidden flex items-center justify-center shrink-0">
          {service.image?.url ? (
            <img src={service.image.url} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <Stethoscope className="w-6 h-6 text-teal-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-teal-800 leading-snug">{service.name}</h3>
            <span className="font-bold text-slate-900 shrink-0">₹{service.price}</span>
          </div>

          <div className="flex items-start justify-between gap-2 mt-1">
            <p className="text-xs sm:text-sm text-teal-600 line-clamp-2">{service.description}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  service.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                }`}
              >
                {service.isActive && <Check className="w-3 h-3" />}
                {service.isActive ? "Available" : "Unavailable"}
              </span>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Collapse details" : "Expand details"}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {service.category && (
            <span className="inline-block mt-2 rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-[11px] font-medium text-teal-700">
              {service.category}
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-teal-800 mb-1">About</h4>
            <p className="text-sm text-teal-600">{service.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-teal-800 mb-1">Instructions</h4>
            {service.preTestInstructions?.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-teal-600 space-y-0.5">
                {service.preTestInstructions.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-teal-600">No instructions</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {/* The edit page isn't built yet, so this link 404s until it is */}
            <Link
              to={`/admin/services/${service._id}`}
              className="flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-sm font-medium px-4 py-1.5 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Link>

            {service.isActive ? (
              <button
                onClick={() => onRemove(service._id)}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50 text-sm font-medium px-4 py-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> {busy ? "Removing..." : "Remove"}
              </button>
            ) : (
              <button
                onClick={() => onRestore(service._id)}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-white text-teal-700 hover:bg-teal-50 disabled:opacity-50 text-sm font-medium px-4 py-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {busy ? "Restoring..." : "Restore"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminListServices = () => {
  const {
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredServices,
    busyId,
    removeService,
    restoreService,
  } = useAdminServiceList();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-3 sm:px-6 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-800">Services</h1>
            <p className="text-xs sm:text-sm text-teal-600 mt-1">Manage your services — edit or remove</p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-end lg:items-center gap-3">
            <div className="flex rounded-full bg-white border border-slate-100 p-1 self-start sm:self-auto">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-semibold transition-colors ${
                    statusFilter === f.value ? "bg-teal-600 text-white" : "text-teal-700 hover:bg-teal-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-teal-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full sm:w-64 rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading services...</p>}
        {error && <p className="text-rose-600">{error}</p>}
        {!loading && !error && filteredServices.length === 0 && (
          <p className="text-slate-500">No services match your filters.</p>
        )}

        {/* items-start so opening one card doesn't stretch its neighbour */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              busy={busyId === service._id}
              onRemove={removeService}
              onRestore={restoreService}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminListServices;