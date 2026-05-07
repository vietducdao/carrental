import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, getMyProfile, updateMyProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
router.get("/me/profile", verifyToken, getMyProfile);
router.patch("/me/profile", verifyToken, updateMyProfile);
router.get("/", verifyToken, requireAdmin, getUsers);
router.get("/:id", verifyToken, requireAdmin, getUserById);
router.post("/", verifyToken, requireAdmin, createUser);
router.patch("/:id", verifyToken, requireAdmin, updateUser);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);
export default router;
