import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RequireAdminAuth = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
    </div>
  );

  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default RequireAdminAuth;
