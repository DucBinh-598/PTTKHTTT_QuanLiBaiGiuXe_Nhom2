# BẢNG DANH MỤC USER STORIES (USER STORY CATALOG)
## HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SPMS)

* **Phiên bản:** 1.0
* **Người biên soạn:** Member 3 (BA / QA)
* **Trạng thái:** Đã phê duyệt (Approved)

---

## 1. BẢNG MÃ HÓA ĐỐI TƯỢNG (ACTORS / PERSONA)

| Mã Actor | Tên Tác Nhân | Mô Tả Vai Trò |
| :---: | :--- | :--- |
| **G** | Guard (Bảo vệ) | Nhân viên vận hành trực tiếp tại các làn xe vào/ra. |
| **S** | Student / Staff (Sinh viên / Giảng viên) | Người gửi xe, người sử dụng dịch vụ vé tháng/vé lượt. |
| **A** | Admin (Quản trị viên) | Quản lý hệ thống, cấu hình giá, xem báo cáo tài chính. |

---

## 2. DANH MỤC USER STORIES CHI TIẾT

### 🚗 Phân Hệ 1: Làn xe & Vận hành (Gate Operations)
*Nhóm tính năng phục vụ cho Nhân viên Bảo vệ tại cổng.*

| Mã Story | Là Ai? (As a...) | Tôi Muốn... (I want to...) | Để Làm Gì? (So that...) | Độ Ưu Tiên | Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria - AC) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **US-G-01** | Bảo vệ | Quẹt thẻ RFID để ghi nhận xe vào bãi | Cho xe vào nhanh chóng và tự động chụp ảnh lưu vết. | **Cao (Must)** | **Given** xe dừng trước làn vào,<br>**When** quẹt thẻ RFID hợp lệ,<br>**Then** hệ thống chụp 2 ảnh, OCR đọc biển số trong < 1.5s, lưu log `IN_PARKING` và mở Barie. |
| **US-G-02** | Bảo vệ | Quẹt thẻ RFID để kiểm tra xe ra khỏi bãi | So sánh ảnh/biển số lượt ra với lượt vào nhằm chống tráo/trộm xe. | **Cao (Must)** | **Given** xe ở làn ra,<br>**When** quẹt thẻ lượt ra,<br>**Then** hệ thống chụp ảnh ra, hiển thị đối chiếu 4 ảnh (vào/ra) và kiểm tra khớp biển số. |
| **US-G-03** | Bảo vệ | Nhận cảnh báo âm thanh/hình ảnh khi sai biển số xe | Ngăn chặn kịp thời các trường hợp trộm xe hoặc dùng sai thẻ. | **Cao (Must)** | **Given** thẻ quẹt ra có biển số ra KHÁC biển số vào,<br>**When** hệ thống đối chiếu xong,<br>**Then** Barie giữ đóng, màn hình nháy ĐỎ và phát tiếng còi cảnh báo. |
| **US-G-04** | Bảo vệ | Nhập tay biển số xe khi AI đọc không rõ | Xử lý thủ công cho các xe bị mờ/bẩn biển số mà không làm tắc làn. | Trung bình | **Given** biển số xe bị che mờ,<br>**When** AI trả về kết quả unreadable,<br>**Then** ô biển số cho phép Bảo vệ gõ lại bằng phím và bấm "Xác nhận". |
| **US-G-05** | Bảo vệ | Tìm kiếm lịch sử xe vào khi khách báo mất thẻ | Xác minh chính chủ và cho xe ra bãi an toàn. | Trung bình | **Given** khách bị mất thẻ,<br>**When** Bảo vệ nhập biển số xe hoặc MSSV vào ô tra cứu,<br>**Then** hệ thống hiển thị ảnh lúc vào và thời gian vào để đối chiếu giấy tờ. |

---

### 💳 Phân Hệ 2: Đăng ký & Dịch vụ Sinh viên (Student & Self-Service)
*Nhóm tính năng dành cho Sinh viên và Cán bộ nhà trường.*

| Mã Story | Là Ai? (As a...) | Tôi Muốn... (I want to...) | Để Làm Gì? (So that...) | Độ Ưu Tiên | Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria - AC) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **US-S-01** | Sinh viên | Đăng nhập tài khoản trường (SSO) trên Web Portal | Sử dụng các dịch vụ đăng ký vé xe trực tuyến. | Trung bình | **Given** sinh viên truy cập trang web,<br>**When** nhập đúng Email/Pass trường,<br>**Then** hệ thống chuyển hướng vào trang cá nhân thành công. |
| **US-S-02** | Sinh viên | Đăng ký vé tháng trực tuyến bằng cách tải ảnh Cà-vẹt xe | Không cần phải xếp hàng nộp hồ sơ giấy tại phòng bảo vệ. | Trung bình | **Given** đã đăng nhập,<br>**When** điền biển số xe, chọn gói 1-3 tháng và upload ảnh cà-vẹt,<br>**Then** yêu cầu chuyển sang trạng thái `PENDING_PAYMENT`. |
| **US-S-03** | Sinh viên | Thanh toán tiền vé tháng qua mã QR/Ví điện tử | Kích hoạt vé tháng tự động tức thì. | Trung bình | **Given** yêu cầu đăng ký vé tháng được tạo,<br>**When** quét mã QR chuyển khoản đúng số tiền,<br>**Then** hệ thống tự động cập nhật trạng thái thẻ thành `ACTIVE_MONTHLY`. |
| **US-S-04** | Sinh viên | Tra cứu lịch sử gửi xe cá nhân | Kiểm tra số lượt gửi và số tiền đã chi trả. | Thấp | **Given** sinh viên vào mục Lịch sử,<br>**When** chọn khoảng thời gian,<br>**Then** danh sách các lượt gửi xe (thời gian, hình ảnh, chi phí) hiển thị đầy đủ. |

---

### ⚙️ Phân Hệ 3: Quản trị & Báo cáo (Admin & Management)
*Nhóm tính năng dành cho Admin/Chủ bãi xe.*

| Mã Story | Là Ai? (As a...) | Tôi Muốn... (I want to...) | Để Làm Gì? (So that...) | Độ Ưu Tiên | Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria - AC) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **US-A-01** | Admin | Quản lý danh mục thẻ RFID (Thêm/Khóa/Hủy) | Kiểm soát số lượng thẻ lưu hành và khóa ngay các thẻ bị mất. | **Cao (Must)** | **Given** danh sách thẻ RFID,<br>**When** Admin chọn khóa thẻ `CARD_101`,<br>**Then** thẻ này lập tức không thể Check-in/Check-out tại làn xe. |
| **US-A-02** | Admin | Cấu hình bảng giá vé theo khung giờ và loại xe | Điều chỉnh linh hoạt phí gửi xe theo quy định nhà trường. | Trung bình | **Given** màn hình Cấu hình giá,<br>**When** Admin chỉnh giá xe máy ban ngày thành 3,000đ,<br>**Then** các lượt Check-out sau đó sẽ tự động tính theo giá mới. |
| **US-A-03** | Admin | Xem Dashboard thống kê số lượng xe trong bãi Real-time | Biết được dung lượng bãi xe còn trống bao nhiêu chỗ. | Trung bình | **Given** trang chủ Admin,<br>**When** có 1 xe vào/ra,<br>**Then** biểu đồ và con số "Tổng xe trong bãi" tự động tăng/giảm nhảy số ngay lập tức. |
| **US-A-04** | Admin | Xuất báo cáo doanh thu ra file Excel | Phục vụ công tác quyết toán tài chính cuối tháng. | Thấp | **Given** màn hình Báo cáo,<br>**When** chọn tháng và bấm "Export Excel",<br>**Then** hệ thống tải về file `.xlsx` chứa chi tiết doanh thu theo ngày/ca. |

---

## 3. NGUYÊN TẮC PHÂN HẠNG ĐỘ ƯU TIÊN (MoSCoW)

* **Must (Cao):** Bắt buộc phải có để hệ thống vận hành cơ bản (Giai đoạn MVP).
* **Should (Trung bình):** Nên có để hoàn thiện trải nghiệm sử dụng.
* **Could (Thấp):** Làm thêm nếu còn thừa thời gian trước ngày nộp đồ án.
