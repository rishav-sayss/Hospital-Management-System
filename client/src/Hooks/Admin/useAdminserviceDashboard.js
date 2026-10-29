import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getServicesOverview } from "../../api/adminapi.js";

export const useAdminServiceDashboard = () => {
  const [search, setSearch] = useState("");
  
  const {
    data: overview,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "services-overview"],
    queryFn: getServicesOverview,
  });

  const filteredServices = useMemo(() => {
    if (!overview) return [];
    const term = search.trim().toLowerCase();
    if (!term) return overview.services;
    return overview.services.filter((s) => s.name.toLowerCase().includes(term));
  }, [overview, search]);

  return {
    overview,
    loading,
    error: isError ? "Could not load the service dashboard. Please try again." : "",
    search,
    setSearch,
    filteredServices,
    refresh: refetch,
  };
};