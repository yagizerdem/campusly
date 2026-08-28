import axios from "axios";

const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  validateStatus: (statusCode) => statusCode >= 200 && statusCode < 300,
});

export default axiosWrapper;
