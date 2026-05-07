import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default RequireAuth;
