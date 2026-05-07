import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Lock, Save, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../utils/api";

const inputCls = "w-full bg-[#222] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition";
const labelCls = "block text-sm text-gray-400 mb-1.5";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState("info");
  const [info, setInfo] = useState({
    name: user?.name || "", phone: user?.phone || "", avatar: user?.avatar || "",
    street: user?.address?.street || "", city: user?.address?.city || "",
    state: user?.address?.state || "", zipCode: user?.address?.zipCode || "",
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch("/api/users/me/profile", {
        name: info.name, phone: info.phone, avatar: info.avatar,
        address: { street: info.street, city: info.city, state: info.state, zipCode: info.zipCode },
      });
      updateProfile(res.data.user);
      toast.success(t.profile.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally { setLoading(false); }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) return toast.error(t.profile.pwdMismatch);
    setLoading(true);
    try {
      await api.patch("/api/auth/change-password", {
        currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword,
      });
      toast.success(t.profile.changePwdSuccess);
      setPwdForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally { setLoading(false); }
  };

  const tabs = [
    { key: "info", icon: <User size={16} />, label: t.profile.tabInfo },
    { key: "password", icon: <Lock size={16} />, label: t.profile.tabPwd },
  ];

  return (
    <div className="min-h-screen bg-[#121212] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t.profile.title}</h1>
        <div className="flex gap-2 mb-6">
          {tabs.map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === tb.key ? "bg-[#f5b754] text-black" : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800"
              }`}>
              {tb.icon}{tb.label}
            </button>
          ))}
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
          {tab === "info" ? (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-20 h-20 rounded-2xl bg-[#222] border-2 border-[#f5b754]/30 overflow-hidden flex-shrink-0">
                  {info.avatar ? (
                    <img src={info.avatar} alt="avatar" className="w-full h-full object-cover" onError={(e) => e.target.style.display = "none"} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#f5b754] text-3xl font-bold">
                      {info.name?.charAt(0)?.toUpperCase() || <ImageIcon size={28} />}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className={labelCls + " flex items-center gap-1.5"}>
                    <ImageIcon size={13} className="text-[#f5b754]" />{t.profile.avatar}
                  </label>
                  <input
                    className={inputCls}
                    value={info.avatar}
                    placeholder={t.profile.avatarPlaceholder}
                    onChange={(e) => setInfo((p) => ({ ...p, avatar: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>{t.profile.fullName}</label>
                  <input className={inputCls} value={info.name} onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))} /></div>
                <div><label className={labelCls}>{t.profile.phone}</label>
                  <input className={inputCls} value={info.phone} onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))} /></div>
                <div><label className={labelCls}>{t.profile.address}</label>
                  <input className={inputCls} value={info.street} onChange={(e) => setInfo((p) => ({ ...p, street: e.target.value }))} /></div>
                <div><label className={labelCls}>{t.profile.city}</label>
                  <input className={inputCls} value={info.city} onChange={(e) => setInfo((p) => ({ ...p, city: e.target.value }))} /></div>
                <div><label className={labelCls}>{t.profile.state}</label>
                  <input className={inputCls} value={info.state} onChange={(e) => setInfo((p) => ({ ...p, state: e.target.value }))} /></div>
                <div><label className={labelCls}>{t.profile.zipCode}</label>
                  <input className={inputCls} value={info.zipCode} onChange={(e) => setInfo((p) => ({ ...p, zipCode: e.target.value }))} /></div>
              </div>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#f5b754] text-black rounded-xl font-semibold hover:bg-amber-400 transition disabled:opacity-60">
                <Save size={16} />{loading ? t.profile.saving : t.profile.saveBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePwdSubmit} className="space-y-4 max-w-sm">
              {[["currentPassword", t.profile.currentPwd], ["newPassword", t.profile.newPwd], ["confirm", t.profile.confirmPwd]].map(([name, label]) => (
                <div key={name}><label className={labelCls}>{label}</label>
                  <input type="password" className={inputCls} value={pwdForm[name]}
                    onChange={(e) => setPwdForm((p) => ({ ...p, [name]: e.target.value }))} required /></div>
              ))}
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#f5b754] text-black rounded-xl font-semibold hover:bg-amber-400 transition disabled:opacity-60">
                <Save size={16} />{loading ? t.profile.saving : t.profile.changePwdBtn}
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Profile;
