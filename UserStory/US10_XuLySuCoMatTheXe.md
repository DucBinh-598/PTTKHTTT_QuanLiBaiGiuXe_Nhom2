# USER STORY: US10 - XỬ LÝ SỰ CỐ MẤT THẺ / KHÓA THẺ KHẨN CẤP

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US10
- **Tên User Story:** Xử lý Sự cố Mất thẻ / Khóa thẻ khẩn cấp
- **Phân hệ:** Phân hệ 3 - Quản lý Bãi xe & Xử lý Sự cố (Parking Operations & Incidents)
- **Tác nhân chính:** Bảo vệ / Quản trị viên
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC10), [SRS.md](../SRS.md) (FR-INV-02)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Nhân viên Bảo vệ / Quản trị viên.
- **I want to:** Tiếp nhận báo mất thẻ, xác thực giấy tờ chủ xe, cho xe ra thủ công và khóa thẻ ngay lập tức.
- **So that:** Chủ xe lấy được xe an toàn và vô hiệu hóa thẻ bị mất.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xử lý thành công khi mất thẻ

- **Given:** Chủ xe xuất trình giấy tờ chứng minh.
- **When:** Bảo vệ xác nhận trên hệ thống và khóa thẻ cũ.
- **Then:** Hoàn tất cho xe ra và chuyển trạng thái thẻ thành `LOCKED`.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC10)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-INV-02)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US01`, `US09`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

