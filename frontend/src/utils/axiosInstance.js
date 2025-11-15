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

axiosInstance.interceptors.response.use(
  (response) => {
    return response; 
  },

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/auth/refresh");

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
