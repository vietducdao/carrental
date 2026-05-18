import TeamMember from "../models/TeamMember.js";

const parseSocials = (body) => {
  const s = {};
  if (body.facebook !== undefined) s.facebook = body.facebook;
  if (body.twitter !== undefined) s.twitter = body.twitter;
  if (body.instagram !== undefined) s.instagram = body.instagram;
  if (body.tiktok !== undefined) s.tiktok = body.tiktok;
  return s;
};

export const getTeamMembers = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === "true";
    const items = await TeamMember.find(filter).sort({ isFeatured: -1, order: 1, createdAt: -1 });
    res.json({ members: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, role, department, email, bio, education, achievement, order, isFeatured, isActive } = req.body;
    if (!name || !String(name).trim()) return res.status(400).json({ message: "Tên là bắt buộc" });
    const image = req.file ? req.file.filename : "";
    const item = await TeamMember.create({
      name: String(name).trim(),
      role: role || "Staff",
      department: department || "",
      email: email || "",
      image,
      bio: bio || "",
      education: education || "",
      achievement: achievement || "",
      socials: parseSocials(req.body),
      isFeatured: isFeatured === true || isFeatured === "true",
      order: order ? Number(order) : 0,
      isActive: isActive === undefined ? true : isActive === true || isActive === "true",
    });
    res.status(201).json({ member: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { name, role, department, email, bio, education, achievement, order, isFeatured, isActive } = req.body;
    const update = {};
    if (name !== undefined) {
      const t = String(name).trim();
      if (!t) return res.status(400).json({ message: "Tên không được để trống" });
      update.name = t;
    }
    if (role !== undefined) update.role = role;
    if (department !== undefined) update.department = department;
    if (email !== undefined) update.email = email;
    if (bio !== undefined) update.bio = bio;
    if (education !== undefined) update.education = education;
    if (achievement !== undefined) update.achievement = achievement;
    if (order !== undefined) update.order = Number(order);
    if (isFeatured !== undefined) update.isFeatured = isFeatured === true || isFeatured === "true";
    if (isActive !== undefined) update.isActive = isActive === true || isActive === "true";
    if (req.file) update.image = req.file.filename;

    const socials = parseSocials(req.body);
    if (Object.keys(socials).length) {
      // merge existing socials so partial updates don't wipe other fields
      const existing = await TeamMember.findById(req.params.id, { socials: 1 });
      update.socials = { ...(existing?.socials || {}), ...socials };
    }

    if (Object.keys(update).length === 0) return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });

    const item = await TeamMember.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Không tìm thấy thành viên" });
    res.json({ member: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const item = await TeamMember.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy thành viên" });
    res.json({ message: "Đã xóa" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};
