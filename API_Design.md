# API Design – Hệ thống quản lý bãi giữ xe trường học

Tài liệu mô tả REST API của backend (`school_parking/backend`, NestJS + Prisma + PostgreSQL).
Nội dung được đối chiếu với mã nguồn bản chính `school_parking` tại commit `c71e12d` (05/11/2026). Khi code thay đổi, cần cập nhật lại tài liệu này.

---

## 1. Thông tin chung

| Mục | Giá trị |
|---|---|
| Base URL (local) | `http://localhost:3000/api` |
| Tiền tố toàn cục | `/api` |
| Tài liệu Swagger | `http://localhost:3000/api/docs` |
| Định dạng dữ liệu | JSON (`Content-Type: application/json`) |
| Xác thực | JWT Bearer, hạn dùng **8 giờ** |
| CORS | Chỉ cho phép các origin trong biến môi trường `FRONTEND_ORIGIN` (mặc định `http://localhost:5173`) |
| Bảo mật HTTP | `helmet` |

### 1.1. Xác thực

Mọi endpoint đều yêu cầu đăng nhập, **trừ** các endpoint đánh dấu "Công khai" bên dưới. Gửi token qua header:

```
Authorization: Bearer <accessToken>
```

Token lấy từ `POST /auth/login` hoặc `POST /auth/register`.

### 1.2. Phân quyền

Bản `school_parking` **không còn phân quyền theo vai trò** (đã xóa cột `role` và các `@Roles`). Mọi tài khoản đã đăng nhập có quyền như nhau trên tất cả endpoint.

| Nhóm | Endpoint | Công khai | Đã đăng nhập |
|---|---|:---:|:---:|
| Health | `GET /health` | ✔ | ✔ |
| Auth | `POST /auth/login`, `POST /auth/register` | ✔ | ✔ |
| Auth | `GET /auth/me` | | ✔ |
| Dashboard | `GET /dashboard` | | ✔ |
| Students | `GET`, `POST`, `PATCH`, `DELETE` | | ✔ |
| Vehicles | `GET`, `POST`, `PATCH`, `DELETE` | | ✔ |
| Movements | `GET /movements`, `POST /movements` | | ✔ |
| Tickets | `GET /tickets`, `PUT /tickets/:studentId/renew` | | ✔ |
| Settings | `GET /settings`, `PUT /settings` | | ✔ |
| Assistant | `POST /assistant/chat` | | ✔ |

- Thiếu hoặc sai token → `401 Unauthorized`.
- Vì `POST /auth/register` công khai, **bất kỳ ai tự đăng ký đều có toàn quyền** với dữ liệu (xem mục 6).

### 1.3. Định dạng lỗi

Lỗi trả về theo chuẩn mặc định của NestJS:

```json
{
  "statusCode": 409,
  "message": "Biển số xe này đã được đăng ký.",
  "error": "Conflict"
}
```

Khi dữ liệu gửi lên không hợp lệ (`400`), `message` là **mảng** các lỗi từ `class-validator`:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 8 characters"],
  "error": "Bad Request"
}
```

Backend dùng `ValidationPipe` với `whitelist` và `forbidNonWhitelisted`, nên **gửi thừa trường không có trong DTO sẽ bị lỗi 400**.

### 1.4. Mã trạng thái thường gặp

| Mã | Ý nghĩa |
|---|---|
| 200 | Thành công (GET, PUT, PATCH, DELETE) |
| 201 | Tạo mới thành công (mọi `POST`, kể cả `login`) |
| 400 | Dữ liệu không hợp lệ |
| 401 | Chưa đăng nhập, token sai hoặc hết hạn |
| 404 | Không tìm thấy tài nguyên |
| 409 | Xung đột nghiệp vụ (trùng dữ liệu, trạng thái không cho phép) |

### 1.5. Giá trị liệt kê (enum)

API nhận và trả giá trị **tiếng Việt**, backend tự ánh xạ sang enum trong database.

| Trường | Giá trị API | Giá trị trong DB |
|---|---|---|
| Trạng thái thẻ (`status`) | `Đang hoạt động` | `ACTIVE` |
| | `Sắp hết hạn` | `EXPIRING` |
| | `Hết hạn` | `EXPIRED` |
| Loại xe (`type` của vehicle) | `Xe máy` | `MOTORCYCLE` |
| | `Xe đạp điện` | `ELECTRIC_BICYCLE` |
| | `Xe đạp` | `BICYCLE` |
| Loại lượt (`type` của movement) | `Vào bãi` | `ENTRY` |
| | `Ra bãi` | `EXIT` |

### 1.6. Quy ước dữ liệu

- Ngày dùng định dạng `YYYY-MM-DD` (ví dụ `2027-06-30`).
- Thời điểm dùng ISO 8601 UTC (ví dụ `2026-11-01T08:30:00.000Z`).
- "Hôm nay" được tính theo múi giờ Việt Nam (UTC+7).
- Các danh sách **chưa có phân trang**, trả về toàn bộ kết quả khớp.
- Tham số tìm kiếm `search` không phân biệt hoa thường.

---

## 2. Tổng quan endpoint

| Phương thức | Đường dẫn | Mô tả | Quyền |
|---|---|---|---|
| GET | `/health` | Kiểm tra server và kết nối database | Công khai |
| POST | `/auth/login` | Đăng nhập | Công khai |
| POST | `/auth/register` | Đăng ký tài khoản | Công khai |
| GET | `/auth/me` | Thông tin người dùng hiện tại | Đã đăng nhập |
| GET | `/dashboard` | Số liệu tổng quan bãi xe | Đã đăng nhập |
| GET | `/students` | Danh sách sinh viên | Đã đăng nhập |
| POST | `/students` | Thêm sinh viên | Đã đăng nhập |
| PATCH | `/students/:id` | Cập nhật sinh viên | Đã đăng nhập |
| DELETE | `/students/:id` | Xóa sinh viên | Đã đăng nhập |
| GET | `/vehicles` | Danh sách phương tiện | Đã đăng nhập |
| POST | `/vehicles` | Đăng ký phương tiện | Đã đăng nhập |
| PATCH | `/vehicles/:id` | Cập nhật phương tiện | Đã đăng nhập |
| DELETE | `/vehicles/:id` | Xóa phương tiện | Đã đăng nhập |
| GET | `/movements` | Lịch sử xe vào/ra | Đã đăng nhập |
| POST | `/movements` | Ghi nhận xe vào hoặc ra | Đã đăng nhập |
| GET | `/tickets` | Danh sách thẻ gửi xe | Đã đăng nhập |
| PUT | `/tickets/:studentId/renew` | Gia hạn thẻ thêm 1 năm | Đã đăng nhập |
| GET | `/settings` | Xem cấu hình bãi xe | Đã đăng nhập |
| PUT | `/settings` | Cập nhật cấu hình bãi xe | Đã đăng nhập |
| POST | `/assistant/chat` | Hỏi trợ lý AI | Đã đăng nhập |

---

## 3. Chi tiết từng nhóm

### 3.1. Health

#### `GET /health` (Công khai)

Phản hồi `200`:

```json
{ "status": "ok", "database": "connected" }
```

Nếu không kết nối được database, server trả lỗi `500`.

---

### 3.2. Auth

#### `POST /auth/login` (Công khai)

Yêu cầu:

```json
{ "email": "user@school.edu.vn", "password": "matkhau-cua-ban" }
```

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `email` | string | Email hợp lệ, không phân biệt hoa thường |
| `password` | string | Tối thiểu 8 ký tự |

Phản hồi `201`:

```json
{
  "accessToken": "eyJhbGciOi...",
  "user": {
    "sub": "clx1abc...",
    "name": "Người dùng Parkly",
    "email": "user@school.edu.vn"
  }
}
```

Lỗi: `401` – `Email hoặc mật khẩu không chính xác.`

> Lưu ý: trong `user` của `login`/`register`, mã người dùng nằm ở trường `sub`; còn `GET /auth/me` trả về trường `id`.

#### `POST /auth/register` (Công khai)

Yêu cầu:

```json
{ "name": "Nguyễn Văn A", "email": "a@school.edu.vn", "password": "matkhau-dai-8-ky-tu" }
```

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `name` | string | Không rỗng, tối đa 100 ký tự |
| `email` | string | Email hợp lệ, tối đa 254 ký tự |
| `password` | string | 8 đến 72 ký tự |

Phản hồi `201`: giống `POST /auth/login`; người dùng được đăng nhập ngay sau khi đăng ký.

Lỗi: `409` – `Địa chỉ email này đã được đăng ký.`

#### `GET /auth/me`

Phản hồi `200`:

```json
{
  "id": "clx1abc...",
  "name": "Người dùng Parkly",
  "email": "user@school.edu.vn"
}
```

---

### 3.3. Dashboard

#### `GET /dashboard`

Phản hồi `200`:

```json
{
  "occupiedCount": 42,
  "capacity": 180,
  "availableSpots": 138,
  "entriesToday": 65,
  "exitsToday": 23,
  "attentionTickets": 7,
  "studentsCount": 320,
  "vehiclesCount": 354
}
```

| Trường | Ý nghĩa |
|---|---|
| `occupiedCount` | Số xe đang trong bãi |
| `capacity` | Sức chứa tối đa |
| `availableSpots` | Chỗ trống (`capacity − occupiedCount`, tối thiểu 0) |
| `entriesToday`, `exitsToday` | Số lượt vào/ra trong ngày (giờ Việt Nam) |
| `attentionTickets` | Số sinh viên có thẻ **không** ở trạng thái `Đang hoạt động` |
| `studentsCount`, `vehiclesCount` | Tổng số sinh viên, phương tiện |

---

### 3.4. Students (Sinh viên)

Đối tượng sinh viên:

```json
{
  "id": "SV2024001",
  "name": "Nguyễn Văn A",
  "className": "CNTT-K18",
  "program": "Công nghệ thông tin",
  "phone": "0901234567",
  "permitUntil": "2027-06-30",
  "status": "Đang hoạt động"
}
```

#### `GET /students`

| Query | Bắt buộc | Mô tả |
|---|:---:|---|
| `search` | Không | Tìm theo mã, tên hoặc lớp |
| `status` | Không | Một trong 3 trạng thái thẻ (mục 1.5) |

Phản hồi `200`: mảng sinh viên, sắp xếp theo tên (A→Z).

Lỗi: `400` – `Trạng thái thẻ gửi xe không hợp lệ.`

#### `POST /students`

Yêu cầu: toàn bộ trường của đối tượng sinh viên.

| Trường | Ràng buộc |
|---|---|
| `id` | 3 đến 30 ký tự, chỉ gồm chữ, số, dấu gạch ngang |
| `name`, `className`, `program` | Không rỗng |
| `phone` | 8 đến 20 ký tự, gồm số và các ký tự `+ ( ) . -` và khoảng trắng |
| `permitUntil` | Đúng định dạng `YYYY-MM-DD` và là ngày hợp lệ |
| `status` | Một trong 3 trạng thái thẻ |

Phản hồi `201`: đối tượng sinh viên vừa tạo.

Lỗi: `409` – `Mã sinh viên này đã tồn tại.`

#### `PATCH /students/:id`

Yêu cầu: giống `POST` nhưng **không có `id`** (mã sinh viên lấy từ đường dẫn). Các trường còn lại đều bắt buộc.

Phản hồi `200`: đối tượng sinh viên sau cập nhật.

Lỗi: `404` – `Không tìm thấy sinh viên.`

#### `DELETE /students/:id`

Phản hồi `200`: `{ "success": true }`

Lỗi:
- `409` – `Không thể xóa sinh viên đang có phương tiện đã đăng ký.`
- `404` – `Không tìm thấy sinh viên.`

---

### 3.5. Vehicles (Phương tiện)

Đối tượng phương tiện:

```json
{
  "id": "clx2def...",
  "studentId": "SV2024001",
  "plate": "59A1-123.45",
  "type": "Xe máy",
  "color": "Đen",
  "registeredAt": "2026-10-15",
  "inParking": false
}
```

#### `GET /vehicles`

| Query | Bắt buộc | Mô tả |
|---|:---:|---|
| `search` | Không | Tìm theo biển số hoặc tên sinh viên |
| `inParking` | Không | `true` (đang trong bãi) hoặc `false` (đang ngoài bãi); giá trị khác bị bỏ qua |

Phản hồi `200`: mảng phương tiện, mới đăng ký xếp trước.

#### `POST /vehicles`

Yêu cầu:

```json
{ "studentId": "SV2024001", "plate": "59A1-123.45", "type": "Xe máy", "color": "Đen" }
```

| Trường | Ràng buộc |
|---|---|
| `studentId` | Mã sinh viên đã tồn tại |
| `plate` | 3 đến 20 ký tự, bắt đầu bằng chữ hoặc số, có thể chứa chữ, số, khoảng trắng, dấu chấm, gạch ngang. Được tự động **chuyển thành chữ hoa** |
| `type` | `Xe máy`, `Xe đạp điện` hoặc `Xe đạp` |
| `color` | Không rỗng |

Phản hồi `201`: đối tượng phương tiện.

Lỗi:
- `404` – `Không tìm thấy sinh viên sở hữu phương tiện.`
- `409` – `Không thể đăng ký xe khi thẻ gửi xe đã hết hạn.`
- `409` – `Biển số xe này đã được đăng ký.`

#### `PATCH /vehicles/:id`

Yêu cầu: giống `POST /vehicles` (đủ 4 trường). Nếu đổi sang sinh viên khác, sinh viên mới phải có thẻ chưa hết hạn.

Phản hồi `200`: đối tượng phương tiện sau cập nhật.

Lỗi: `404` (không thấy xe hoặc sinh viên), `409` (trùng biển số hoặc thẻ hết hạn).

#### `DELETE /vehicles/:id`

Phản hồi `200`: `{ "success": true }`

Lỗi:
- `404` – `Không tìm thấy phương tiện.`
- `409` – `Xe đang trong bãi. Hãy ghi nhận xe ra trước khi xóa.`
- `409` – `Không thể xóa phương tiện đã có lịch sử gửi xe.`

---

### 3.6. Movements (Lượt xe vào/ra)

Đối tượng lượt xe:

```json
{
  "id": "clx3ghi...",
  "studentId": "SV2024001",
  "studentName": "Nguyễn Văn A",
  "plate": "59A1-123.45",
  "vehicleType": "Xe máy",
  "type": "Vào bãi",
  "timestamp": "2026-11-01T01:30:00.000Z",
  "gate": "Cổng chính"
}
```

#### `GET /movements`

| Query | Bắt buộc | Mô tả |
|---|:---:|---|
| `date` | Không | `today` (hôm nay, giờ Việt Nam) hoặc `all`. Giá trị khác → `400` |
| `search` | Không | Tìm theo tên sinh viên, mã sinh viên hoặc biển số |
| `type` | Không | `Vào bãi` hoặc `Ra bãi` |

Phản hồi `200`: mảng lượt xe, mới nhất xếp trước.

#### `POST /movements`

Ghi nhận một lượt xe vào hoặc ra.

Yêu cầu:

```json
{ "vehicleId": "clx2def...", "type": "Vào bãi", "gate": "Cổng chính" }
```

| Trường | Bắt buộc | Ràng buộc |
|---|:---:|---|
| `vehicleId` | Có | Mã phương tiện (trường `id`, không phải biển số) |
| `type` | Có | `Vào bãi` hoặc `Ra bãi` |
| `gate` | Không | Chuỗi không rỗng. Bỏ trống thì dùng cổng chính trong cấu hình |

Phản hồi `201`: đối tượng lượt xe.

Quy tắc nghiệp vụ (kiểm tra trong một giao dịch mức `Serializable`):

| Điều kiện | Lỗi |
|---|---|
| Không có phương tiện | `404` – `Không tìm thấy phương tiện.` |
| Xe đã trong bãi mà vẫn ghi "Vào bãi" | `409` – `Xe này hiện đang ở trong bãi.` |
| Xe không ở trong bãi mà ghi "Ra bãi" | `409` – `Xe này hiện không ở trong bãi.` |
| Vào bãi khi thẻ sinh viên `Hết hạn` | `409` – `Thẻ gửi xe của sinh viên đã hết hạn.` |
| Vào bãi khi bãi đã đủ sức chứa | `409` – `Bãi xe đã hết chỗ trống.` |
| Hai thao tác xung đột cùng lúc | `409` – `Bãi xe vừa được cập nhật. Hãy tải lại trạng thái xe và thử lại.` |

Thao tác thành công sẽ cập nhật `inParking` của xe và tạo bản ghi lượt xe.

---

### 3.7. Tickets (Thẻ gửi xe)

Thẻ gửi xe gắn trực tiếp với sinh viên, nên endpoint này trả dữ liệu theo sinh viên.

Đối tượng thẻ:

```json
{
  "id": "SV2024001",
  "studentId": "SV2024001",
  "studentName": "Nguyễn Văn A",
  "className": "CNTT-K18",
  "permitUntil": "2027-06-30",
  "status": "Đang hoạt động",
  "vehicleCount": 2
}
```

#### `GET /tickets`

| Query | Bắt buộc | Mô tả |
|---|:---:|---|
| `search` | Không | Tìm theo mã, tên hoặc lớp |
| `status` | Không | Một trong 3 trạng thái thẻ |

Phản hồi `200`: mảng thẻ, sắp xếp theo ngày hết hạn gần nhất trước, sau đó theo tên.

Lỗi: `400` – `Trạng thái vé không hợp lệ.`

#### `PUT /tickets/:studentId/renew`

Không cần body. Gia hạn thẻ thêm **1 năm** tính từ ngày hết hạn hiện tại; nếu thẻ đã quá hạn thì tính từ **hôm nay**. Trạng thái được đặt lại thành `Đang hoạt động`.

Phản hồi `200`:

```json
{
  "studentId": "SV2024001",
  "studentName": "Nguyễn Văn A",
  "permitUntil": "2027-11-01",
  "status": "Đang hoạt động"
}
```

Lỗi: `404` – `Không tìm thấy sinh viên.`

---

### 3.8. Settings (Cấu hình bãi xe)

Đối tượng cấu hình:

```json
{
  "schoolName": "Trường Đại học Công nghệ",
  "lotName": "Bãi xe sinh viên",
  "capacity": 180,
  "mainGate": "Cổng chính",
  "contactEmail": "baixe@university.edu.vn"
}
```

Nếu chưa có cấu hình, hệ thống tự tạo bản mặc định như ví dụ trên.

#### `GET /settings`

Phản hồi `200`: đối tượng cấu hình.

#### `PUT /settings`

Yêu cầu: đủ 5 trường.

| Trường | Ràng buộc |
|---|---|
| `schoolName`, `lotName`, `mainGate` | Không rỗng |
| `capacity` | Số nguyên, tối thiểu 1 |
| `contactEmail` | Email hợp lệ |

Phản hồi `200`: đối tượng cấu hình sau cập nhật.

Lỗi: `400` – `Sức chứa không thể thấp hơn số xe hiện có trong bãi (N).`

---

### 3.9. Assistant (Trợ lý AI)

#### `POST /assistant/chat`

Gửi hội thoại cho trợ lý hướng dẫn sử dụng Parkly. Backend ghép system prompt rồi gọi dịch vụ AI bên ngoài (khóa API chỉ nằm ở backend).

Yêu cầu:

```json
{
  "messages": [
    { "role": "user", "content": "Cách gia hạn vé gửi xe?" }
  ]
}
```

| Trường | Ràng buộc |
|---|---|
| `messages` | Mảng 1 đến 12 phần tử |
| `messages[].role` | `user` hoặc `assistant` |
| `messages[].content` | Chuỗi 1 đến 1500 ký tự |

Phản hồi `201`:

```json
{ "message": { "role": "assistant", "content": "Để gia hạn vé gửi xe, bạn..." } }
```

Lỗi:

| Mã | Khi nào |
|---|---|
| `400` | Dữ liệu không hợp lệ (quá dài, quá nhiều tin, sai vai trò) |
| `401` | Chưa đăng nhập hoặc token sai |
| `503` | Chưa cấu hình `AI_API_KEY`/`AI_MODEL`, hoặc `AI_API_URL` không hợp lệ |
| `504` | Dịch vụ AI không phản hồi trong 30 giây |
| `502` | Không kết nối được, dịch vụ AI trả lỗi, hoặc phản hồi rỗng/không hợp lệ |

Giới hạn: câu trả lời tối đa 500 token. Trợ lý chỉ hướng dẫn cách dùng hệ thống, không truy cập database.

---

## 4. Mô hình dữ liệu (tóm tắt)

```
User(id, name, email*, passwordHash)

Student(id, name, className, program, phone, permitUntil, status)
   │ 1
   │ n
Vehicle(id, studentId→Student, plate*, type, color, registeredAt, inParking)
   │ 1
   │ n
Movement(id, studentId→Student, vehicleId→Vehicle, type, timestamp, gate)

ParkingSettings(id='default', schoolName, lotName, capacity, mainGate, contactEmail)
```

`*` là cột duy nhất (unique). Quan hệ khóa ngoại dùng `onDelete: Restrict`, nên không xóa được sinh viên hoặc xe còn dữ liệu liên quan.

---

## 5. Biến môi trường backend

| Biến | Bắt buộc | Mô tả |
|---|:---:|---|
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL |
| `JWT_SECRET` | Có | Khóa ký token, **tối thiểu 32 ký tự**, nếu không server không khởi động |
| `PORT` | Không | Cổng chạy, mặc định `3000` |
| `FRONTEND_ORIGIN` | Không | Các origin được phép gọi API, cách nhau bằng dấu phẩy |
| `SEED_USER_EMAIL`, `SEED_USER_PASSWORD` | Khi seed | Tài khoản tạo sẵn bởi seed, mật khẩu **tối thiểu 12 ký tự**; bỏ trống thì đăng ký qua giao diện |
| `AI_API_URL` | Không | Địa chỉ API chat completions của nhà cung cấp AI (mặc định endpoint kiểu OpenAI) |
| `AI_API_KEY` | Để dùng trợ lý | Khóa API của dịch vụ AI; không đưa lên GitHub |
| `AI_MODEL` | Để dùng trợ lý | Tên mô hình AI; thiếu `AI_API_KEY` hoặc `AI_MODEL` thì `/assistant/chat` trả 503 |

---

## 6. Điểm cần lưu ý và đề xuất cải tiến

Các mục dưới đây rút ra từ việc đọc mã nguồn hiện tại, nhóm nên cân nhắc xử lý theo mức ưu tiên.

### Ưu tiên cao

1. **`POST /auth/register` công khai và không còn phân quyền.** Ai biết địa chỉ API cũng tự tạo được tài khoản rồi thêm, sửa, xóa sinh viên, phương tiện, vé và đổi cấu hình bãi. Nên đóng endpoint (ví dụ chỉ cho đăng ký khi chưa có tài khoản nào, hoặc tạo tài khoản bằng seed), hoặc khôi phục phân quyền. Cần ghi rõ quyết định trong báo cáo.
2. **Trạng thái thẻ (`status`) do client gửi lên**, không tự tính theo `permitUntil`. Thẻ quá ngày hết hạn vẫn là `Đang hoạt động` nếu không ai cập nhật, và khi đó xe vẫn vào bãi được. Nên tính trạng thái ở server (ví dụ còn dưới 30 ngày là `Sắp hết hạn`).
3. **`/assistant/chat` chưa giới hạn số lượt hỏi theo người dùng.** Mỗi lượt tốn chi phí API và tài khoản ai cũng tự tạo được. Nên thêm giới hạn tần suất.

### Ưu tiên trung bình

4. **Chưa có phân trang** cho `/students`, `/vehicles`, `/movements`, `/tickets`; frontend tải toàn bộ danh sách khi vào trang. Lịch sử vào/ra tăng nhanh theo thời gian, nên thêm `page` và `limit`.
5. **Chưa có tính phí và báo cáo doanh thu** (US03, US06, US14).
6. **Chưa có nhật ký thao tác (audit log)**; đặc biệt cần khi mọi tài khoản đều có toàn quyền.
7. **Chưa giới hạn số lần đăng nhập sai.** Nên thêm rate limiting (ví dụ `@nestjs/throttler`) cho `/auth/login`.
8. **Swagger chưa cấu hình Bearer token**, nên không thử được các endpoint cần đăng nhập ngay trên `/api/docs`. Thêm `.addBearerAuth()` vào `DocumentBuilder`.
9. **Giao diện không gọi `GET /tickets`** (trang Vé gửi xe tính từ danh sách sinh viên). Giữ hoặc bỏ endpoint này cho nhất quán.

### Ưu tiên thấp

10. Phản hồi `login` trả mã người dùng ở `user.sub`, còn `/auth/me` trả `id`. Nên thống nhất tên trường.
11. `POST /movements` nhận `vehicleId` thay vì biển số, và giao diện không gửi `gate` nên luôn ghi cổng mặc định.
12. Giá trị enum đang là tiếng Việt trong API. Nếu sau này đa ngôn ngữ, nên đổi sang mã (`ACTIVE`, `ENTRY`...) và để frontend hiển thị nhãn.
