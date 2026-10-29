import { ClipboardList, CalendarDays, IndianRupee, CheckCircle2, XCircle, Search, RefreshCcw, Stethoscope } from "lucide-react";
import {  useAdminServiceDashboard } from "../../Hooks/Admin/useAdminserviceDashboard.js";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 sm:gap-4 rounded-full bg-white/70 border border-teal-100 pl-4 sm:pl-5 pr-5 sm:pr-7 py-3 sm:py-4 min-w-0">
    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
    </div>
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-slate-600 truncate">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const AdminServiceDashboard = () => {
  const { overview, loading, error, search, setSearch, filteredServices, refresh } = useAdminServiceDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-3 sm:px-6 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Service Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Overview of services, appointments and earnings</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {overview && <span className="text-sm text-slate-500">{overview.totalServices} services</span>}
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading dashboard...</p>}
        {error && <p className="text-rose-600">{error}</p>}

        {!loading && !error && overview && (
          <>
            {/* 2-up on mobile, flows naturally wider up */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCard icon={ClipboardList} label="Total Services" value={overview.totalServices} />
              <StatCard icon={CalendarDays} label="Total Appointments" value={overview.totalAppointments} />
              <StatCard icon={IndianRupee} label="Total Earning" value={`₹${overview.totalEarning.toLocaleString("en-IN")}`} />
              <StatCard icon={CheckCircle2} label="Completed" value={overview.completed} />
              <StatCard icon={XCircle} label="Cancelled" value={overview.cancelled} />
            </div>

            <div className="relative mb-6 sm:mb-8">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service..."
                className="w-full sm:w-80 rounded-full border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              {/* Scrolls sideways on narrow screens instead of squeezing columns unreadably */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-slate-500 bg-emerald-50/50">
                      <th className="px-4 sm:px-6 py-3">Service</th>
                      <th className="px-4 sm:px-6 py-3 text-right">Price</th>
                      <th className="px-4 sm:px-6 py-3 text-right">Appointments</th>
                      <th className="px-4 sm:px-6 py-3 text-right">Completed</th>
                      <th className="px-4 sm:px-6 py-3 text-right">Cancelled</th>
                      <th className="px-4 sm:px-6 py-3 text-right">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          No services match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((s) => (
                        <tr key={s.id} className="border-t border-slate-50">
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-teal-50 overflow-hidden flex items-center justify-center shrink-0">
                                {s.image ? (
                                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Stethoscope className="w-5 h-5 text-teal-500" />
                                )}
                              </div>
                              <p className="font-semibold text-slate-900 truncate">{s.name}</p>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right text-slate-800">₹{s.price}</td>
                          <td className="px-4 sm:px-6 py-4 text-right text-slate-800">{s.appointments}</td>
                          <td className="px-4 sm:px-6 py-4 text-right text-emerald-600 font-medium">{s.completed}</td>
                          <td className="px-4 sm:px-6 py-4 text-right text-rose-500 font-medium">{s.cancelled}</td>
                          <td className="px-4 sm:px-6 py-4 text-right font-bold text-slate-900">
                            ₹{s.earning.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminServiceDashboard;