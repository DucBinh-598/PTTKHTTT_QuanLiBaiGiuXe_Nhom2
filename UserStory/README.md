# DANH MỤC CÁC USER STORY (AGILE USER STORIES)
## HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SMART PARKING SYSTEM)
**Chủ đề trọng tâm:** Quản lý Luồng Xe Vào/Ra (RFID & AI Camera Check-in/Check-out), Cảnh báo An ninh & Thống kê Doanh thu / Lượt xe  
**Tài liệu cơ sở:** 
**Phiên bản:** 1.0  
**Ngày lập:** 05/10/2026  

---

## 1. TỔNG QUAN HỆ THỐNG USER STORIES

Hệ thống User Story được thiết kế chuẩn mực theo phương pháp Agile/Scrum, đóng vai trò làm cầu nối giữa các yêu cầu nghiệp vụ chuyên sâu trong tài liệu Đặc tả (DacTa.md / SRS.md) với đội ngũ phát triển phần mềm (Developers) và đội ngũ kiểm thử chất lượng (QA/QC).

Mỗi User Story được tổ chức thành một file Markdown độc lập trong thư mục `user_stories/`, tuân thủ cấu trúc chuẩn:
1. **Thông tin chung (Metadata):** Mã US, Tên, Phân hệ, Mức độ ưu tiên (MoSCoW), Tác nhân, Trạng thái.
2. **Nội dung User Story (Story Statement):** Định dạng *As a... / I want to... / So that...*
3. **Bối cảnh & Nghiệp vụ thực tế (Business Context).**
4. **Quy tắc nghiệp vụ & Thuật toán (Business Rules & Algorithms).**
5. **Tiêu chí nghiệm thu (Acceptance Criteria - AC):** Kịch bản kiểm thử chuẩn BDD/Gherkin (*Given - When - Then*).
6. **Đặc tả kỹ thuật & CSDL liên quan (Technical & Data Specs):** Schema CSDL, Pseudo-code, NFR, UI/UX shortcuts.
7. **Truy vết & Điều kiện phụ thuộc (Traceability & Dependencies).**

---

## 2. MA TRẬN TRUY VẾT YÊU CẦU (TRACEABILITY MATRIX)

Bảng đối chiếu 1-1 giữa User Stories với Use Case (DacTa.md) và Yêu cầu chức năng (SRS.md):

| Mã US | Tên User Story | Phân hệ | Use Case (DacTa.md) | Yêu cầu SRS (SRS.md) | Tác nhân chính | File chi tiết |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **US01** | Quản lý Danh mục Thẻ xe (RFID) | Phân hệ 1 | **UC01** | **[FR-MD-01]** | Quản trị viên | [US01_QuanLyDanhMucTheXe.md](user_stories/US01_QuanLyDanhMucTheXe.md) |
| **US02** | Đăng ký & Cấp phát Thẻ tháng Sinh viên | Phân hệ 1 | **UC02** | **[FR-MD-02]** | Quản trị viên | [US02_DangKyCapPhatTheThang.md](user_stories/US02_DangKyCapPhatTheThang.md) |
| **US03** | Thiết lập Bảng giá & Khung giờ Gửi xe | Phân hệ 1 | **UC03** | **[FR-MD-03]** | Quản trị viên | [US03_ThietLapBangGiaKhungGio.md](user_stories/US03_ThietLapBangGiaKhungGio.md) |
| **US04** | Xử lý Xe Vào & Quét Thẻ RFID (Check-in) | Phân hệ 2 | **UC04** | **[FR-POS-01]** | Bảo vệ | [US04_XuLyXeVaoCheckIn.md](user_stories/US04_XuLyXeVaoCheckIn.md) |
| **US05** | Tự động Chụp ảnh & Nhận diện Biển số Vào (AI ALPR) | Phân hệ 2 | **UC05** | **[FR-POS-02]** | Hệ thống / Bảo vệ | [US05_NhanDienBienSoVao.md](user_stories/US05_NhanDienBienSoVao.md) |
| **US06** | Xử lý Xe Ra & Đối soát Biển số (Check-out) | Phân hệ 2 | **UC06** | **[FR-POS-03]** | Bảo vệ | [US06_XuLyXeRaCheckOut.md](user_stories/US06_XuLyXeRaCheckOut.md) |
| **US07** | Cảnh báo Sai lệch Biển số & Khóa Barem (Anti-theft) | Phân hệ 2 | **UC07** | **[FR-POS-04]** | Bảo vệ / Hệ thống | [US07_CanhBaoSaiLechBienSo.md](user_stories/US07_CanhBaoSaiLechBienSo.md) |
| **US08** | Cho phép Xác nhận Cho Ra Thủ công (Override Warning) | Phân hệ 2 | **UC08** | **[FR-POS-05]** | Bảo vệ | [US08_XacNhanChoRaThuCong.md](user_stories/US08_XacNhanChoRaThuCong.md) |
| **US09** | Tra cứu Vị trí & Lịch sử Xe trong Bãi | Phân hệ 3 | **UC09** | **[FR-INV-01]** | Bảo vệ / Sinh viên | [US09_TraCuuLichSuXeTrongBai.md](user_stories/US09_TraCuuLichSuXeTrongBai.md) |
| **US10** | Xử lý Sự cố Mất thẻ / Khóa thẻ khẩn cấp | Phân hệ 3 | **UC10** | **[FR-INV-02]** | Bảo vệ / Quản trị viên | [US10_XuLySuCoMatTheXe.md](user_stories/US10_XuLySuCoMatTheXe.md) |
| **US11** | Kiểm kê Sức chứa Bãi xe & Điều phối Luồng | Phân hệ 3 | **UC11** | **[FR-INV-03]** | Bảo vệ | [US11_KiemKeSucChuaBaiXe.md](user_stories/US11_KiemKeSucChuaBaiXe.md) |
| **US12** | Quét & Cảnh báo Xe Tồn Kho quá 24h / Xe Lạ | Phân hệ 4 | **UC12** | **[FR-REP-01]** | Hệ thống / Bảo vệ | [US12_QuetCanhBaoXeTonKhoQuaHan.md](user_stories/US12_QuetCanhBaoXeTonKhoQuaHan.md) |
| **US13** | Báo cáo Mật độ Lượt xe Vào/Ra theo Khung giờ | Phân hệ 4 | **UC13** | **[FR-REP-02]** | Quản trị viên / Bảo vệ | [US13_XemBaoCaoMatDoLuotXe.md](user_stories/US13_XemBaoCaoMatDoLuotXe.md) |
| **US14** | Báo cáo Doanh thu Bán vé lượt & Vé tháng | Phân hệ 4 | **UC14** | **[Báo cáo TC]** | Quản trị viên | [US14_XemBaoCaoDoanhThuBaiXe.md](user_stories/US14_XemBaoCaoDoanhThuBaiXe.md) |
| **US15** | Quản lý Tài khoản & Phân quyền RBAC (Phần mềm Bãi xe) | Phân hệ 4 | **UC15** | **[NFR-SEC-01]** | Quản trị viên | [US15_QuanLyTaiKhoan_PhanQuyen.md](user_stories/US15_QuanLyTaiKhoan_PhanQuyen.md) |

---

## 3. PHÂN BỔ THEO PHÂN HỆ CHỨC NĂNG

* **HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SMART PARKING)**
  * **Phân hệ 1: Quản lý Danh mục & Cấu hình Hệ thống (Master Data)**
    * `US01`: Quản lý Danh mục Thẻ xe (RFID)
    * `US02`: Đăng ký & Cấp phát Thẻ tháng Sinh viên
    * `US03`: Thiết lập Bảng giá & Khung giờ Gửi xe
  * **Phân hệ 2: Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)**
    * `US04`: Xử lý Xe Vào & Quét Thẻ RFID (Check-in)
    * `US05`: Tự động Chụp ảnh & Nhận diện Biển số Vào (AI ALPR)
    * `US06`: Xử lý Xe Ra & Đối soát Biển số (Check-out)
    * `US07`: Cảnh báo Sai lệch Biển số & Khóa Barem (Anti-theft Logic)
    * `US08`: Cho phép Xác nhận Cho Ra Thủ công (Override Warning)
  * **Phân hệ 3: Quản lý Bãi xe & Xử lý Sự cố (Parking Operations & Incidents)**
    * `US09`: Tra cứu Vị trí & Lịch sử Xe trong Bãi
    * `US10`: Xử lý Sự cố Mất thẻ / Khóa thẻ khẩn cấp
    * `US11`: Kiểm kê Sức chứa Bãi xe & Điều phối Luồng
  * **Phân hệ 4: Cảnh báo, Báo cáo & Quản trị (Alerts, Reports & Admin)**
    * `US12`: Quét & Cảnh báo Xe Tồn Kho quá 24h / Xe Lạ
    * `US13`: Báo cáo Mật độ Lượt xe Vào/Ra theo Khung giờ
    * `US14`: Báo cáo Doanh thu Bán vé lượt & Vé tháng
    * `US15`: Quản lý Tài khoản & Phân quyền RBAC

---

## 4. MA TRẬN TÁC NHÂN VS USER STORY

| User Story | Nhân viên Bảo vệ | Sinh viên / Khách gửi xe | Quản trị viên (Admin) | Hệ thống Tự động (Worker/AI) |
| :--- | :---: | :---: | :---: | :---: |
| **US01** | Tra cứu | | **Chính (CRUD)** | |
| **US02** | Xem | Đăng ký | **Chính (Phê duyệt/Cấp)** | |
| **US03** | Tra cứu | Xem bảng giá | **Chính (CRUD)** | |
| **US04** | **Chính (Quét thẻ)** | Sử dụng thẻ | | Kích hoạt Camera |
| **US05** | Xem màn hình | | | **Chính (Thuật toán OCR/AI)** |
| **US06** | **Chính (Cho ra)** | Trả tiền/Thẻ | | So sánh hình ảnh |
| **US07** | Nhận cảnh báo | | Giám sát | **Chính (So sánh chuỗi biển số)** |
| **US08** | **Chính (Xác nhận)** | Khai báo | Giám sát Audit | Lưu Log bất thường |
| **US09** | **Chính (Tra cứu)** | Tra cứu (nếu có App) | Xem | |
| **US10** | **Chính (Lập biên bản)** | Khai báo mất | **Chính (Duyệt hủy thẻ)** | Khóa mã thẻ RFID |
| **US11** | **Chính (Điều phối)** | Xem biển báo | Giám sát | Đếm số lượng xe tồn |
| **US12** | Nhận thông báo | | **Chính (Xử lý)** | **Chính (Cron job quét định kỳ)** |
| **US13** | Xem | | **Chính (Phân tích)** | Tổng hợp dữ liệu lượt xe |
| **US14** | | | **Chính (Quản lý tài chính)** | Tính toán tổng doanh thu |
| **US15** | | | **Chính (Quản trị)** | Kiểm soát phiên & JWT |
