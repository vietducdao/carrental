import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FileText,
  Plus,
  Trash2,
  X,
  Search,
  Loader2,
  Edit3,
  Image as ImageIcon,
  Eye,
  EyeOff,
  UploadCloud,
} from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "Admin",
  category: "News",
  tags: "",
  isPublished: true,
  image: null,
  imagePreview: null,
};

const ManageBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { lang } = useLanguage();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/blog?limit=100");
      setPosts(res.data.posts || []);
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Tải bài viết thất bại" : "Failed to load posts"));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setEditImage("");
    setModal("create");
  };

  const openEdit = (post) => {
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "Admin",
      category: post.category || "News",
      tags: (post.tags || []).join(", "),
      isPublished: post.isPublished !== false,
      image: null,
      imagePreview: null,
    });
    setEditId(post._id);
    setEditImage(post.image || "");
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setEditId(null);
    setEditImage("");
  };

  const handleImage = (file) => {
    if (!file) return;
    setForm((p) => ({ ...p, image: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warning(lang === "vi" ? "Tiêu đề là bắt buộc" : "Title is required");
      return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("author", form.author);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("isPublished", String(form.isPublished));
      if (form.image) fd.append("image", form.image);

      if (editId) {
        await api.patch(`/api/blog/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success(lang === "vi" ? "Cập nhật thành công" : "Updated");
      } else {
        await api.post("/api/blog", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success(lang === "vi" ? "Thêm bài viết thành công" : "Post created");
      }
      closeModal();
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Lưu thất bại" : "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === "vi" ? "Xóa bài viết này?" : "Delete this post?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/blog/${id}`);
      toast.success(lang === "vi" ? "Đã xóa" : "Deleted");
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Xóa thất bại" : "Delete failed"));
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (post) => {
    try {
      await api.patch(`/api/blog/${post._id}`, { isPublished: !post.isPublished });
      fetchPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Cập nhật thất bại" : "Update failed"));
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-orange-500" size={24} />
            {lang === "vi" ? "Quản lý Blog" : "Manage Blog"}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{posts.length} {lang === "vi" ? "bài viết" : "posts"}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-amber-500 transition shadow-lg shadow-orange-900/30">
          <Plus size={18} /> {lang === "vi" ? "Thêm bài viết" : "New Post"}
        </button>
      </div>

      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === "vi" ? "Tìm theo tiêu đề..." : "Search by title..."}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p>{lang === "vi" ? "Chưa có bài viết nào" : "No posts yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <div key={post._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/40 transition">
              {post.image ? (
                <img src={`${BASE_URL}/uploads/${post.image}`} alt={post.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-white/5 flex items-center justify-center text-gray-600">
                  <ImageIcon size={32} />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                  <span>{post.category}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <h3 className="text-white font-semibold text-base line-clamp-2 mb-2">{post.title}</h3>
                {post.excerpt && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <button
                    onClick={() => togglePublish(post)}
                    className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-semibold ${post.isPublished ? "bg-green-900/30 text-green-400" : "bg-gray-700/40 text-gray-400"}`}
                  >
                    {post.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                    {post.isPublished ? (lang === "vi" ? "Hiển thị" : "Published") : (lang === "vi" ? "Ẩn" : "Hidden")}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(post)} className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition" title={lang === "vi" ? "Sửa" : "Edit"}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(post._id)} disabled={deletingId === post._id} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50" title={lang === "vi" ? "Xóa" : "Delete"}>
                      {deletingId === post._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-950 border border-white/10 rounded-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editId ? (lang === "vi" ? "Sửa bài viết" : "Edit Post") : (lang === "vi" ? "Thêm bài viết" : "New Post")}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{lang === "vi" ? "Ảnh bìa" : "Cover Image"}</label>
                <label className="block w-full aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-orange-500/40 cursor-pointer overflow-hidden bg-white/5 relative">
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

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Tiêu đề" : "Title"} *</label>
                <input
                  type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Tóm tắt" : "Excerpt"}</label>
                <textarea
                  value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Nội dung" : "Content"}</label>
                <textarea
                  value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Tác giả" : "Author"}</label>
                  <input
                    type="text" value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Danh mục" : "Category"}</label>
                  <input
                    type="text" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === "vi" ? "Tags (phân cách bằng dấu phẩy)" : "Tags (comma-separated)"}</label>
                <input
                  type="text" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="rental, luxury, tips"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={form.isPublished}
                  onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm text-white">{lang === "vi" ? "Hiển thị bài viết" : "Publish post"}</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-400 hover:text-white transition">
                  {lang === "vi" ? "Hủy" : "Cancel"}
                </button>
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

export default ManageBlogPage;
