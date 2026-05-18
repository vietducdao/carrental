import { Router } from "express";
import { getServices, createService, updateService, deleteService } from "../controllers/service.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/", getServices);
router.post("/", verifyToken, requireAdmin, createService);
router.patch("/:id", verifyToken, requireAdmin, updateService);
router.delete("/:id", verifyToken, requireAdmin, deleteService);
export default router;
