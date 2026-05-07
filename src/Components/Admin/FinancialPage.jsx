import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Search,
  ChevronDown,
  Eye,
  X,
  Filter,
  Calendar,
  Download,
  Loader2,
  Hash,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  RefreshCw,
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";
import { exportRevenueExcel } from "../../utils/exportExcel";
import Pagination from "./Pagination";

const STATUS_OPTIONS = ["all", "success", "pending", "failed", "refunded"];
const METHOD_OPTIONS = ["all", "cash", "card", "mock"];

const statusColor = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const StatCard = ({ icon: Icon, label, value, sub, tone }) => {
  const toneMap = {
    orange: "from-orange-600 to-amber-600",
    green: "from-emerald-600 to-teal-700",
    blue: "from-blue-600 to-cyan-700",
    amber: "from-amber-600 to-yellow-700",
    red: "from-red-600 to-rose-700",
    gray: "from-gray-700 to-gray-800",
  };
  return (
    <div className={`${styles.glassDark} rounded-2xl p-5 border border-white/5 transition-all hover:scale-[1.02] shadow-lg shadow-black/20`}>
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${toneMap[tone] || toneMap.orange} flex items-center justify-center mb-3 shadow-lg shadow-black/20`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">{sub}</p>}
    </div>
  );
};

const FinancialPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    success: { count: 0, total: 0 },
    pending: { count: 0, total: 0 },
    failed: { count: 0, total: 0 },
    refunded: { count: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { lang, t } = useLanguage();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (methodFilter !== "all") params.method = methodFilter;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const res = await api.get("/api/transactions", { params });
      const data = res.data || {};
      setTransactions(Array.isArray(data) ? data : (data.transactions || []));
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.loadingError);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, methodFilter, dateFrom, dateTo, t]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((tr) => {
      const customer = tr.booking?.customer?.toLowerCase() || tr.user?.name?.toLowerCase() || "";
      const email = tr.booking?.email?.toLowerCase() || tr.user?.email?.toLowerCase() || "";
      const id = String(tr._id).toLowerCase();
      const ref = (tr.gatewayRef || "").toLowerCase();
      return customer.includes(q) || email.includes(q) || id.includes(q) || ref.includes(q);
    });
  }, [transactions, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, methodFilter, dateFrom, dateTo, pageSize]);

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  );

  const stats = useMemo(() => {
    const successTotal = summary.success?.total || 0;
    const successCount = summary.success?.count || 0;
    const pendingTotal = summary.pending?.total || 0;
    const refundedTotal = summary.refunded?.total || 0;
    const allCount = (summary.success?.count || 0) + (summary.pending?.count || 0) + (summary.failed?.count || 0) + (summary.refunded?.count || 0);
    const successRate = allCount ? Math.round((successCount / allCount) * 100) : 0;
    const avg = successCount ? Math.round(successTotal / successCount) : 0;
    return {
      revenue: successTotal,
      pendingRevenue: pendingTotal,
      refunded: refundedTotal,
      total: allCount,
      successCount,
      successRate,
      avg,
    };
  }, [summary]);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US");
  };
  const formatDateTime = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleString(lang === "vi" ? "vi-VN" : "en-US");
  };

  const updateStatus = async (id, newStatus, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    try {
      setUpdatingId(id);
      const res = await api.patch(`/api/transactions/${id}`, { status: newStatus });
      const updated = res.data?.transaction;
      if (updated) {
        setTransactions((prev) => prev.map((tr) => (tr._id === id ? updated : tr)));
        if (selected?._id === id) setSelected(updated);
      }
      await fetchTransactions();
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.warning(t.admin.common.noResults);
      return;
    }
    exportRevenueExcel(filtered);
    toast.success(t.admin.common.saveSuccess);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMethodFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.admin.financial.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.admin.financial.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className={styles.buttonSecondary + " px-4 flex items-center gap-2 disabled:opacity-50"}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleExport}
            className={styles.buttonPrimary + " px-5 flex items-center gap-2 font-bold tracking-wider"}
          >
            <Download size={14} /> {t.admin.financial.export}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          icon={DollarSign}
          label={t.admin.financial.stats.revenue}
          value={`$${stats.revenue.toLocaleString()}`}
          sub={t.admin.financial.stats.revenueSub}
          tone="orange"
        />
        <StatCard
          icon={Clock}
          label={t.admin.financial.stats.pending}
          value={`$${stats.pendingRevenue.toLocaleString()}`}
          sub={t.admin.financial.stats.pendingSub}
          tone="amber"
        />
        <StatCard
          icon={RotateCcw}
          label={t.admin.financial.stats.refunded}
          value={`$${stats.refunded.toLocaleString()}`}
          sub={t.admin.financial.stats.refundedSub}
          tone="blue"
        />
        <StatCard
          icon={CreditCard}
          label={t.admin.financial.stats.transactions}
          value={stats.total}
          sub={t.admin.financial.stats.transactionsSub}
          tone="gray"
        />
        <StatCard
          icon={TrendingUp}
          label={t.admin.financial.stats.growth}
          value={`${stats.successRate}%`}
          sub={`${stats.successCount}/${stats.total} ${t.admin.financial.status.success.toLowerCase()}`}
          tone="green"
        />
        <StatCard
          icon={Wallet}
          label={t.admin.financial.stats.avg}
          value={`$${stats.avg.toLocaleString()}`}
          sub={t.admin.financial.stats.avgSub}
          tone="red"
        />
      </div>

      <div className={`${styles.glassDark} rounded-2xl p-4 border border-white/5`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-3.5 top-3 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.admin.common.search}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="relative">
            <Filter size={14} className="absolute left-3 top-3 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-9 text-sm text-gray-200 focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-gray-950">
                  {s === "all" ? t.admin.financial.filters.allStatus : t.admin.financial.status[s]}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <Wallet size={14} className="absolute left-3 top-3 text-gray-500" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-9 text-sm text-gray-200 focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              {METHOD_OPTIONS.map((m) => (
                <option key={m} value={m} className="bg-gray-950">
                  {m === "all" ? t.admin.financial.filters.allMethods : t.admin.financial.methods[m]}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar size={12} className="absolute left-2.5 top-3 text-gray-500" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title={t.admin.financial.filters.from}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-2 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="relative">
              <Calendar size={12} className="absolute left-2.5 top-3 text-gray-500" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title={t.admin.financial.filters.to}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-2 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>
        {(search || statusFilter !== "all" || methodFilter !== "all" || dateFrom || dateTo) && (
          <button
            onClick={resetFilters}
            className="mt-3 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            <X size={12} /> {t.admin.financial.filters.reset}
          </button>
        )}
      </div>

      <div className={`${styles.glassDark} rounded-2xl border border-white/5 overflow-hidden shadow-2xl`}>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 leading-relaxed uppercase tracking-widest font-bold text-[10px]">
            <DollarSign className="mx-auto text-gray-700 mb-4 opacity-20" size={64} />
            {t.admin.common.noResults}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.admin.financial.table.id}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.admin.financial.table.customer}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.admin.financial.table.method}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.admin.financial.table.amount}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.admin.financial.table.status}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.admin.financial.table.date}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">{t.admin.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginated.map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-[10px] text-gray-500">#{String(tx._id).slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">{tx.booking?.customer || tx.user?.name || "—"}</span>
                        <span className="text-[10px] text-gray-500">{tx.booking?.email || tx.user?.email || ""}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-xs capitalize px-2 py-1 rounded-md bg-white/5 border border-white/5 inline-flex items-center gap-1.5">
                        <Wallet size={11} className="text-orange-500/70" />
                        {t.admin.financial.methods[tx.method] || tx.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-orange-400 font-black tracking-tight">${tx.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor[tx.status] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                        {t.admin.financial.status[tx.status] || tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">{formatDate(tx.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        {updatingId === tx._id && <Loader2 size={14} className="animate-spin text-orange-400 mr-1" />}
                        <button
                          onClick={() => setSelected(tx)}
                          className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition border border-white/5 hover:border-orange-500/20"
                          title={t.admin.financial.modal.title}
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      {selected && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.glassDark} rounded-3xl shadow-2xl w-full max-w-3xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300`}>
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500"><DollarSign size={18} /></div>
                {t.admin.financial.modal.title}
              </h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-5">
                <DetailRow icon={Hash} label={t.admin.financial.table.id} value={<span className="font-mono break-all">#{selected._id}</span>} />
                <DetailRow icon={DollarSign} label={t.admin.financial.table.amount} value={<span className="text-2xl font-black text-orange-400">${selected.amount?.toLocaleString()} {selected.currency || "USD"}</span>} />
                <DetailRow
                  icon={selected.status === "success" ? CheckCircle2 : selected.status === "pending" ? Clock : selected.status === "refunded" ? RotateCcw : XCircle}
                  label={t.admin.financial.table.status}
                  value={
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor[selected.status]}`}>
                      {t.admin.financial.status[selected.status] || selected.status}
                    </span>
                  }
                />
                <DetailRow icon={Wallet} label={t.admin.financial.table.method} value={<span className="capitalize">{t.admin.financial.methods[selected.method] || selected.method}</span>} />
                <DetailRow icon={Calendar} label={t.admin.financial.modal.createdAt} value={formatDateTime(selected.createdAt)} />
                {selected.updatedAt && selected.updatedAt !== selected.createdAt && (
                  <DetailRow icon={Calendar} label={t.admin.financial.modal.updatedAt} value={formatDateTime(selected.updatedAt)} />
                )}
              </div>

              <div className="space-y-5">
                <DetailRow icon={Hash} label={t.admin.financial.modal.gatewayRef} value={<span className="font-mono">{selected.gatewayRef || "—"}</span>} />
                <DetailRow icon={Hash} label={t.admin.financial.modal.bookingId} value={<span className="font-mono break-all">{selected.booking?._id || selected.booking || "—"}</span>} />
                <DetailRow icon={CreditCard} label={t.admin.financial.modal.customer} value={(
                  <div>
                    <div className="text-white font-bold">{selected.booking?.customer || selected.user?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{selected.booking?.email || selected.user?.email || ""}</div>
                    {selected.booking?.phone && <div className="text-xs text-gray-500">{selected.booking.phone}</div>}
                  </div>
                )} />
                {selected.description && (
                  <DetailRow icon={Hash} label={t.admin.financial.modal.description} value={<span className="italic text-gray-400">"{selected.description}"</span>} />
                )}

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{t.admin.financial.modal.changeStatus}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.status !== "success" && (
                      <button
                        onClick={() => updateStatus(selected._id, "success")}
                        disabled={updatingId === selected._id}
                        className="px-4 py-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition border border-green-500/20 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} /> {t.admin.financial.modal.markPaid}
                      </button>
                    )}
                    {selected.status === "success" && (
                      <button
                        onClick={() => updateStatus(selected._id, "refunded", t.admin.financial.modal.refundConfirm)}
                        disabled={updatingId === selected._id}
                        className="px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition border border-blue-500/20 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <RotateCcw size={14} /> {t.admin.financial.modal.refund}
                      </button>
                    )}
                    {selected.status !== "failed" && selected.status !== "success" && (
                      <button
                        onClick={() => updateStatus(selected._id, "failed")}
                        disabled={updatingId === selected._id}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition border border-red-500/20 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <XCircle size={14} /> {t.admin.financial.status.failed}
                      </button>
                    )}
                    {selected.status !== "pending" && selected.status !== "success" && (
                      <button
                        onClick={() => updateStatus(selected._id, "pending")}
                        disabled={updatingId === selected._id}
                        className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition border border-amber-500/20 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Clock size={14} /> {t.admin.financial.status.pending}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="space-y-1.5">
    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1.5">
      <Icon size={11} className="text-orange-500/70" /> {label}
    </p>
    <div className="text-sm text-gray-200">{value}</div>
  </div>
);

export default FinancialPage;
