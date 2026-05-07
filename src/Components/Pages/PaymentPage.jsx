import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditCard, CheckCircle } from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [method, setMethod] = useState("mock");

  useEffect(() => {
    api.get(`/api/bookings/${bookingId}`)
      .then((r) => setBooking(r.data.booking))
      .catch(() => toast.error(t.payment.loadError))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post("/api/transactions/mock-payment", { bookingId, amount: booking.amount, method });
      setPaid(true);
      toast.success(t.payment.paySuccess);
    } catch (err) { toast.error(err.response?.data?.message || t.payment.payError); }
    finally { setPaying(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
    </div>
  );

  if (paid) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="text-center bg-[#1a1a1a] rounded-2xl border border-green-800/40 p-10 max-w-md w-full">
        <CheckCircle className="mx-auto text-green-400 mb-4" size={56} />
        <h2 className="text-2xl font-bold text-white mb-2">{t.payment.successTitle}</h2>
        <p className="text-gray-400 mb-6">{t.payment.successDesc}</p>
        <button onClick={() => navigate("/booking-history")}
          className="px-6 py-3 bg-[#f5b754] text-black rounded-xl font-semibold hover:bg-amber-400 transition">
          {t.payment.viewHistory}
        </button>
      </div>
    </div>
  );

  const snap = booking?.carSnapshot || {};
  const fmt = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

  const paymentMethods = [
    { key: "mock", label: t.payment.creditCard },
    { key: "card", label: t.payment.card },
    { key: "cash", label: t.payment.cash },
  ];

  return (
    <div className="min-h-screen bg-[#121212] py-24 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t.payment.title}</h1>
        {booking && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">{t.payment.orderSummary}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between"><span>{t.payment.car}</span><span className="text-white">{snap.make} {snap.model} {snap.year}</span></div>
              <div className="flex justify-between"><span>{t.payment.pickupDate}</span><span className="text-white">{fmt(booking.pickupDate)}</span></div>
              <div className="flex justify-between"><span>{t.payment.returnDate}</span><span className="text-white">{fmt(booking.returnDate)}</span></div>
              <div className="flex justify-between text-white font-bold text-base border-t border-gray-800 pt-2 mt-2">
                <span>{t.payment.total}</span><span className="text-[#f5b754]">${booking.amount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-[#f5b754]" />{t.payment.paymentMethod}
          </h3>
          <div className="space-y-2">
            {paymentMethods.map((m) => (
              <label key={m.key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${method === m.key ? "border-[#f5b754] bg-[#f5b754]/5" : "border-gray-800 hover:border-gray-600"}`}>
                <input type="radio" name="method" value={m.key} checked={method === m.key} onChange={() => setMethod(m.key)} className="accent-[#f5b754]" />
                <span className="text-white text-sm">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={handlePay} disabled={paying}
          className="w-full py-4 bg-[#f5b754] text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition disabled:opacity-60">
          {paying ? t.payment.paying : `${t.payment.payBtn} $${booking?.amount || 0}`}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default PaymentPage;
