import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
    if (role) filter.role = role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Tên là bắt buộc" });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ message: "Email là bắt buộc" });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }
    if (role && !["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      phone: phone || "",
      role: role || "customer",
    });
    res.status(201).json({ user: user.toSafeObject() });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, isActive, role } = req.body;
    const isSelf = String(req.params.id) === String(req.user.id);

    if (isSelf && role !== undefined) {
      return res.status(400).json({ message: "Không thể tự thay đổi vai trò của chính mình" });
    }
    if (isSelf && isActive !== undefined) {
      return res.status(400).json({ message: "Không thể tự thay đổi trạng thái tài khoản của chính mình" });
    }

    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (email !== undefined) update.email = String(email).trim().toLowerCase();
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;
    if (isActive !== undefined) update.isActive = Boolean(isActive);
    if (role !== undefined) {
      if (!["customer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Vai trò không hợp lệ" });
      }
      update.role = role;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ user });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ message: "Không thể tự xóa tài khoản của chính mình" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Đã xóa người dùng" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const update = {};
    if (name) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;
    if (avatar !== undefined) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
