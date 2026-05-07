import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Car from "../models/Car.js";

const parseDateRange = ({ from, to }) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }
  return Object.keys(range).length ? range : null;
};

export const getRevenue = async (req, res) => {
  try {
    const { from, to, period = "day" } = req.query;
    const groupBy = period === "month" ? "month" : period === "week" ? "week" : "day";

    const match = { status: "success" };
    const range = parseDateRange({ from, to });
    if (range) match.createdAt = range;

    const formatMap = {
      day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      week: {
        $concat: [
          { $toString: { $isoWeekYear: "$createdAt" } },
          "-W",
          {
            $toString: {
              $cond: [
                { $lt: [{ $isoWeek: "$createdAt" }, 10] },
                { $concat: ["0", { $toString: { $isoWeek: "$createdAt" } }] },
                { $toString: { $isoWeek: "$createdAt" } },
              ],
            },
          },
        ],
      },
    };

    const revenue = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: formatMap[groupBy], total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = revenue.reduce((s, r) => s + r.total, 0);
    const totalCount = revenue.reduce((s, r) => s + r.count, 0);
    res.json({ revenue, totalRevenue, totalCount, period: groupBy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingsSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    const range = parseDateRange({ from, to });
    if (range) match.createdAt = range;

    const byStatusAgg = await Booking.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
    ]);

    const total = byStatusAgg.reduce((s, r) => s + r.count, 0);
    const totalRevenue = byStatusAgg
      .filter((r) => r._id === "completed" || r._id === "active")
      .reduce((s, r) => s + (r.totalAmount || 0), 0);

    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalCars = await Car.countDocuments({ isActive: true });

    res.json({
      byStatus: byStatusAgg,
      total,
      totalRevenue,
      totalUsers,
      totalCars,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopCars = async (req, res) => {
  try {
    const { from, to, limit = 5 } = req.query;
    const match = { status: { $in: ["confirmed", "active", "completed"] } };
    const range = parseDateRange({ from, to });
    if (range) match.createdAt = range;

    const top = await Booking.aggregate([
      { $match: match },
      { $group: { _id: "$car", bookingCount: { $sum: 1 }, totalRevenue: { $sum: "$amount" } } },
      { $sort: { bookingCount: -1, totalRevenue: -1 } },
      { $limit: Number(limit) || 5 },
      { $lookup: { from: "cars", localField: "_id", foreignField: "_id", as: "car" } },
      { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          bookingCount: 1,
          totalRevenue: 1,
          make: "$car.make",
          model: "$car.model",
          year: "$car.year",
          image: "$car.image",
          category: "$car.category",
          dailyRate: "$car.dailyRate",
        },
      },
    ]);

    res.json({ topCars: top });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 8)
      .populate("car", "make model")
      .lean();
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 8)
      .populate("booking", "customer")
      .lean();
    res.json({ recentBookings, recentTransactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const exportData = async (req, res) => {
  try {
    const { type = "bookings", from, to } = req.query;
    const range = parseDateRange({ from, to });
    if (type === "revenue") {
      const filter = {};
      if (range) filter.createdAt = range;
      const transactions = await Transaction.find(filter)
        .populate("booking", "customer email")
        .lean();
      return res.json({ transactions });
    }
    const filter = {};
    if (range) filter.createdAt = range;
    const bookings = await Booking.find(filter)
      .populate("car", "make model year")
      .populate("user", "name email")
      .lean();
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
