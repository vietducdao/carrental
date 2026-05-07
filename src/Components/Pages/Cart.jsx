import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Car, Tag, Trash2, MapPin, StickyNote } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api, { BASE_URL } from "../../utils/api";

const Cart = () => {
  const { cartItem, appliedVoucher, subtotal, discount, total, clearCart, applyVoucher } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  if (!cartItem) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center py-24">
      <div className="text-center">
        <Car className="mx-auto text-gray-600 mb-4" size={48} />
        <p className="text-gray-400 text-lg">{t.cart.empty}</p>
        <button onClick={() => navigate("/cars")} className="mt-4 px-6 py-2.5 bg-[#f5b754] text-black rounded-xl font-semibold">
          {t.cart.browseCars}
        </button>
      </div>
    </div>
  );

  const fmt = (d) => new Date(d).toLocaleDateString("vi-VN");
  const { car, pickupDate, returnDate, days } = cartItem;
  const imgSrc = car.image ? `${BASE_URL}/uploads/${car.image}` : null;

  const handleVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const res = await api.post("/api/vouchers/validate", { code: voucherCode, orderValue: subtotal });
      applyVoucher({ voucher: res.data.voucher, discount: res.data.discount });
      toast.success(`${t.cart.voucherSuccess} $${res.data.discount.toFixed(2)}`);
    } catch (err) { toast.error(err.response?.data?.message || t.cart.invalidVoucher); }
    finally { setVoucherLoading(false); }
  };

  const handleConfirm = async () => {
    setBooking(true);
    try {
      const res = await api.post("/api/bookings", {
        carId: car._id, pickupDate, returnDate,
        customer: user.name, email: user.email, phone: user.phone,
        address: user.address || {},
        pickupLocation, dropoffLocation, notes,
        ...(appliedVoucher ? { voucherId: appliedVoucher.voucher._id } : {}),
      });
      const bookingId = res.data.booking._id;
      clearCart();
      navigate(`/payment/${bookingId}`);
    } catch (err) { toast.error(err.response?.data?.message || t.cart.bookingError); }
    finally { setBooking(false); }
  };

  return (
    <div className="min-h-screen bg-[#121212] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">{t.cart.title}</h1>
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-4">
          <div className="flex gap-4">
            {imgSrc && <img src={imgSrc} alt="car" className="w-28 h-20 object-cover rounded-xl flex-shrink-0" />}
            <div>
              <h2 className="text-white font-bold text-xl">{car.make} {car.model}</h2>
              <p className="text-gray-400 text-sm mt-1">{car.year} • {car.category} • {car.seats} chỗ</p>
              <p className="text-[#f5b754] font-semibold mt-1">${car.dailyRate}{t.cart.perDay}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-800 text-sm">
            <div><span className="text-gray-500">{t.cart.pickupDate}</span><p className="text-white">{fmt(pickupDate)}</p></div>
            <div><span className="text-gray-500">{t.cart.returnDate}</span><p className="text-white">{fmt(returnDate)}</p></div>
            <div><span className="text-gray-500">{t.cart.numDays}</span><p className="text-white">{days} {t.cart.days}</p></div>
          </div>
        </div>

        {/* Voucher */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-5 mb-4">
          <div className="flex gap-2">
            <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder={t.cart.voucherPlaceholder}
              className="flex-1 bg-[#222] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] text-sm transition" />
            <button onClick={handleVoucher} disabled={voucherLoading}
              className="px-4 py-2.5 bg-[#f5b754] text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition flex items-center gap-1.5 disabled:opacity-60">
              <Tag size={15} />{t.cart.applyVoucher}
            </button>
          </div>
          {appliedVoucher && (
            <div className="mt-3 p-3 rounded-xl bg-green-900/15 border border-green-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400 font-semibold flex items-center gap-1.5">
                  <Tag size={13} /> {appliedVoucher.voucher.code}
                </span>
                <button onClick={() => applyVoucher(null)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] text-gray-400">
                <span>−${discount.toFixed(2)}</span>
                {appliedVoucher.voucher.discountType === "percent" && (
                  <span>{appliedVoucher.voucher.discountValue}%</span>
                )}
                {appliedVoucher.voucher.minOrderValue > 0 && (
                  <span>Min: ${appliedVoucher.voucher.minOrderValue}</span>
                )}
                {appliedVoucher.voucher.maxDiscount > 0 && (
                  <span>Max: ${appliedVoucher.voucher.maxDiscount}</span>
                )}
                {appliedVoucher.voucher.validUntil && (
                  <span>{new Date(appliedVoucher.voucher.validUntil).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trip details */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-5 mb-4 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <MapPin size={15} className="text-[#f5b754]" />{t.cart.tripDetails}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5 uppercase tracking-wider">{t.cart.pickupLocation}</label>
              <input
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder={t.cart.pickupLocationPlaceholder}
                className="w-full bg-[#222] border border-gray-700 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] text-sm transition"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5 uppercase tracking-wider">{t.cart.dropoffLocation}</label>
              <input
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder={t.cart.dropoffLocationPlaceholder}
                className="w-full bg-[#222] border border-gray-700 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] text-sm transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <StickyNote size={11} />{t.cart.notes}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t.cart.notesPlaceholder}
              className="w-full bg-[#222] border border-gray-700 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5b754] text-sm transition resize-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-5 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>{t.cart.subtotal} ({days} {t.cart.days} × ${car.dailyRate})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>{t.cart.discount}</span><span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-lg border-t border-gray-800 pt-2 mt-2">
              <span>{t.cart.total}</span><span className="text-[#f5b754]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={booking}
          className="w-full py-4 bg-[#f5b754] text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition disabled:opacity-60">
          {booking ? t.cart.processing : t.cart.confirmBtn}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Cart;
