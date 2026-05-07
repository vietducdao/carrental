import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/", getCategories);
router.post("/", verifyToken, requireAdmin, createCategory);
router.patch("/:id", verifyToken, requireAdmin, updateCategory);
router.delete("/:id", verifyToken, requireAdmin, deleteCategory);
export default router;
