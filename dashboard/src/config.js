import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-1qyb.onrender.com";

// Production-grade Axios Interceptor:
// Automatically attach admin JWT token to all requests from dashboard
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);
