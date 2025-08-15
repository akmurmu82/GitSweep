import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Keep this for cookie fallback
});

// Add request interceptor to include token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Adding token to request:', token.substring(0, 10) + '...');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🚫 Authentication failed, clearing localStorage');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Optionally redirect to login
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;