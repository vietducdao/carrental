import { Router } from "express";
import { getVouchers, getPublicVouchers, validateVoucher, createVoucher, updateVoucher, deleteVoucher } from "../controllers/voucher.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
// Public - active vouchers visible to anyone
router.get("/public", getPublicVouchers);
router.post("/validate", verifyToken, validateVoucher);

// Admin only - full CRUD
router.get("/", verifyToken, requireAdmin, getVouchers);
router.post("/", verifyToken, requireAdmin, createVoucher);
router.patch("/:id", verifyToken, requireAdmin, updateVoucher);
router.delete("/:id", verifyToken, requireAdmin, deleteVoucher);
export default router;
