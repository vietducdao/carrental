import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
