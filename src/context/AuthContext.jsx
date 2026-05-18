import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children, scope = "user" }) => {
  const tokenKey = `${scope}_token`;
  const userKey = `${scope}_user`;

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(userKey)); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";

  // Validate token on mount (per scope)
  useEffect(() => {
    const validate = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
        localStorage.setItem(userKey, JSON.stringify(res.data.user));
      } catch {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem(tokenKey, t);
    localStorage.setItem(userKey, JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  }, [tokenKey, userKey]);

  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setToken(null);
    setUser(null);
  }, [tokenKey, userKey]);

  const register = useCallback(async (data) => {
    const res = await api.post("/api/auth/register", data);
    const { token: t, user: u } = res.data;
    localStorage.setItem(tokenKey, t);
    localStorage.setItem(userKey, JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  }, [tokenKey, userKey]);

  const updateProfile = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
  }, [userKey]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, scope, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
