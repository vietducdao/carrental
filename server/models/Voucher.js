import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percent", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, default: null },
    validUntil: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

voucherSchema.methods.isValid = function (orderValue = 0) {
  if (!this.isActive) return { valid: false, reason: "Voucher không còn hiệu lực" };
  if (this.usageLimit && this.usedCount >= this.usageLimit)
    return { valid: false, reason: "Voucher đã hết lượt sử dụng" };
  const now = new Date();
  if (this.validFrom && now < this.validFrom)
    return { valid: false, reason: "Voucher chưa đến ngày hiệu lực" };
  if (this.validUntil && now > this.validUntil)
    return { valid: false, reason: "Voucher đã hết hạn" };
  if (orderValue < this.minOrderValue)
    return { valid: false, reason: `Đơn hàng tối thiểu $${this.minOrderValue}` };
  return { valid: true };
};

voucherSchema.methods.computeDiscount = function (orderValue) {
  if (this.discountType === "percent") {
    const disc = (orderValue * this.discountValue) / 100;
    return this.maxDiscount ? Math.min(disc, this.maxDiscount) : disc;
  }
  return Math.min(this.discountValue, orderValue);
};

export default mongoose.model("Voucher", voucherSchema);
