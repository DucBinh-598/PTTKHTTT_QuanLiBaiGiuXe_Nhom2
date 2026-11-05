# Parkly — Quản lý bãi giữ xe

Ứng dụng quản lý bãi xe trường học gồm giao diện React, API NestJS và cơ sở dữ liệu PostgreSQL. Ứng dụng dùng dữ liệu trực tiếp từ API; không có chế độ demo hay dữ liệu mẫu giả lập.

## Yêu cầu

- Node.js 20 trở lên và npm
- PostgreSQL 15 trở lên

## Cài đặt lần đầu

1. Tạo database PostgreSQL tên `school_parking`.
2. Sao chép `backend/.env.example` thành `backend/.env`. Điền `DATABASE_URL`, tạo `JWT_SECRET` ngẫu nhiên dài tối thiểu 32 ký tự và thiết lập `FRONTEND_ORIGIN=http://localhost:5173`.
3. Nếu muốn khởi tạo sẵn tài khoản, điền `SEED_USER_EMAIL` và `SEED_USER_PASSWORD` (ít nhất 12 ký tự) trong `backend/.env`. Nếu không, đăng ký tài khoản qua giao diện sau khi khởi động.
4. Chuẩn bị API và database:

   ```powershell
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:deploy
   npm run prisma:seed
   ```

5. Mở terminal thứ nhất để chạy API:

   ```powershell
   cd backend
   npm run start:dev
   ```

6. Sao chép `frontend/.env.example` thành `frontend/.env`, giữ `VITE_API_URL=http://localhost:3000/api`. Mở terminal thứ hai:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

7. Mở địa chỉ Vite hiển thị trong terminal, tạo tài khoản hoặc đăng nhập. API Swagger ở `http://localhost:3000/api/docs`; trạng thái API/database ở `http://localhost:3000/api/health`.

## Chức năng

- Đăng ký, đăng nhập và đăng xuất bằng tài khoản dùng chung.
- Theo dõi tổng quan bãi xe, lượt xe, sinh viên, phương tiện, vé và báo cáo.
- Quản lý thông tin bãi xe; xuất lượt xe ra CSV.
- Thông báo theo hạn vé và công suất; trang trợ giúp, thông tin tài khoản và trợ lý AI Parkly.
- Giao diện sáng/tối, lưu tùy chọn trên thiết bị.
- Trợ lý AI tùy chọn để hướng dẫn sử dụng. Cấu hình `AI_API_KEY`, `AI_MODEL` và nếu cần `AI_API_URL` trong `backend/.env`.

Mọi tài khoản có cùng quyền quản lý dữ liệu. Trợ lý AI cần cấu hình riêng và không được phép truy cập dữ liệu cá nhân hoặc số liệu bãi xe trực tiếp.

## Kiểm tra

```powershell
cd frontend
npm run build
npm run lint

cd ..\backend
npm run prisma:generate
npm run build
npm run lint
```

Chi tiết API, migration và cấu hình AI: [backend/README.md](./backend/README.md).
