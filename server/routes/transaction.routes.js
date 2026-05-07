import { Router } from "express";
import { getTransactions, mockPayment, updateTransactionStatus } from "../controllers/transaction.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/", verifyToken, requireAdmin, getTransactions);
router.patch("/:id", verifyToken, requireAdmin, updateTransactionStatus);
router.post("/mock-payment", verifyToken, mockPayment);
export default router;
