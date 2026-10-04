# BẢNG THEO DÕI TIẾN ĐỘ TÍNH NĂNG (FEATURE TRACKING)
## HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SPMS)

* **Cập nhật lần cuối:** 04/10/2026
* **Người quản lý bảng:** Member 3 (BA / QA)
* **Tổng số tính năng:** 12 | **Hoàn thành:** 3/12 (25%)

---

## 1. THỐNG KÊ TỔNG QUAN (PROGRESS SUMMARY)

| Phân Hệ (Module) | Số Lượng Tasks | Đã Xong (Done) | Đang Làm (In Progress) | Chưa Làm (To Do) | Tỷ Lệ Hoàn Thành |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Tài liệu & BA** | 3 | 3 | 0 | 0 | **100%** |
| **Core AI & Backend** | 4 | 0 | 2 | 2 | **25%** |
| **Frontend (Web/App)** | 3 | 0 | 1 | 2 | **15%** |
| **Kiểm thử (QA/Testing)**| 2 | 0 | 1 | 1 | **10%** |

---

## 2. DANH SÁCH CHI TIẾT TIẾN ĐỘ TÍNH NĂNG

### 🎯 Phân Hệ 1: Tài liệu & Phân tích Nghiệp vụ (BA)
*Người phụ trách: Member 3*

| Mã Task | Tên Tính Năng / Công Việc | Độ Ưu Tiên | Trạng Thái | Ngày BĐ | Hạn Chót | Tiến Độ | Ghi Chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `DOC-01` | Đảo tả Yêu cầu SRS v2 & BRD | **Cao** | `DONE` | 01/10 | 03/10 | 100% | Đã chốt file SRS hoàn chỉnh |
| `DOC-02` | Vẽ sơ đồ Use Case & Sequence Diagram | **Cao** | `DONE` | 03/10 | 04/10 | 100% | Đã có mã Mermaid |
| `DOC-03` | Cấu trúc thư mục dự án & File Tracking | Trung bình | `DONE` | 04/10 | 04/10 | 100% | Khởi tạo xong khung dự án |

---

### 🧠 Phân Hệ 2: Core AI & Backend Server
*Người phụ trách: Member 1*

| Mã Task | Tên Tính Năng / Công Việc | Độ Ưu Tiên | Trạng Thái | Ngày BĐ | Hạn Chót | Tiến Độ | Ghi Chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `BE-01` | Thiết kế CSDL PostgreSQL (Models/ERD) | **Cao** | `IN_PROGRESS` | 04/10 | 07/10 | 60% | Đã xong bảng Users & Cards |
| `BE-02` | Module AI đọc biển số xe (OpenCV/OCR) | **Cao** | `IN_PROGRESS` | 05/10 | 11/10 | 40% | Đang test độ chính xác ảnh tối |
| `BE-03` | API Check-in & Check-out | **Cao** | `TO_DO` | 10/10 | 15/10 | 0% | Chờ xong Module AI & DB |
| `BE-04` | API Quản lý vé tháng & Báo cáo Admin | Thấp | `TO_DO` | 16/10 | 20/10 | 0% | Làm ở giai đoạn 2 |

---

### 💻 Phân Hệ 3: Giao diện Người dùng (Frontend)
*Người phụ trách: Member 2*

| Mã Task | Tên Tính Năng / Công Việc | Độ Ưu Tiên | Trạng Thái | Ngày BĐ | Hạn Chót | Tiến Độ | Ghi Chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `FE-01` | Màn hình Bảo vệ (Làn xe vào/ra) | **Cao** | `IN_PROGRESS` | 05/10 | 12/10 | 30% | Dựng xong UI, chưa nối API |
| `FE-02` | Màn hình Admin (Thống kê/Quản lý thẻ) | Trung bình | `TO_DO` | 13/10 | 18/10 | 0% | Dùng Ant Design dựng nhanh |
| `FE-03` | Cổng Đăng ký vé tháng cho Sinh viên | Thấp | `TO_DO` | 19/10 | 22/10 | 0% | Trang Web đính kèm |

---

### 🧪 Phân Hệ 4: Kiểm thử & Đảm bảo Chất lượng (QA)
*Người phụ trách: Member 3*

| Mã Task | Tên Tính Năng / Công Việc | Độ Ưu Tiên | Trạng Thái | Ngày BĐ | Hạn Chót | Tiến Độ | Ghi Chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `QA-01` | Lập Kịch bản Test (Test Cases) | **Cao** | `IN_PROGRESS` | 04/10 | 06/10 | 80% | Đã xong bộ Test Case Check-in/out |
| `QA-02` | Test tích hợp API & Báo lỗi (Log Bug) | **Cao** | `TO_DO` | 12/10 | 20/10 | 0% | Sẽ test ngay khi Dev push code |

---

## 3. QUY ƯỚC TRẠNG THÁI (STATUS LEGEND)

* `TO_DO`: Chưa thực hiện.
* `IN_PROGRESS`: Đang phát triển / Đang xử lý.
* `TESTING`: Đã code xong, chuyển cho QA test.
* `FIXING`: QA phát hiện bug, Dev đang sửa.
* `DONE`: Đã hoàn thành $100\%$ và kiểm thử đạt yêu cầu.
