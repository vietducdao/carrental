import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, LogIn, Car } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);

      if (user.role !== "admin") {
        toast.error("Bạn không có quyền truy cập vào khu vực này.", { theme: "dark" });
        return;
      }

      toast.success("Đăng nhập thành công!", { theme: "dark" });
      setTimeout(() => navigate("/admin"), 800);
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message || "Đăng nhập thất bại";
      toast.error(msg, { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-orange-600 to-orange-800 blur-3xl opacity-10" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 blur-3xl opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rotate-45 bg-gradient-to-r from-orange-500 to-amber-500 blur-xl opacity-10" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg shadow-orange-900/40 mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Portal
            </span>
          </h1>
          <p className="mt-2 text-gray-400 text-sm">
            Đăng nhập để quản lý hệ thống
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl border border-gray-700 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="glass-input w-full px-4 py-3 pr-12 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-xs text-gray-500">
              Car Rental Admin Dashboard &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default AdminLogin;
