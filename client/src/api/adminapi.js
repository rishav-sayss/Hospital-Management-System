import api from "./axios";

export const getDoctorsOverview = () => api.get("/admin/doctor-overview").then((res) => res.data);


export const getDoctors = async () => {
  const response = await api.get("/admin/doctors");
  return response.data.doctors;
};

export const getDoctorAppointments = async () => {
  const response = await api.get("/appointments/");
  console.log(response.data)
  return response.data.appointments;
};

export const deleteDoctorByAdmin = (doctorId) => api.delete(`/doctors/${doctorId}/admin`).then((res) => res.data);


export const getServicesOverview = () => api.get("/services/Admin-Dashboard").then((res) => res.data);

export const createService = (formData) =>
  api.post("/services/", formData).then((res) => res.data);