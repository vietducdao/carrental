import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const { active, home } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === "true";
    if (home !== undefined) filter.showOnHome = home === "true";
    const items = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ services: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, icon, order, showOnHome, isActive } = req.body;
    if (!title || !String(title).trim()) return res.status(400).json({ message: "Tiêu đề là bắt buộc" });
    const item = await Service.create({
      title: String(title).trim(),
      description: description || "",
      icon: icon || "",
      order: order ? Number(order) : 0,
      showOnHome: showOnHome === true || showOnHome === "true",
      isActive: isActive === undefined ? true : isActive === true || isActive === "true",
    });
    res.status(201).json({ service: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { title, description, icon, order, showOnHome, isActive } = req.body;
    const update = {};
    if (title !== undefined) {
      const t = String(title).trim();
      if (!t) return res.status(400).json({ message: "Tiêu đề không được để trống" });
      update.title = t;
    }
    if (description !== undefined) update.description = description;
    if (icon !== undefined) update.icon = icon;
    if (order !== undefined) update.order = Number(order);
    if (showOnHome !== undefined) update.showOnHome = showOnHome === true || showOnHome === "true";
    if (isActive !== undefined) update.isActive = isActive === true || isActive === "true";

    if (Object.keys(update).length === 0) return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });

    const item = await Service.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({ service: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json({ message: "Đã xóa" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};
