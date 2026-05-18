import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Briefcase,
  Plus,
  Trash2,
  X,
  Loader2,
  Edit3,
  Eye,
  EyeOff,
  Home,
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const emptyForm = {
  title: "",
  description: "",
  icon: "",
  order: 0,
  showOnHome: false,
  isActive: true,
};

const ManageServicesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { lang } = useLanguage();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/services");
      setItems(res.data.services || []);
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Tải dữ liệu thất bại" : "Failed to load"));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal("create"); };
  const openEdit = (it) => {
    setForm({
      title: it.title || "",
      description: it.description || "",
      icon: it.icon || "",
      order: it.order || 0,
      showOnHome: !!it.showOnHome,
      isActive: it.isActive !== false,
    });
    setEditId(it._id);
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warning(lang === "vi" ? "Tiêu đề là bắt buộc" : "Title required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description,
        icon: form.icon,
        order: Number(form.order) || 0,
        showOnHome: form.showOnHome,
        isActive: form.isActive,
      };
      if (editId) {
        await api.patch(`/api/services/${editId}`, payload);
        toast.success(lang === "vi" ? "Cập nhật thành công" : "Updated");
      } else {
        await api.post("/api/services", payload);
        toast.success(lang === "vi" ? "Thêm thành công" : "Created");
      }
      closeModal();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Lưu thất bại" : "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === "vi" ? "Xóa dịch vụ này?" : "Delete this service?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/services/${id}`);
      toast.success(lang === "vi" ? "Đã xóa" : "Deleted");
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Xóa thất bại" : "Delete failed"));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (it) => {
    try {
      await api.patch(`/api/services/${it._id}`, { isActive: !it.isActive });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Cập nhật thất bại" : "Update failed"));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-orange-500" size={24} />
            {lang === "vi" ? "Quản lý dịch vụ" : "Manage Services"}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{items.length} {lang === "vi" ? "dịch vụ" : "services"}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-900/30">
          <Plus size={18} /> {lang === "vi" ? "Thêm dịch vụ" : "New Service"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p>{lang === "vi" ? "Chưa có dịch vụ" : "No services yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/40 transition relative">
              {it.showOnHome && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Home size={10} /> {lang === "vi" ? "Trang chủ" : "Home"}
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                {it.icon && <span className="text-3xl">{it.icon}</span>}
                <h3 className="text-white font-bold text-lg flex-1">{it.title}</h3>
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 mb-3">{it.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  onClick={() => toggleActive(it)}
                  className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-semibold ${it.isActive ? "bg-green-900/30 text-green-400" : "bg-gray-700/40 text-gray-400"}`}
                >
                  {it.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                  {it.isActive ? (lang === "vi" ? "Hiện" : "Active") : (lang === "vi" ? "Ẩn" : "Hidden")}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(it)} className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition"><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(it._id)} disabled={deletingId === it._id} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50">
                    {deletingId === it._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-950 border border-white/10 rounded-2xl max-w-md w-full my-8">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editId ? (lang === "vi" ? "Sửa dịch vụ" : "Edit Service") : (lang === "vi" ? "Thêm dịch vụ" : "New Service")}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Tiêu đề" : "Title"} *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Icon (emoji)" : "Icon (emoji)"}</label>
                <input type="text" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="🚗" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Mô tả" : "Description"}</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={5} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Thứ tự" : "Order"}</label>
                <input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.showOnHome} onChange={(e) => setForm((p) => ({ ...p, showOnHome: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-white flex items-center gap-1"><Home size={12} className="text-orange-400" />{lang === "vi" ? "Hiển thị ở trang chủ" : "Show on home page"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-white">{lang === "vi" ? "Hiển thị" : "Active"}</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-400 hover:text-white transition">{lang === "vi" ? "Hủy" : "Cancel"}</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition disabled:opacity-60 flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editId ? (lang === "vi" ? "Cập nhật" : "Update") : (lang === "vi" ? "Tạo" : "Create")}
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

export default ManageServicesPage;
