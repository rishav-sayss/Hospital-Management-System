import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "./Authcontext.jsx";

const DoctorContext = createContext(null);

// backend { doctor } bhejta hai; name/email populated "user" me bhi ho sakta hai
const norm = (d) => ({ ...d, name: d.name || d.user?.name, email: d.email || d.user?.email });

// DB me status "completed" (lowercase) ho ya "Completed" -- UI me hamesha "Completed"
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "");
const normAppt = (a) => ({ ...a, _lower: a.status === a.status?.toLowerCase(), status: cap(a.status) });

export const DoctorProvider = ({ children }) => {
  const { user } = useAuth();
  const doctorId = user?._id || user?.id;

  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const { data } = await api.get("/appointments/doctor");
      const list = Array.isArray(data) ? data : data.appointments || [];
      setAppointments(list.map(normAppt));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/doctor/me");
      setProfile(norm(data.doctor || data));
    } catch (e) {
      console.error(e);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchAppointments();
    fetchProfile();
  }, [fetchAppointments, fetchProfile]);

  const updateStatus = async (id, status) => {
    const prev = appointments;
    const target = appointments.find((a) => a._id === id);
    setAppointments((l) => l.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      // DB jis case me rakhta hai usi me bhejo (lowercase ya Capitalized)
      await api.put(`/appointments/${id}/status`, { status: target?._lower ? status.toLowerCase() : status });
    } catch {
      setAppointments(prev);
    }
  };

  // body JSON ya FormData (photo ke saath) dono ho sakta hai
  const updateProfile = async (body) => {
    const { data } = await api.put("/doctor/me", body);
    setProfile(norm(data.doctor || data));
  };

  const stats = useMemo(() => {
    const completed = appointments.filter((a) => a.status === "Completed");
    return {
      total: appointments.length,
      completed: completed.length,
      cancelled: appointments.filter((a) => a.status === "Cancelled").length,
      earnings: completed.reduce((s, a) => s + (Number(a.fees || a.amount) || 0), 0),
    };
  }, [appointments]);

  return (
    <DoctorContext.Provider
      value={{ doctorId, appointments, profile, loading, stats, fetchAppointments, updateStatus, updateProfile }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);