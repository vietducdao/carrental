import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "Staff", trim: true },
    department: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    education: { type: String, default: "" },
    achievement: { type: String, default: "" },
    socials: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
    },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ isActive: 1, order: 1 });

export default mongoose.model("TeamMember", teamMemberSchema);
