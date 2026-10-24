# USER STORY: US03 - THIẾT LẬP BẢNG GIÁ & KHUNG GIỜ GỬI XE

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US03
- **Tên User Story:** Thiết lập Bảng giá & Khung giờ Gửi xe
- **Phân hệ:** Phân hệ 1 - Quản lý Danh mục & Cấu hình Hệ thống (Master Data)
- **Tác nhân chính:** Quản trị viên (Admin)
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC03), [SRS.md](../SRS.md) (FR-MD-03)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Quản trị viên hệ thống (Admin).
- **I want to:** Cấu hình biểu giá gửi xe theo từng loại phương tiện và khung giờ (Ngày/Đêm/Qua đêm).
- **So that:** Hệ thống tự động tính chính xác tiền phí tại làn Check-out.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Phí gửi xe được phân rã theo khung giờ hành chính và ban đêm để quản lý tài chính minh bạch, hạn chế xe gửi qua đêm trái phép.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

- **BR-01:** Ca ngày tính từ `06:00:00` đến `21:59:59`; Ca đêm tính từ `22:00:00` đến `05:59:59`.
- **BR-02:** Thẻ vé tháng (`MONTHLY`) được miễn phí toàn bộ các khung giờ (`price = 0`).

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Cấu hình giá vé ca đêm thành công

- **Given:** Admin mở cấu hình giá vé, nhập mức phí ca đêm mới.
- **When:** Bấm "Lưu".
- **Then:** Hệ thống áp dụng bảng giá mới cho các lượt Check-out tiếp theo.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

```sql
CREATE TABLE Tariffs (
    tariff_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_type VARCHAR(50) NOT NULL,
    day_rate DECIMAL(10,2) NOT NULL,
    night_rate DECIMAL(10,2) NOT NULL
);
```

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC03)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-MD-03)
- **Thành phần phụ thuộc trước (Pre-dependencies):** Không có.
- **Thành phần phụ thuộc sau (Post-dependencies):** `US06`.
