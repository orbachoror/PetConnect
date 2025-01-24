import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Base API URL
});

let isRefreshing = false; // To prevent multiple refresh requests
let failedQueue: any[] = []; // Queue for requests while the token is being refreshed

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// Add request interceptor to include the access token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("[API Request] Using token:", token); // Log the current token
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config; // The failed request config

    // If the response was 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("[API Response] Received 401 Unauthorized");

      if (isRefreshing) {
        console.log("[API Response] Token is already refreshing; queueing request");
        // Wait for the token refresh process to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log("[API Response] Retrying queued request with new token");
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true; // Mark the request as retried
      isRefreshing = true; // Set the refresh flag

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("[API Refresh] Using refresh token:", refreshToken);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call the refresh token endpoint
        const { data } = await axios.post("http://localhost:3000/auth/refresh", {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = data;

        console.log("[API Refresh] Successfully refreshed tokens");
        console.log("[API Refresh] New access token:", accessToken);

        // Update tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update default headers for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Process queued requests with the new token
        processQueue(null, accessToken);

        // Retry the original failed request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("[API Refresh] Failed to refresh token:", err);

        // Reject queued requests if token refresh fails
        processQueue(err, null);

        // Clear tokens and log out the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(err);
      } finally {
        isRefreshing = false; // Reset the refresh flag
      }
    }

    return Promise.reject(error); // Reject other errors as normal
  }
);

export default api;
