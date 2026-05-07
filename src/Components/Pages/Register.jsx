import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error(t.auth.pwdMismatch);
    if (form.password.length < 6) return toast.error(t.auth.pwdTooShort);
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success(t.auth.registerSuccess);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: t.auth.fullName, type: "text", placeholder: "Nguyễn Văn A" },
    { name: "email", label: t.auth.email, type: "email", placeholder: "email@example.com" },
    { name: "phone", label: t.auth.phone, type: "tel", placeholder: "0901234567" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{t.auth.registerTitle}</h1>
          <p className="text-gray-400 mt-2">{t.auth.registerSub}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                  required={f.name !== "phone"} placeholder={f.placeholder}
                  className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition" />
              </div>
            ))}
            {["password", "confirm"].map((name) => (
              <div key={name}>
                <label className="block text-sm text-gray-400 mb-1.5">
                  {name === "password" ? t.auth.password : t.auth.confirmPwd}
                </label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} name={name} value={form[name]}
                    onChange={handleChange} required placeholder="••••••••"
                    className="w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition" />
                  {name === "password" && (
                    <button type="button" onClick={() => setShowPwd((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f5b754]">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl font-semibold text-black bg-[#f5b754] hover:bg-amber-400 transition disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><UserPlus size={18} />{t.auth.registerBtn}</>}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            {t.auth.hasAccount}{" "}
            <Link to="/login" className="text-[#f5b754] hover:underline">{t.auth.loginLink}</Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Register;
