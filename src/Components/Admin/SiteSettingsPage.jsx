import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Settings,
  Save,
  Loader2,
  Building2,
  Layers,
  Info as InfoIcon,
  Layout,
  Share2,
  Map as MapIcon,
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const initial = {
  companyName: "",
  email: "",
  phone: "",
  address: "",
  hours: "",
  heroPremium: "",
  heroTitle: "",
  heroSubtitle: "",
  heroDesc: "",
  aboutTitle1: "",
  aboutTitle2: "",
  aboutDesc: "",
  aboutFeature1: "",
  aboutFeature2: "",
  footerTagline: "",
  copyright: "",
  mapEmbedSrc: "",
  socials: { facebook: "", twitter: "", instagram: "", tiktok: "", messenger: "", zalo: "" },
};

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
    <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
      <Icon size={16} className="text-orange-500" />
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
);

const SiteSettingsPage = () => {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    api.get("/api/site-settings")
      .then((r) => setData({ ...initial, ...r.data.settings, socials: { ...initial.socials, ...(r.data.settings?.socials || {}) } }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setField = (key, value) => setData((p) => ({ ...p, [key]: value }));
  const setSocial = (key, value) => setData((p) => ({ ...p, socials: { ...p.socials, [key]: value } }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch("/api/site-settings", data);
      toast.success(lang === "vi" ? "Đã lưu thiết lập" : "Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Lưu thất bại" : "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className={styles.pageContainer}>
      <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
    </div>
  );

  const inputCls = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500";

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSave}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="text-orange-500" size={24} />
              {lang === "vi" ? "Thiết lập website" : "Site Settings"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{lang === "vi" ? "Thông tin chung hiển thị trên các trang user" : "Global info shown on user pages"}</p>
          </div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-900/30 disabled:opacity-60">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {lang === "vi" ? "Lưu thay đổi" : "Save changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Section icon={Building2} title={lang === "vi" ? "Thông tin công ty" : "Company Info"}>
            <Field label={lang === "vi" ? "Tên công ty" : "Company name"}>
              <input type="text" value={data.companyName} onChange={(e) => setField("companyName", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} className={inputCls} />
            </Field>
            <Field label={lang === "vi" ? "Số điện thoại" : "Phone"}>
              <input type="text" value={data.phone} onChange={(e) => setField("phone", e.target.value)} className={inputCls} />
            </Field>
            <Field label={lang === "vi" ? "Địa chỉ" : "Address"}>
              <input type="text" value={data.address} onChange={(e) => setField("address", e.target.value)} className={inputCls} />
            </Field>
            <Field label={lang === "vi" ? "Giờ làm việc" : "Working hours"}>
              <input type="text" value={data.hours} onChange={(e) => setField("hours", e.target.value)} className={inputCls} />
            </Field>
          </Section>

          <Section icon={Layers} title={lang === "vi" ? "Hero (Trang chủ)" : "Hero (Home)"}>
            <Field label={lang === "vi" ? "Subtitle nhỏ" : "Premium tag"}>
              <input type="text" value={data.heroPremium} onChange={(e) => setField("heroPremium", e.target.value)} className={inputCls} />
            </Field>
            <Field label={lang === "vi" ? "Tiêu đề lớn" : "Title"}>
              <input type="text" value={data.heroTitle} onChange={(e) => setField("heroTitle", e.target.value)} className={inputCls} />
            </Field>
            <Field label={lang === "vi" ? "Phụ đề" : "Subtitle"}>
              <input type="text" value={data.heroSubtitle} onChange={(e) => setField("heroSubtitle", e.target.value)} className={inputCls} />
            </Field>
            <Field label={lang === "vi" ? "Mô tả" : "Description"}>
              <textarea value={data.heroDesc} onChange={(e) => setField("heroDesc", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </Field>
          </Section>

          <Section icon={InfoIcon} title={lang === "vi" ? "Phần Giới thiệu (About)" : "About Section"}>
            <div className="grid grid-cols-2 gap-3">
              <Field label={lang === "vi" ? "Tiêu đề 1" : "Title 1"}>
                <input type="text" value={data.aboutTitle1} onChange={(e) => setField("aboutTitle1", e.target.value)} className={inputCls} />
              </Field>
              <Field label={lang === "vi" ? "Tiêu đề 2 (highlight)" : "Title 2 (highlight)"}>
                <input type="text" value={data.aboutTitle2} onChange={(e) => setField("aboutTitle2", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label={lang === "vi" ? "Mô tả" : "Description"}>
              <textarea value={data.aboutDesc} onChange={(e) => setField("aboutDesc", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={lang === "vi" ? "Điểm nổi bật 1" : "Feature 1"}>
                <input type="text" value={data.aboutFeature1} onChange={(e) => setField("aboutFeature1", e.target.value)} className={inputCls} />
              </Field>
              <Field label={lang === "vi" ? "Điểm nổi bật 2" : "Feature 2"}>
                <input type="text" value={data.aboutFeature2} onChange={(e) => setField("aboutFeature2", e.target.value)} className={inputCls} />
              </Field>
            </div>
          </Section>

          <Section icon={Layout} title={lang === "vi" ? "Footer" : "Footer"}>
            <Field label={lang === "vi" ? "Slogan ngắn" : "Tagline"}>
              <textarea value={data.footerTagline} onChange={(e) => setField("footerTagline", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Copyright">
              <input type="text" value={data.copyright} onChange={(e) => setField("copyright", e.target.value)} placeholder="All rights reserved." className={inputCls} />
            </Field>
          </Section>

          <Section icon={Share2} title={lang === "vi" ? "Mạng xã hội" : "Social Links"}>
            <div className="grid grid-cols-2 gap-3">
              {["facebook", "twitter", "instagram", "tiktok", "messenger", "zalo"].map((k) => (
                <Field key={k} label={k}>
                  <input type="text" value={data.socials[k] || ""} onChange={(e) => setSocial(k, e.target.value)} placeholder={`https://${k}.com/...`} className={inputCls} />
                </Field>
              ))}
            </div>
          </Section>

          <Section icon={MapIcon} title={lang === "vi" ? "Bản đồ liên hệ" : "Contact Map"}>
            <Field label={lang === "vi" ? "Google Maps Embed URL (chỉ phần src)" : "Google Maps Embed URL (src only)"}>
              <textarea value={data.mapEmbedSrc} onChange={(e) => setField("mapEmbedSrc", e.target.value)} rows={3} placeholder="https://www.google.com/maps/embed?pb=..." className={`${inputCls} resize-none font-mono text-xs`} />
            </Field>
            <p className="text-[11px] text-gray-500">{lang === "vi" ? "Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → copy giá trị thuộc tính src của iframe" : "From Google Maps → Share → Embed a map → copy iframe src value"}</p>
          </Section>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-900/30 disabled:opacity-60">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {lang === "vi" ? "Lưu thay đổi" : "Save changes"}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default SiteSettingsPage;
