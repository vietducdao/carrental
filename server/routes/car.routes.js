import { Router } from "express";
import { getCars, getCarById, createCar, updateCar, deleteCar } from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/", verifyToken, requireAdmin, upload.single("image"), createCar);
router.patch("/:id", verifyToken, requireAdmin, upload.single("image"), updateCar);
router.delete("/:id", verifyToken, requireAdmin, deleteCar);
export default router;
