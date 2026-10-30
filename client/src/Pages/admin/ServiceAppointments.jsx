import React from "react";
import { useServiceAppointments } from "../../Hooks/Admin/useServiceAppointments.js";

const ServiceAppointments = () => {
  const {
    loading,
    error,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    visibleAppointments,
    totalCount,
    remainingCount,
    showMore,
    clearFilters,
  } = useServiceAppointments();

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#155e59] sm:text-3xl">
              Service Appointments
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage patient bookings for healthcare services
            </p>
          </div>

          {/* Filters */}
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#51b9aa]">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient or service"
                className="w-full rounded-full border border-[#b7e5dd] bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#51b9aa] focus:ring-2 focus:ring-[#51b9aa]/20"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-full border border-[#9bd8cf] bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#51b9aa] sm:w-44"
            >
              <option value="all">All</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {totalCount} {totalCount === 1 ? "result" : "results"}
        </p>

        <button
          onClick={clearFilters}
          className="text-xs font-medium text-[#16756b] transition hover:text-[#0f514b]"
        >
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#d5f2ed] border-t-[#43ad9f]" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && visibleAppointments.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#b7e5dd]">
          <div className="text-center">
            <p className="text-base font-semibold text-gray-600">
              No appointments found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or filter.
            </p>
          </div>
        </div>
      )}

      {/* Appointment Grid */}
      {!loading && !error && visibleAppointments.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleAppointments.map((appointment) => (
              <ServiceAppointmentCard
                key={appointment._id}
                appointment={appointment}
              />
            ))}
          </div>

          {/* Show More */}
          {remainingCount > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={showMore}
                className="rounded-full border border-[#8ed3c8] px-6 py-2.5 text-sm font-medium text-[#16756b] transition hover:bg-[#e9f9f6]"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ServiceAppointmentCard = ({ appointment }) => {
  const patient = appointment.patient;
  const service = appointment.service;

  const status = appointment.status || "Pending";

  const statusStyles = {
    Confirmed:
      "bg-[#d8f5ed] text-[#16806e]",
    Pending:
      "bg-[#fff4c7] text-[#927000]",
    Completed:
      "bg-[#dff1fa] text-[#4786a5]",
    Cancelled:
      "bg-[#fde8e8] text-[#c35c5c]",
    Rescheduled:
      "bg-[#e9e8fb] text-[#6d70a8]",
  };

  return (
    <div className="flex min-h-[300px] flex-col rounded-2xl border border-[#b8e7df] bg-white p-4 shadow-[0_2px_8px_rgba(46,170,155,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(46,170,155,0.12)]">
      {/* Patient Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e2f8f3] text-[#38a997]">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15 19a6 6 0 00-12 0m6-9a4 4 0 100-8 4 4 0 000 8zm10 9a5 5 0 00-5-5m2-7a3 3 0 100-6"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#245f59]">
              {patient?.name || "Unknown Patient"}
            </h3>

            <p className="text-xs text-gray-500">
              {patient?.gender || "Male"} • {patient?.age || "--"} yrs
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
            statusStyles[status] || statusStyles.Pending
          }`}
        >
          {status === "Confirmed" && "✓ "}
          {status}
        </span>
      </div>

      {/* Appointment Details */}
      <div className="mt-5 space-y-3 text-sm">
        {/* Phone */}
        <div className="flex items-center gap-3">
          <span className="text-[#51b9aa]">⌕</span>

          <span className="text-gray-600">
            {patient?.phone || appointment.phone || "N/A"}
          </span>
        </div>

        {/* Fees */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#51b9aa]">₹</span>

          <span className="font-semibold text-gray-700">
            Fees: ₹{service?.price || appointment.fees || 0}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <span className="text-[#51b9aa]">▣</span>

          <span className="text-gray-600">
            Date: {appointment.date || "N/A"}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <span className="text-[#51b9aa]">◷</span>

          <span className="text-gray-600">
            Time: {appointment.time || "N/A"}
          </span>
        </div>
      </div>

      {/* Service */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Service:{" "}
          <span className="font-bold text-[#28685f]">
            {service?.name || "Unknown Service"}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center justify-end gap-3 pt-5">
        <button
          disabled={status === "Completed"}
          className="rounded-full border border-[#78c9bd] px-3 py-1.5 text-xs font-medium text-[#28786e] transition hover:bg-[#eaf9f6] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
        >
          Reschedule
        </button>

        <button
          disabled={
            status === "Completed" || status === "Cancelled"
          }
          className="rounded-full border border-[#efcaca] px-3 py-1.5 text-xs font-medium text-[#bb6868] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ServiceAppointments;