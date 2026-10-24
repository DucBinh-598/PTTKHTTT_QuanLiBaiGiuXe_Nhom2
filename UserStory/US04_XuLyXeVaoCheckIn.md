# USER STORY: US04 - XỬ LÝ XE VÀO & QUÉT THẺ RFID (CHECK-IN)

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US04
- **Tên User Story:** Xử lý Xe Vào & Quét Thẻ RFID (Check-in)
- **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
- **Tác nhân chính:** Nhân viên Bảo vệ
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC04), [SRS.md](../SRS.md) (FR-POS-01)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Nhân viên Bảo vệ tại làn vào.
- **I want to:** Quẹt thẻ RFID của xe để hệ thống ghi nhận thời gian vào và mở Barie.
- **So that:** Phương tiện vào bãi nhanh chóng và lưu lại log dữ liệu ban đầu.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Giờ cao điểm sáng yêu cầu thao tác quẹt thẻ tốc độ cao dưới 1.5 giây để tránh ùn tắc trước cổng trường.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

- **BR-01:** Thẻ quẹt phải có trạng thái `ACTIVE`.
- **BR-02:** Thẻ đang có trạng thái `IN_PARKING` không được phép Check-in lần nữa.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Check-in hợp lệ thành công

- **Given:** Thẻ ở trạng thái `ACTIVE` và ngoài bãi.
- **When:** Bảo vệ quẹt thẻ lên đầu đọc.
- **Then:** Lưu log `IN_PARKING`, mở Barie tự động.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

```sql
CREATE TABLE ParkingLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    check_in_time DATETIME NOT NULL,
    status ENUM('IN_PARKING', 'COMPLETED', 'WARNING') DEFAULT 'IN_PARKING'
);
```

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC04)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-POS-01)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US01`.
- **Thành phần phụ thuộc sau (Post-dependencies):** `US05`.
