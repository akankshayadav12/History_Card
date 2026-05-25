// src/utils/auth.js
import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const ROLE_KEY = "role";

// Save login info
export const setAuth = ({ token, role }) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days
  Cookies.set(ROLE_KEY, role, { expires: 7 });
};

// Get token
export const getToken = () => Cookies.get(TOKEN_KEY);

// Get role (admin/faculty/student)
export const getRole = () => Cookies.get(ROLE_KEY);

// Clear cookies
export const clearAuth = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
};

// Check if logged in
export const isAuthenticated = () => !!getToken();
