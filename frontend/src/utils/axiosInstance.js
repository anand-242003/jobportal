import axios from "axios";

let baseURL = "";

if (process.env.NODE_ENV !== "production") {
  baseURL = "http://localhost:5001/api";
} else {
  baseURL = "https://jobportal-oc40.onrender.com/api";
}

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
        console.error("Refresh token failed. Redirecting to login...");

        if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
