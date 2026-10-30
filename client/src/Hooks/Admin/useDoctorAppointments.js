import { useEffect, useMemo, useState } from "react";
import { getDoctorAppointments } from "../../api/adminapi.js";

const PAGE_SIZE = 8;

export const useDoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDoctorAppointments();
      setAppointments(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load doctor appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const specialities = useMemo(() => {
    return [
      ...new Set(
        appointments
          .map((appointment) => appointment.doctor?.specialization)
          .filter(Boolean)
      ),
    ];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const patientName =
        appointment.patient?.name?.toLowerCase() || "";

      const specialization =
        appointment.doctor?.specialization?.toLowerCase() || "";

      const matchesSearch =
        !term ||
        patientName.includes(term) ||
        specialization.includes(term);

      const matchesDate =
        !dateFilter || appointment.date === dateFilter;

      const matchesSpeciality =
        specialityFilter === "all" ||
        appointment.doctor?.specialization === specialityFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesSpeciality
      );
    });
  }, [
    appointments,
    search,
    dateFilter,
    specialityFilter,
  ]);

  const visibleAppointments = filteredAppointments.slice(
    0,
    visibleCount
  );

  const remainingCount =
    filteredAppointments.length - visibleAppointments.length;

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
    setSpecialityFilter("all");
    setVisibleCount(PAGE_SIZE);
  };

  return {
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
    totalCount: filteredAppointments.length,
    remainingCount,
    showMore: () =>
      setVisibleCount((count) => count + PAGE_SIZE),
    clearFilters,
  };
};