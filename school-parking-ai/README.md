# School Parking AI

Hệ thống quản lý bãi giữ xe trường học tích hợp trợ lý AI.

## Công nghệ
- Frontend: React + Vite + Tailwind CSS 4
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma 7
- AI: OpenAI Responses API

## 1. Yêu cầu
- Node.js 20.19+ hoặc 22.12+ (khuyến nghị Node.js 22 LTS hoặc mới hơn)
- PostgreSQL đang chạy
- API key OpenAI nếu muốn sử dụng chức năng AI

## 2. Tạo database
Mở pgAdmin hoặc psql và tạo database:
```sql
CREATE DATABASE school_parking;
```

## 3. Cấu hình Backend
Mở terminal:
```bash
cd backend
```
Tạo file `.env` bằng cách sao chép `.env.example`, sau đó cập nhật mật khẩu PostgreSQL và OpenAI API key.

Cài thư viện:
```bash
npm install
```

Tạo Prisma Client và bảng:
```bash
npm run db:generate
npm run db:migrate
```

Thêm dữ liệu mẫu:
```bash
npm run db:seed
```

Chạy Backend:
```bash
npm run dev
```
Backend chạy tại http://localhost:5000

## 4. Cấu hình Frontend
Mở terminal thứ hai tại thư mục dự án:
```bash
cd frontend
npm install
npm run dev
```
Mở địa chỉ Vite hiển thị trong terminal, thường là http://localhost:5173

## 5. Tài khoản / dữ liệu mẫu
Lệnh seed tạo:
- Quản trị viên mẫu: admin@school.edu.vn
- Học sinh mẫu: student@school.edu.vn
- Khu vực xe đạp, xe điện, xe máy
- Một số phương tiện mẫu

Lưu ý: dữ liệu người dùng mẫu KHÔNG phải tài khoản đăng nhập. Phiên bản này chưa triển khai đăng nhập/JWT/phân quyền.

## 6. API
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/health` | Kiểm tra Backend |
| GET | `/api/dashboard` | Số liệu tổng quan |
| GET | `/api/vehicles` | Danh sách phương tiện |
| POST | `/api/vehicles` | Thêm phương tiện |
| DELETE | `/api/vehicles/:id` | Xóa phương tiện nếu chưa có lịch sử |
| GET | `/api/parking/areas` | Danh sách khu vực |
| POST | `/api/parking/areas` | Tạo khu vực |
| GET | `/api/parking` | Các lượt xe đang gửi |
| POST | `/api/parking/check-in` | Ghi nhận xe vào |
| PUT | `/api/parking/check-out/:id` | Ghi nhận xe ra |
| POST | `/api/ai/chat` | Hỏi trợ lý AI |

Ví dụ body thêm xe:
```json
{
  "plateNumber": "59A-12345",
  "type": "MOTORBIKE",
  "ownerId": 2,
  "description": "Xe mẫu"
}
```

Ví dụ body gửi xe:
```json
{
  "vehicleId": 1,
  "areaId": 1
}
```

Ví dụ body hỏi AI:
```json
{
  "question": "Hiện tại có bao nhiêu xe đang gửi?"
}
```

## 7. Cấu trúc
```text
school-parking-ai/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── prisma.config.ts
└── frontend/
    ├── src/
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## 8. Lưu ý bảo mật và giới hạn
- Không đưa `.env` hoặc API key lên GitHub.
- Không dùng bản mẫu này với dữ liệu học sinh thật trước khi bổ sung đăng nhập, JWT, phân quyền, kiểm soát truy cập và nhật ký hoạt động.
- API hiện tại là bản học tập/MVP, chưa có xác thực người dùng, giới hạn tốc độ và chống gửi yêu cầu đồng thời khi đầy chỗ.
- AI chỉ được cung cấp số liệu tổng hợp; không gửi dữ liệu định danh cá nhân của học sinh đến AI.
- Nếu chưa có OpenAI API key, toàn bộ chức năng quản lý xe vẫn có thể chạy; chức năng AI sẽ báo lỗi cấu hình.
