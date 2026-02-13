import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // optional: prevent hanging requests
});

// Request interceptor: attach token if available
instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      console.warn("Unable to access localStorage for token.");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle global errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API response error:", error?.response || error);
    // Optional: handle 401 globally
    if (error.response?.status === 401) {
      // e.g., auto-logout or redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default instance;