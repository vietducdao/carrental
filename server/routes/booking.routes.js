import { Router } from "express";
import { getBookings, getMyBookings, getBookingById, createBooking, updateBooking, deleteBooking } from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/my", verifyToken, getMyBookings);
router.get("/", verifyToken, requireAdmin, getBookings);
router.get("/:id", verifyToken, getBookingById);
router.post("/", verifyToken, createBooking);
router.patch("/:id", verifyToken, requireAdmin, updateBooking);
router.delete("/:id", verifyToken, requireAdmin, deleteBooking);
export default router;
