import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import carRoutes from "./routes/car.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import voucherRoutes from "./routes/voucher.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import reportRoutes from "./routes/report.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import teamRoutes from "./routes/team.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import siteSettingRoutes from "./routes/siteSetting.routes.js";
import { activeProvider } from "./services/claude.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve uploaded car images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/site-settings", siteSettingRoutes);

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Chatbot AI provider: ${activeProvider}`);
    if (activeProvider === "rule-based") {
      console.log("  → Set GEMINI_API_KEY (free) or ANTHROPIC_API_KEY in .env to enable AI");
      console.log("  → Free Gemini key: https://aistudio.google.com/apikey");
    }
  });
});
