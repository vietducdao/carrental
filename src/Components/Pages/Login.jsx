import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin") {
        logout();
        toast.error(t.auth.adminMustUseAdminLogin || "Tài khoản admin phải đăng nhập qua trang Admin Portal");
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{t.auth.loginTitle}</h1>
          <p className="text-gray-400 mt-2">{t.auth.loginSub}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t.auth.email}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="email@example.com"
                className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} name="password" value={form.password}
                  onChange={handleChange} required placeholder="••••••••"
                  className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition" />
                <button type="button" onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f5b754]">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-black bg-[#f5b754] hover:bg-amber-400 transition disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><LogIn size={18} />{t.auth.loginBtn}</>}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            {t.auth.noAccount}{" "}
            <Link to="/register" className="text-[#f5b754] hover:underline">{t.auth.registerLink}</Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Login;
