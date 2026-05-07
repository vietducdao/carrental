import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    method: { type: String, enum: ["cash", "card", "mock"], default: "mock" },
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending" },
    gatewayRef: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
