# USER STORY: US14 - BÁO CÁO DOANH THU BÁN VÉ LƯỢT & VÉ THÁNG

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US14
- **Tên User Story:** Báo cáo Doanh thu Bán vé lượt & Vé tháng
- **Phân hệ:** Phân hệ 4 - Cảnh báo, Báo cáo & Quản trị (Alerts, Reports & Admin)
- **Tác nhân chính:** Quản trị viên (Admin)
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC14), [SRS.md](../SRS.md) (Báo cáo TC)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Chủ bãi xe / Quản trị viên.
- **I want to:** Xem tổng hợp doanh thu tiền mặt và chuyển khoản theo ngày/tháng và xuất file Excel.
- **So that:** Quản lý tài chính minh bạch và đối soát ca trực.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xuất báo cáo Excel thành công

- **Given:** Admin chọn khoảng thời gian báo cáo.
- **When:** Bấm nút "Xuất Excel".
- **Then:** File `.xlsx` được tải về đầy đủ số liệu tài chính.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC14)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (Báo cáo TC)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US02`, `US06`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

