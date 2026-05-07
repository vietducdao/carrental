import { Router } from "express";
import { register, login, getMe, changePassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.patch("/change-password", verifyToken, changePassword);
export default router;
