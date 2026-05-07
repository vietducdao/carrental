import Voucher from "../models/Voucher.js";

export const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPublicVouchers = async (req, res) => {
  try {
    const now = new Date();
    const vouchers = await Voucher.find({
      isActive: true,
      $and: [
        { $or: [{ validFrom: null }, { validFrom: { $lte: now } }] },
        { $or: [{ validUntil: null }, { validUntil: { $gte: now } }] },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const filtered = vouchers.filter((v) => !v.usageLimit || v.usedCount < v.usageLimit);
    res.json({ vouchers: filtered });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validateVoucher = async (req, res) => {
  try {
    const { code, orderValue = 0 } = req.body;
    const voucher = await Voucher.findOne({ code: code?.toUpperCase() });
    if (!voucher) return res.status(404).json({ message: "Mã giảm giá không tồn tại" });

    const check = voucher.isValid(Number(orderValue));
    if (!check.valid) return res.status(400).json({ message: check.reason });

    const discount = voucher.computeDiscount(Number(orderValue));
    res.json({ voucher, discount, finalAmount: Number(orderValue) - discount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ALLOWED_VOUCHER_FIELDS = [
  "code", "discountType", "discountValue", "minOrderValue",
  "maxDiscount", "usageLimit", "validFrom", "validUntil", "isActive",
];

const sanitizeVoucherPayload = (body, { partial = false } = {}) => {
  const out = {};
  for (const key of ALLOWED_VOUCHER_FIELDS) {
    if (body[key] !== undefined && body[key] !== "") out[key] = body[key];
  }
  if (out.code) out.code = String(out.code).toUpperCase().trim();
  if (out.discountValue !== undefined) out.discountValue = Number(out.discountValue);
  if (out.minOrderValue !== undefined) out.minOrderValue = Number(out.minOrderValue);
  if (out.maxDiscount !== undefined) out.maxDiscount = Number(out.maxDiscount);
  if (out.usageLimit !== undefined) out.usageLimit = Number(out.usageLimit);
  if (out.isActive !== undefined) out.isActive = Boolean(out.isActive);

  if (!partial) {
    if (!out.code) return { error: "Mã voucher là bắt buộc" };
    if (!out.discountType || !["percent", "fixed"].includes(out.discountType)) {
      return { error: "Loại giảm giá không hợp lệ" };
    }
    if (out.discountValue === undefined || Number.isNaN(out.discountValue) || out.discountValue <= 0) {
      return { error: "Giá trị giảm phải lớn hơn 0" };
    }
  }
  if (out.discountType === "percent" && out.discountValue !== undefined && out.discountValue > 100) {
    return { error: "Phần trăm giảm không được vượt quá 100" };
  }
  if (out.validFrom && out.validUntil && new Date(out.validUntil) <= new Date(out.validFrom)) {
    return { error: "Ngày kết thúc phải sau ngày bắt đầu" };
  }
  return { value: out };
};

export const createVoucher = async (req, res) => {
  try {
    const { error, value } = sanitizeVoucherPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const voucher = await Voucher.create(value);
    res.status(201).json(voucher);
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.code === 11000) return res.status(409).json({ message: "Mã voucher đã tồn tại" });
    res.status(500).json({ message: err.message });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const { error, value } = sanitizeVoucherPayload(req.body, { partial: true });
    if (error) return res.status(400).json({ message: error });
    if (Object.keys(value).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const voucher = await Voucher.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher" });
    res.json(voucher);
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.code === 11000) return res.status(409).json({ message: "Mã voucher đã tồn tại" });
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Không tìm thấy voucher" });
    res.json({ message: "Đã xóa voucher" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};
