import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Car, Calendar, DollarSign, CreditCard, Hash, Clock, StickyNote, ArrowRight, Wallet, MapPin } from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const statusColor = {
  pending: "bg-amber-900/30 text-amber-400 border-amber-500/30",
  confirmed: "bg-blue-900/30 text-blue-400 border-blue-500/30",
  active: "bg-orange-900/30 text-orange-400 border-orange-500/30",
  completed: "bg-green-900/30 text-green-400 border-green-500/30",
  cancelled: "bg-red-900/30 text-red-400 border-red-500/30",
};

const paymentColor = {
  unpaid: "bg-amber-900/30 text-amber-400 border-amber-500/30",
  paid: "bg-green-900/30 text-green-400 border-green-500/30",
  refunded: "bg-blue-900/30 text-blue-400 border-blue-500/30",
};

const fmt = (d, lang) => d ? new Date(d).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US") : "—";
const fmtDateTime = (d, lang) => d ? new Date(d).toLocaleString(lang === "vi" ? "vi-VN" : "en-US") : "—";
const daysBetween = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/bookings/my")
      .then((r) => setBookings(r.data.bookings || []))
      .catch(() => toast.error(t.bookingHistory.loadError))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm(t.bookingHistory.cancelConfirm)) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b));
      toast.success(t.bookingHistory.cancelSuccess);
    } catch (err) { toast.error(err.response?.data?.message || t.bookingHistory.cancelError); }
  };

  return (
    <div className="min-h-screen bg-[#121212] py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t.bookingHistory.title}</h1>
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-gray-800">
            <Car className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">{t.bookingHistory.empty}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const snap = b.carSnapshot || {};
              const imgSrc = b.carImage ? `${BASE_URL}/uploads/${b.carImage}` : (snap.image ? `${BASE_URL}/uploads/${snap.image}` : null);
              const days = daysBetween(b.pickupDate, b.returnDate);
              const paymentStatus = b.paymentStatus || "unpaid";
              const paymentMethod = b.paymentMethod || "cash";
              return (
                <div key={b._id} className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {imgSrc && <img src={imgSrc} alt="car" className="w-full sm:w-40 h-28 object-cover rounded-xl flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{snap.make} {snap.model} {snap.year}</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                            <Hash size={10} />{t.bookingHistory.bookingId}: #{String(b._id).slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor[b.status] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                            {t.bookingHistory.status[b.status] || b.status}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${paymentColor[paymentStatus] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                            {t.bookingHistory.payment[paymentStatus] || paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-800 text-xs">
                        <div>
                          <p className="text-gray-500 mb-0.5 flex items-center gap-1"><Calendar size={11} />{t.bookingHistory.pickup}</p>
                          <p className="text-white font-medium">{fmt(b.pickupDate, lang)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5 flex items-center gap-1"><Calendar size={11} />{t.bookingHistory.return}</p>
                          <p className="text-white font-medium">{fmt(b.returnDate, lang)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5 flex items-center gap-1"><Clock size={11} />{t.bookingHistory.duration}</p>
                          <p className="text-white font-medium">{days} {t.cart.days}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5 flex items-center gap-1"><Wallet size={11} />{t.bookingHistory.payment.methodLabel}</p>
                          <p className="text-white font-medium capitalize">{t.bookingHistory.payment[paymentMethod] || paymentMethod}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-800 flex-wrap">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={11} />{t.bookingHistory.createdAt}: {fmtDateTime(b.createdAt, lang)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {b.discount > 0 && (
                            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">
                              -${b.discount} {t.bookingHistory.discount}
                            </span>
                          )}
                          <span className="text-[#f5b754] text-lg font-bold flex items-center gap-1">
                            <DollarSign size={16} />{b.amount}
                          </span>
                        </div>
                      </div>

                      {(b.pickupLocation || b.dropoffLocation) && (
                        <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {b.pickupLocation && (
                            <p className="text-gray-400 flex items-start gap-1.5">
                              <MapPin size={11} className="text-[#f5b754] flex-shrink-0 mt-0.5" />
                              <span><span className="text-gray-500">{t.cart.pickupLocation}:</span> {b.pickupLocation}</span>
                            </p>
                          )}
                          {b.dropoffLocation && (
                            <p className="text-gray-400 flex items-start gap-1.5">
                              <MapPin size={11} className="text-[#f5b754] flex-shrink-0 mt-0.5" />
                              <span><span className="text-gray-500">{t.cart.dropoffLocation}:</span> {b.dropoffLocation}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {b.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-800 bg-[#222]/40 -mx-5 px-5 py-2.5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                            <StickyNote size={10} />{t.bookingHistory.notes}
                          </p>
                          <p className="text-xs text-gray-300 italic">"{b.notes}"</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                        {paymentStatus === "unpaid" && b.status !== "cancelled" && (
                          <button
                            onClick={() => navigate(`/payment/${b._id}`)}
                            className="text-xs px-4 py-2 rounded-lg bg-[#f5b754] text-black hover:bg-amber-400 transition font-bold flex items-center gap-1.5"
                          >
                            <CreditCard size={13} />{t.bookingHistory.payNow}
                            <ArrowRight size={11} />
                          </button>
                        )}
                        {b.status === "pending" && (
                          <button onClick={() => handleCancel(b._id)}
                            className="text-xs px-4 py-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition font-bold">
                            {t.bookingHistory.cancelBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default BookingHistory;
