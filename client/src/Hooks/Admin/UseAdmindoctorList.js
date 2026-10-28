import { useEffect, useMemo, useState } from "react";
import { getDoctors, deleteDoctorByAdmin } from "../../api/adminapi.js";

const PAGE_SIZE = 6;

export const useAdminDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "available" | "unavailable"
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      setDoctors(await getDoctors());
    } catch {
      setError("Could not load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return doctors.filter((d) => {
      const matchesSearch =
        !term ||
        d.user?.name?.toLowerCase().includes(term) ||
        d.specialization?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && d.isAvailable) ||
        (statusFilter === "unavailable" && !d.isAvailable);

      return matchesSearch && matchesStatus;
    });
  }, [doctors, search, statusFilter]);

  const visibleDoctors = filteredDoctors.slice(0, visibleCount);
  const remainingCount = filteredDoctors.length - visibleDoctors.length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const removeDoctor = async (id) => {
    if (!window.confirm("Delete this doctor? This also deletes their login account and cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deleteDoctorByAdmin(id);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete this doctor");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    clearFilters,
    visibleDoctors,
    totalCount: filteredDoctors.length,
    remainingCount,
    showMore: () => setVisibleCount((c) => c + PAGE_SIZE),
    deletingId,
    removeDoctor,
  };
};