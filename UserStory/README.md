# DANH MỤC CÁC USER STORY (AGILE USER STORIES)
## HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SMART PARKING SYSTEM)
**Chủ đề trọng tâm:** Quản lý Luồng Xe Vào/Ra (RFID & AI Camera Check-in/Check-out), Cảnh báo An ninh & Thống kê Doanh thu / Lượt xe  
**Tài liệu cơ sở:** [DacTa.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/DacTa.md) và [SRS.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/SRS.md)  
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

Bảng đối chiếu 1-1 giữa User Stories với Use Case ([DacTa.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/DacTa.md)) và Yêu cầu chức năng ([SRS.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/SRS.md)):

| Mã US | Tên User Story | Phân hệ | Use Case (DacTa.md) | Yêu cầu SRS (SRS.md) | Tác nhân chính | File chi tiết |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **US01** | Quản lý Danh mục Thẻ xe (RFID) | Phân hệ 1 | **UC01** | **[FR-MD-01]** | Quản trị viên | [US01_QuanLyDanhMucTheXe.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US01_QuanLyDanhMucTheXe.md) |
| **US02** | Đăng ký & Cấp phát Thẻ tháng Sinh viên | Phân hệ 1 | **UC02** | **[FR-MD-02]** | Quản trị viên | [US02_DangKyCapPhatTheThang.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US02_DangKyCapPhatTheThang.md) |
| **US03** | Thiết lập Bảng giá & Khung giờ Gửi xe | Phân hệ 1 | **UC03** | **[FR-MD-03]** | Quản trị viên | [US03_ThietLapBangGiaKhungGio.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US03_ThietLapBangGiaKhungGio.md) |
| **US04** | Xử lý Xe Vào & Quét Thẻ RFID (Check-in) | Phân hệ 2 | **UC04** | **[FR-POS-01]** | Bảo vệ | [US04_XuLyXeVaoCheckIn.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US04_XuLyXeVaoCheckIn.md) |
| **US05** | Tự động Chụp ảnh & Nhận diện Biển số Vào (AI ALPR) | Phân hệ 2 | **UC05** | **[FR-POS-02]** | Hệ thống / Bảo vệ | [US05_NhanDienBienSoVao.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US05_NhanDienBienSoVao.md) |
| **US06** | Xử lý Xe Ra & Đối soát Biển số (Check-out) | Phân hệ 2 | **UC06** | **[FR-POS-03]** | Bảo vệ | [US06_XuLyXeRaCheckOut.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US06_XuLyXeRaCheckOut.md) |
| **US07** | Cảnh báo Sai lệch Biển số & Khóa Barem (Anti-theft) | Phân hệ 2 | **UC07** | **[FR-POS-04]** | Bảo vệ / Hệ thống | [US07_CanhBaoSaiLechBienSo.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US07_CanhBaoSaiLechBienSo.md) |
| **US08** | Cho phép Xác nhận Cho Ra Thủ công (Override Warning) | Phân hệ 2 | **UC08** | **[FR-POS-05]** | Bảo vệ | [US08_XacNhanChoRaThuCong.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US08_XacNhanChoRaThuCong.md) |
| **US09** | Tra cứu Vị trí & Lịch sử Xe trong Bãi | Phân hệ 3 | **UC09** | **[FR-INV-01]** | Bảo vệ / Sinh viên | [US09_TraCuuLichSuXeTrongBai.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US09_TraCuuLichSuXeTrongBai.md) |
| **US10** | Xử lý Sự cố Mất thẻ / Khóa thẻ khẩn cấp | Phân hệ 3 | **UC10** | **[FR-INV-02]** | Bảo vệ / Quản trị viên | [US10_XuLySuCoMatTheXe.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US10_XuLySuCoMatTheXe.md) |
| **US11** | Kiểm kê Sức chứa Bãi xe & Điều phối Luồng | Phân hệ 3 | **UC11** | **[FR-INV-03]** | Bảo vệ | [US11_KiemKeSucChuaBaiXe.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US11_KiemKeSucChuaBaiXe.md) |
| **US12** | Quét & Cảnh báo Xe Tồn Kho quá 24h / Xe Lạ | Phân hệ 4 | **UC12** | **[FR-REP-01]** | Hệ thống / Bảo vệ | [US12_QuetCanhBaoXeTonKhoQuaHan.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US12_QuetCanhBaoXeTonKhoQuaHan.md) |
| **US13** | Báo cáo Mật độ Lượt xe Vào/Ra theo Khung giờ | Phân hệ 4 | **UC13** | **[FR-REP-02]** | Quản trị viên / Bảo vệ | [US13_XemBaoCaoMatDoLuotXe.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US13_XemBaoCaoMatDoLuotXe.md) |
| **US14** | Báo cáo Doanh thu Bán vé lượt & Vé tháng | Phân hệ 4 | **UC14** | **[Báo cáo TC]** | Quản trị viên | [US14_XemBaoCaoDoanhThuBaiXe.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US14_XemBaoCaoDoanhThuBaiXe.md) |
| **US15** | Quản lý Tài khoản & Phân quyền RBAC (Phần mềm Bãi xe) | Phân hệ 4 | **UC15** | **[NFR-SEC-01]** | Quản trị viên | [US15_QuanLyTaiKhoan_PhanQuyen.md](file:///d:/0%20-%20Client/VIDO/PTTKHTTH/PARKING_SYSTEM/user_stories/US15_QuanLyTaiKhoan_PhanQuyen.md) |

---

## 3. PHÂN BỔ THEO PHÂN HỆ CHỨC NĂNG
