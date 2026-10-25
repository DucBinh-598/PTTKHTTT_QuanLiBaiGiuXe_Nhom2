# USER STORY: US15 - QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN RBAC

---

## 1. THÔNG TIN CHUNG (METADATA)

- **Mã User Story:** US15
- **Tên User Story:** Quản lý Tài khoản & Phân quyền RBAC (Phần mềm Bãi xe)
- **Phân hệ:** Phân hệ 4 - Cảnh báo, Báo cáo & Quản trị (Alerts, Reports & Admin)
- **Tác nhân chính:** Quản trị viên (Admin)
- **Mức độ ưu tiên (MoSCoW):** High (Must Have)
- **Trạng thái:** Approved
- **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC15), [SRS.md](../SRS.md) (NFR-SEC-01)

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

- **As a:** Quản trị viên hệ thống.
- **I want to:** Tạo tài khoản, gán vai trò (`ADMIN`, `GUARD`) và kiểm soát quyền hạn truy cập hệ thống.
- **So that:** Đảm bảo an toàn thông tin, nhân viên bảo vệ chỉ thao tác nghiệp vụ quẹt thẻ mà không can thiệp được dữ liệu cấu hình/báo cáo.

---

## 3. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Chặn quyền truy cập trái phép

- **Given:** Tài khoản `GUARD` cố tình truy cập trang cấu hình Admin.
- **When:** Gửi request tới hệ thống.
- **Then:** Hệ thống chặn lại và trả về lỗi `403 Forbidden`.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

- **Tài liệu đặc tả Use Case:** [DacTa.md](../DacTa.md) (UC15)
- **Tài liệu đặc tả yêu cầu phần mềm:** [SRS.md](../SRS.md) (NFR-SEC-01)
- **Thành phần phụ thuộc trước (Pre-dependencies):** Không có.
- **Thành phần phụ thuộc sau (Post-dependencies):** Toàn bộ các User Stories.

