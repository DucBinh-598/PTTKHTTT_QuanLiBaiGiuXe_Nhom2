# USER STORY: US12 - QUÉT & CẢNH BÁO XE TỒN KHO QUÁ 24H / XE LẠ

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US12
- **Tên User Story:** Quét & Cảnh báo Xe Tồn Kho quá 24h / Xe Lạ
- **Phân hệ:** Phân hệ 4 - Cảnh báo, Báo cáo & Quản trị (Alerts, Reports & Admin)
- **Tác nhân chính:** Hệ thống Tự động (Cron Job)
- **Mức độ ưu tiên (MoSCoW):** Low (Could Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC12), [SRS.md](../SRS.md) (FR-REP-01)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Quản trị viên bãi xe.
- **I want to:** Hệ thống tự động quét các xe gửi liên tục trên 24h/48h mà chưa ra.
- **So that:** Phát hiện kịp thời các phương tiện bỏ quên hoặc nghi vấn gửi trái phép.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Cron job lọc xe quá hạn

- **Given:** Xe gửi liên tục quá thời gian quy định.
- **When:** Tác vụ chạy lúc 00:00 hàng ngày.
- **Then:** Đưa vào danh sách cảnh báo tồn lưu trên Dashboard Admin.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC12)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (FR-REP-01)
- **Thành phần phụ thuộc trước (Pre-dependencies):** `US04`.
- **Thành phần phụ thuộc sau (Post-dependencies):** Không có.

