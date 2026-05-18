import { Router } from "express";
import { getSiteSettings, updateSiteSettings } from "../controllers/siteSetting.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/", getSiteSettings);
router.patch("/", verifyToken, requireAdmin, updateSiteSettings);
export default router;
