import api from "../../api/axios.js";

// Get logged-in doctor's profile
export const getMyDoctorProfile = async () => {
  const response = await api.get("/doctor/me");

  return response.data;
};

// Update logged-in doctor's profile
export const updateMyDoctorProfile = async (profileData) => {
  const response = await api.patch("/doctor/me", profileData);

  return response.data;
};