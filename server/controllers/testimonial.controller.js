import Testimonial from "../models/Testimonial.js";

export const getTestimonials = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === "true";
    const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ testimonials: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, review, rating, order, isActive } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ message: "Tên là bắt buộc" });
    if (!review || !String(review).trim()) return res.status(400).json({ message: "Nội dung đánh giá là bắt buộc" });
    const avatar = req.file ? req.file.filename : "";
    const item = await Testimonial.create({
      name: String(name).trim(),
      role: role || "Customer",
      review: String(review).trim(),
      rating: rating ? Math.max(1, Math.min(5, Number(rating))) : 5,
      avatar,
      order: order ? Number(order) : 0,
      isActive: isActive === undefined ? true : isActive === true || isActive === "true",
    });
    res.status(201).json({ testimonial: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { name, role, review, rating, order, isActive } = req.body;
    const update = {};
    if (name !== undefined) {
      const t = String(name).trim();
      if (!t) return res.status(400).json({ message: "Tên không được để trống" });
      update.name = t;
    }
    if (role !== undefined) update.role = role;
    if (review !== undefined) {
      const t = String(review).trim();
      if (!t) return res.status(400).json({ message: "Nội dung không được để trống" });
      update.review = t;
    }
    if (rating !== undefined) update.rating = Math.max(1, Math.min(5, Number(rating)));
    if (order !== undefined) update.order = Number(order);
    if (isActive !== undefined) update.isActive = isActive === true || isActive === "true";
    if (req.file) update.avatar = req.file.filename;

    if (Object.keys(update).length === 0) return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });

    const item = await Testimonial.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json({ testimonial: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json({ message: "Đã xóa" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};
