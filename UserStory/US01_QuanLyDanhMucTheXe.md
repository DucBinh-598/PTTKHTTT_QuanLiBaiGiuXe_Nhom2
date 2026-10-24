# USER STORY: US01 - QUẢN LÝ DANH MỤC THẺ XE (RFID)

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US01
- **Tên User Story:** Quản lý Danh mục Thẻ xe (RFID)
- **Phân hệ:** Phân hệ 1 - Quản lý Danh mục & Cấu hình Hệ thống (Master Data)
- **Tác nhân chính:** Quản trị viên (Admin)
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC01), [SRS.md](../SRS.md) (FR-MD-01)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Quản trị viên hệ thống (Admin).
- **I want to:** Thêm mới, cập nhật, kích hoạt, khóa hoặc vô hiệu hóa danh mục các thẻ từ RFID trong hệ thống.
- **So that:** Quản lý chính xác số lượng thẻ lưu hành, đảm bảo chỉ những thẻ hợp lệ mới được phép ra/vào bãi xe và ngăn ngừa rủi ro gian lận/mất thẻ.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Bãi giữ xe trường học vận hành dựa trên công nghệ quét thẻ RFID tại làn xe vào/ra. Quản trị viên cần khai báo mã chip vật lý (`card_uid`) vào cơ sở dữ liệu trước khi bàn giao cho Bảo vệ hoặc cấp phát cho Sinh viên/Cán bộ. Khi thẻ bị mất hoặc hỏng, Quản trị viên phải khóa thẻ ngay lập tức để tránh kẻ gian lợi dụng.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

- **BR-01 (Mã chip duy nhất):** Mỗi thẻ RFID có duy nhất một mã `card_uid` không trùng lặp trong toàn bộ hệ thống.
- **BR-02 (Loại thẻ):** Thẻ xe phân làm 2 loại chính:
  - `CASUAL`: Thẻ vé lượt (dành cho khách vãng lai).
  - `MONTHLY`: Thẻ vé tháng (gắn liền với thông tin Sinh viên/Cán bộ).
- **BR-03 (Trạng thái thẻ):** `ACTIVE` (Hoạt động), `LOCKED` (Khóa khẩn cấp), `DISABLED` (Hủy vĩnh viễn).
- **BR-04 (Ràng buộc xóa):** Không cho phép XÓA VĨNH VIỄN các thẻ đã từng có lịch sử gửi xe trong bảng `ParkingLogs`, chỉ cho phép chuyển sang trạng thái `DISABLED`.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Thêm mới thẻ RFID hợp lệ

- **Given:** Quản trị viên đang ở màn hình Quản lý Danh mục Thẻ xe.
- **When:** Nhập mã chip `RFID_100200`, chọn loại thẻ `CASUAL`, trạng thái `ACTIVE` và bấm "Lưu".
- **Then:** Hệ thống ghi nhận thẻ mới vào CSDL, hiển thị thông báo thành công.

### Kịch bản 2: Thêm mới thẻ RFID bị trùng mã chip

- **Given:** Mã chip `RFID_100200` đã tồn tại.
- **When:** Quản trị viên nhập lại mã chip này và bấm "Lưu".
- **Then:** Hệ thống báo lỗi "Mã chip RFID đã tồn tại", không cho phép lưu.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

### Cấu trúc bảng CSDL (`Cards`)

```sql
CREATE TABLE Cards (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    card_uid VARCHAR(50) NOT NULL UNIQUE,
    card_type ENUM('CASUAL', 'MONTHLY') DEFAULT 'CASUAL',
    status ENUM('ACTIVE', 'LOCKED', 'DISABLED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Danh sách API

- `GET /api/v1/cards` - Lấy danh sách thẻ xe.
- `POST /api/v1/cards` - Thêm mới thẻ RFID.
- `PUT /api/v1/cards/{card_id}` - Cập nhật thông tin thẻ.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC01)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-MD-01)
- **Thành phần phụ thuộc trước (Pre-dependencies):** Không có (Master Data).
- **Thành phần phụ thuộc sau (Post-dependencies):** `US02`, `US04`.
