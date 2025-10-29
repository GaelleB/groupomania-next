import axios from 'axios';

const resolveBaseURL = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname, port } = window.location;
    if (port === '3000' || port === '') {
      return `${protocol}//${hostname}:3001/api`;
    }
    return `${window.location.origin.replace(/\/$/, '')}/api`;
  }

  return 'http://localhost:3001/api';
};

const axiosInstance = axios.create({
  baseURL: resolveBaseURL(),
});

// Intercepteur pour ajouter le token automatiquement
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
