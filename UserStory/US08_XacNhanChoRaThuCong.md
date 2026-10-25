# USER STORY: US08 - CHO PHÉP XÁC NHẬN CHO RA THỦ CÔNG (OVERRIDE WARNING)

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US08
- **Tên User Story:** Cho phép Xác nhận Cho Ra Thủ công (Override Warning)
- **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
- **Tác nhân chính:** Nhân viên Bảo vệ
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC08), [SRS.md](../SRS.md) (FR-POS-05)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Nhân viên Bảo vệ.
- **I want to:** Nhập lý do và bấm xác nhận ghi đè (Override) sau khi kiểm tra giấy tờ thực tế.
- **So that:** Xử lý cho xe ra trong trường hợp AI đọc nhầm ký tự biển số.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Tránh tình trạng ùn tắc do AI đọc nhầm biển số bám bẩn hoặc mờ chữ khi Bảo vệ đã xác thực trực tiếp giấy tờ xe hợp lệ.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

- **BR-01:** Bắt buộc nhập lý do Override và lưu vết tài khoản bảo vệ thao tác.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Bảo vệ Override thành công

- **Given:** Lượt xe đang bị cảnh báo sai biển số.
- **When:** Bảo vệ kiểm tra Cà-vẹt khớp, nhập lý do và bấm xác nhận mở cổng.
- **Then:** Barie mở, lưu log ghi đè và hoàn tất lượt gửi.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

Cập nhật `ParkingLogs`: `override_by_user_id`, `override_reason`.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC08)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-POS-05)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US07`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

