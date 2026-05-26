

import axios from 'axios';

const api = axios.create({
  // Add /api to the end of both the environment variable and the fallback string
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
