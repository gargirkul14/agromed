import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agromed_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if on login or register
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        localStorage.removeItem('agromed_token');
        localStorage.removeItem('agromed_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
