# USER STORY: US13 - BÁO CÁO MẬT ĐỘ LƯỢT XE VÀO/RA THEO KHUNG GIỜ

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US13
- **Tên User Story:** Báo cáo Mật độ Lượt xe Vào/Ra theo Khung giờ
- **Phân hệ:** Phân hệ 4 - Cảnh báo, Báo cáo & Quản trị (Alerts, Reports & Admin)
- **Tác nhân chính:** Quản trị viên (Admin)
- **Mức độ ưu tiên (MoSCoW):** Medium (Should Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC13), [SRS.md](../SRS.md) (FR-REP-02)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Quản trị viên bãi xe.
- **I want to:** Xem biểu đồ thống kê lưu lượng xe ra vào theo từng khung giờ trong ngày.
- **So that:** Sắp xếp lực lượng bảo vệ phân luồng hiệu quả vào giờ cao điểm.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xem biểu đồ lưu lượng

- **Given:** Admin chọn ngày cần xem báo cáo.
- **When:** Bấm "Xem biểu đồ".
- **Then:** Hiển thị biểu đồ cột trực quan phân bổ theo khung giờ.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC13)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-REP-02)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US04`, `US06`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

