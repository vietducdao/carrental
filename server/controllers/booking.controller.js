import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Voucher from "../models/Voucher.js";

export const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "", paymentStatus = "", from, to } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { customer: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { "carSnapshot.make": { $regex: search, $options: "i" } },
      { "carSnapshot.model": { $regex: search, $options: "i" } },
    ];
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (from || to) {
      filter.pickupDate = {};
      if (from) filter.pickupDate.$gte = new Date(from);
      if (to) filter.pickupDate.$lte = new Date(to);
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("car", "make model year image")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ bookings, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("car", "make model year image dailyRate category")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("user", "name email phone");
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn đặt xe" });
    // Non-admin can only view own booking
    if (req.user.role !== "admin" && String(booking.user?._id) !== req.user.id)
      return res.status(403).json({ message: "Không có quyền truy cập" });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, customer, email, phone, address, notes, voucherId, pickupLocation, dropoffLocation } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Không tìm thấy xe" });
    if (car.status !== "available") return res.status(400).json({ message: "Xe hiện không có sẵn" });

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (returnD <= pickup) return res.status(400).json({ message: "Ngày trả phải sau ngày nhận" });

    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    const subtotal = days * car.dailyRate;

    let discount = 0;
    let voucherRef = undefined;
    if (voucherId) {
      const voucher = await Voucher.findById(voucherId);
      if (voucher) {
        const check = voucher.isValid(subtotal);
        if (check.valid) {
          discount = voucher.computeDiscount(subtotal);
          voucherRef = voucher._id;
          voucher.usedCount = (voucher.usedCount || 0) + 1;
          await voucher.save();
        }
      }
    }
    const amount = Math.max(0, subtotal - discount);

    const booking = await Booking.create({
      user: req.user.id,
      car: car._id,
      carSnapshot: { make: car.make, model: car.model, year: car.year, dailyRate: car.dailyRate, image: car.image },
      carImage: car.image,
      customer: customer || req.user.name,
      email: email || req.user.email,
      phone, address, notes,
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      pickupDate: pickup,
      returnDate: returnD,
      amount,
      discount,
      voucher: voucherRef,
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const allowed = ["status", "notes", "paymentStatus", "paymentMethod", "phone", "address"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("car", "make model year image")
      .populate("user", "name email");
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn" });
    res.json({ booking });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID đơn không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: "cancelled" }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn" });
    res.json({ message: "Đã hủy đơn đặt xe", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
