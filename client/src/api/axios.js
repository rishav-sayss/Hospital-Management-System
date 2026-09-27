import axios from "axios";

// withCredentials: true is what makes the browser send/receive the httpOnly
// accessToken/refreshToken cookies with every request — without this, the
// backend's `authenticate` middleware will never see the user as logged in.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// If a request fails because the access token expired, silently refresh it once
// and retry the original request — the user never sees a failed request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // stop this from looping forever if refresh also fails

      try {
        await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        return api(originalRequest); // retry the original request now that we have a fresh token
      } catch (refreshError) {
        return Promise.reject(refreshError); // refresh failed too — user needs to log in again
      }
    }

    return Promise.reject(error);
  }
);

export default api;