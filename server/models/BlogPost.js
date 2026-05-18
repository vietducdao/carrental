import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, default: "", trim: true, lowercase: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    author: { type: String, default: "Admin" },
    category: { type: String, default: "News" },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogPostSchema.index({ title: "text", excerpt: "text", content: "text" });
blogPostSchema.index({ category: 1, isPublished: 1 });

export default mongoose.model("BlogPost", blogPostSchema);
