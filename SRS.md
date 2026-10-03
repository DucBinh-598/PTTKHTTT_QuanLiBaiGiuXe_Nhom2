**TÀI LIỆU MÔ TẢ YÊU CẦU PHẦN MỀM (SRS)**

**HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SPMS)**

- **Phiên bản:** 2.0 (Completed)
- **Tác giả:** Đội ngũ Phát triển Dự án SPMS (BA / QA / Dev)
- **Trạng thái:** Tối ưu hóa cho Đồ án Sinh viên / Sản phẩm MVP

**1\. GIỚI THIỆU (INTRODUCTION)**

**1.1. Mục đích (Purpose)**

Tài liệu này mô tả chi tiết các yêu cầu chức năng (Functional Requirements) và phi chức năng (Non-Functional Requirements) cho **Hệ thống Quản lý Bãi giữ xe Trường học (School Parking Management System - SPMS)**. Tài liệu phục vụ làm căn cứ thiết kế kiến trúc, cơ sở dữ liệu, phát triển giao diện/API và kiểm thử sản phẩm.

**1.2. Phạm vi dự án (Scope)**

Hệ thống SPMS được thiết kế nhằm tự động hóa quy trình gửi/lấy xe tại trường học bằng việc kết hợp công nghệ **Nhận diện biển số xe tự động (ALPR/OCR)** và **Thẻ từ RFID/Mã QR**.

- **Phạm vi triển khai:** Bãi xe máy, xe đạp điện và ô tô dành cho Học sinh, Sinh viên, Cán bộ/Giảng viên và Khách vãng lai.
- **Mục tiêu chính:** Rút ngắn thời gian soát vé (< 2 giây/xe), loại bỏ ùn tắc giờ cao điểm, chống tráo/mất xe và tự động hóa báo cáo doanh thu/lưu lượng.

**1.3. Thuật ngữ & Tên viết tắt (Glossary)**

- **SPMS:** School Parking Management System (Hệ thống Quản lý Bãi xe Trường học).
- **ALPR / OCR:** Automatic License Plate Recognition / Optical Character Recognition (Công nghệ tự động nhận diện biển số xe từ hình ảnh).
- **RFID:** Radio Frequency Identification (Công nghệ nhận dạng qua tần số vô tuyến - Thẻ từ).
- **Check-in / Check-out:** Quy trình xe vào bãi / Quy trình xe ra khỏi bãi.
- **MVP:** Minimum Viable Product (Sản phẩm khả thi tối thiểu).

**2\. MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)**

**2.1. Bối cảnh hệ thống (System Context)**

Hệ thống SPMS đóng vai trò trung tâm điều khiển, kết nối trực tiếp với:

1. **Thiết bị ngoại vi (Hardware Layer):** Camera IP (chụp ảnh mặt + biển số), Đầu đọc thẻ RFID, Hệ thống Barie tự động, Bảng LED hiển thị.
2. **Người dùng (Users):** Nhân viên bảo vệ (vận hành làn xe), Sinh viên/Giảng viên (đăng ký vé tháng, gửi xe), Admin (quản trị hệ thống).
3. **Hệ thống bên ngoài (External Systems):** Hệ thống cơ sở dữ liệu sinh viên/cán bộ (SSO/LDAP trường học), Cổng thanh toán điện tử (VNPay/MoMo).

**2.2. Các đối tượng người dùng (User Classes & Characteristics)**

- **Nhân viên Bảo vệ (Gate Keeper):** Kỹ năng máy tính cơ bản. Cần giao diện tối giản, trực quan, thao tác quẹt thẻ và nhìn màn hình trong 1-2 giây.
- **Sinh viên / Cán bộ trường (End User):** Sử dụng smartphone/web portal để đăng ký vé tháng, tra cứu lịch sử gửi xe và nạp tiền.
- **Quản trị viên (Admin):** Thành thạo tin học. Quản lý toàn bộ danh mục thẻ, phân quyền, xem báo cáo doanh thu và cấu hình giá vé.

**3\. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)**

**3.1. Phân hệ Vận hành Làn xe (Gate Operation Module)**

FR-CHECKIN-001**: Xử lý Xe vào (Check-in)**

- **User Story:** Là Bảo vệ, tôi muốn hệ thống tự động chụp ảnh và ghi nhận biển số xe khi quẹt thẻ để cho xe vào nhanh chóng.
- **Luồng xử lý:**

- 1. Bảo vệ quẹt thẻ RFID (hoặc sinh viên quét mã QR).
  2. Hệ thống kích hoạt 2 camera: Camera 1 chụp biển số, Camera 2 chụp toàn cảnh/mặt người điều khiển.
  3. Thư viện ALPR/OCR trích xuất chuỗi biển số xe từ ảnh Camera 1.
  4. Hệ thống kiểm tra trạng thái thẻ (Card_Status = ACTIVE và Current_State = OUT_PARKING).
  5. Lưu bản ghi ParkingLog (Thời gian vào, Mã thẻ, Biển số đọc được, Link 2 ảnh).
  6. Phát tín hiệu mở Barie và hiển thị thông báo "HỢP LỆ" (màu xanh).
- **Acceptance Criteria (Cho QA):**

- 1. _Given_ thẻ RFID hợp lệ và xe dừng đúng vị trí, _When_ quẹt thẻ, _Then_ hệ thống trả kết quả và mở barie trong vòng dưới 1.5 giây.

FR-CHECKOUT-001**: Xử lý Xe ra & Chống trộm (Check-out)**

- **User Story:** Là Bảo vệ, tôi muốn hệ thống so sánh ảnh và biển số lượt ra với lượt vào để tránh tình trạng tráo xe/trộm xe.
- **Luồng xử lý:**

- 1. Bảo vệ quẹt thẻ RFID lượt ra.
  2. Hệ thống chụp ảnh biển số ra và mặt người lái xe ra.
  3. Hệ thống truy vấn bản ghi lượt vào gần nhất của Card_UID này.
  4. Tự động so sánh: Chuỗi biển số ra VS Chuỗi biển số vào.
  5. Hiển thị đồng thời trên màn hình 4 bức ảnh: (Ảnh mặt vào, Ảnh biển vào) và (Ảnh mặt ra, Ảnh biển ra).
  6. **Trường hợp khớp:** Tính phí gửi xe (nếu là vé lượt) Hiện số tiền Mở Barie Cập nhật Current_State = OUT_PARKING.
  7. **Trường hợp KHÔNG khớp biển số:** Phát chuông cảnh báo đỏ "SAI BIỂN SỐ", giữ Barie đóng, yêu cầu Bảo vệ xác minh thủ công.

FR-EXCEPT-001**: Xử lý Ngoại lệ & Mất thẻ**

- **Mô tả:** Cho phép Bảo vệ tìm kiếm lịch sử xe vào bằng biển số xe hoặc mã sinh viên để cho xe ra khi khách bị mất thẻ; hỗ trợ nút bấm mở Barie khẩn cấp.

**3.2. Phân hệ Quản lý Vé tháng & Sinh viên (Monthly Pass Module)**

FR-PASS-001**: Đăng ký / Gia hạn Vé tháng Trực tuyến**

- **Mô tả:** Sinh viên/Cán bộ đăng nhập tài khoản trường, nhập biển số xe, đăng tải ảnh Cà-vẹt xe (Giấy đăng ký xe) và chọn gói vé tháng (1 tháng, 3 tháng, 1 học kỳ).
- **Luồng thanh toán:** Tích hợp chuyển khoản QR/Ví điện tử. Sau khi thanh toán thành công, hệ thống tự động kích hoạt vé tháng gắn với Mã sinh viên/Thẻ RFID.

**3.3. Phân hệ Quản trị Hệ thống & Báo cáo (Admin & Analytics Module)**

FR-MNG-001**: Quản lý Thẻ & Phân quyền**

- **Mô tả:** Admin có quyền thêm mới, kích hoạt, khóa hoặc hủy thẻ RFID; phân quyền tài khoản (Bảo vệ ca sáng/chiêm, Admin tài chính).

FR-MNG-002**: Cấu hình Bảng giá Vé (Tariff Configuration)**

- **Mô tả:** Cho phép Admin cài đặt linh hoạt:

- - Khung giờ Ngày / Đêm.
    - Giá vé theo loại xe (Xe đạp, Xe máy, Xe máy điện, Ô tô).
    - Chính sách miễn phí cho Giảng viên / Cán bộ.

FR-REP-001**: Thống kê & Báo cáo Real-time**

- **Mô tả:**

- - Hiển thị Dashboard thời gian thực: Số lượng xe hiện có trong bãi / Tổng dung lượng bãi xe.
    - Thống kê doanh thu theo ngày, tuần, tháng, ca trực.
    - Xuất dữ liệu báo cáo ra file Excel / PDF.

**4\. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)**

**4.1. Hiệu năng (Performance Requirements)**

- NFR-PERF-001 **(Tốc độ xử lý):** Thời gian nhận diện biển số (OCR) + kiểm tra CSDL + phát lệnh mở barie không quá **1.5 giây** mỗi xe.
- NFR-PERF-002 **(Độ chính xác AI):** Tỷ lệ nhận dạng chính xác biển số xe (với ảnh đủ sáng, không bị che lấp) đạt tối thiểu **95%**.
- NFR-PERF-003 **(Chịu tải):** Hệ thống Backend hỗ trợ tối thiểu **50 yêu cầu/giây (RPS)** đồng thời tại các cổng ra/vào.

**4.2. Độ tin cậy & Chế độ Offline (Reliability & Availability)**

- NFR-REL-001 **(Chế độ dự phòng Offline):** Khi mất kết nối Internet hoặc mất mạng LAN trung tâm, phần mềm tại máy tính làn xe phải tự động chuyển sang lưu CSDL tạm thời (Local DB) để tiếp tục cho xe vào/ra bình thường. Khi có mạng trở lại, hệ thống tự động đồng bộ (Sync) về Server chính.
- NFR-REL-002 **(Lưu trữ ảnh):** Ảnh chụp lượt vào/ra được lưu trữ tối thiểu **60 ngày** để phục vụ tra cứu sự cố.

**4.3. Bảo mật (Security)**

- NFR-SEC-001 **(Phân quyền):** Tài khoản Bảo vệ tuyệt đối không có quyền chỉnh sửa số tiền, xóa nhật ký gửi xe hoặc thay đổi bảng giá.
- NFR-SEC-002 **(Mã hóa):** Mật khẩu người dùng được mã hóa bằng thuật toán Bcrypt. API trao đổi dữ liệu sử dụng phương thức xác thực JWT (JSON Web Token).

**5\. THIẾT KẾ CƠ SỞ DỮ LIỆU SƠ BỘ (DATA DICTIONARY)**

Dưới đây là các bảng CSDL cốt lõi (Database Entities):

1. Users (Người dùng): user_id, username, password_hash, full_name, role (ADMIN/GUARD/STUDENT), student_code.
2. Cards (Thẻ xe): card_id, card_uid (Mã chip RFID), card_type (MONTHLY/CASUAL), status (ACTIVE/LOCKED), user_id.
3. Vehicles (Thông tin xe): vehicle_id, plate_number, vehicle_type, user_id.
4. ParkingLogs (Nhật ký vào/ra): log_id, card_uid, plate_in, plate_out, time_in, time_out, image_face_in, image_plate_in, image_face_out, image_plate_out, fee, status (IN_PARKING/COMPLETED/WARNING).

**6\. RÀNG BUỘC KỸ THUẬT & TÍCH HỢP (CONSTRAINTS & INTERFACES)**

- **Công nghệ phát triển (Tech Stack gợi ý):**

- - **Backend:** Python (FastAPI / Django) hoặc Node.js.
    - **Frontend:** React.js / Vue.js (Web) hoặc Flutter (Mobile).
    - **AI/OCR Module:** Python + OpenCV + EasyOCR / YOLOv8.
    - **Database:** PostgreSQL / MySQL.
- **Tích hợp phần cứng (Mô phỏng/Thực tế):** Giao tiếp qua cổng COM/RS485 hoặc Protocol TCP/IP tới bộ điều khiển Barie và đầu đọc RFID.
