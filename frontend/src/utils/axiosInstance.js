import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

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
        await axiosInstance.post("/auth/refresh");
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        const publicPages = ["/", "/jobs", "/companies", "/auth/login", "/auth/signup"];
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

        if (typeof window !== "undefined" &&
          !publicPages.includes(currentPath) &&
          !currentPath.startsWith("/jobs/") &&
          !currentPath.includes("/auth/")) {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
