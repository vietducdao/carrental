import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Shield,
  ShieldOff,
  ShieldCheck,
  Edit2,
  X,
  Filter,
  ChevronDown,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  Mail,
  User as UserIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { styles } from "../../assets/adminStyles";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Pagination from "./Pagination";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "customer",
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(initialForm);
  const [showPwd, setShowPwd] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { lang, t } = useLanguage();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;
  const isSelf = (id) => id && currentUserId && String(id) === String(currentUserId);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users", { params: { limit: 1000 } });
      const raw = Array.isArray(res.data) ? res.data : (res.data.data || res.data.users || []);
      setUsers(raw);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.loadingError);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDeleteUser = async (id) => {
    if (isSelf(id)) {
      toast.warning(t.admin.users.modal.selfActionDisabled);
      return;
    }
    if (!window.confirm(t.admin.users.modal.deleteConfirm)) return;
    try {
      setSavingId(id);
      await api.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleRole = async (user) => {
    if (isSelf(user._id)) {
      toast.warning(t.admin.users.modal.selfActionDisabled);
      return;
    }
    const newRole = user.role === "admin" ? "customer" : "admin";
    try {
      setSavingId(user._id);
      const res = await api.patch(`/api/users/${user._id}`, { role: newRole });
      const updated = res.data?.user;
      setUsers(prev => prev.map(u => u._id === user._id ? (updated || { ...u, role: newRole }) : u));
      toast.success(`${t.admin.common.saveSuccess} (${t.admin.users.roles[newRole]})`);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (user) => {
    if (isSelf(user._id)) {
      toast.warning(t.admin.users.modal.selfActionDisabled);
      return;
    }
    try {
      setSavingId(user._id);
      const res = await api.patch(`/api/users/${user._id}`, { isActive: !user.isActive });
      const updated = res.data?.user;
      setUsers(prev => prev.map(u => u._id === user._id ? (updated || { ...u, isActive: !u.isActive }) : u));
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim()) {
      toast.warning(lang === "vi" ? "Vui lòng nhập tên và email" : "Name and email are required");
      return;
    }
    if (addForm.password.length < 6) {
      toast.warning(t.admin.users.modal.passwordHint);
      return;
    }
    try {
      setIsCreating(true);
      const res = await api.post("/api/users", addForm);
      const created = res.data?.user;
      if (created) setUsers(prev => [created, ...prev]);
      else await fetchUsers();
      setShowAddModal(false);
      setAddForm(initialForm);
      setShowPwd(false);
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser?._id) return;
    if (!editingUser.name?.trim() || !editingUser.email?.trim()) {
      toast.warning(lang === "vi" ? "Tên và email là bắt buộc" : "Name and email are required");
      return;
    }
    try {
      setIsUpdating(true);
      const payload = {
        name: editingUser.name.trim(),
        email: editingUser.email.trim(),
        phone: editingUser.phone || "",
      };
      if (!isSelf(editingUser._id)) {
        payload.role = editingUser.role;
        payload.isActive = editingUser.isActive;
      }
      const res = await api.patch(`/api/users/${editingUser._id}`, payload);
      const updated = res.data?.user;
      setUsers(prev => prev.map(u => u._id === editingUser._id ? (updated || { ...u, ...editingUser }) : u));
      setEditingUser(null);
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter(u => {
      const matchesSearch = !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, pageSize]);

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredUsers, currentPage, pageSize]
  );

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: users.length,
      admins: users.filter(u => u.role === "admin").length,
      customers: users.filter(u => u.role === "customer").length,
      newThisWeek: users.filter(u => new Date(u.createdAt).getTime() > weekAgo).length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users size={22} />} label={t.admin.users.stats.total} value={stats.total} tone="orange" />
        <StatCard icon={<ShieldCheck size={22} />} label={t.admin.users.stats.privilege} value={stats.admins} tone="blue" />
        <StatCard icon={<UserIcon size={22} />} label={t.admin.users.stats.customers} value={stats.customers} tone="green" />
        <StatCard icon={<UserPlus size={22} />} label={t.admin.users.stats.acquisition} value={`+${stats.newThisWeek}`} tone="amber" />
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
        <div className="relative w-full md:w-56">
          <Filter size={16} className="absolute left-3 top-3.5 text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:border-orange-500 appearance-none transition-all cursor-pointer"
          >
            <option value="all" className="bg-gray-900">{t.admin.users.filters.allRoles}</option>
            <option value="admin" className="bg-gray-900">{t.admin.users.filters.admin}</option>
            <option value="customer" className="bg-gray-900">{t.admin.users.filters.customer}</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
        </div>
        <button
          onClick={() => { setAddForm(initialForm); setShowPwd(false); setShowAddModal(true); }}
          className={styles.buttonPrimary + " px-6 flex items-center gap-2 justify-center font-bold tracking-wider whitespace-nowrap"}
        >
          <UserPlus size={16} /> {t.admin.users.modal.addTitle}
        </button>
      </div>

      <div className={`${styles.glassDark} rounded-2xl overflow-hidden shadow-2xl border border-white/5`}>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t.admin.common.noResults}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className={styles.tableHeader}>{t.admin.users.table.identity}</th>
                  <th className={styles.tableHeader}>{t.admin.users.table.contact}</th>
                  <th className={styles.tableHeader}>{t.admin.users.table.role}</th>
                  <th className={styles.tableHeader}>{t.admin.common.status}</th>
                  <th className={styles.tableHeader}>{t.admin.users.table.joined}</th>
                  <th className={`${styles.tableHeader} text-right pr-6`}>{t.admin.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold border border-white/5 shadow-xl text-lg uppercase tracking-tighter">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white tracking-tight">{user.name}</span>
                          {isSelf(user._id) && (
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-black uppercase tracking-widest border border-orange-500/30">
                              {t.admin.users.modal.selfTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-sm font-medium">{user.email}</span>
                        <span className="text-[10px] text-gray-500">{user.phone || "—"}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        onClick={() => handleToggleRole(user)}
                        disabled={savingId === user._id || isSelf(user._id)}
                        title={isSelf(user._id) ? t.admin.users.modal.selfActionDisabled : ""}
                        className={`group px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${user.role === 'admin' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}`}
                      >
                        {user.role === 'admin' ? <Shield size={10} /> : <ShieldOff size={10} />}
                        {t.admin.users.roles[user.role] || user.role}
                        {!isSelf(user._id) && <Edit2 size={8} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />}
                      </button>
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        onClick={() => handleToggleActive(user)}
                        disabled={savingId === user._id || isSelf(user._id)}
                        title={isSelf(user._id) ? t.admin.users.modal.selfActionDisabled : ""}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${user.isActive !== false ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}
                      >
                        {user.isActive !== false ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {user.isActive !== false ? t.admin.common.active : t.admin.common.inactive}
                      </button>
                    </td>
                    <td className={styles.tableCell}>
                      <span className="text-xs text-gray-500 font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US') : "—"}
                      </span>
                    </td>
                    <td className={styles.tableCell + " pr-6"}>
                      <div className="flex justify-end items-center gap-2">
                        {savingId === user._id && <Loader2 size={14} className="animate-spin text-orange-400" />}
                        <button
                          onClick={() => setEditingUser({ ...user, isActive: user.isActive !== false })}
                          className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all border border-white/5 hover:border-orange-500/20"
                          title={t.admin.users.modal.editTitle}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={savingId === user._id || isSelf(user._id)}
                          title={isSelf(user._id) ? t.admin.users.modal.selfActionDisabled : ""}
                          className="p-2.5 rounded-xl bg-red-500/5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600 disabled:hover:bg-red-500/5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.glassDark} rounded-3xl w-full max-w-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-3 tracking-tight">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500"><UserPlus size={18} /></div>
                {t.admin.users.modal.addTitle}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setAddForm(initialForm); }}
                className="text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <Field icon={UserIcon} label={t.admin.users.modal.name} required>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className={styles.inputField}
                  required
                />
              </Field>
              <Field icon={Mail} label={t.admin.users.modal.email} required>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className={styles.inputField}
                  required
                />
              </Field>
              <Field icon={Lock} label={t.admin.users.modal.password} required hint={t.admin.users.modal.passwordHint}>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className={styles.inputField + " pr-10"}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field icon={Phone} label={t.admin.users.modal.phone}>
                <input
                  type="text"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className={styles.inputField}
                />
              </Field>
              <Field icon={Shield} label={t.admin.users.modal.role}>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className={styles.inputField}
                >
                  <option value="customer" className="bg-gray-950">{t.admin.users.roles.customer}</option>
                  <option value="admin" className="bg-gray-950">{t.admin.users.roles.admin}</option>
                </select>
              </Field>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setAddForm(initialForm); }}
                  className={styles.buttonSecondary + " px-8"}
                  disabled={isCreating}
                >
                  {t.admin.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={styles.buttonPrimary + " px-10 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"}
                >
                  {isCreating && <Loader2 size={16} className="animate-spin" />}
                  {t.admin.common.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.glassDark} rounded-3xl w-full max-w-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-3 tracking-tight">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500"><Edit2 size={18} /></div>
                {t.admin.users.modal.editTitle}
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <Field icon={UserIcon} label={t.admin.users.modal.name} required>
                <input
                  type="text"
                  value={editingUser.name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className={styles.inputField}
                  required
                />
              </Field>
              <Field icon={Mail} label={t.admin.users.modal.email} required>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className={styles.inputField}
                  required
                />
              </Field>
              <Field icon={Phone} label={t.admin.users.modal.phone}>
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className={styles.inputField}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field icon={Shield} label={t.admin.users.modal.role}>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className={styles.inputField + (isSelf(editingUser._id) ? " opacity-50 cursor-not-allowed" : "")}
                    disabled={isSelf(editingUser._id)}
                  >
                    <option value="customer" className="bg-gray-950">{t.admin.users.roles.customer}</option>
                    <option value="admin" className="bg-gray-950">{t.admin.users.roles.admin}</option>
                  </select>
                </Field>
                <Field icon={editingUser.isActive ? CheckCircle2 : XCircle} label={t.admin.users.modal.status}>
                  <select
                    value={String(editingUser.isActive !== false)}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === "true" })}
                    className={styles.inputField + (isSelf(editingUser._id) ? " opacity-50 cursor-not-allowed" : "")}
                    disabled={isSelf(editingUser._id)}
                  >
                    <option value="true" className="bg-gray-950">{t.admin.common.active}</option>
                    <option value="false" className="bg-gray-950">{t.admin.common.inactive}</option>
                  </select>
                </Field>
              </div>
              {isSelf(editingUser._id) && (
                <div className="px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                  <Shield size={14} className="flex-shrink-0 mt-0.5" />
                  {t.admin.users.modal.selfActionDisabled}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className={styles.buttonSecondary + " px-8"}
                  disabled={isUpdating}
                >
                  {t.admin.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={styles.buttonPrimary + " px-10 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"}
                >
                  {isUpdating && <Loader2 size={16} className="animate-spin" />}
                  {t.admin.common.save}
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
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    amber: "bg-amber-500/20 text-amber-400",
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

const Field = ({ icon: Icon, label, required, hint, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
      {Icon && <Icon size={12} className="text-orange-500/70" />}
      {label}{required && <span className="text-orange-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-600 font-mono">{hint}</p>}
  </div>
);

export default ManageUsersPage;
