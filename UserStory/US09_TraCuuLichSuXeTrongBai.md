# USER STORY: US09 - TRA CỨU VỊ TRÍ & LỊCH SỬ XE TRONG BÃI

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US09
- **Tên User Story:** Tra cứu Vị trí & Lịch sử Xe trong Bãi
- **Phân hệ:** Phân hệ 3 - Quản lý Bãi xe & Xử lý Sự cố (Parking Operations & Incidents)
- **Tác nhân chính:** Bảo vệ / Sinh viên
- **Mức độ ưu tiên (MoSCoW):** Medium (Should Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC09), [SRS.md](../SRS.md) (FR-INV-01)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Bảo vệ / Sinh viên.
- **I want to:** Nhập biển số xe để tra cứu xem xe có đang trong bãi và xem lại hình ảnh lúc vào.
- **So that:** Hỗ trợ tìm xe thất lạc trong khuôn viên bãi đỗ rộng.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tra cứu thấy xe đang trong bãi

- **Given:** Xe đang gửi có trạng thái `IN_PARKING`.
- **When:** Nhập biển số lên thanh tìm kiếm.
- **Then:** Hiển thị thông tin thời gian vào và ảnh chụp thực tế.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC09)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-INV-01)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US04`, `US05`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

