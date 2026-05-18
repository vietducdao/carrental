import { Router } from "express";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../controllers/testimonial.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/", getTestimonials);
router.post("/", verifyToken, requireAdmin, upload.single("avatar"), createTestimonial);
router.patch("/:id", verifyToken, requireAdmin, upload.single("avatar"), updateTestimonial);
router.delete("/:id", verifyToken, requireAdmin, deleteTestimonial);
export default router;
