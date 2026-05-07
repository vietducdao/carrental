import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Car from "../models/Car.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const removeUploadedFile = (file) => {
  if (!file?.filename) return;
  const fp = path.join(__dirname, "../uploads", file.filename);
  fs.unlink(fp, () => {});
};

export const getCars = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = "", category = "", status = "", minRate, maxRate, transmission = "", fuelType = "", seats = "", sort = "newest" } = req.query;
    const filter = { isActive: true };
    if (search) filter.$or = [
      { make: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (seats) filter.seats = Number(seats);
    if (minRate || maxRate) {
      filter.dailyRate = {};
      if (minRate) filter.dailyRate.$gte = Number(minRate);
      if (maxRate) filter.dailyRate.$lte = Number(maxRate);
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priceAsc: { dailyRate: 1 },
      priceDesc: { dailyRate: -1 },
      yearDesc: { year: -1 },
    };

    const total = await Car.countDocuments(filter);
    const cars = await Car.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ cars, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Không tìm thấy xe" });
    res.json({ car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const { make, model, year, dailyRate, category, seats, transmission, fuelType, mileage, description, color } = req.body;

    if (!make || !String(make).trim()) {
      removeUploadedFile(req.file);
      return res.status(400).json({ message: "Tên xe (make) là bắt buộc" });
    }
    if (!year || Number.isNaN(Number(year))) {
      removeUploadedFile(req.file);
      return res.status(400).json({ message: "Năm sản xuất không hợp lệ" });
    }
    if (dailyRate === undefined || dailyRate === "" || Number.isNaN(Number(dailyRate)) || Number(dailyRate) <= 0) {
      removeUploadedFile(req.file);
      return res.status(400).json({ message: "Giá thuê/ngày không hợp lệ" });
    }

    const image = req.file ? req.file.filename : "";
    const car = await Car.create({
      make: String(make).trim(),
      model: model ? String(model).trim() : "",
      year: Number(year),
      dailyRate: Number(dailyRate),
      category: category || "Sedan",
      seats: Number(seats) || 4,
      transmission: transmission || "Automatic",
      fuelType: fuelType || "Petrol",
      mileage: Number(mileage) || 0,
      description: description || "",
      color: color || "",
      image,
    });
    res.status(201).json(car);
  } catch (err) {
    removeUploadedFile(req.file);
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

const ALLOWED_UPDATE_FIELDS = [
  "make", "model", "year", "dailyRate", "category", "seats",
  "transmission", "fuelType", "mileage", "description", "color", "status",
];
const NUMERIC_FIELDS = new Set(["year", "dailyRate", "seats", "mileage"]);

const sanitizeImageFilename = (val) => {
  if (!val) return "";
  let s = String(val).trim();
  if (/^https?:\/\//i.test(s)) {
    const idx = s.lastIndexOf("/uploads/");
    s = idx !== -1 ? s.slice(idx + "/uploads/".length) : s.slice(s.lastIndexOf("/") + 1);
  }
  return s.replace(/^\/+/, "").replace(/^uploads\//, "");
};

export const updateCar = async (req, res) => {
  try {
    const updates = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== "") {
        updates[key] = NUMERIC_FIELDS.has(key) ? Number(req.body[key]) : req.body[key];
      }
    }

    for (const key of NUMERIC_FIELDS) {
      if (updates[key] !== undefined && Number.isNaN(updates[key])) {
        removeUploadedFile(req.file);
        return res.status(400).json({ message: `Trường ${key} không hợp lệ` });
      }
    }

    if (req.file) {
      updates.image = req.file.filename;
    } else if (req.body.image !== undefined) {
      const cleaned = sanitizeImageFilename(req.body.image);
      if (cleaned) updates.image = cleaned;
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      removeUploadedFile(req.file);
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }
    res.json(car);
  } catch (err) {
    removeUploadedFile(req.file);
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID xe không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!car) return res.status(404).json({ message: "Không tìm thấy xe" });
    res.json({ message: "Đã xóa xe" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
