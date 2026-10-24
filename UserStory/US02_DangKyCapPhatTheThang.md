# USER STORY: US02 - ĐĂNG KÝ & CẤP PHÁT THẺ THÁNG SINH VIÊN

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US02
- **Tên User Story:** Đăng ký & Cấp phát Thẻ tháng Sinh viên
- **Phân hệ:** Phân hệ 1 - Quản lý Danh mục & Cấu hình Hệ thống (Master Data)
- **Tác nhân chính:** Sinh viên / Cán bộ & Quản trị viên (Admin)
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC02), [SRS.md](../SRS.md) (FR-MD-02)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Sinh viên / Cán bộ nhà trường.
- **I want to:** Đăng ký vé xe tháng trực tuyến và tải lên thông tin xe cùng giấy tờ xác thực.
- **So that:** Tiết kiệm thời gian làm thủ tục trực tiếp và được cấp thẻ RFID gửi xe tháng thuận tiện.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Đầu mỗi học kỳ, nhu cầu đăng ký vé xe tháng lớn. Việc số hóa giúp Admin kiểm duyệt thông tin chính chủ giữa Biển số xe - Mã Sinh viên - Thẻ RFID nhanh chóng.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

- **BR-01:** Mỗi Sinh viên chỉ sở hữu tối đa 1 thẻ vé tháng có hiệu lực tại một thời điểm.
- **BR-02:** Hồ sơ đăng ký bắt buộc đính kèm ảnh Cà-vẹt xe và Thẻ sinh viên.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Sinh viên nộp đơn đăng ký thành công

- **Given:** Sinh viên đăng nhập cổng thông tin, điền biển số và tải ảnh.
- **When:** Bấm "Gửi đăng ký".
- **Then:** Hệ thống tạo đơn trạng thái `PENDING_APPROVAL` chuyển tới Admin.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

```sql
CREATE TABLE MonthlySubscriptions (
    subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    card_id INT UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);
```

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC02)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-MD-02)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US01`.
- **Thành phần phụ thuộc sau (Post-dependencies):** `US06`.
