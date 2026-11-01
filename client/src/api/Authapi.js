import api from "../api/axios.js";
 
export const updateMeRequest = (name) => api.put("/auth/me", { name }).then((res) => res.data);

export const changePasswordRequest = (currentPassword, newPassword) =>
  api.put("/auth/me/password", { currentPassword, newPassword }).then((res) => res.data);