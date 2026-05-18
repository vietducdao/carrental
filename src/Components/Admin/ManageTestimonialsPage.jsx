import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Star,
  Plus,
  Trash2,
  X,
  Loader2,
  Edit3,
  Eye,
  EyeOff,
  UploadCloud,
  MessageCircle,
} from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const emptyForm = {
  name: "",
  role: "Customer",
  review: "",
  rating: 5,
  order: 0,
  isActive: true,
  avatar: null,
  avatarPreview: null,
};

const ManageTestimonialsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editAvatar, setEditAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { lang } = useLanguage();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/testimonials");
      setItems(res.data.testimonials || []);
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Tải dữ liệu thất bại" : "Failed to load"));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setEditAvatar(""); setModal("create"); };
  const openEdit = (it) => {
    setForm({
      name: it.name || "",
      role: it.role || "Customer",
      review: it.review || "",
      rating: it.rating || 5,
      order: it.order || 0,
      isActive: it.isActive !== false,
      avatar: null,
      avatarPreview: null,
    });
    setEditId(it._id);
    setEditAvatar(it.avatar || "");
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null); setEditAvatar(""); };

  const handleImage = (file) => {
    if (!file) return;
    setForm((p) => ({ ...p, avatar: file, avatarPreview: URL.createObjectURL(file) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      toast.warning(lang === "vi" ? "Tên và nội dung là bắt buộc" : "Name and review required");
      return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("role", form.role);
      fd.append("review", form.review.trim());
      fd.append("rating", String(form.rating));
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));
      if (form.avatar) fd.append("avatar", form.avatar);

      if (editId) {
        await api.patch(`/api/testimonials/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success(lang === "vi" ? "Cập nhật thành công" : "Updated");
      } else {
        await api.post("/api/testimonials", fd, { headers: { "Content-Type": "multipart/form-data" } });
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
    if (!window.confirm(lang === "vi" ? "Xóa đánh giá này?" : "Delete this testimonial?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/testimonials/${id}`);
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
      await api.patch(`/api/testimonials/${it._id}`, { isActive: !it.isActive });
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
            <MessageCircle className="text-orange-500" size={24} />
            {lang === "vi" ? "Quản lý đánh giá khách hàng" : "Manage Testimonials"}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{items.length} {lang === "vi" ? "đánh giá" : "testimonials"}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-900/30">
          <Plus size={18} /> {lang === "vi" ? "Thêm đánh giá" : "New Testimonial"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p>{lang === "vi" ? "Chưa có đánh giá nào" : "No testimonials yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/40 transition">
              <div className="flex items-center gap-3 mb-3">
                {it.avatar ? (
                  <img src={`${BASE_URL}/uploads/${it.avatar}`} alt={it.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold">
                    {it.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{it.name}</h3>
                  <p className="text-xs text-gray-400">{it.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < it.rating ? "text-[#f5b754] fill-[#f5b754]" : "text-gray-600"} />
                ))}
              </div>
              <p className="text-sm text-gray-300 line-clamp-3 mb-3">{it.review}</p>
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
                {editId ? (lang === "vi" ? "Sửa đánh giá" : "Edit Testimonial") : (lang === "vi" ? "Thêm đánh giá" : "New Testimonial")}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "vi" ? "Ảnh đại diện" : "Avatar"}</label>
                <label className="block w-24 h-24 rounded-full border-2 border-dashed border-white/10 hover:border-orange-500/40 cursor-pointer overflow-hidden bg-white/5 relative mx-auto">
                  {form.avatarPreview ? (
                    <img src={form.avatarPreview} alt="" className="w-full h-full object-cover" />
                  ) : editAvatar ? (
                    <img src={`${BASE_URL}/uploads/${editAvatar}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <UploadCloud size={24} />
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Tên khách hàng" : "Name"} *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Vai trò / nghề nghiệp" : "Role"}</label>
                <input type="text" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Customer" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Nội dung đánh giá" : "Review"} *</label>
                <textarea value={form.review} onChange={(e) => setForm((p) => ({ ...p, review: e.target.value }))} rows={4} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Số sao" : "Rating"}</label>
                  <div className="flex gap-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button key={r} type="button" onClick={() => setForm((p) => ({ ...p, rating: r }))}>
                        <Star size={20} className={r <= form.rating ? "text-[#f5b754] fill-[#f5b754]" : "text-gray-600 hover:text-[#f5b754]/60"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Thứ tự" : "Order"}</label>
                  <input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-white">{lang === "vi" ? "Hiển thị trên trang chủ" : "Show on home page"}</span>
              </label>

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

export default ManageTestimonialsPage;
