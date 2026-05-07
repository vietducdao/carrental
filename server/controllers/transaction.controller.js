import Transaction from "../models/Transaction.js";
import Booking from "../models/Booking.js";

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "", method = "", search = "", from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    let query = Transaction.find(filter)
      .populate("booking", "customer email phone pickupDate returnDate")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    let transactions = await query.skip((page - 1) * Number(limit)).limit(Number(limit));

    if (search) {
      const q = String(search).toLowerCase();
      transactions = transactions.filter((tx) => {
        const customer = tx.booking?.customer?.toLowerCase() || "";
        const email = tx.booking?.email?.toLowerCase() || tx.user?.email?.toLowerCase() || "";
        const id = String(tx._id).toLowerCase();
        const ref = (tx.gatewayRef || "").toLowerCase();
        return customer.includes(q) || email.includes(q) || id.includes(q) || ref.includes(q);
      });
    }

    const total = await Transaction.countDocuments(filter);

    const summaryAgg = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const summary = { success: { count: 0, total: 0 }, pending: { count: 0, total: 0 }, failed: { count: 0, total: 0 }, refunded: { count: 0, total: 0 } };
    summaryAgg.forEach((row) => {
      if (summary[row._id]) summary[row._id] = { count: row.count, total: row.total };
    });

    res.json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      summary,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "success", "failed", "refunded"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Không tìm thấy giao dịch" });

    transaction.status = status;
    await transaction.save();

    if (status === "refunded" && transaction.booking) {
      await Booking.findByIdAndUpdate(transaction.booking, { paymentStatus: "refunded" });
    } else if (status === "success" && transaction.booking) {
      await Booking.findByIdAndUpdate(transaction.booking, { paymentStatus: "paid" });
    }

    const populated = await Transaction.findById(transaction._id)
      .populate("booking", "customer email phone pickupDate returnDate")
      .populate("user", "name email");
    res.json({ transaction: populated });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
    res.status(500).json({ message: err.message });
  }
};

export const mockPayment = async (req, res) => {
  try {
    const { bookingId, amount, method = "mock" } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn đặt xe" });

    const gatewayRef = `MOCK-${Date.now()}`;
    const transaction = await Transaction.create({
      booking: booking._id,
      user: req.user.id,
      amount: Number(amount),
      method,
      status: "success",
      gatewayRef,
      description: `Payment for booking ${booking._id}`,
    });

    booking.paymentStatus = "paid";
    booking.paymentMethod = method;
    booking.status = "confirmed";
    booking.transactionId = transaction._id;
    await booking.save();

    res.json({ transaction, booking, message: "Thanh toán thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
