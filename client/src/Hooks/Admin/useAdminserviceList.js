import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllServicesAdmin, setServiceActive, deleteService } from "../../api/adminapi.js";

const SERVICES_KEY = ["admin", "services"];

export const useAdminServiceList = () => {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading: loading,
    isError,
  } = useQuery({ queryKey: SERVICES_KEY, queryFn: getAllServicesAdmin });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "available" | "unavailable"
  const [busyId, setBusyId] = useState(null);

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();

    return services.filter((s) => {
      const matchesSearch =
        !term || s.name.toLowerCase().includes(term) || s.category?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && s.isActive) ||
        (statusFilter === "unavailable" && !s.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  // Writes the new status straight into the cached list so the card updates
  // instantly, and marks the Service Dashboard numbers stale so they refetch next visit
  const applyActive = (id, isActive) => {
    queryClient.setQueryData(SERVICES_KEY, (old) => old?.map((s) => (s._id === id ? { ...s, isActive } : s)));
    queryClient.invalidateQueries({ queryKey: ["admin", "services-overview"] });
  };

  // "Remove" is a soft delete on the backend: the service turns Unavailable, and
  // past bookings that point at it keep working
  const removeService = async (id) => {
    if (!window.confirm("Remove this service? Patients won't be able to book it, but past bookings stay.")) return;

    setBusyId(id);
    try {
      await deleteService(id);
      applyActive(id, false);
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove this service");
    } finally {
      setBusyId(null);
    }
  };

  const restoreService = async (id) => {
    setBusyId(id);
    try {
      await setServiceActive(id, true);
      applyActive(id, true);
    } catch (err) {
      alert(err.response?.data?.message || "Could not restore this service");
    } finally {
      setBusyId(null);
    }
  };

  return {
    loading,
    error: isError ? "Could not load services. Please try again." : "",
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredServices,
    busyId,
    removeService,
    restoreService,
  };
};