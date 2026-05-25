
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hcr-1.onrender.com',
  withCredentials: true,
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// export const loginUser = async (email, password) => {
//   const res = await api.post("/auth/login", { email, password });
//   localStorage.setItem("token", res.data.token);
//   localStorage.setItem("role", res.data.user.role); // store role
//   return res.data; // return user data if needed
// };
export default api;
