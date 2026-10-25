import { Users, UserCheck, CalendarDays, IndianRupee, CheckCircle2, XCircle, Search, User } from "lucide-react";
import { useAdminDashboard } from "../../Hooks/Admin/useadmindashboard.js";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-full bg-white/70 border border-teal-100 pl-5 pr-7 py-4 min-w-0">
    <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-teal-700" />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-slate-600 truncate">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { overview, loading, error, search, setSearch, filteredDoctors } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 mb-8">Overview of doctors &amp; appointments</p>

        {loading && <p className="text-slate-500">Loading dashboard...</p>}
        {error && <p className="text-rose-600">{error}</p>}

        {!loading && !error && overview && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              <StatCard icon={Users} label="Total Doctors" value={overview.totalDoctors} />
              <StatCard icon={UserCheck} label="Total Registered Users" value={overview.totalRegisteredUsers} />
              <StatCard icon={CalendarDays} label="Total Appointments" value={overview.totalAppointments} />
              <StatCard icon={IndianRupee} label="Total Earnings" value={`₹${overview.totalEarnings.toLocaleString("en-IN")}`} />
              <StatCard icon={CheckCircle2} label="Completed" value={overview.completed} />
              <StatCard icon={XCircle} label="Cancelled" value={overview.cancelled} />
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mb-3">Search doctors</h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name / specialization / fee"
                  className="w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <button
                onClick={() => setSearch("")}
                className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-3 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5">
                <h2 className="text-xl font-bold text-slate-900">Doctors</h2>
                <span className="text-sm text-slate-500">
                  Showing {filteredDoctors.length} of {overview.doctors.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-slate-500 border-y border-slate-100">
                      <th className="px-6 py-3">Doctor</th>
                      <th className="px-6 py-3">Specialization</th>
                      <th className="px-6 py-3 text-right">Fee</th>
                      <th className="px-6 py-3 text-right">Appointments</th>
                      <th className="px-6 py-3 text-right">Completed</th>
                      <th className="px-6 py-3 text-right">Cancelled</th>
                      <th className="px-6 py-3 text-right">Total Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          No doctors match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredDoctors.map((d) => (
                        <tr key={d.id} className="border-b border-slate-50 last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-teal-100 overflow-hidden flex items-center justify-center shrink-0">
                                {d.image ? (
                                  <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-5 h-5 text-teal-600" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{d.name}</p>
                                <p className="text-xs text-slate-400 truncate">ID: {d.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{d.specialization}</td>
                          <td className="px-6 py-4 text-right text-slate-800">₹{d.fee}</td>
                          <td className="px-6 py-4 text-right text-slate-800">{d.appointments}</td>
                          <td className="px-6 py-4 text-right text-emerald-600 font-medium">{d.completed}</td>
                          <td className="px-6 py-4 text-right text-rose-500 font-medium">{d.cancelled}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            ₹{d.totalEarnings.toLocaleString("en-IN")}
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

export default AdminDashboard;