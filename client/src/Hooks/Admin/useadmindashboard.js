import { useEffect, useMemo, useState } from "react";
import { getDoctorsOverview } from "../../api/adminapi.js";

export const useAdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      setOverview(await getDoctorsOverview());
    } catch {
      setError("Could not load the dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Matches by name, specialization, or fee — whatever the search box says
  const filteredDoctors = useMemo(() => {
    if (!overview) return [];
    const term = search.trim().toLowerCase();
    if (!term) return overview.doctors;

    return overview.doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.specialization.toLowerCase().includes(term) ||
        String(d.fee).includes(term)
    );
  }, [overview, search]);

  return { overview, loading, error, search, setSearch, filteredDoctors, refresh: loadData };
};