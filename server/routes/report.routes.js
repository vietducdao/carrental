import { Router } from "express";
import { getRevenue, getBookingsSummary, getTopCars, getRecentActivity, exportData } from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/revenue", verifyToken, requireAdmin, getRevenue);
router.get("/bookings-summary", verifyToken, requireAdmin, getBookingsSummary);
router.get("/top-cars", verifyToken, requireAdmin, getTopCars);
router.get("/recent-activity", verifyToken, requireAdmin, getRecentActivity);
router.get("/export", verifyToken, requireAdmin, exportData);
export default router;
