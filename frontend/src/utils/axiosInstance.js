import axios from "axios";

const axiosInstance = axios.create({
 baseURL: "https://jobportal-oc40.onrender.com/api",
 
  withCredentials: true, 
});

export default axiosInstance;

