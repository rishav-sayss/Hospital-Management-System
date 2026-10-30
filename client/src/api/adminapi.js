import api from "./axios";

export const getDoctorsOverview = () =>
  api.get("/admin/doctor-overview").then((res) => res.data);

export const getDoctors = async () => {
  const response = await api.get("/admin/doctors");
  return response.data.doctors;
};

export const getDoctorAppointments = async () => {
  const response = await api.get("/appointments/");
  console.log(response.data);
  return response.data.appointments;
};

export const deleteDoctorByAdmin = (doctorId) =>
  api.delete(`/doctors/${doctorId}/admin`).then((res) => res.data);

export const getServicesOverview = () =>
  api.get("/services/Admin-Dashboard").then((res) => res.data);

export const createService = (formData) =>
  api.post("/services/", formData).then((res) => res.data);

export const updateService = (id, formData) =>
  api
    .put(`/services/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.service);

// Includes deactivated services too (the public getAllServices hides them)
export const getAllServicesAdmin = () =>
  api.get("/services/admin/all").then((res) => res.data.services);
export const setServiceActive = (id, isActive) =>
  api.put(`/services/${id}`, { isActive }).then((res) => res.data.service);

export const deleteService = (id) =>
  api.delete(`/services/${id}`).then((res) => res.data);
