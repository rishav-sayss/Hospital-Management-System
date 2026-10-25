import api from "./axios";

export const getDoctorsOverview = () => api.get("/admin/doctor-overview").then((res) => res.data);

export const getServiceDashboardStats = () => api.get("/admin/service-dashboard").then((res) => res.data);