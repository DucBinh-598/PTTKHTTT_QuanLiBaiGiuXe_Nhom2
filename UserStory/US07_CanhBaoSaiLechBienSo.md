# USER STORY: US07 - CẢNH BÁO SAI LỆCH BIỂN SỐ & KHÓA BARIE (ANTI-THEFT)

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US07
- **Tên User Story:** Cảnh báo Sai lệch Biển số & Khóa Barie (Anti-theft)
- **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
- **Tác nhân chính:** Bảo vệ / Hệ thống Tự động
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC07), [SRS.md](../SRS.md) (FR-POS-04)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Hệ thống Giám sát An ninh.
- **I want to:** Khóa Barie, phát còi hú và nháy màn hình cảnh báo khi biển số ra khác biệt với biển số vào.
- **So that:** Ngăn chặn tuyệt đối hành vi tráo thẻ hoặc trộm cắp xe.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Đây là chức năng cốt lõi bảo vệ tài sản sinh viên, chặn đứng thủ đoạn tráo xe bằng cách nhặt hoặc lấy cắp thẻ từ.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

- **BR-01:** Nếu `plate_in != plate_out`, bật cờ `is_warning = TRUE` và giữ Barie đóng.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Kích hoạt cảnh báo khi lệch biển số

- **Given:** Xe quẹt ra có biển số khác với lúc vào.
- **When:** Hệ thống đối chiếu tự động.
- **Then:** Barie khóa chặt, loa phát âm thanh cảnh báo và chuyển trạng thái log thành `WARNING`.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

Cập nhật log trạng thái `status = 'WARNING'` và ghi lại dữ liệu bất thường vào bảng audit.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC07)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-POS-04)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US06`.
- **Thành phần phụ thuộc sau (Post-dependencies):** `US08`.
