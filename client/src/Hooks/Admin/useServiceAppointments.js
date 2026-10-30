import { useEffect, useMemo, useState } from "react";
import { getServiceAppointments } from "../../api/adminapi.js";

const PAGE_SIZE = 8;

export const useServiceAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getServiceAppointments();
      setAppointments(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load service appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        appointments
          .map((appointment) => appointment.service?.category)
          .filter(Boolean)
      ),
    ];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const patientName =
        appointment.patient?.name?.toLowerCase() || "";

      const serviceName =
        appointment.service?.name?.toLowerCase() || "";

      const category =
        appointment.service?.category?.toLowerCase() || "";

      const matchesSearch =
        !term ||
        patientName.includes(term) ||
        serviceName.includes(term) ||
        category.includes(term);

      const matchesDate =
        !dateFilter || appointment.date === dateFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        appointment.service?.category === categoryFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesCategory
      );
    });
  }, [
    appointments,
    search,
    dateFilter,
    categoryFilter,
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
    setCategoryFilter("all");
    setVisibleCount(PAGE_SIZE);
  };

  return {
    loading,
    error,
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    visibleAppointments,
    totalCount: filteredAppointments.length,
    remainingCount,
    showMore: () =>
      setVisibleCount((count) => count + PAGE_SIZE),
    clearFilters,
  };
};