import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart3,
  Download,
  Car as CarIcon,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
  RefreshCw,
  X,
  Activity,
  Loader2,
  Clock,
  Trophy,
} from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { exportBookingsExcel, exportRevenueExcel } from "../../utils/exportExcel";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const PERIODS = ["day", "week", "month"];

const StatCard = ({ icon: Icon, label, value, sub, tone }) => {
  const toneMap = {
    orange: "bg-orange-500/20 text-orange-500",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    amber: "bg-amber-500/20 text-amber-400",
    red: "bg-red-500/20 text-red-400",
    purple: "bg-purple-500/20 text-purple-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    gray: "bg-gray-500/20 text-gray-300",
  };
  return (
    <div className={`${styles.glassDark} rounded-2xl p-5 border border-white/5 shadow-xl`}>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${toneMap[tone] || toneMap.orange}`}>
        <Icon size={20} />
      </div>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">{sub}</p>}
    </div>
  );
};

const ReportsPage = () => {
  const [revenue, setRevenue] = useState([]);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [summary, setSummary] = useState(null);
  const [topCars, setTopCars] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("day");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exporting, setExporting] = useState(false);
  const { lang, t } = useLanguage();

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const params = { period };
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const [r1, r2, r3, r4] = await Promise.all([
        api.get("/api/reports/revenue", { params }),
        api.get("/api/reports/bookings-summary", { params: { from: dateFrom || undefined, to: dateTo || undefined } }),
        api.get("/api/reports/top-cars", { params: { from: dateFrom || undefined, to: dateTo || undefined, limit: 5 } }),
        api.get("/api/reports/recent-activity", { params: { limit: 6 } }),
      ]);

      setRevenue(r1.data?.revenue || []);
      setRevenueTotal(r1.data?.totalRevenue || 0);
      setSummary(r2.data || null);
      setTopCars(r3.data?.topCars || []);
      setRecentBookings(r4.data?.recentBookings || []);
      setRecentTransactions(r4.data?.recentTransactions || []);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.loadingError);
    } finally {
      setLoading(false);
    }
  }, [period, dateFrom, dateTo, t]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleExport = async (type) => {
    try {
      setExporting(true);
      const params = { type };
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const res = await api.get("/api/reports/export", { params });
      if (type === "bookings") {
        const data = res.data?.bookings || [];
        if (!data.length) {
          toast.warning(t.admin.common.noResults);
          return;
        }
        exportBookingsExcel(data);
      } else {
        const data = res.data?.transactions || [];
        if (!data.length) {
          toast.warning(t.admin.common.noResults);
          return;
        }
        exportRevenueExcel(data);
      }
      toast.success(t.admin.common.saveSuccess);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setPeriod("day");
  };

  const maxRevenue = useMemo(() => (revenue.length ? Math.max(...revenue.map((r) => r.total)) : 1), [revenue]);
  const avgBooking = useMemo(() => {
    if (!summary || !summary.total) return 0;
    return Math.round((summary.totalRevenue || 0) / summary.total);
  }, [summary]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US") : "—");
  const formatDateTime = (d) => (d ? new Date(d).toLocaleString(lang === "vi" ? "vi-VN" : "en-US") : "—");

  const statusColors = {
    pending: "bg-amber-500", confirmed: "bg-cyan-500",
    active: "bg-blue-500", completed: "bg-green-500", cancelled: "bg-red-500",
  };

  const statusLabel = (s) => t.bookingHistory.status[s] || s;

  const getCarImage = (img) => {
    if (!img) return "";
    const s = String(img).trim();
    return /^https?:\/\//i.test(s) ? s : `${BASE_URL}/uploads/${s.replace(/^\/+/, "").replace(/^uploads\//, "")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.admin.reports.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.admin.reports.subtitle}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={fetchAll}
            disabled={loading}
            className={styles.buttonSecondary + " px-4 flex items-center gap-2 disabled:opacity-50"}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => handleExport("bookings")}
            disabled={exporting}
            className={styles.buttonSecondary + " flex items-center gap-2 text-sm disabled:opacity-50"}
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {t.admin.reports.exportBookings}
          </button>
          <button
            onClick={() => handleExport("revenue")}
            disabled={exporting}
            className={styles.buttonPrimary + " flex items-center gap-2 text-sm disabled:opacity-50"}
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {t.admin.reports.exportRevenue}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`${styles.glassDark} rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-3 items-stretch md:items-center`}>
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Calendar size={12} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              title={t.admin.reports.filters.from}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-3 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
            />
          </div>
          <span className="text-gray-600 text-xs">→</span>
          <div className="relative flex-1">
            <Calendar size={12} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              title={t.admin.reports.filters.to}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-3 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={resetFilters}
            className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-orange-400 transition-colors flex items-center gap-1 px-3 py-2"
          >
            <X size={12} /> {t.admin.reports.filters.reset}
          </button>
        )}
      </div>

      {loading ? (
        <div className={`${styles.glassDark} flex justify-center py-20 rounded-2xl border border-white/5`}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <StatCard icon={Calendar} label={t.admin.reports.stats.total} value={summary.total || 0} tone="orange" />
              <StatCard icon={TrendingUp} label={t.admin.reports.stats.completed} value={summary.byStatus?.find((s) => s._id === "completed")?.count || 0} tone="green" />
              <StatCard icon={CarIcon} label={t.admin.reports.stats.active} value={summary.byStatus?.find((s) => s._id === "active")?.count || 0} tone="blue" />
              <StatCard icon={DollarSign} label={t.admin.reports.stats.revenue} value={`$${(summary.totalRevenue || 0).toLocaleString()}`} tone="amber" />
              <StatCard icon={Wallet} label={t.admin.reports.stats.revenuePeriod} value={`$${revenueTotal.toLocaleString()}`} tone="cyan" />
              <StatCard icon={Users} label={t.admin.reports.stats.users} value={summary.totalUsers || 0} tone="purple" />
              <StatCard icon={CarIcon} label={t.admin.reports.stats.cars} value={summary.totalCars || 0} tone="gray" />
            </div>
          )}

          {avgBooking > 0 && (
            <div className={`${styles.glassDark} rounded-2xl p-4 border border-white/5 flex items-center gap-4`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{t.admin.reports.stats.avg}</p>
                <p className="text-xl font-black text-white tracking-tight">${avgBooking.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Revenue chart */}
          <div className={`${styles.glassDark} rounded-2xl p-6 border border-white/5`}>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <BarChart3 size={18} className="text-orange-400" />
                {t.admin.reports.charts.revenue}
              </h2>
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${period === p ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40" : "text-gray-500 hover:text-white"}`}
                  >
                    {t.admin.reports.charts[p === "day" ? "daily" : p === "week" ? "weekly" : "monthly"]}
                  </button>
                ))}
              </div>
            </div>
            {revenue.length === 0 ? (
              <p className="text-center text-gray-600 py-12 italic uppercase tracking-widest text-[10px]">
                {t.admin.reports.charts.noData}
              </p>
            ) : (
              <div className="flex items-end gap-3 h-56 overflow-x-auto pb-4 custom-scrollbar">
                {revenue.map((r) => {
                  const heightPct = Math.max(8, (r.total / maxRevenue) * 180);
                  return (
                    <div
                      key={r._id}
                      className="flex flex-col items-center gap-2 flex-shrink-0 group"
                      style={{ minWidth: 56 }}
                      title={`${r._id}: $${r.total?.toLocaleString()} (${r.count} ${lang === "vi" ? "GD" : "tx"})`}
                    >
                      <span className="text-[10px] text-orange-400 font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        ${r.total?.toLocaleString()}
                      </span>
                      <div
                        className="w-10 bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-lg transition-all hover:from-orange-500 hover:to-amber-300 hover:scale-110 shadow-lg shadow-orange-900/20 cursor-pointer"
                        style={{ height: `${heightPct}px` }}
                      />
                      <span className="text-[10px] text-gray-600 text-center font-mono whitespace-nowrap">{r._id}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status breakdown + Top cars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {summary?.byStatus && summary.byStatus.length > 0 && (
              <div className={`${styles.glassDark} rounded-2xl p-6 border border-white/5`}>
                <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                  <Calendar size={18} className="text-orange-400" />
                  {t.admin.reports.charts.status}
                </h2>
                <div className="space-y-4">
                  {summary.byStatus.map((s) => {
                    const pct = summary.total ? Math.round((s.count / summary.total) * 100) : 0;
                    return (
                      <div key={s._id}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400 font-medium">{statusLabel(s._id)}</span>
                          <span className="text-white font-bold">
                            {s.count} <span className="text-gray-600 text-[10px]">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full ${statusColors[s._id] || "bg-gray-600"} shadow-inner transition-all`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={`${styles.glassDark} rounded-2xl p-6 border border-white/5`}>
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Trophy size={18} className="text-orange-400" />
                {t.admin.reports.charts.topCars}
              </h2>
              {topCars.length === 0 ? (
                <p className="text-gray-600 text-center py-12 italic uppercase tracking-widest text-[10px]">
                  {t.admin.reports.charts.noData}
                </p>
              ) : (
                <div className="space-y-3">
                  {topCars.map((c, i) => (
                    <div
                      key={c._id || i}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 shadow-lg ${
                          i === 0 ? "bg-amber-500 text-black shadow-amber-500/20"
                            : i === 1 ? "bg-gray-400 text-black shadow-gray-400/20"
                            : i === 2 ? "bg-amber-800 text-white shadow-amber-800/20"
                            : "bg-white/5 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className="w-14 h-10 rounded-lg bg-gray-950 overflow-hidden border border-white/10 flex-shrink-0">
                        {c.image ? (
                          <img src={getCarImage(c.image)} alt={c.make} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10"><CarIcon size={18} /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate group-hover:text-orange-400 transition-colors">
                          {c.make || "—"} {c.model || ""} {c.year ? `(${c.year})` : ""}
                        </p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                          {c.bookingCount} {t.admin.reports.topCars.bookings}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-orange-400 font-black text-sm">${(c.totalRevenue || 0).toLocaleString()}</span>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold mt-0.5">{t.admin.reports.topCars.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className={`${styles.glassDark} rounded-2xl p-6 border border-white/5`}>
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Activity size={18} className="text-orange-400" />
              {t.admin.reports.charts.activity}
            </h2>
            {recentBookings.length === 0 && recentTransactions.length === 0 ? (
              <p className="text-gray-600 text-center py-8 italic uppercase tracking-widest text-[10px]">
                {t.admin.reports.activity.noActivity}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-1.5">
                    <Calendar size={11} className="text-orange-500/70" /> {t.admin.reports.activity.booking}
                  </p>
                  <div className="space-y-2">
                    {recentBookings.length === 0 ? (
                      <p className="text-gray-700 text-xs italic">—</p>
                    ) : (
                      recentBookings.map((b) => (
                        <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                          <div className={`w-2 h-2 rounded-full ${statusColors[b.status] || "bg-gray-500"} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-bold truncate">{b.customer || "—"}</p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {b.car?.make} {b.car?.model} • {statusLabel(b.status)}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono whitespace-nowrap">
                            {formatDateTime(b.createdAt)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-1.5">
                    <DollarSign size={11} className="text-orange-500/70" /> {t.admin.reports.activity.transaction}
                  </p>
                  <div className="space-y-2">
                    {recentTransactions.length === 0 ? (
                      <p className="text-gray-700 text-xs italic">—</p>
                    ) : (
                      recentTransactions.map((tx) => (
                        <div key={tx._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                          <Clock size={12} className="text-orange-500/70 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-bold truncate">
                              {tx.booking?.customer || "—"} <span className="text-gray-600 font-normal">• {tx.method}</span>
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {tx.status} • {formatDate(tx.createdAt)}
                            </p>
                          </div>
                          <span className="text-orange-400 font-black text-xs">${tx.amount?.toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default ReportsPage;
