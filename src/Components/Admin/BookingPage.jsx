import React, { useState, useCallback, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Car as CarIcon,
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  Eye,
  ArrowRight,
  DollarSign,
  Wallet,
  StickyNote,
  Hash,
  Clock,
  Loader2,
  Ban,
} from "lucide-react";
import { styles } from "../../assets/adminStyles";
import api, { BASE_URL as baseURL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import Pagination from "./Pagination";

const formatDate = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d) ? "—" : d.toLocaleDateString("vi-VN");
};

const formatDateTime = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d) ? "—" : d.toLocaleString("vi-VN");
};

const makeImageUrl = (img) => {
  if (!img) return "";
  const s = String(img).trim();
  return /^https?:\/\//i.test(s)
    ? s
    : `${baseURL}/uploads/${s.replace(/^\/+/, "").replace(/^uploads\//, "")}`;
};

const daysBetween = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const extractCarInfo = (b) => {
  const car = b.carSnapshot || b.car || {};
  return {
    title: b.carName || `${car.make || ""} ${car.model || ""}`.trim() || "—",
    year: car.year ?? "",
    dailyRate: car.dailyRate ?? 0,
    seats: car.seats ?? "",
    transmission: car.transmission ?? "",
    fuel: car.fuelType ?? car.fuel ?? "",
    image: car.image || b.carImage || b.image || "",
  };
};

const STATUS_OPTIONS = ["pending", "confirmed", "active", "completed", "cancelled"];
const PAYMENT_STATUS_OPTIONS = ["unpaid", "paid", "refunded"];

const statusColors = {
  pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  confirmed: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  active: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  completed: "text-green-400 bg-green-500/10 border-green-500/20",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
};

const paymentColors = {
  unpaid: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  paid: "text-green-400 bg-green-500/10 border-green-500/20",
  refunded: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [viewingBooking, setViewingBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { lang, t } = useLanguage();

  const mapBooking = useCallback((b, i) => {
    const carInfo = extractCarInfo(b);
    return {
      id: b._id || b.id || `local-${i}`,
      _id: b._id,
      customer: b.customer || b.user?.name || "Guest",
      email: b.email || b.user?.email || "—",
      phone: b.phone || "—",
      car: carInfo.title,
      carImage: carInfo.image,
      carDailyRate: carInfo.dailyRate,
      carYear: carInfo.year,
      pickupDate: b.pickupDate || b.startDate,
      returnDate: b.returnDate || b.endDate,
      amount: b.amount || b.total || 0,
      discount: b.discount || 0,
      status: b.status || "pending",
      paymentStatus: b.paymentStatus || "unpaid",
      paymentMethod: b.paymentMethod || "cash",
      notes: b.notes || "",
      address: b.address || {},
      createdAt: b.createdAt,
      details: {
        seats: carInfo.seats,
        fuel: carInfo.fuel,
        transmission: carInfo.transmission,
      },
    };
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings", { params: { limit: 500 } });
      const raw = Array.isArray(res.data) ? res.data : (res.data.data || res.data.bookings || []);
      setBookings(raw.map(mapBooking));
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.loadingError || (lang === "vi" ? "Không tải được đơn" : "Failed to load bookings"));
    } finally {
      setLoading(false);
    }
  }, [t, lang, mapBooking]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateBookingField = async (id, payload, successMsg) => {
    try {
      setUpdatingId(id);
      const res = await api.patch(`/api/bookings/${id}`, payload);
      const updated = res.data?.booking;
      if (updated) {
        const mapped = mapBooking(updated, 0);
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, ...mapped, _id: id } : b)));
        if (viewingBooking?._id === id) setViewingBooking((prev) => ({ ...prev, ...mapped, _id: id }));
      } else {
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, ...payload } : b)));
        if (viewingBooking?._id === id) setViewingBooking((prev) => ({ ...prev, ...payload }));
      }
      toast.success(successMsg || t.admin.common.saveSuccess || (lang === "vi" ? "Đã cập nhật" : "Updated"));
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Cập nhật thất bại" : "Update failed"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm(t.admin.bookings.modal.cancelConfirm)) return;
    await updateBookingField(id, { status: "cancelled" }, lang === "vi" ? "Đã hủy đơn" : "Booking cancelled");
  };

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesSearch =
        !q ||
        b.customer.toLowerCase().includes(q) ||
        b.car.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (b.phone && b.phone.toLowerCase().includes(q));
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || b.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, pageSize]);

  const paginatedBookings = useMemo(
    () => filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredBookings, currentPage, pageSize]
  );

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    active: bookings.filter((b) => b.status === "active").length,
    revenue: bookings
      .filter((b) => b.paymentStatus === "paid" && b.status !== "cancelled")
      .reduce((acc, b) => acc + (b.amount || 0), 0),
  }), [bookings]);

  const statusLabel = (s) => t.bookingHistory.status[s] || s;
  const paymentLabel = (s) => t.admin.bookings.payment[s] || s;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar size={20} />}
          label={t.admin.bookings.stats.total}
          value={stats.total}
          tone="orange"
        />
        <StatCard
          icon={<Clock size={20} />}
          label={t.admin.bookings.stats.pending}
          value={stats.pending}
          tone="amber"
        />
        <StatCard
          icon={<CarIcon size={20} />}
          label={t.admin.bookings.stats.active}
          value={stats.active}
          tone="blue"
        />
        <StatCard
          icon={<CreditCard size={20} />}
          label={t.admin.bookings.stats.revenue}
          value={`$${stats.revenue.toLocaleString()}`}
          tone="green"
        />
      </div>

      <div className={`${styles.glassDark} p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center`}>
        <div className="relative flex-1 w-full text-white">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder={t.admin.common.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="relative w-full md:w-56">
          <Filter size={16} className="absolute left-3 top-3.5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:border-orange-500 appearance-none transition-all cursor-pointer"
          >
            <option value="all" className="bg-gray-900">{t.admin.bookings.filters.allStatus}</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-gray-900">{statusLabel(s)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
        </div>
        <div className="relative w-full md:w-56">
          <Wallet size={16} className="absolute left-3 top-3.5 text-gray-500" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:border-orange-500 appearance-none transition-all cursor-pointer"
          >
            <option value="all" className="bg-gray-900">{t.admin.bookings.filters.allPayment}</option>
            {PAYMENT_STATUS_OPTIONS.map((p) => (
              <option key={p} value={p} className="bg-gray-900">{paymentLabel(p)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className={`${styles.glassDark} rounded-2xl overflow-hidden shadow-2xl`}>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t.admin.common.noResults}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className={styles.tableHeader}>{t.admin.bookings.table.car}</th>
                  <th className={styles.tableHeader}>{t.admin.bookings.table.customer}</th>
                  <th className={styles.tableHeader}>{t.carDetails.selectDates}</th>
                  <th className={styles.tableHeader}>{t.admin.bookings.table.amount}</th>
                  <th className={styles.tableHeader}>{t.admin.common.status}</th>
                  <th className={styles.tableHeader}>{t.admin.bookings.payment.status}</th>
                  <th className={`${styles.tableHeader} text-right pr-6`}>{t.admin.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg bg-gray-900 border border-white/5 overflow-hidden flex-shrink-0">
                          {b.carImage ? (
                            <img src={makeImageUrl(b.carImage)} alt={b.car} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700"><CarIcon size={14} /></div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm uppercase tracking-tight block">{b.car}</span>
                          {b.carYear && <span className="text-[10px] text-gray-600 font-mono">{b.carYear}</span>}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex flex-col text-sm">
                        <span className="text-white font-medium">{b.customer}</span>
                        <span className="text-[10px] text-gray-500">{b.email}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar size={12} className="text-orange-500" />
                        <span className="text-gray-300 font-medium">{formatDate(b.pickupDate)}</span>
                        <ArrowRight size={10} className="text-gray-600" />
                        <span className="text-gray-400 font-medium">{formatDate(b.returnDate)}</span>
                      </div>
                      <div className="text-[10px] text-gray-600 mt-1 ml-5">
                        {daysBetween(b.pickupDate, b.returnDate)} {t.cart.days}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className="font-bold text-orange-400">${b.amount}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="relative inline-block">
                        <select
                          value={b.status}
                          disabled={updatingId === b._id}
                          onChange={(e) => updateBookingField(b._id, { status: e.target.value })}
                          className={`appearance-none px-3 py-1.5 pr-7 rounded-full text-[10px] font-bold uppercase tracking-widest border cursor-pointer focus:outline-none transition-all ${statusColors[b.status] || ""} disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-gray-900 text-white">{statusLabel(s)}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="relative inline-block">
                        <select
                          value={b.paymentStatus}
                          disabled={updatingId === b._id}
                          onChange={(e) => updateBookingField(b._id, { paymentStatus: e.target.value })}
                          className={`appearance-none px-3 py-1.5 pr-7 rounded-full text-[10px] font-bold uppercase tracking-widest border cursor-pointer focus:outline-none transition-all ${paymentColors[b.paymentStatus] || ""} disabled:opacity-50`}
                        >
                          {PAYMENT_STATUS_OPTIONS.map((p) => (
                            <option key={p} value={p} className="bg-gray-900 text-white">{paymentLabel(p)}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className={styles.tableCell + " pr-6"}>
                      <div className="flex justify-end items-center gap-2">
                        {updatingId === b._id && <Loader2 size={14} className="animate-spin text-orange-400" />}
                        <button
                          onClick={() => setViewingBooking(b)}
                          className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all hover:bg-white/10"
                          title={t.admin.bookings.modal.title}
                        >
                          <Eye size={18} />
                        </button>
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(b._id)}
                            disabled={updatingId === b._id}
                            className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                            title={t.admin.bookings.modal.cancelBooking}
                          >
                            <Ban size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredBookings.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      {viewingBooking && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.glassDark} rounded-3xl w-full max-w-5xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold flex items-center gap-3 tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500"><Calendar size={18} /></div>
                {t.admin.bookings.modal.title}
              </h2>
              <button onClick={() => setViewingBooking(null)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Customer + meta */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4">{t.profile.tabInfo}</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xl font-bold uppercase shadow-lg shadow-orange-900/40">
                      {(viewingBooking.customer || "?").charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg tracking-tight">{viewingBooking.customer}</p>
                      <p className="text-sm text-gray-500">{viewingBooking.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300"><Phone size={14} className="text-orange-500/70" /> {viewingBooking.phone}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-300"><Mail size={14} className="text-orange-500/70" /> {viewingBooking.email}</div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4">{t.contact.addressLabel}</h4>
                  <p className="text-sm text-gray-300 mb-1 leading-relaxed">{viewingBooking.address?.street || "—"}</p>
                  <p className="text-xs text-gray-500">
                    {[viewingBooking.address?.city, viewingBooking.address?.state, viewingBooking.address?.zipCode]
                      .filter(Boolean).join(", ") || "—"}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">{t.admin.bookings.modal.bookingId}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono break-all">
                    <Hash size={12} className="text-orange-500/70 flex-shrink-0" /> {viewingBooking._id}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={12} className="text-orange-500/70" /> {t.admin.bookings.modal.createdAt}: {formatDateTime(viewingBooking.createdAt)}
                  </div>
                </div>

                {viewingBooking.notes && (
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-2">
                      <StickyNote size={12} /> {t.admin.bookings.modal.notes}
                    </h4>
                    <p className="text-sm text-gray-300 italic leading-relaxed">"{viewingBooking.notes}"</p>
                  </div>
                )}
              </div>

              {/* Car */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4">{t.cars.bannerTitle2 || "Vehicle"}</h4>
                  <div className="aspect-video rounded-2xl bg-gray-900 border border-white/5 overflow-hidden mb-4 shadow-xl">
                    {viewingBooking.carImage ? (
                      <img src={makeImageUrl(viewingBooking.carImage)} alt={viewingBooking.car} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700"><CarIcon size={40} /></div>
                    )}
                  </div>
                  <h5 className="font-bold text-white text-center uppercase tracking-wider text-sm">{viewingBooking.car}</h5>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  {Object.entries(viewingBooking.details).map(([k, v]) => (
                    <div key={k} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] uppercase font-bold text-gray-600 tracking-wider mb-1">{t.carDetails[`${k}Label`] || k}</p>
                      <p className="text-xs text-white font-semibold truncate uppercase">
                        {(v === "Automatic" ? t.cars.transmission_auto
                          : v === "Manual" ? t.cars.transmission_manual
                            : t.carDetails[String(v).toLowerCase()] || t.cars[String(v).toLowerCase()]) || (v || "—")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary + status edit */}
              <div className="space-y-4">
                <div className="bg-orange-500/5 rounded-3xl p-6 border border-orange-500/10 space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-orange-500 tracking-widest mb-2 text-center">{t.admin.bookings.modal.summary}</h4>
                  <Row label={t.carDetails.pickupDate} value={formatDate(viewingBooking.pickupDate)} />
                  <Row label={t.carDetails.returnDate} value={formatDate(viewingBooking.returnDate)} />
                  <Row label={t.admin.bookings.modal.days} value={`${daysBetween(viewingBooking.pickupDate, viewingBooking.returnDate)} ${t.cart.days}`} />
                  {viewingBooking.discount > 0 && (
                    <Row label={t.admin.bookings.modal.discount} value={`-$${viewingBooking.discount}`} accent="text-green-400" />
                  )}
                  <div className="flex justify-between items-center text-xl pt-3 border-t border-orange-500/10">
                    <span className="text-white font-bold">{t.cart.total}</span>
                    <span className="font-black text-orange-500">${viewingBooking.amount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">{t.admin.bookings.modal.updateStatus}</label>
                  <div className="relative">
                    <select
                      value={viewingBooking.status}
                      disabled={updatingId === viewingBooking._id}
                      onChange={(e) => updateBookingField(viewingBooking._id, { status: e.target.value })}
                      className={`w-full appearance-none px-4 py-3 pr-10 rounded-2xl text-xs font-bold uppercase tracking-widest border cursor-pointer focus:outline-none transition-all ${statusColors[viewingBooking.status] || ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-gray-900 text-white">{statusLabel(s)}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>

                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pt-2">{t.admin.bookings.payment.status}</label>
                  <div className="relative">
                    <select
                      value={viewingBooking.paymentStatus}
                      disabled={updatingId === viewingBooking._id}
                      onChange={(e) => updateBookingField(viewingBooking._id, { paymentStatus: e.target.value })}
                      className={`w-full appearance-none px-4 py-3 pr-10 rounded-2xl text-xs font-bold uppercase tracking-widest border cursor-pointer focus:outline-none transition-all ${paymentColors[viewingBooking.paymentStatus] || ""}`}
                    >
                      {PAYMENT_STATUS_OPTIONS.map((p) => (
                        <option key={p} value={p} className="bg-gray-900 text-white">{paymentLabel(p)}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>

                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block pt-2">{t.admin.bookings.payment.method}</label>
                  <div className="relative">
                    <select
                      value={viewingBooking.paymentMethod}
                      disabled={updatingId === viewingBooking._id}
                      onChange={(e) => updateBookingField(viewingBooking._id, { paymentMethod: e.target.value })}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl text-xs font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-white cursor-pointer focus:outline-none transition-all"
                    >
                      <option value="cash" className="bg-gray-900">{paymentLabel("cash")}</option>
                      <option value="card" className="bg-gray-900">{paymentLabel("card")}</option>
                      <option value="mock" className="bg-gray-900">{paymentLabel("mock")}</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>

                  {viewingBooking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(viewingBooking._id)}
                      disabled={updatingId === viewingBooking._id}
                      className="w-full mt-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingId === viewingBooking._id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                      {t.admin.bookings.modal.cancelBooking}
                    </button>
                  )}
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

const StatCard = ({ icon, label, value, tone }) => {
  const toneMap = {
    orange: "bg-orange-500/10 text-orange-500",
    amber: "bg-amber-500/10 text-amber-500",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
  };
  return (
    <div className={`${styles.glassDark} p-5 rounded-2xl flex items-center justify-between border border-white/5`}>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
        <p className={`text-xl font-bold ${toneMap[tone]?.split(" ")[1] || "text-white"}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneMap[tone] || toneMap.orange}`}>
        {icon}
      </div>
    </div>
  );
};

const Row = ({ label, value, accent }) => (
  <div className="flex justify-between items-center text-sm border-b border-orange-500/10 pb-2 last:border-b-0 last:pb-0">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${accent || "text-white"}`}>{value}</span>
  </div>
);

export default BookingPage;
