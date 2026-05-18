import BlogPost from "../models/BlogPost.js";

const toSlug = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = "", category = "", published } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (published !== undefined) filter.isPublished = published === "true";

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ posts, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json({ post });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags, isPublished } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Tiêu đề là bắt buộc" });
    }
    const image = req.file ? req.file.filename : "";
    const post = await BlogPost.create({
      title: String(title).trim(),
      slug: toSlug(title),
      excerpt: excerpt || "",
      content: content || "",
      image,
      author: author || "Admin",
      category: category || "News",
      tags: Array.isArray(tags) ? tags : tags ? String(tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
      isPublished: isPublished === undefined ? true : isPublished === true || isPublished === "true",
    });
    res.status(201).json({ post });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags, isPublished } = req.body;
    const update = {};
    if (title !== undefined) {
      const trimmed = String(title).trim();
      if (!trimmed) return res.status(400).json({ message: "Tiêu đề không được để trống" });
      update.title = trimmed;
      update.slug = toSlug(trimmed);
    }
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (content !== undefined) update.content = content;
    if (author !== undefined) update.author = author;
    if (category !== undefined) update.category = category;
    if (tags !== undefined) {
      update.tags = Array.isArray(tags)
        ? tags
        : String(tags).split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (isPublished !== undefined) update.isPublished = isPublished === true || isPublished === "true";
    if (req.file) update.image = req.file.filename;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json({ post });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json({ message: "Đã xóa bài viết" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};
