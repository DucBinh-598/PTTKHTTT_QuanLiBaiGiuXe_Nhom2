# USER STORY: US11 - KIỂM KÊ SỨC CHỨA BÃI XE & ĐIỀU PHỐI LUỒNG

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US11
- **Tên User Story:** Kiểm kê Sức chứa Bãi xe & Điều phối Luồng
- **Phân hệ:** Phân hệ 3 - Quản lý Bãi xe & Xử lý Sự cố (Parking Operations & Incidents)
- **Tác nhân chính:** Bảo vệ / Hệ thống Tự động
- **Mức độ ưu tiên (MoSCoW):** Medium (Should Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC11), [SRS.md](../SRS.md) (FR-INV-03)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Bảo vệ / Sinh viên.
- **I want to:** Hệ thống hiển thị số lượng chỗ trống thực tế trong bãi tại bảng điện tử ngoài cổng.
- **So that:** Nắm bắt tình trạng bãi xe còn chỗ hay đã đầy.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Cập nhật sức chứa real-time

- **Given:** Bãi xe đạt sức chứa tối đa.
- **When:** Có xe mới Check-in.
- **Then:** Bảng điện tử chuyển sang trạng thái "FULL".

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC11)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-INV-03)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US04`, `US06`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

