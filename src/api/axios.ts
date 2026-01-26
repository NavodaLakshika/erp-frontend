import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite proxy will forward to your Railway backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // no cookies needed
});

// Attach Authorization token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
