import { useEffect, useState } from "react";
import { getDoctors, deleteDoctor } from "../../api/adminapi.js";

export default function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false; // avoids setting state after unmount

    getDoctors()
      .then((data) => !ignore && setDoctors(data))
      .catch((err) => !ignore && setError(err.response?.data?.message || "Could not load doctors"))
      .finally(() => !ignore && setLoading(false));

    return () => { ignore = true; };
  }, []);

  const removeDoctor = async (id) => {
    await deleteDoctor(id);
    setDoctors((prev) => prev.filter((d) => d._id !== id));
  };

  return { doctors, loading, error, removeDoctor };
}