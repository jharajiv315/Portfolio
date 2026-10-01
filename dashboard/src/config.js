import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-1qyb.onrender.com";

// Production-grade Axios Interceptor:
// Automatically attach admin JWT token to protected requests from dashboard
axios.interceptors.request.use(
  (config) => {
    const isPublicAuthRoute =
      typeof config.url === "string" &&
      (config.url.includes("/password/forgot") ||
        config.url.includes("/password/reset") ||
        config.url.includes("/login"));

    if (!isPublicAuthRoute) {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);
