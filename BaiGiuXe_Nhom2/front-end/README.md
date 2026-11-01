# Parkly — Quản lý bãi giữ xe trường học

Frontend React + TypeScript, Vite, Tailwind CSS và lucide-react. Giao diện hỗ trợ kết nối API NestJS; đặt `VITE_DEMO_MODE=true` để chạy độc lập bằng dữ liệu mẫu lưu trên trình duyệt.

## Chức năng

- Tổng quan công suất bãi và lượt xe gần đây.
- Tìm kiếm, lọc và ghi nhận lượt xe vào/ra; kiểm tra trạng thái xe, hạn thẻ và sức chứa.
- Quản lý hồ sơ sinh viên và thẻ gửi xe.
- Theo dõi hạn vé, lọc trạng thái và gia hạn vé gửi xe.
- Đăng ký, cập nhật, tìm kiếm và quản lý trạng thái phương tiện.
- Báo cáo lưu lượng, tải lịch sử lượt xe dưới dạng CSV.
- Cấu hình thông tin bãi xe và khôi phục dữ liệu mẫu.
- Giao diện responsive cho desktop và thiết bị di động.
- Màn hình vào demo theo vai trò quản trị viên hoặc nhân viên bãi xe.

## Chạy giao diện

```bash
npm install
npm run dev
```

Mở URL được Vite hiển thị trong terminal.

## Kết nối API

1. Tạo `frontend/.env` từ `.env.example`.
2. Đặt `VITE_API_URL=http://localhost:3000/api` và `VITE_DEMO_MODE=false`.
3. Khởi động PostgreSQL và API theo hướng dẫn trong [backend README](../backend/README.md).
4. Khởi động lại Vite sau khi đổi biến môi trường và đăng nhập bằng tài khoản đã cấu hình trong backend.

Để chỉ xem giao diện mà không có backend, đổi `VITE_DEMO_MODE=true`. Không dùng chế độ demo để lưu dữ liệu thật.

## Kiểm tra

```bash
npm run lint
npm run build
```

Chế độ demo lưu thay đổi trong trình duyệt hiện tại. Chọn **Cài đặt → Khôi phục dữ liệu mẫu** để đưa dữ liệu về trạng thái ban đầu. Quyền truy cập thật được kiểm tra bởi JWT và backend NestJS; lựa chọn vai trò trong chế độ demo chỉ để xem giao diện.
