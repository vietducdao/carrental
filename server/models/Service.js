import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" }, // emoji or icon name
    order: { type: Number, default: 0 },
    showOnHome: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ isActive: 1, order: 1 });

export default mongoose.model("Service", serviceSchema);
