import { Router } from "express";
import { sendMessage, getChatHistory, getAllSessions, deleteSession } from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();
// Public chat - guests and logged-in users
router.post("/message", sendMessage);
router.get("/history/:sessionId", getChatHistory);

// Admin - manage chat sessions
router.get("/sessions", verifyToken, requireAdmin, getAllSessions);
router.delete("/sessions/:sessionId", verifyToken, requireAdmin, deleteSession);

export default router;
