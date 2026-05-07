import "dotenv/config";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Car from "./models/Car.js";
import Voucher from "./models/Voucher.js";
import Booking from "./models/Booking.js";
import Transaction from "./models/Transaction.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");

const downloadImage = async (url, basename) => {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = res.headers.get("content-type") || "";
  const ext = ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg";
  const filename = `seed-${basename}.${ext}`;
  await writeFile(path.join(uploadsDir, filename), buf);
  return filename;
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
};
const daysAhead = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(10, 0, 0, 0);
  return d;
};
const between = (start, end) => {
  const ms = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, ms);
};

const log = (msg, ...rest) => console.log(`\x1b[36m[seed]\x1b[0m ${msg}`, ...rest);
const ok = (msg, ...rest) => console.log(`\x1b[32m[seed]\x1b[0m ${msg}`, ...rest);

const main = async () => {
  await connectDB();

  log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Car.deleteMany({}),
    Voucher.deleteMany({}),
    Booking.deleteMany({}),
    Transaction.deleteMany({}),
  ]);

  // ─── Categories ────────────────────────────────────────────────────
  log("Seeding categories...");
  const categoryDefs = [
    { name: "Sedan", icon: "🚗", description: "Phân khúc xe 4 cửa thoải mái cho gia đình và doanh nhân." },
    { name: "SUV", icon: "🚙", description: "Xe gầm cao đa dụng, lý tưởng cho mọi địa hình." },
    { name: "Sports", icon: "🏎️", description: "Xe thể thao mạnh mẽ với thiết kế khí động học." },
    { name: "Coupe", icon: "🚘", description: "Xe 2 cửa thanh lịch, phong cách trẻ trung." },
    { name: "Hatchback", icon: "🚐", description: "Xe nhỏ gọn, tiết kiệm và linh hoạt trong đô thị." },
    { name: "Luxury", icon: "💎", description: "Phân khúc cao cấp với nội thất sang trọng." },
  ];
  await Category.insertMany(categoryDefs);
  ok(`✔ ${categoryDefs.length} categories`);

  // ─── Users ─────────────────────────────────────────────────────────
  log("Seeding users...");
  const userDefs = [
    {
      name: "Admin Carrental",
      email: "admin@carrental.com",
      password: "admin123",
      phone: "0900000000",
      role: "admin",
      isActive: true,
    },
    {
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      password: "customer123",
      phone: "0901234567",
      role: "customer",
      isActive: true,
      address: { street: "123 Lê Lợi, Phường Bến Thành", city: "Quận 1", state: "TP. Hồ Chí Minh", zipCode: "70000" },
    },
    {
      name: "Trần Thị Bình",
      email: "binh.tran@example.com",
      password: "customer123",
      phone: "0902345678",
      role: "customer",
      isActive: true,
      address: { street: "45 Hai Bà Trưng", city: "Hoàn Kiếm", state: "Hà Nội", zipCode: "10000" },
    },
    {
      name: "Lê Hoàng Cường",
      email: "cuong.le@example.com",
      password: "customer123",
      phone: "0903456789",
      role: "customer",
      isActive: true,
      address: { street: "78 Trần Phú", city: "Hải Châu", state: "Đà Nẵng", zipCode: "50000" },
    },
    {
      name: "Phạm Mỹ Dung",
      email: "dung.pham@example.com",
      password: "customer123",
      phone: "0904567890",
      role: "customer",
      isActive: true,
      address: { street: "12 Nguyễn Huệ", city: "Quận 1", state: "TP. Hồ Chí Minh", zipCode: "70000" },
    },
    {
      name: "Đặng Quốc Em",
      email: "em.dang@example.com",
      password: "customer123",
      phone: "0905678901",
      role: "customer",
      isActive: false,
    },
    {
      name: "Vũ Thị Phương",
      email: "phuong.vu@example.com",
      password: "customer123",
      phone: "0906789012",
      role: "customer",
      isActive: true,
      address: { street: "99 Lý Thường Kiệt", city: "Hồng Bàng", state: "Hải Phòng", zipCode: "18000" },
    },
    {
      name: "Hoàng Anh Tuấn",
      email: "tuan.hoang@example.com",
      password: "customer123",
      phone: "0907890123",
      role: "customer",
      isActive: true,
    },
  ];

  const users = [];
  for (const u of userDefs) {
    users.push(await User.create(u));
  }
  const admin = users[0];
  const customers = users.slice(1);
  ok(`✔ ${users.length} users (1 admin + ${customers.length} customers)`);

  // ─── Cars ──────────────────────────────────────────────────────────
  log("Seeding cars...");
  await mkdir(uploadsDir, { recursive: true });

  const carDefs = [
    {
      make: "Toyota Camry", model: "XLE", year: 2023, color: "Trắng ngọc trai",
      category: "Sedan", seats: 5, transmission: "Automatic", fuelType: "Petrol",
      mileage: 32, dailyRate: 65, status: "available",
      description: "Sedan hạng D thoải mái, vận hành êm ái, phù hợp công tác và gia đình.",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80&auto=format&fit=crop",
      slug: "toyota-camry",
    },
    {
      make: "Honda Civic", model: "Sport", year: 2022, color: "Xám titanium",
      category: "Sedan", seats: 5, transmission: "CVT", fuelType: "Petrol",
      mileage: 35, dailyRate: 55, status: "available",
      description: "Civic Sport thiết kế thể thao, công nghệ Honda Sensing đầy đủ.",
      imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80&auto=format&fit=crop",
      slug: "honda-civic",
    },
    {
      make: "Hyundai Tucson", model: "Limited", year: 2024, color: "Đen huyền bí",
      category: "SUV", seats: 5, transmission: "Automatic", fuelType: "Hybrid",
      mileage: 38, dailyRate: 85, status: "rented",
      description: "Tucson 2024 với động cơ hybrid tiết kiệm, công nghệ SmartSense thế hệ mới.",
      imageUrl: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200&q=80&auto=format&fit=crop",
      slug: "hyundai-tucson",
    },
    {
      make: "Mazda CX-5", model: "Touring", year: 2023, color: "Đỏ Soul Crystal",
      category: "SUV", seats: 5, transmission: "Automatic", fuelType: "Petrol",
      mileage: 28, dailyRate: 75, status: "available",
      description: "Mazda CX-5 với thiết kế KODO mê hoặc và cảm giác lái G-Vectoring Plus.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80&auto=format&fit=crop",
      slug: "mazda-cx5",
    },
    {
      make: "BMW M4", model: "Competition", year: 2024, color: "Xanh Portimao",
      category: "Sports", seats: 4, transmission: "Automatic", fuelType: "Petrol",
      mileage: 18, dailyRate: 250, status: "available",
      description: "BMW M4 Competition - 503 mã lực, 0-100 km/h trong 3.9s.",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80&auto=format&fit=crop",
      slug: "bmw-m4",
    },
    {
      make: "Porsche 911", model: "Carrera S", year: 2023, color: "Bạc GT",
      category: "Sports", seats: 4, transmission: "Automatic", fuelType: "Petrol",
      mileage: 19, dailyRate: 400, status: "available",
      description: "Biểu tượng xe thể thao Đức với cảm giác lái thuần khiết.",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop",
      slug: "porsche-911",
    },
    {
      make: "Mercedes-Benz", model: "S-Class S500", year: 2024, color: "Đen Obsidian",
      category: "Luxury", seats: 5, transmission: "Automatic", fuelType: "Petrol",
      mileage: 23, dailyRate: 350, status: "available",
      description: "Mercedes S-Class - đỉnh cao công nghệ và xa xỉ, MBUX Hyperscreen.",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80&auto=format&fit=crop",
      slug: "mercedes-sclass",
    },
    {
      make: "Audi A8", model: "L 55 TFSI", year: 2023, color: "Trắng Glacier",
      category: "Luxury", seats: 5, transmission: "Automatic", fuelType: "Petrol",
      mileage: 22, dailyRate: 300, status: "maintenance",
      description: "Audi A8 L với hệ thống treo thích ứng và quattro AWD.",
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&auto=format&fit=crop",
      slug: "audi-a8",
    },
    {
      make: "Ford Mustang", model: "GT Premium", year: 2023, color: "Cam Race Red",
      category: "Coupe", seats: 4, transmission: "Manual", fuelType: "Petrol",
      mileage: 17, dailyRate: 180, status: "available",
      description: "Ford Mustang GT V8 5.0L âm thanh đặc trưng, đậm chất Mỹ.",
      imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80&auto=format&fit=crop",
      slug: "ford-mustang",
    },
    {
      make: "Volkswagen Golf", model: "GTI", year: 2023, color: "Trắng Pure",
      category: "Hatchback", seats: 5, transmission: "Automatic", fuelType: "Petrol",
      mileage: 30, dailyRate: 90, status: "available",
      description: "Hot hatch huyền thoại, 245 mã lực kết hợp tính thực dụng.",
      imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80&auto=format&fit=crop",
      slug: "vw-golf-gti",
    },
    {
      make: "Tesla Model 3", model: "Long Range", year: 2024, color: "Đỏ Multi-Coat",
      category: "Sedan", seats: 5, transmission: "Automatic", fuelType: "Electric",
      mileage: 130, dailyRate: 120, status: "available",
      description: "Tesla Model 3 Long Range - 568 km/lần sạc, Autopilot tiêu chuẩn.",
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80&auto=format&fit=crop",
      slug: "tesla-model3",
    },
    {
      make: "Kia Sorento", model: "SX Prestige", year: 2024, color: "Xám Steel Matte",
      category: "SUV", seats: 7, transmission: "Automatic", fuelType: "Diesel",
      mileage: 26, dailyRate: 95, status: "available",
      description: "Kia Sorento 7 chỗ rộng rãi, lý tưởng cho chuyến đi gia đình.",
      imageUrl: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80&auto=format&fit=crop",
      slug: "kia-sorento",
    },
  ];

  // Try to download each car image to uploads/. If it fails, fall back to direct URL.
  let downloaded = 0;
  let urlFallback = 0;
  for (const c of carDefs) {
    try {
      c.image = await downloadImage(c.imageUrl, c.slug);
      downloaded++;
    } catch (err) {
      c.image = c.imageUrl;
      urlFallback++;
      console.warn(`  ⚠ ${c.make}: download failed (${err.message}), using direct URL`);
    }
    delete c.imageUrl;
    delete c.slug;
  }
  ok(`✔ Images: ${downloaded} downloaded to /uploads, ${urlFallback} via direct URL`);

  const cars = await Car.insertMany(carDefs.map((c) => ({ ...c, isActive: true })));
  ok(`✔ ${cars.length} cars`);

  // ─── Vouchers ──────────────────────────────────────────────────────
  log("Seeding vouchers...");
  const voucherDefs = [
    {
      code: "WELCOME20",
      discountType: "percent", discountValue: 20,
      minOrderValue: 0, maxDiscount: 30,
      usageLimit: 1000, usedCount: 47,
      validFrom: daysAgo(30), validUntil: daysAhead(60),
      isActive: true,
    },
    {
      code: "SUMMER50",
      discountType: "fixed", discountValue: 50,
      minOrderValue: 200, maxDiscount: null,
      usageLimit: 100, usedCount: 23,
      validFrom: daysAgo(15), validUntil: daysAhead(45),
      isActive: true,
    },
    {
      code: "VIP100",
      discountType: "fixed", discountValue: 100,
      minOrderValue: 500, maxDiscount: null,
      usageLimit: 10, usedCount: 10,
      validFrom: daysAgo(60), validUntil: daysAhead(90),
      isActive: true,
    },
    {
      code: "LOYAL10",
      discountType: "percent", discountValue: 10,
      minOrderValue: 0, maxDiscount: null,
      usageLimit: null, usedCount: 156,
      validFrom: daysAgo(90), validUntil: daysAgo(1),
      isActive: true,
    },
    {
      code: "FUTURE25",
      discountType: "percent", discountValue: 25,
      minOrderValue: 100, maxDiscount: 50,
      usageLimit: 200, usedCount: 0,
      validFrom: daysAhead(7), validUntil: daysAhead(60),
      isActive: true,
    },
    {
      code: "DISABLED5",
      discountType: "percent", discountValue: 5,
      minOrderValue: 0, maxDiscount: null,
      usageLimit: 500, usedCount: 12,
      validFrom: daysAgo(30), validUntil: daysAhead(120),
      isActive: false,
    },
  ];
  await Voucher.insertMany(voucherDefs);
  ok(`✔ ${voucherDefs.length} vouchers`);

  // ─── Bookings + Transactions ───────────────────────────────────────
  log("Seeding bookings & transactions...");

  const carByMake = (mk) => cars.find((c) => c.make.includes(mk));
  const pickCustomer = (i) => customers[i % customers.length];

  const makeBooking = async ({
    customer, car, pickupDate, returnDate, status,
    paymentStatus = "unpaid", paymentMethod = "cash",
    discount = 0, notes = "", createdAt,
  }) => {
    const days = between(pickupDate, returnDate);
    const baseAmount = days * car.dailyRate;
    const amount = Math.max(0, baseAmount - discount);
    const booking = await Booking.create({
      user: customer._id,
      car: car._id,
      carSnapshot: {
        make: car.make, model: car.model, year: car.year,
        dailyRate: car.dailyRate, image: car.image,
        seats: car.seats, transmission: car.transmission,
        fuelType: car.fuelType, mileage: car.mileage,
      },
      customer: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      pickupDate, returnDate,
      status, amount, discount,
      paymentStatus, paymentMethod,
      address: customer.address || {},
      notes, carImage: car.image,
    });
    if (createdAt) {
      await Booking.findByIdAndUpdate(booking._id, { createdAt });
    }
    return booking;
  };

  const makeTransaction = async ({ booking, status = "success", method, createdAt }) => {
    const tx = await Transaction.create({
      booking: booking._id,
      user: booking.user,
      amount: booking.amount,
      currency: "USD",
      method: method || booking.paymentMethod || "mock",
      status,
      gatewayRef: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      description: `Payment for booking ${booking._id}`,
    });
    if (createdAt) {
      await Transaction.findByIdAndUpdate(tx._id, { createdAt });
    }
    if (status === "success") {
      await Booking.findByIdAndUpdate(booking._id, { transactionId: tx._id });
    }
    return tx;
  };

  // 5 completed bookings (đã thanh toán + giao dịch success, rải khắp 60 ngày)
  const completedSpecs = [
    { ago: 55, days: 3, carMake: "Toyota", paid: true, custIdx: 0, method: "card" },
    { ago: 42, days: 5, carMake: "Honda", paid: true, custIdx: 1, method: "cash" },
    { ago: 30, days: 2, carMake: "Mazda", paid: true, custIdx: 2, method: "card" },
    { ago: 22, days: 7, carMake: "BMW", paid: true, custIdx: 3, method: "mock" },
    { ago: 14, days: 4, carMake: "Volkswagen", paid: true, custIdx: 5, method: "card" },
    { ago: 10, days: 3, carMake: "Tesla", paid: true, custIdx: 0, method: "card" },
    { ago: 6, days: 2, carMake: "Kia", paid: true, custIdx: 1, method: "cash" },
  ];
  for (const s of completedSpecs) {
    const car = carByMake(s.carMake);
    if (!car) continue;
    const pickup = daysAgo(s.ago);
    const ret = daysAgo(s.ago - s.days);
    const cust = pickCustomer(s.custIdx);
    const booking = await makeBooking({
      customer: cust, car, pickupDate: pickup, returnDate: ret,
      status: "completed", paymentStatus: "paid", paymentMethod: s.method,
      discount: s.days >= 5 ? 20 : 0,
      notes: s.days >= 5 ? "Áp dụng voucher SUMMER50" : "",
      createdAt: daysAgo(s.ago + 2),
    });
    await makeTransaction({ booking, status: "success", method: s.method, createdAt: daysAgo(s.ago + 1) });
  }

  // 4 active bookings (đang thuê, đã thanh toán)
  const activeSpecs = [
    { startedAgo: 1, returnIn: 4, carMake: "Hyundai", custIdx: 2, method: "card" },
    { startedAgo: 3, returnIn: 7, carMake: "Mercedes", custIdx: 3, method: "card" },
    { startedAgo: 2, returnIn: 5, carMake: "Ford", custIdx: 6, method: "mock" },
    { startedAgo: 5, returnIn: 2, carMake: "Porsche", custIdx: 0, method: "card" },
  ];
  for (const s of activeSpecs) {
    const car = carByMake(s.carMake);
    if (!car) continue;
    const cust = pickCustomer(s.custIdx);
    const pickup = daysAgo(s.startedAgo);
    const ret = daysAhead(s.returnIn);
    const booking = await makeBooking({
      customer: cust, car, pickupDate: pickup, returnDate: ret,
      status: "active", paymentStatus: "paid", paymentMethod: s.method,
      createdAt: daysAgo(s.startedAgo + 1),
    });
    await makeTransaction({ booking, status: "success", method: s.method, createdAt: daysAgo(s.startedAgo) });
  }

  // 3 confirmed bookings (đã xác nhận, sắp đến)
  const confirmedSpecs = [
    { in: 5, days: 3, carMake: "Toyota", custIdx: 4, paid: true, method: "card" },
    { in: 12, days: 5, carMake: "Honda", custIdx: 5, paid: true, method: "mock" },
    { in: 20, days: 2, carMake: "Mazda", custIdx: 6, paid: false, method: "cash" },
  ];
  for (const s of confirmedSpecs) {
    const car = carByMake(s.carMake);
    if (!car) continue;
    const cust = pickCustomer(s.custIdx);
    const pickup = daysAhead(s.in);
    const ret = daysAhead(s.in + s.days);
    const booking = await makeBooking({
      customer: cust, car, pickupDate: pickup, returnDate: ret,
      status: "confirmed",
      paymentStatus: s.paid ? "paid" : "unpaid",
      paymentMethod: s.method,
      createdAt: daysAgo(2),
    });
    if (s.paid) {
      await makeTransaction({ booking, status: "success", method: s.method, createdAt: daysAgo(1) });
    }
  }

  // 4 pending bookings (chờ duyệt)
  const pendingSpecs = [
    { in: 2, days: 4, carMake: "Volkswagen", custIdx: 0, method: "cash" },
    { in: 8, days: 6, carMake: "BMW", custIdx: 1, method: "card" },
    { in: 15, days: 3, carMake: "Tesla", custIdx: 2, method: "card" },
    { in: 25, days: 2, carMake: "Kia", custIdx: 3, method: "mock" },
  ];
  for (const s of pendingSpecs) {
    const car = carByMake(s.carMake);
    if (!car) continue;
    const cust = pickCustomer(s.custIdx);
    const pickup = daysAhead(s.in);
    const ret = daysAhead(s.in + s.days);
    await makeBooking({
      customer: cust, car, pickupDate: pickup, returnDate: ret,
      status: "pending", paymentStatus: "unpaid", paymentMethod: s.method,
      createdAt: new Date(),
    });
  }

  // 3 cancelled bookings - 2 refunded, 1 unpaid
  const cancelledSpecs = [
    { ago: 25, days: 3, carMake: "Toyota", custIdx: 4, refunded: true, method: "card" },
    { ago: 18, days: 5, carMake: "Mercedes", custIdx: 0, refunded: true, method: "card" },
    { ago: 8, days: 2, carMake: "Ford", custIdx: 6, refunded: false, method: "cash" },
  ];
  for (const s of cancelledSpecs) {
    const car = carByMake(s.carMake);
    if (!car) continue;
    const cust = pickCustomer(s.custIdx);
    const pickup = daysAgo(s.ago);
    const ret = daysAgo(s.ago - s.days);
    const booking = await makeBooking({
      customer: cust, car, pickupDate: pickup, returnDate: ret,
      status: "cancelled",
      paymentStatus: s.refunded ? "refunded" : "unpaid",
      paymentMethod: s.method,
      notes: s.refunded ? "Khách hủy do thay đổi lịch trình - đã hoàn tiền" : "Khách không xác nhận thanh toán",
      createdAt: daysAgo(s.ago + 1),
    });
    if (s.refunded) {
      await makeTransaction({ booking, status: "refunded", method: s.method, createdAt: daysAgo(s.ago - 1) });
    }
  }

  // 2 thêm transactions: 1 pending + 1 failed (gắn với booking pending bất kỳ)
  const pendingBooking = await Booking.findOne({ status: "pending" });
  if (pendingBooking) {
    await makeTransaction({ booking: pendingBooking, status: "pending", method: "card" });
  }
  const failedBooking = await Booking.findOne({ status: "pending", paymentStatus: "unpaid" });
  if (failedBooking) {
    await makeTransaction({ booking: failedBooking, status: "failed", method: "card" });
  }

  const totals = {
    users: await User.countDocuments(),
    categories: await Category.countDocuments(),
    cars: await Car.countDocuments(),
    vouchers: await Voucher.countDocuments(),
    bookings: await Booking.countDocuments(),
    transactions: await Transaction.countDocuments(),
  };

  console.log("\n────────────────────────────────────────");
  ok("✔ Seed complete!");
  console.log("────────────────────────────────────────");
  console.table(totals);
  console.log("\n\x1b[33m Đăng nhập admin:\x1b[0m");
  console.log("  Email   : admin@carrental.com");
  console.log("  Password: admin123\n");
  console.log("\x1b[33m Đăng nhập khách hàng (mọi user):\x1b[0m");
  console.log("  Password: customer123\n");
};

main()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("\x1b[31m[seed error]\x1b[0m", err);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  });
