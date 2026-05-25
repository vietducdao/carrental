# UML Diagrams — Car Rental System (Mermaid)

Bộ sơ đồ UML đầy đủ cho hệ thống Car Rental, viết bằng **Mermaid** (`.mmd`).
Phủ toàn bộ chức năng: auth, booking, voucher, payment, chat AI, admin CRUD, report, content management, …

## Cấu trúc thư mục

```
docs/uml/
├── 01-usecase/      # Use Case (mô phỏng bằng flowchart)
├── 02-activity/     # Sơ đồ hoạt động — flowchart TD
├── 03-sequence/     # Sơ đồ trình tự — sequenceDiagram
├── 04-state/        # Sơ đồ trạng thái — stateDiagram-v2
├── 05-class/        # Sơ đồ lớp — classDiagram
├── 06-component.mmd
└── 07-deployment.mmd
```

## 1. Use Case — [01-usecase/](01-usecase/)

| File | Nội dung |
|------|----------|
| [overview.mmd](01-usecase/overview.mmd) | Tổng quan Guest / Customer / Admin / Payment / AI |
| [customer.mmd](01-usecase/customer.mmd) | Chi tiết chức năng phía Khách hàng |
| [admin.mmd](01-usecase/admin.mmd) | Chi tiết chức năng phía Admin (gom theo phân hệ) |

> Mermaid không có native use-case diagram → dùng `flowchart LR` + subgraph làm system boundary, `(((Actor)))` cho actor.

## 2. Activity — [02-activity/](02-activity/)

| File | Luồng |
|------|-------|
| [auth-register.mmd](02-activity/auth-register.mmd) | Đăng ký tài khoản |
| [auth-login.mmd](02-activity/auth-login.mmd) | Đăng nhập |
| [profile-update.mmd](02-activity/profile-update.mmd) | Cập nhật hồ sơ + đổi mật khẩu + avatar |
| [car-browse.mmd](02-activity/car-browse.mmd) | Duyệt & tìm kiếm xe |
| [booking-create.mmd](02-activity/booking-create.mmd) | Tạo đơn đặt xe (tính giá + voucher) |
| [booking-cancel.mmd](02-activity/booking-cancel.mmd) | Hủy đơn (customer / admin) |
| [voucher-apply.mmd](02-activity/voucher-apply.mmd) | Validate & áp dụng voucher |
| [payment.mmd](02-activity/payment.mmd) | Thanh toán (mock) |
| [chat-ai.mmd](02-activity/chat-ai.mmd) | Chatbot AI (Gemini/Claude/Rule-based) |
| [testimonial-write.mmd](02-activity/testimonial-write.mmd) | Gửi đánh giá |
| [admin-manage-car.mmd](02-activity/admin-manage-car.mmd) | Admin CRUD xe + upload ảnh |
| [admin-manage-user.mmd](02-activity/admin-manage-user.mmd) | Admin quản lý user (khóa/mở/role) |
| [admin-manage-booking.mmd](02-activity/admin-manage-booking.mmd) | Admin xử lý đơn (confirm/active/complete) |
| [admin-manage-voucher.mmd](02-activity/admin-manage-voucher.mmd) | Admin CRUD voucher |
| [admin-manage-transaction.mmd](02-activity/admin-manage-transaction.mmd) | Admin xử lý giao dịch & refund |
| [admin-manage-content.mmd](02-activity/admin-manage-content.mmd) | Admin Blog/Service/Team/Testi/SiteSetting |
| [admin-chat-support.mmd](02-activity/admin-chat-support.mmd) | Admin trả lời chat hỗ trợ |
| [admin-report-revenue.mmd](02-activity/admin-report-revenue.mmd) | Báo cáo doanh thu / booking / top xe |

## 3. Sequence — [03-sequence/](03-sequence/)

| File | Tương tác |
|------|-----------|
| [auth-register.mmd](03-sequence/auth-register.mmd) | UI ↔ AuthCtrl ↔ User ↔ bcrypt ↔ JWT |
| [auth-login.mmd](03-sequence/auth-login.mmd) | Login + JWT issuance |
| [booking-create.mmd](03-sequence/booking-create.mmd) | UI ↔ BookingCtrl ↔ Car/Voucher/Booking Model |
| [booking-cancel.mmd](03-sequence/booking-cancel.mmd) | Cancel + refund + cập nhật Car |
| [voucher-validate.mmd](03-sequence/voucher-validate.mmd) | Validate voucher trước khi đặt |
| [payment-mock.mmd](03-sequence/payment-mock.mmd) | Mock payment + cập nhật Booking |
| [chat-ai-provider.mmd](03-sequence/chat-ai-provider.mmd) | Chatbot với 3 provider fallback |
| [admin-car-upload.mmd](03-sequence/admin-car-upload.mmd) | Admin upload ảnh xe (multer) |
| [admin-update-booking-status.mmd](03-sequence/admin-update-booking-status.mmd) | Cập nhật trạng thái booking + side effect Car |
| [admin-report-revenue.mmd](03-sequence/admin-report-revenue.mmd) | Báo cáo song song 4 API |

## 4. State — [04-state/](04-state/)

| File | Đối tượng |
|------|-----------|
| [booking.mmd](04-state/booking.mmd) | Booking (pending → confirmed → active → completed/cancelled) |
| [car.mmd](04-state/car.mmd) | Car (available / rented / maintenance / inactive) |
| [transaction.mmd](04-state/transaction.mmd) | Transaction (pending / success / failed / refunded) |
| [voucher.mmd](04-state/voucher.mmd) | Voucher (scheduled / active / exhausted / expired / disabled) |
| [user.mmd](04-state/user.mmd) | User (active / locked / promoted / deleted) |
| [chat-session.mmd](04-state/chat-session.mmd) | Chat Session (open / waiting_bot / escalated / archived / closed) |

## 5. Class — [05-class/](05-class/)

| File | Mô tả |
|------|-------|
| [domain.mmd](05-class/domain.mmd) | Domain Model (12 Mongoose schemas + quan hệ) |
| [controllers.mmd](05-class/controllers.mmd) | Controllers / Middleware / Services |

## 6 & 7

- [06-component.mmd](06-component.mmd) — Sơ đồ thành phần (Frontend ↔ Backend ↔ DB ↔ AI)
- [07-deployment.mmd](07-deployment.mmd) — Sơ đồ triển khai (Browser / WebHost / AppServer / MongoDB / AI / Gateway / Mail)

---

## Cách render

### 1. Mermaid Live Editor (nhanh nhất)
- Mở https://mermaid.live → dán nội dung file `.mmd`
- Export PNG / SVG / PDF từ menu **Actions**

### 2. VS Code
- Cài extension **Markdown Preview Mermaid Support** (`bierner.markdown-mermaid`)
  hoặc **Mermaid Preview** (`vstirbu.vscode-mermaid-preview`)
- Mở file `.mmd` → bật Preview

### 3. CLI — `mmdc` (Mermaid CLI)
```powershell
npm install -g @mermaid-js/mermaid-cli

# Single file
mmdc -i docs/uml/04-state/booking.mmd -o booking.svg

# Bulk (PowerShell)
Get-ChildItem -Recurse docs/uml -Filter *.mmd | ForEach-Object {
  mmdc -i $_.FullName -o ($_.FullName -replace '\.mmd$', '.svg')
}
```

### 4. Trong Markdown (GitHub / GitLab / Notion)
Sao chép nội dung `.mmd` (không cần `%%` comment đầu), bọc trong:
````markdown
```mermaid
... nội dung ...
```
````

### 5. Docker
```powershell
docker run --rm -v "${PWD}:/data" minlag/mermaid-cli -i /data/docs/uml/04-state/booking.mmd -o /data/booking.svg
```

---

## Ghi chú kỹ thuật
- Encoding UTF-8, nhãn tiếng Việt.
- Sơ đồ dựa trên codebase thực tế:
  - 12 Mongoose models trong [server/models/](../../server/models/)
  - 14 controllers trong [server/controllers/](../../server/controllers/)
  - React + Vite frontend trong [src/Components/](../../src/Components/)
  - Chatbot Gemini/Claude + fallback rule-based trong [server/services/claude.service.js](../../server/services/claude.service.js)
- Khi codebase thay đổi (thêm trường, đổi endpoint), cập nhật sơ đồ tương ứng để tránh tài liệu lệch thực tế.

## Lưu ý cú pháp Mermaid
- Ký tự đặc biệt cần escape hoặc tránh trong label: `()`, `:`, `[]` → dùng `<br/>` để xuống dòng.
- Sequence diagram có `alt`/`opt`/`par`/`and`/`else`/`end` tương đương PlantUML.
- State diagram dùng `stateDiagram-v2` (mới hơn `stateDiagram` v1).
- Class diagram quan hệ: `--|>` kế thừa, `*--` composition, `o--` aggregation, `-->` association.
