import * as XLSX from "xlsx";

const saveAs = (wb, filename) => {
  XLSX.writeFile(wb, filename);
};

export const exportBookingsExcel = (bookings) => {
  const rows = bookings.map((b) => ({
    "ID": b._id,
    "Khách hàng": b.customer,
    "Email": b.email,
    "Điện thoại": b.phone || "",
    "Xe": b.carSnapshot ? `${b.carSnapshot.make} ${b.carSnapshot.model} ${b.carSnapshot.year}` : "",
    "Ngày nhận": b.pickupDate ? new Date(b.pickupDate).toLocaleDateString("vi-VN") : "",
    "Ngày trả": b.returnDate ? new Date(b.returnDate).toLocaleDateString("vi-VN") : "",
    "Trạng thái": b.status,
    "Thanh toán": b.paymentStatus,
    "Số tiền ($)": b.amount,
    "Ngày tạo": b.createdAt ? new Date(b.createdAt).toLocaleDateString("vi-VN") : "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bookings");
  saveAs(wb, `bookings_${Date.now()}.xlsx`);
};

export const exportRevenueExcel = (transactions) => {
  const rows = transactions.map((t) => ({
    "ID giao dịch": t._id,
    "Booking ID": t.booking?._id || t.booking || "",
    "Phương thức": t.method,
    "Số tiền ($)": t.amount,
    "Trạng thái": t.status,
    "Ngày": t.createdAt ? new Date(t.createdAt).toLocaleDateString("vi-VN") : "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Revenue");
  saveAs(wb, `revenue_${Date.now()}.xlsx`);
};
