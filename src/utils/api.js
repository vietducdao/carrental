import axios from "axios";

export const BASE_URL = "http://localhost:5000";

// Scope helpers — admin and user have fully separate sessions in localStorage
export const getScope = () =>
  window.location.pathname.startsWith("/admin") ? "admin" : "user";
export const tokenKey = (scope = getScope()) => `${scope}_token`;
export const userKey = (scope = getScope()) => `${scope}_user`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

// Attach JWT for the current scope on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey());
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear only the current scope's session
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const scope = getScope();
      localStorage.removeItem(tokenKey(scope));
      localStorage.removeItem(userKey(scope));
      window.location.href = scope === "admin" ? "/admin/login" : "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
