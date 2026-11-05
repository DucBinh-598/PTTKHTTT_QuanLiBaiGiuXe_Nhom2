# Parkly — Giao diện quản lý bãi giữ xe

Frontend React + TypeScript, Vite, Tailwind CSS và lucide-react. Ứng dụng sử dụng dữ liệu trực tiếp từ REST API NestJS; không có chế độ demo hoặc dữ liệu mẫu giả lập.

## Chức năng

- Tổng quan công suất bãi xe và hoạt động trong ngày.
- Tìm kiếm, lọc và ghi nhận lượt xe vào/ra.
- Quản lý hồ sơ sinh viên, phương tiện và vé gửi xe.
- Báo cáo lưu lượng, tải lịch sử lượt xe dưới dạng CSV.
- Cấu hình thông tin bãi xe.
- Thông báo theo trạng thái vé và công suất bãi.
- Trang trợ giúp, thông tin tài khoản và trợ lý AI Parkly.
- Giao diện sáng/tối, responsive cho desktop và thiết bị di động.

## Chạy giao diện

```powershell
npm install
npm run dev
```

Mở URL được Vite hiển thị trong terminal.

## Kết nối API

1. Tạo `frontend/.env` từ `.env.example`.
2. Đặt `VITE_API_URL=http://localhost:3000/api`.
3. Khởi động PostgreSQL và API theo hướng dẫn trong [backend README](../backend/README.md).
4. Đăng ký tài khoản hoặc đăng nhập. Tài khoản được xác thực bằng JWT từ backend.

Trợ lý AI gọi endpoint đã xác thực `POST /api/assistant/chat`. Cấu hình nhà cung cấp AI ở backend; không đặt khóa AI trong biến môi trường frontend.

## Kiểm tra

```powershell
npm run lint
npm run build
```
