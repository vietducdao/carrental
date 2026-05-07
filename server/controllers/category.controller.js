import Category from "../models/Category.js";
import Car from "../models/Car.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    // Attach car count per category
    const withCount = await Promise.all(
      categories.map(async (c) => {
        const count = await Car.countDocuments({ category: c.name, isActive: true });
        return { ...c.toObject(), carCount: count };
      })
    );
    res.json(withCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }
    const trimmedName = String(name).trim();
    if (await Category.findOne({ name: trimmedName })) {
      return res.status(409).json({ message: "Danh mục đã tồn tại" });
    }
    const cat = await Category.create({
      name: trimmedName,
      description: description || "",
      icon: icon || "",
    });
    res.status(201).json(cat);
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Danh mục đã tồn tại" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;
    const update = {};
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) return res.status(400).json({ message: "Tên danh mục không được để trống" });
      update.name = trimmed;
    }
    if (description !== undefined) update.description = description;
    if (icon !== undefined) update.icon = icon;
    if (isActive !== undefined) update.isActive = Boolean(isActive);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const cat = await Category.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(cat);
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Danh mục đã tồn tại" });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json({ message: "Đã xóa danh mục", category: cat });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};
