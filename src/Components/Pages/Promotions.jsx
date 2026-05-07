import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tag, Copy, Check, Calendar, DollarSign, Ticket, Percent, Clock, Gift } from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const Promotions = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/vouchers/public")
      .then((r) => setVouchers(r.data.vouchers || []))
      .catch(() => toast.error(t.promotions.loadError))
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t.promotions.copied);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US") : null;

  return (
    <div className="min-h-screen bg-[#121212] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f5b754]/10 border border-[#f5b754]/30 mb-4">
            <Gift size={32} className="text-[#f5b754]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{t.promotions.title}</h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">{t.promotions.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-gray-800">
            <Ticket className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">{t.promotions.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((v) => {
              const isPercent = v.discountType === "percent";
              const usesLeft = v.usageLimit ? Math.max(0, v.usageLimit - (v.usedCount || 0)) : null;

              return (
                <div
                  key={v._id}
                  className="relative bg-gradient-to-br from-[#1f1a14] to-[#1a1a1a] rounded-2xl border border-[#f5b754]/20 shadow-lg overflow-hidden group hover:shadow-[#f5b754]/20 transition-all"
                >
                  {/* Decorative dots on edge */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] -ml-1.5" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#121212] -mr-1.5" />

                  {/* Discount section */}
                  <div className="bg-gradient-to-r from-[#f5b754] to-amber-500 p-6 text-center relative">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {isPercent ? <Percent size={28} className="text-black" /> : <DollarSign size={28} className="text-black" />}
                      <span className="text-5xl font-black text-black tracking-tighter">
                        {isPercent ? v.discountValue : `$${v.discountValue}`}
                      </span>
                    </div>
                    <p className="text-black/80 text-xs font-bold uppercase tracking-[0.2em]">
                      {isPercent ? t.promotions.percentOff : t.promotions.flatOff}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    {/* Code */}
                    <div className="bg-[#0a0a0a] border-2 border-dashed border-[#f5b754]/40 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
                      <code className="text-[#f5b754] font-bold text-lg tracking-wider truncate">{v.code}</code>
                      <button
                        onClick={() => copyToClipboard(v.code)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[#f5b754] text-black text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
                      >
                        {copiedCode === v.code ? (
                          <><Check size={13} />{t.promotions.copied}</>
                        ) : (
                          <><Copy size={13} />{t.promotions.copyCode}</>
                        )}
                      </button>
                    </div>

                    {/* Conditions */}
                    <ul className="space-y-2 text-xs">
                      {v.minOrderValue > 0 && (
                        <li className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <DollarSign size={12} className="text-[#f5b754]" />
                            {t.promotions.minOrder}
                          </span>
                          <span className="text-white font-semibold">${v.minOrderValue}</span>
                        </li>
                      )}
                      {v.maxDiscount && (
                        <li className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Tag size={12} className="text-[#f5b754]" />
                            {t.promotions.maxDiscount}
                          </span>
                          <span className="text-white font-semibold">${v.maxDiscount}</span>
                        </li>
                      )}
                      {v.validUntil && (
                        <li className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#f5b754]" />
                            {t.promotions.validUntil}
                          </span>
                          <span className="text-white font-semibold">{fmt(v.validUntil)}</span>
                        </li>
                      )}
                      {usesLeft !== null && (
                        <li className="flex items-center justify-between text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-[#f5b754]" />
                            {t.promotions.usesLeft}
                          </span>
                          <span className={`font-semibold ${usesLeft < 5 ? "text-red-400" : "text-white"}`}>
                            {usesLeft}
                          </span>
                        </li>
                      )}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => navigate("/cars")}
                      className="w-full py-2.5 rounded-xl bg-[#f5b754]/10 border border-[#f5b754]/30 text-[#f5b754] hover:bg-[#f5b754]/20 transition text-xs font-bold uppercase tracking-widest"
                    >
                      {t.promotions.apply}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
};

export default Promotions;
