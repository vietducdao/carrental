import { Router } from "express";
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/team.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.get("/", getTeamMembers);
router.post("/", verifyToken, requireAdmin, upload.single("image"), createTeamMember);
router.patch("/:id", verifyToken, requireAdmin, upload.single("image"), updateTeamMember);
router.delete("/:id", verifyToken, requireAdmin, deleteTeamMember);
export default router;
