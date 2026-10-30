import {
  Search,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import AppointmentCard from "../../Components/admin/AppointmentCard.jsx";
import { useDoctorAppointments } from "../../Hooks/Admin/useDoctorAppointments.js";

const DoctorAppointments = () => {
  const {
    loading,
    error,
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    specialityFilter,
    setSpecialityFilter,
    specialities,
    visibleAppointments,
    totalCount,
    remainingCount,
    showMore,
    clearFilters,
  } = useDoctorAppointments();

  return (
    <main className="min-h-screen bg-emerald-50/80 px-4 py-7 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Heading and filters */}
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
              Appointments
            </h1>

            <p className="mt-1 text-sm text-emerald-800 sm:text-base">
              Manage and search upcoming patient appointments
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:min-w-[590px]">
            {/* Search */}
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 shadow-sm sm:col-span-2">
              <Search
                size={17}
                className="shrink-0 text-teal-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor, patient, or speciality"
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-teal-600"
              />
            </label>

            {/* Date */}
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 shadow-sm">
              <CalendarDays
                size={16}
                className="shrink-0 text-teal-600"
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none"
              />
            </label>

            {/* Speciality */}
            <div className="relative flex h-11 min-w-0 items-center rounded-full border border-emerald-100 bg-white shadow-sm">
              <select
                value={specialityFilter}
                onChange={(e) =>
                  setSpecialityFilter(e.target.value)
                }
                className="h-full w-full appearance-none bg-transparent px-4 pr-9 text-sm text-slate-700 outline-none"
              >
                <option value="all">All specialities</option>

                {specialities.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 text-teal-700"
              />
            </div>

            {/* Clear */}
            <button
              type="button"
              onClick={clearFilters}
              className="h-11 rounded-full bg-emerald-700 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-800 sm:col-span-2 sm:justify-self-end xl:col-span-1"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="py-12 text-center text-sm text-emerald-800">
            Loading appointments...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="rounded-xl border border-rose-200 bg-white p-5 text-center text-sm text-rose-700">
            {error}
          </p>
        )}

        {/* Empty state */}
        {!loading && !error && visibleAppointments.length === 0 && (
          <p className="rounded-xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-600">
            No appointments found.
          </p>
        )}

        {/* Appointment cards */}
        {!loading && !error && visibleAppointments.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              ))}
            </div>

            {remainingCount > 0 && (
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={showMore}
                  className="rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-emerald-50"
                >
                  Show more ({remainingCount})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default DoctorAppointments;