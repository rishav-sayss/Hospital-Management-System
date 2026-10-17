import { createContext, useContext, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "./Authcontext.jsx";

const DoctorContext = createContext(null);

const PROFILE_KEY = ["doctor-me"];
const APPTS_KEY = ["doctor-appointments"];
const EMPTY = []; // stable reference, taaki bina data ke bhi re-render na ho

// name/email populated "user" me bhi ho sakta hai
const norm = (d) => ({ ...d, name: d.name || d.user?.name, email: d.email || d.user?.email });
// DB me "completed" ho ya "Completed" -- UI me hamesha "Completed"
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "");
const normAppt = (a) => ({ ...a, status: cap(a.status) });

export const DoctorProvider = ({ children }) => {
  const { user } = useAuth();
  const doctorId = user?._id || user?.id;
  const qc = useQueryClient();

  // ---- Profile: cache me raw data, har consumer ko select se norm milta hai ----
  // Apna useDoctorProfile hook bhi yahi queryKey use kare to /doctor/me ek hi baar jaayegi
  const profileQ = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const { data } = await api.get("/doctor/me");
      return data.doctor || data;
    },
    select: norm,
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000,
  });

  // ---- Appointments ----
  const apptQ = useQuery({
    queryKey: APPTS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/appointments/doctor");
      return Array.isArray(data) ? data : data.appointments || [];
    },
    select: (list) => list.map(normAppt),
    enabled: !!doctorId,
    staleTime: 30 * 1000,
  });
  const appointments = apptQ.data ?? EMPTY;

  // ---- Status badlo: UI turant, fail ho to wapas ----
  const { mutate: mutateStatus } = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/appointments/${id}/status`, { status }).then((r) => r.data.appointment),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: APPTS_KEY });
      const prev = qc.getQueryData(APPTS_KEY);
      qc.setQueryData(APPTS_KEY, (old = []) => old.map((a) => (a._id === id ? { ...a, status } : a)));
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(APPTS_KEY, ctx?.prev),
    onSuccess: (updated) => {
      // server paymentStatus bhi badal sakta hai (cash completed -> paid)
      if (updated)
        qc.setQueryData(APPTS_KEY, (old = []) => old.map((a) => (a._id === updated._id ? { ...a, ...updated } : a)));
    },
  });

  const updateStatus = useCallback(
    (id, status) => {
      // DB jis case me rakhta hai usi me bhejo (lowercase ya Capitalized)
      const raw = qc.getQueryData(APPTS_KEY)?.find((a) => a._id === id);
      const lower = raw?.status && raw.status === raw.status.toLowerCase();
      mutateStatus({ id, status: lower ? status.toLowerCase() : status });
    },
    [qc, mutateStatus]
  );

  // ---- Profile save: body JSON ya FormData (photo ke saath) ----
  const profileMut = useMutation({
    mutationFn: async (body) => {
      const { data } = await api.put("/doctor/me", body);
      return data.doctor || data;
    },
    onSuccess: (doctor) =>
      qc.setQueryData(PROFILE_KEY, (old) => ({
        ...old,
        ...doctor,
        // PUT me user sirf id aaye to populated user (naam) mat khoo
        user: doctor.user && typeof doctor.user === "object" ? doctor.user : old?.user,
      })),
  });
  const updateProfile = profileMut.mutateAsync;

  // ---- Stats: ek hi loop me ----
  const stats = useMemo(() => {
    let completed = 0, cancelled = 0, earnings = 0;
    for (const a of appointments) {
      if (a.status === "Completed") {
        completed++;
        earnings += Number(a.fee) || 0;
      } else if (a.status === "Cancelled") cancelled++;
    }
    return { total: appointments.length, completed, cancelled, earnings };
  }, [appointments]);

  const { refetch: fetchAppointments } = apptQ;

  // value memo: jab tak kuch badla nahi, consumers dobara render nahi honge
  const value = useMemo(
    () => ({
      doctorId,
      appointments,
      profile: profileQ.data ?? null,
      loading: apptQ.isLoading,
      stats,
      fetchAppointments,
      updateStatus,
      updateProfile,
    }),
    [doctorId, appointments, profileQ.data, apptQ.isLoading, stats, fetchAppointments, updateStatus, updateProfile]
  );

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};

export const useDoctor = () => useContext(DoctorContext);