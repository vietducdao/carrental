import ChatMessage from "../models/ChatMessage.js";
import Car from "../models/Car.js";
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

    // Build history (last 10 messages)
    const history = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const formattedHistory = history
      .reverse()
      .map((m) => ({ role: m.role, content: m.content }));

    // Get available cars for context
    const cars = await Car.find({ status: "available", isActive: true })
      .select("make model year category dailyRate seats")
      .limit(8)
      .lean();

    const reply = await getChatResponse(formattedHistory, cars);

    // Save assistant reply
    await ChatMessage.create({ sessionId, role: "assistant", content: reply });

    res.json({ reply, sessionId });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Không thể xử lý tin nhắn lúc này, vui lòng thử lại." });
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
