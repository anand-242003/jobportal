import axios from "axios";

// Use direct backend URL for production
const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

// Add Authorization header with token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network error - cannot reach backend");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/refresh")) {

      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axiosInstance.post("/auth/refresh", { refreshToken });
        
        if (typeof window !== "undefined" && response.data.token) {
          localStorage.setItem("token", response.data.token);
          if (response.data.refreshToken) {
            localStorage.setItem("refreshToken", response.data.refreshToken);
          }
        }

        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }

        const publicPages = ["/", "/jobs", "/companies", "/auth/login", "/auth/signup", "/chat"];
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

        if (typeof window !== "undefined" &&
          !publicPages.includes(currentPath) &&
          !currentPath.startsWith("/jobs/") &&
          !currentPath.includes("/auth/")) {
          console.log("Session expired, redirecting to login");
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
