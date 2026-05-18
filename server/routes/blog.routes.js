import { Router } from "express";
import { getBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost } from "../controllers/blog.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/", getBlogPosts);
router.get("/:id", getBlogPostById);
router.post("/", verifyToken, requireAdmin, upload.single("image"), createBlogPost);
router.patch("/:id", verifyToken, requireAdmin, upload.single("image"), updateBlogPost);
router.delete("/:id", verifyToken, requireAdmin, deleteBlogPost);
export default router;
