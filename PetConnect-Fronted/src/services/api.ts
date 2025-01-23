import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});




api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("[API Request] Using token:", token);
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("[API] 401 Unauthorized - Attempting token refresh");

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        console.log("[API Refresh] Sending refresh request");
        const { data } = await axios.post("http://localhost:3000/auth/refresh", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data;

        console.log("[API Refresh] Successfully refreshed tokens");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("[API Refresh] Failed to refresh token:", err);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;