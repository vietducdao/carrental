import ChatMessage from "../models/ChatMessage.js";
import Car from "../models/Car.js";
import Service from "../models/Service.js";
import SiteSetting from "../models/SiteSetting.js";
import User from "../models/User.js";
import { getChatResponse } from "../services/claude.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim() || !sessionId)
      return res.status(400).json({ message: "Thiếu nội dung tin nhắn hoặc sessionId" });

    // Save user message
    await ChatMessage.create({
      sessionId,
      user: req.user?.id || null,
      role: "user",
      content: message.trim(),
    });

    // Build history (last 6 messages — keep token usage low for free tier)
    const history = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    const formattedHistory = history
      .reverse()
      .map((m) => ({ role: m.role, content: m.content }));

    // Build rich context: cars + services + site settings + user info (parallel)
    const [cars, services, settings, user] = await Promise.all([
      Car.find({ status: "available", isActive: true })
        .select("_id make model year category dailyRate seats transmission fuelType")
        .limit(8)
        .lean(),
      Service.find({ isActive: true })
        .select("title description icon")
        .sort({ order: 1 })
        .limit(8)
        .lean(),
      SiteSetting.findOne().lean(),
      req.user?.id ? User.findById(req.user.id).select("name email phone").lean() : null,
    ]);

    const reply = await getChatResponse(formattedHistory, { cars, services, settings, user });

    // Save assistant reply
    await ChatMessage.create({ sessionId, role: "assistant", content: reply });

    res.json({ reply, sessionId });
  } catch (err) {
    console.error("Chat error:", err.message);
    if (err.stack) console.error(err.stack);
    // Surface API config / auth errors so admin can diagnose quickly
    const isConfigError = /ANTHROPIC_API_KEY/i.test(err.message);
    const isAuthError = err.status === 401 || /authentication|invalid api key/i.test(err.message);
    const isRateLimit = err.status === 429;
    let message = "Không thể xử lý tin nhắn lúc này, vui lòng thử lại.";
    if (isConfigError) message = "Chatbot chưa được cấu hình API key. Vui lòng liên hệ admin.";
    else if (isAuthError) message = "API key không hợp lệ. Vui lòng kiểm tra cấu hình.";
    else if (isRateLimit) message = "Quá nhiều yêu cầu, vui lòng thử lại sau ít phút.";
    res.status(500).json({ message });
  }
};

// Public: load own session history (no auth required, scoped by sessionId)
export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ message: "Thiếu sessionId" });
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .select("role content createdAt")
      .lean();
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: clear own session
export const clearSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ message: "Thiếu sessionId" });
    const result = await ChatMessage.deleteMany({ sessionId });
    res.json({ message: "Đã xóa phiên chat", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("user", "name email");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$sessionId",
          user: { $first: "$user" },
          messageCount: { $sum: 1 },
          lastMessage: { $first: "$content" },
          lastRole: { $first: "$role" },
          lastAt: { $first: "$createdAt" },
          firstAt: { $last: "$createdAt" },
        },
      },
      { $sort: { lastAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          userInfo: { $arrayElemAt: ["$userInfo", 0] },
        },
      },
      {
        $project: {
          sessionId: "$_id",
          _id: 0,
          messageCount: 1,
          lastMessage: 1,
          lastRole: 1,
          lastAt: 1,
          firstAt: 1,
          "userInfo.name": 1,
          "userInfo.email": 1,
          "userInfo._id": 1,
        },
      },
    ]);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const result = await ChatMessage.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: "Đã xóa phiên chat", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
