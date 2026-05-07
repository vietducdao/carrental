import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Ticket,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Percent,
  DollarSign,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  Clock,
  Power,
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";
import Pagination from "./Pagination";

const emptyForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  usageLimit: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
};

const fmt = (d, lang) => (d ? new Date(d).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US") : "—");
const toInputDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

const computeStatus = (v) => {
  if (v.isActive === false) return "inactive";
  const now = new Date();
  if (v.validFrom && now < new Date(v.validFrom)) return "scheduled";
  if (v.validUntil && now > new Date(v.validUntil)) return "expired";
  if (v.usageLimit && v.usedCount >= v.usageLimit) return "exhausted";
  return "active";
};

const STATUS_FILTERS = ["all", "active", "scheduled", "expired", "exhausted", "inactive"];

const statusStyles = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
  exhausted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const ManageVouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { lang, t } = useLanguage();

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/vouchers");
      const raw = Array.isArray(res.data)
        ? res.data
        : res.data?.vouchers || res.data?.data || [];
      setVouchers(raw);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.loadingError);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setModal("create");
  };

  const openEdit = (v) => {
    setForm({
      code: v.code,
      discountType: v.discountType,
      discountValue: String(v.discountValue),
      minOrderValue: String(v.minOrderValue || ""),
      maxDiscount: v.maxDiscount != null ? String(v.maxDiscount) : "",
      usageLimit: v.usageLimit != null ? String(v.usageLimit) : "",
      validFrom: toInputDate(v.validFrom),
      validUntil: toInputDate(v.validUntil),
      isActive: v.isActive !== false,
    });
    setEditId(v._id);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.warning(t.admin.vouchers.modal.code + " *");
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      toast.warning(t.admin.vouchers.modal.value + " *");
      return;
    }
    if (form.discountType === "percent" && Number(form.discountValue) > 100) {
      toast.warning(lang === "vi" ? "Phần trăm không vượt quá 100" : "Percentage must be ≤ 100");
      return;
    }
    if (form.validFrom && form.validUntil && new Date(form.validUntil) <= new Date(form.validFrom)) {
      toast.warning(lang === "vi" ? "Ngày kết thúc phải sau ngày bắt đầu" : "End date must be after start date");
      return;
    }

    const payload = {
      code: form.code.toUpperCase().trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount !== "" ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : null,
      validFrom: form.validFrom || null,
      validUntil: form.validUntil || null,
      isActive: form.isActive,
    };

    try {
      setSaving(true);
      if (modal === "create") {
        const res = await api.post("/api/vouchers", payload);
        const created = res.data?.voucher || res.data;
        if (created?._id) setVouchers((prev) => [created, ...prev]);
        else await fetchVouchers();
      } else {
        const res = await api.patch(`/api/vouchers/${editId}`, payload);
        const updated = res.data?.voucher || res.data;
        if (updated?._id) setVouchers((prev) => prev.map((v) => (v._id === editId ? { ...v, ...updated } : v)));
        else await fetchVouchers();
      }
      toast.success(t.admin.common.saveSuccess);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.admin.vouchers.modal.deleteConfirm)) return;
    try {
      setBusyId(id);
      await api.delete(`/api/vouchers/${id}`);
      setVouchers((prev) => prev.filter((v) => v._id !== id));
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleActive = async (v) => {
    try {
      setBusyId(v._id);
      const res = await api.patch(`/api/vouchers/${v._id}`, { isActive: !(v.isActive !== false) });
      const updated = res.data?.voucher || res.data;
      setVouchers((prev) => prev.map((x) => (x._id === v._id ? { ...x, ...(updated || { isActive: !x.isActive }) } : x)));
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vouchers.filter((v) => {
      const matchesSearch = !q || v.code.toLowerCase().includes(q);
      const status = computeStatus(v);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vouchers, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  );

  const stats = useMemo(() => {
    let active = 0;
    let expired = 0;
    let redeemed = 0;
    vouchers.forEach((v) => {
      const s = computeStatus(v);
      if (s === "active") active++;
      if (s === "expired") expired++;
      redeemed += v.usedCount || 0;
    });
    return { total: vouchers.length, active, expired, redeemed };
  }, [vouchers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Ticket size={22} />} label={t.admin.vouchers.stats.total} value={stats.total} tone="orange" />
        <StatCard icon={<CheckCircle2 size={22} />} label={t.admin.vouchers.stats.active} value={stats.active} tone="green" />
        <StatCard icon={<XCircle size={22} />} label={t.admin.vouchers.stats.expired} value={stats.expired} tone="red" />
        <StatCard icon={<TrendingUp size={22} />} label={t.admin.vouchers.stats.redeemed} value={stats.redeemed} tone="blue" />
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:border-orange-500 appearance-none transition-all cursor-pointer"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s} className="bg-gray-900">
                {s === "all" ? t.admin.vouchers.filters.allStatus : t.admin.vouchers.statusLabels[s]}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
        </div>
        <button
          onClick={openCreate}
          className={styles.buttonPrimary + " px-6 flex items-center gap-2 justify-center font-bold tracking-wider whitespace-nowrap"}
        >
          <Plus size={18} /> {t.admin.vouchers.addBtn}
        </button>
      </div>

      {loading ? (
        <div className={`${styles.glassDark} flex justify-center py-20 rounded-2xl border border-white/5`}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${styles.glassDark} text-center py-20 rounded-2xl border border-white/5`}>
          <Ticket className="mx-auto text-gray-700 mb-4 opacity-20" size={64} />
          <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">{t.admin.common.noResults}</p>
        </div>
      ) : (
        <div className={`${styles.glassDark} rounded-2xl overflow-hidden border border-white/5 shadow-2xl`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className={styles.tableHeader}>{t.admin.vouchers.table.code}</th>
                  <th className={styles.tableHeader}>{t.admin.vouchers.table.type}</th>
                  <th className={styles.tableHeader}>{t.admin.vouchers.table.value}</th>
                  <th className={styles.tableHeader}>{t.admin.vouchers.table.minOrder}</th>
                  <th className={styles.tableHeader}>{t.admin.vouchers.table.limit}</th>
                  <th className={styles.tableHeader}>{t.admin.vouchers.table.validity}</th>
                  <th className={`${styles.tableHeader} text-right pr-6`}>{t.admin.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginated.map((v) => {
                  const status = computeStatus(v);
                  const usedPct = v.usageLimit ? Math.min(100, Math.round((v.usedCount / v.usageLimit) * 100)) : 0;
                  return (
                    <tr key={v._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 tracking-wider">
                          {v.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                          {v.discountType === "percent"
                            ? <><Percent size={12} className="text-orange-500" /> %</>
                            : <><DollarSign size={12} className="text-orange-500" /> $</>}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-bold tracking-tight">
                        {v.discountType === "percent" ? `${v.discountValue}%` : `$${v.discountValue}`}
                        {v.maxDiscount && v.discountType === "percent" && (
                          <span className="text-[10px] text-gray-500 font-normal block">max ${v.maxDiscount}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{v.minOrderValue ? `$${v.minOrderValue}` : "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                          <span className="text-gray-300 font-medium text-xs">
                            {v.usedCount || 0} / {v.usageLimit || "∞"}
                          </span>
                          {v.usageLimit && (
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${usedPct >= 100 ? "bg-red-500" : usedPct >= 80 ? "bg-amber-500" : "bg-orange-500"}`}
                                style={{ width: `${usedPct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${statusStyles[status]}`}>
                          {t.admin.vouchers.statusLabels[status] || status}
                        </span>
                        <p className="text-[10px] text-gray-600 mt-1.5 font-mono flex items-center gap-1">
                          <Calendar size={9} /> {fmt(v.validFrom, lang)} → {fmt(v.validUntil, lang)}
                        </p>
                      </td>
                      <td className="px-6 py-4 pr-6">
                        <div className="flex justify-end items-center gap-1.5">
                          {busyId === v._id && <Loader2 size={14} className="animate-spin text-orange-400 mr-1" />}
                          <button
                            onClick={() => handleToggleActive(v)}
                            disabled={busyId === v._id}
                            title={v.isActive !== false ? (lang === "vi" ? "Tắt" : "Disable") : (lang === "vi" ? "Bật" : "Enable")}
                            className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${v.isActive !== false ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20"}`}
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(v)}
                            disabled={busyId === v._id}
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition border border-white/5 hover:border-orange-500/20 disabled:opacity-50"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            disabled={busyId === v._id}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition border border-red-500/10 hover:border-red-500/30 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {modal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.glassDark} rounded-3xl shadow-2xl w-full max-w-xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300`}>
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                  {modal === "create" ? <Plus size={18} /> : <Edit3 size={18} />}
                </div>
                {modal === "create" ? t.admin.vouchers.modal.create : t.admin.vouchers.modal.edit}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <Field label={t.admin.vouchers.modal.code} required hint={t.admin.vouchers.modal.codeHint}>
                <input
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  required
                  placeholder="SUMMER20"
                  className={styles.inputField + " font-mono tracking-wider uppercase"}
                />
              </Field>

              <Field label={t.admin.vouchers.modal.type}>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, discountType: "percent" }))}
                    className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${form.discountType === "percent" ? "bg-orange-500 text-white shadow-lg shadow-orange-900/30" : "text-gray-400 hover:text-white"}`}
                  >
                    <Percent size={14} /> {t.admin.vouchers.types.percent}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, discountType: "fixed" }))}
                    className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${form.discountType === "fixed" ? "bg-orange-500 text-white shadow-lg shadow-orange-900/30" : "text-gray-400 hover:text-white"}`}
                  >
                    <DollarSign size={14} /> {t.admin.vouchers.types.fixed}
                  </button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t.admin.vouchers.modal.value} required>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.discountValue}
                      onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                      required
                      min={0}
                      max={form.discountType === "percent" ? 100 : undefined}
                      step="0.01"
                      className={styles.inputField + " pr-8"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                      {form.discountType === "percent" ? "%" : "$"}
                    </span>
                  </div>
                </Field>
                <Field label={t.admin.vouchers.modal.max} hint={form.discountType === "percent" ? t.admin.vouchers.modal.maxHint : undefined}>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))}
                      min={0}
                      step="0.01"
                      disabled={form.discountType !== "percent"}
                      className={styles.inputField + " pr-8 disabled:opacity-40"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">$</span>
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t.admin.vouchers.modal.min}>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.minOrderValue}
                      onChange={(e) => setForm((p) => ({ ...p, minOrderValue: e.target.value }))}
                      min={0}
                      step="0.01"
                      className={styles.inputField + " pr-8"}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">$</span>
                  </div>
                </Field>
                <Field label={t.admin.vouchers.modal.limit} hint={t.admin.vouchers.modal.limitHint}>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))}
                    min={1}
                    className={styles.inputField}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t.admin.vouchers.modal.from}>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))}
                    className={styles.inputField}
                  />
                </Field>
                <Field label={t.admin.vouchers.modal.until}>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))}
                    className={styles.inputField}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
                  <Power size={14} className={form.isActive ? "text-green-400" : "text-gray-500"} />
                  {t.admin.vouchers.modal.isActive}
                </span>
              </label>

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

export default ManageVouchersPage;
