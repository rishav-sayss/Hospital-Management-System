import api from "./axios";

// ---- Public ----
export const getAllDoctors = () => api.get("/doctor").then((res) => res.data.doctors);

export const getDoctorById = (id) => api.get(`/doctor/${id}`).then((res) => res.data.doctor);

export const getAvailableDates = (doctorId) =>
  api.get(`/doctor/${doctorId}/available-dates`).then((res) => res.data.dates);

export const getAvailableSlots = (doctorId, date) =>
  api.get(`/doctor/${doctorId}/available-slots`, { params: { date } }).then((res) => res.data.slots);

// ---- Doctor managing their own profile ----
export const getMyDoctorProfile = () => api.get("/doctor/me").then((res) => res.data.doctor);

export const updateMyDoctorProfile = (updates) => api.put("/doctor/me", updates).then((res) => res.data.doctor);

export const addScheduleDate = (date) => api.post("/doctor/me/schedule", { date }).then((res) => res.data.schedule);

export const deleteScheduleDate = (date) =>
  api.delete(`/doctor/me/schedule/${date}`).then((res) => res.data.schedule);

export const addScheduleSlot = (date, time) =>
  api.post(`/doctor/me/schedule/${date}/slots`, { time }).then((res) => res.data.schedule);

export const deleteScheduleSlot = (date, time) =>
  api.delete(`/doctor/me/schedule/${date}/slots`, { data: { time } }).then((res) => res.data.schedule);

export const updateDoctorByAdmin = (doctorId, updates) =>
  api.put(`/doctor/${doctorId}/admin`, updates).then((res) => res.data.doctor);