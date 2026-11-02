import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bsh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear and optionally redirect
      if (window.location.pathname.startsWith('/admin') ||
          window.location.pathname.startsWith('/doctor') ||
          window.location.pathname.startsWith('/pharmacist') ||
          window.location.pathname.startsWith('/supplier') ||
          window.location.pathname.startsWith('/receptionist') ||
          window.location.pathname.startsWith('/patient')) {
        // Only redirect if on protected route
        localStorage.removeItem('bsh_token');
        localStorage.removeItem('bsh_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
