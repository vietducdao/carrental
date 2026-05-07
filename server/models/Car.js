import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, default: "", trim: true },
    year: { type: Number, required: true },
    color: { type: String, default: "" },
    category: { type: String, default: "Sedan" },
    seats: { type: Number, default: 4 },
    transmission: { type: String, enum: ["Automatic", "Manual", "CVT"], default: "Automatic" },
    fuelType: { type: String, default: "Petrol" },
    mileage: { type: Number, default: 0 },
    dailyRate: { type: Number, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: String, enum: ["available", "rented", "maintenance"], default: "available" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

carSchema.index({ make: "text", model: "text" });
carSchema.index({ category: 1, status: 1 });

export default mongoose.model("Car", carSchema);
