import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Tag,
  Plus,
  Trash2,
  X,
  Search,
  Loader2,
  Edit3,
  Layers,
  CheckCircle2,
  EyeOff,
  Car as CarIcon,
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const emptyForm = { name: "", description: "", icon: "" };

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { lang, t } = useLanguage();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/categories");
      const raw = Array.isArray(res.data)
        ? res.data
        : res.data?.categories || res.data?.data || [];
      setCategories(raw);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.loadingError);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setModal("create");
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || "", icon: cat.icon || "" });
    setEditId(cat._id);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning(lang === "vi" ? "Tên danh mục là bắt buộc" : "Category name is required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description || "",
        icon: form.icon || "",
      };
      if (modal === "create") {
        const res = await api.post("/api/categories", payload);
        const created = res.data?.category || res.data;
        if (created?._id) {
          setCategories((prev) => [...prev, { ...created, carCount: 0 }]);
        } else {
          await fetchCategories();
        }
      } else {
        const res = await api.patch(`/api/categories/${editId}`, payload);
        const updated = res.data?.category || res.data;
        if (updated?._id) {
          setCategories((prev) => prev.map((c) => (c._id === editId ? { ...c, ...updated } : c)));
        } else {
          await fetchCategories();
        }
      }
      toast.success(t.admin.common.saveSuccess);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    const carCount = cat.carCount ?? 0;
    let confirmMsg = t.admin.categories.modal.deleteConfirm;
    if (carCount > 0) {
      const warning = t.admin.categories.modal.deleteWithCarsWarning.replace("{n}", carCount);
      confirmMsg = `${warning}\n\n${confirmMsg}`;
    }
    if (!window.confirm(confirmMsg)) return;
    try {
      setDeletingId(cat._id);
      await api.delete(`/api/categories/${cat._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const stats = useMemo(() => ({
    total: categories.length,
    active: categories.filter((c) => c.isActive !== false).length,
    hidden: categories.filter((c) => c.isActive === false).length,
    cars: categories.reduce((sum, c) => sum + (c.carCount || 0), 0),
  }), [categories]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Layers size={22} />} label={t.admin.categories.stats.total} value={stats.total} tone="orange" />
        <StatCard icon={<CheckCircle2 size={22} />} label={t.admin.categories.stats.active} value={stats.active} tone="green" />
        <StatCard icon={<EyeOff size={22} />} label={t.admin.categories.stats.hidden} value={stats.hidden} tone="red" />
        <StatCard icon={<CarIcon size={22} />} label={t.admin.categories.stats.carsTagged} value={stats.cars} tone="blue" />
      </div>

      <div className={`${styles.glassDark} p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center`}>
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder={t.admin.common.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={openCreate}
          className={styles.buttonPrimary + " px-6 flex items-center gap-2 justify-center font-bold tracking-wider whitespace-nowrap"}
        >
          <Plus size={18} /> {t.admin.categories.addBtn}
        </button>
      </div>

      {loading ? (
        <div className={`${styles.glassDark} flex justify-center py-20 rounded-2xl border border-white/5`}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${styles.glassDark} text-center py-20 rounded-2xl border border-white/5`}>
          <Tag className="mx-auto text-gray-700 mb-4 opacity-20" size={64} />
          <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">{t.admin.common.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className={`${styles.glassDark} rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-orange-500/30 border border-white/5 flex flex-col`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 text-3xl shadow-inner border border-orange-500/10">
                  {cat.icon || <Tag size={22} />}
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                    cat.isActive !== false
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                  }`}
                >
                  {cat.isActive !== false ? t.admin.common.active : t.admin.common.inactive}
                </span>
              </div>

              <h3 className="text-white font-black text-lg tracking-tight uppercase mb-1">{cat.name}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                <CarIcon size={11} className="text-orange-500/70" /> {cat.carCount ?? 0} {t.admin.cars.stats.unit}
              </p>

              {cat.description && (
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 flex-1 italic leading-relaxed">"{cat.description}"</p>
              )}

              <div className="flex gap-2 pt-4 border-t border-white/5 mt-auto">
                <button
                  onClick={() => openEdit(cat)}
                  disabled={deletingId === cat._id}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition text-xs font-bold uppercase tracking-widest border border-white/5 hover:border-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={12} /> {t.admin.common.edit}
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  disabled={deletingId === cat._id}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs font-bold uppercase tracking-widest border border-red-500/10 hover:border-red-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {deletingId === cat._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  {t.admin.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.glassDark} rounded-3xl shadow-2xl w-full max-w-lg border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300`}>
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                  {modal === "create" ? <Plus size={18} /> : <Edit3 size={18} />}
                </div>
                {modal === "create" ? t.admin.categories.modal.create : t.admin.categories.modal.edit}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <Field label={t.admin.categories.modal.name} required>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className={styles.inputField}
                  placeholder={lang === "vi" ? "vd: SUV" : "e.g., SUV"}
                />
              </Field>
              <Field label={t.admin.categories.modal.icon} hint={lang === "vi" ? "Một emoji hoặc ký tự (vd: 🚙)" : "An emoji or character (e.g., 🚙)"}>
                <input
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="🚗"
                  maxLength={4}
                  className={styles.inputField + " text-2xl text-center"}
                />
              </Field>
              <Field label={t.admin.categories.modal.desc}>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className={styles.inputField + " resize-none"}
                  placeholder={lang === "vi" ? "Mô tả ngắn về phân khúc này..." : "Brief description of this segment..."}
                />
              </Field>
              <div className="flex gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className={styles.buttonSecondary + " flex-1 disabled:opacity-50"}
                >
                  {t.admin.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={styles.buttonPrimary + " flex-1 disabled:opacity-50 flex items-center justify-center gap-2"}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {modal === "create" ? t.admin.common.create : t.admin.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

const StatCard = ({ icon, label, value, tone }) => {
  const toneMap = {
    orange: "bg-orange-500/20 text-orange-500",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
  };
  return (
    <div className={`${styles.glassDark} p-5 rounded-2xl flex items-center gap-4 border border-white/5 shadow-xl`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${toneMap[tone] || toneMap.orange}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
};

const Field = ({ label, required, hint, children }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
      {label}{required && <span className="text-orange-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-600 font-mono">{hint}</p>}
  </div>
);

export default ManageCategoriesPage;
