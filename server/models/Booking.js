import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
    carSnapshot: { type: Object, default: {} },
    customer: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    sameDayReturn: { type: Boolean, default: false },
    pickupLocation: { type: String, default: "" },
    dropoffLocation: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
    amount: { type: Number, default: 0 },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
    discount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    paymentMethod: { type: String, enum: ["cash", "card", "mock"], default: "cash" },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    notes: { type: String, default: "" },
    carImage: { type: String, default: "" },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1 });

export default mongoose.model("Booking", bookingSchema);
