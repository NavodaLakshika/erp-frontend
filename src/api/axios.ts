import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // IMPORTANT
});

/**
 * Request Interceptor
 * Attach token ONLY if it exists
 * (Login API will not send token)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // DO NOT attach token for login
    if (token && !config.url?.includes("/api/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle global errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
