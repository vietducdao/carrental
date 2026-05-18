import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Users,
  Plus,
  Trash2,
  X,
  Loader2,
  Edit3,
  Eye,
  EyeOff,
  UploadCloud,
  Crown,
  Mail,
} from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const emptyForm = {
  name: "",
  role: "Staff",
  department: "",
  email: "",
  bio: "",
  education: "",
  achievement: "",
  facebook: "",
  twitter: "",
  instagram: "",
  tiktok: "",
  order: 0,
  isFeatured: false,
  isActive: true,
  image: null,
  imagePreview: null,
};

const ManageTeamPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { lang } = useLanguage();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/team");
      setItems(res.data.members || []);
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Tải dữ liệu thất bại" : "Failed to load"));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setEditImage(""); setModal("create"); };
  const openEdit = (it) => {
    setForm({
      name: it.name || "",
      role: it.role || "Staff",
      department: it.department || "",
      email: it.email || "",
      bio: it.bio || "",
      education: it.education || "",
      achievement: it.achievement || "",
      facebook: it.socials?.facebook || "",
      twitter: it.socials?.twitter || "",
      instagram: it.socials?.instagram || "",
      tiktok: it.socials?.tiktok || "",
      order: it.order || 0,
      isFeatured: !!it.isFeatured,
      isActive: it.isActive !== false,
      image: null,
      imagePreview: null,
    });
    setEditId(it._id);
    setEditImage(it.image || "");
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null); setEditImage(""); };

  const handleImage = (file) => {
    if (!file) return;
    setForm((p) => ({ ...p, image: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning(lang === "vi" ? "Tên là bắt buộc" : "Name required");
      return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      ["name", "role", "department", "email", "bio", "education", "achievement", "facebook", "twitter", "instagram", "tiktok"].forEach((k) => fd.append(k, form[k] || ""));
      fd.append("order", String(form.order || 0));
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isActive", String(form.isActive));
      if (form.image) fd.append("image", form.image);

      if (editId) {
        await api.patch(`/api/team/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success(lang === "vi" ? "Cập nhật thành công" : "Updated");
      } else {
        await api.post("/api/team", fd, { headers: { "Content-Type": "multipart/form-data" } });
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
    if (!window.confirm(lang === "vi" ? "Xóa thành viên này?" : "Delete this member?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/team/${id}`);
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
      await api.patch(`/api/team/${it._id}`, { isActive: !it.isActive });
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
            <Users className="text-orange-500" size={24} />
            {lang === "vi" ? "Quản lý đội ngũ" : "Manage Team"}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{items.length} {lang === "vi" ? "thành viên" : "members"}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-900/30">
          <Plus size={18} /> {lang === "vi" ? "Thêm thành viên" : "New Member"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>{lang === "vi" ? "Chưa có thành viên" : "No members yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/40 transition relative">
              {it.isFeatured && (
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#f5b754] text-black text-[10px] font-bold rounded-full flex items-center gap-1">
                  <Crown size={10} /> {lang === "vi" ? "Nổi bật" : "Featured"}
                </span>
              )}
              {it.image ? (
                <img src={`${BASE_URL}/uploads/${it.image}`} alt={it.name} className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-600">
                  <Users size={40} />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-white font-bold truncate">{it.name}</h3>
                <p className="text-xs text-orange-400 mt-0.5">{it.role}</p>
                {it.department && <p className="text-[11px] text-gray-500 mt-0.5">{it.department}</p>}
                {it.email && (
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1"><Mail size={11} /> {it.email}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
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
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-950 border border-white/10 rounded-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editId ? (lang === "vi" ? "Sửa thành viên" : "Edit Member") : (lang === "vi" ? "Thêm thành viên" : "New Member")}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "vi" ? "Ảnh đại diện" : "Photo"}</label>
                <label className="block w-full aspect-[4/3] rounded-xl border-2 border-dashed border-white/10 hover:border-orange-500/40 cursor-pointer overflow-hidden bg-white/5 relative">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="" className="w-full h-full object-cover" />
                  ) : editImage ? (
                    <img src={`${BASE_URL}/uploads/${editImage}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <UploadCloud size={32} className="mb-2" />
                      <span className="text-xs">{lang === "vi" ? "Click để chọn ảnh" : "Click to upload"}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Họ tên" : "Name"} *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Chức vụ" : "Role"}</label>
                  <input type="text" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Phòng ban" : "Department"}</label>
                  <input type="text" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Giới thiệu / Bio" : "Bio"}</label>
                <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Học vấn" : "Education"}</label>
                  <textarea value={form.education} onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))} rows={2} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Thành tích" : "Achievement"}</label>
                  <textarea value={form.achievement} onChange={(e) => setForm((p) => ({ ...p, achievement: e.target.value }))} rows={2} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "vi" ? "Mạng xã hội" : "Social Links"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {["facebook", "twitter", "instagram", "tiktok"].map((k) => (
                    <input
                      key={k}
                      type="text" placeholder={k}
                      value={form[k]}
                      onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500 text-sm"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Thứ tự" : "Order"}</label>
                  <input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex flex-col gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                    <span className="text-sm text-white flex items-center gap-1"><Crown size={12} className="text-orange-400" />{lang === "vi" ? "Nổi bật" : "Featured"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                    <span className="text-sm text-white">{lang === "vi" ? "Hiển thị" : "Active"}</span>
                  </label>
                </div>
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

export default ManageTeamPage;
