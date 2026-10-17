# BẢN ĐẶC TẢ YÊU CẦU NGHIỆP VỤ & HỆ THỐNG (BUSINESS & SYSTEM SPECIFICATION)
## HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG HỌC (SMART PARKING SYSTEM)
**Chủ đề trọng tâm:** Quản lý Luồng xe Vào/Ra (Check-in/Check-out RFID), Nhận diện Biển số Tự động (AI ALPR) & Cảnh báo Sai lệch An ninh  
**Tài liệu cơ sở:** DacTa.md và SRS.md  
**Phiên bản:** 1.0  
**Ngày lập:** 05/10/2026  

---

## 1. TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Hệ thống Quản lý Bãi giữ xe Trường học hỗ trợ toàn bộ quá trình kiểm soát phương tiện (xe máy, xe đạp điện) ra vào trong khuôn viên nhà trường, nâng cao tốc độ lưu thông giờ cao điểm và đảm bảo an ninh tài sản. Hệ thống giải quyết hai bài toán nghiệp vụ cốt lõi:

1. **Kiểm soát Tốc độ cao tại Làn xe:** Xử lý quẹt thẻ RFID kết hợp camera tự động chụp ảnh mặt và nhận diện biển số (ALPR - Automatic License Plate Recognition) với thời gian xử lý < 1.5 giây/xe, chống ùn tắc tại cổng trường.
2. **Cảnh báo Chống trộm & Sai lệch Biển số (Anti-theft Logic):** Tự động đối chiếu hình ảnh và chuỗi biển số xe giữa lượt vào và lượt ra. Hệ thống tự động khóa Barie và phát còi cảnh báo ngay khi phát hiện biển số ra không trùng khớp với biển số vào.

---

## 2. DANH SÁCH TÁC NHÂN (ACTORS)

| STT | Tên Tác nhân (Actor) | Loại Tác nhân | Mô tả vai trò & Trách nhiệm |
| :---: | :--- | :--- | :--- |
| **1** | **Nhân viên Bảo vệ** *(Security Guard)* | Human (Primary) | Vận hành trực tiếp tại các làn xe: quẹt thẻ vé lượt, giám sát màn hình đối chiếu ảnh vào/ra, xử lý cảnh báo sai biển số, xác nhận cho xe ra thủ công khi có sự cố. |
| **2** | **Sinh viên / Cán bộ** *(Student / Staff)* | Human (Secondary) | Người gửi xe: quẹt thẻ vé tháng/vé lượt, đăng ký/gia hạn vé tháng qua trang Cổng thông tin, khai báo khi mất thẻ xe. |
| **3** | **Quản trị viên / Chủ bãi xe** *(Admin)* | Human (Primary) | Quản lý danh mục thẻ RFID, duyệt đăng ký vé tháng, cấu hình bảng giá vé theo khung giờ, xem báo cáo lưu lượng xe real-time và báo cáo doanh thu. |
| **4** | **Hệ thống Nhận diện AI (AI ALPR Worker)** | System (Secondary) | Tiến hành xử lý hình ảnh ngầm: kích hoạt camera chụp ảnh, cắt vùng biển số (Cropping), chạy mô hình OCR chuyển ảnh thành chuỗi ký tự biển số. |
| **5** | **Thiết bị Ngoại vi (Hardware / Barrier)** | System (Secondary) | Đầu đọc thẻ RFID, Camera IP làn vào/ra, Đèn LED tín hiệu và Mô-tơ điều khiển thanh Barie đóng/mở tự động. |

---

## 3. MA TRẬN TÁC NHÂN VS USE CASE (ACTOR - USE CASE MATRIX)

| Mã UC | Tên Use Case | Bảo vệ | Sinh viên | Quản trị viên | Hệ thống AI / Hardware |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **UC01** | Quản lý Danh mục Thẻ xe (RFID) | Tra cứu | | **X** | |
| **UC02** | Đăng ký & Cấp phát Thẻ tháng | Xem | **X** | **X** | |
| **UC03** | Thiết lập Bảng giá & Khung giờ Gửi xe | | Xem | **X** | |
| **UC04** | Xử lý Xe Vào & Quét Thẻ RFID (Check-in) | **X** | **X** | | **X** |
| **UC05** | Tự động Chụp ảnh & Nhận diện Biển số (AI) | Xem | | | **X** |
| **UC06** | Xử lý Xe Ra & Đối soát Biển số (Check-out) | **X** | **X** | | **X** |
| **UC07** | Cảnh báo Sai lệch Biển số & Khóa Barie | **X** | | | **X** |
| **UC08** | Xác nhận Cho Ra Thủ công (Override Warning) | **X** | Khai báo | | |
| **UC09** | Tra cứu Lịch sử & Vị trí Xe trong Bãi | **X** | **X** | **X** | |
| **UC10** | Xử lý Sự cố Mất thẻ / Khóa thẻ khẩn cấp | **X** | Khai báo | **X** | |
| **UC11** | Kiểm kê Sức chứa Bãi xe Real-time | **X** | Xem | **X** | **X** |
| **UC12** | Quét & Cảnh báo Xe Tồn Kho quá 24h | **X** | | **X** | **X** |
| **UC13** | Xem Báo cáo Mật độ Lượt xe theo Khung giờ | Xem | | **X** | |
| **UC14** | Xem Báo cáo Doanh thu Vé lượt & Vé tháng | | | **X** | |
| **UC15** | Quản lý Tài khoản & Phân quyền RBAC | | | **X** | |

---

## 4. DANH SÁCH USE CASE CHI TIẾT PHÂN THEO PHÂN HỆ

### 4.1. Phân hệ 1: Quản lý Danh mục & Cấu hình Hệ thống (Master Data)
- **UC01: Quản lý Danh mục Thẻ xe (RFID)**
  * *Mô tả:* Khai báo mã chip `card_uid`, phân loại thẻ (`CASUAL` - Vé lượt, `MONTHLY` - Vé tháng) và quản lý trạng thái (`ACTIVE`, `LOCKED`, `DISABLED`).
- **UC02: Đăng ký & Cấp phát Thẻ tháng Sinh viên**
  * *Mô tả:* Sinh viên gửi yêu cầu đăng ký vé tháng trực tuyến (tải ảnh Cà-vẹt/Thẻ SV). Admin kiểm tra hồ sơ, gán mã thẻ RFID tương ứng và kích hoạt hạn dùng.
- **UC03: Thiết lập Bảng giá & Khung giờ Gửi xe**
  * *Mô tả:* Cấu hình mức phí theo khung giờ (Ví dụ: Ca ngày 3,000đ, Ca đêm sau 22h 10,000đ) và áp dụng miễn phí/giảm giá cho thẻ vé tháng.

### 4.2. Phân hệ 2: Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
- **UC04: Xử lý Xe Vào & Quét Thẻ RFID (Check-in)**
  * *Mô tả:* Xe dừng tại làn vào, quẹt thẻ RFID. Hệ thống ghi nhận thời gian vào, mã thẻ và chuyển tín hiệu kích hoạt cụm camera.
- **UC05: Tự động Chụp ảnh & Nhận diện Biển số Vào (AI ALPR)**
  * *Mô tả:* Camera chụp 2 luồng ảnh (Ảnh toàn cảnh/mặt người + Ảnh cận cảnh biển số). Mô hình AI OCR đọc chuỗi ký tự biển số và lưu nhật ký `IN_PARKING`.
- **UC06: Xử lý Xe Ra & Đối soát Biển số (Check-out)**
  * *Mô tả:* Xe dừng tại làn ra, quẹt lại thẻ. Hệ thống chụp ảnh lượt ra, tự động truy xuất ảnh lượt vào tương ứng và hiển thị đồng thời 4 ảnh trên màn hình Bảo vệ để kiểm tra.
- **UC07: Cảnh báo Sai lệch Biển số & Khóa Barie (Anti-theft Logic)**
  * *Mô tả:* Hệ thống so sánh chuỗi `plate_in` và `plate_out`. Nếu khác biệt, hệ thống giữ Barie đóng, nháy màn hình ĐỎ và phát âm thanh cảnh báo **"CẢNH BÁO: SAI BIỂN SỐ"**.
- **UC08: Xác nhận Cho Ra Thủ công (Override Warning)**
  * *Mô tả:* Trong trường hợp cảnh báo sai (do AI đọc nhầm ký tự hoặc xe mờ biển), Bảo vệ kiểm tra giấy tờ thực tế và bấm nút "Xác nhận cho ra" kèm ghi chú lý do.

### 4.3. Phân hệ 3: Quản lý Bãi xe & Xử lý Sự cố (Parking Operations & Incidents)
- **UC09: Tra cứu Lịch sử & Vị trí Xe trong Bãi**
  * *Mô tả:* Cho phép tra cứu xe đang nằm trong bãi theo biển số, mã thẻ hoặc khoảng thời gian vào để giải quyết thắc mắc.
- **UC10: Xử lý Sự cố Mất thẻ / Khóa thẻ khẩn cấp**
  * *Mô tả:* Khi sinh viên báo mất thẻ, Bảo vệ tra cứu nhật ký xe vào bằng biển số, đối chiếu giấy tờ xe/CCCD, làm thủ tục cho xe ra và Admin lập tức chuyển trạng thái thẻ mất sang `LOCKED`.
- **UC11: Kiểm kê Sức chứa Bãi xe Real-time**
  * *Mô tả:* Tự động đếm tổng lượt xe vào/ra để tính toán con số xe hiện tại trong bãi. Hiển thị biển báo "Còn chỗ" hoặc "Đã đầy" tại cổng.

### 4.4. Phân hệ 4: Cảnh báo, Báo cáo & Quản trị (Alerts, Reports & Admin)
- **UC12: Quét & Cảnh báo Xe Tồn Kho quá 24h**
  * *Mô tả:* Hệ thống chạy Cron Job định kỳ quét danh sách xe gửi liên tục quá 24h/48h mà chưa Check-out để đưa vào danh sách theo dõi đặc biệt (nghi vấn xe bị bỏ quên hoặc trộm cắp).
- **UC13: Xem Báo cáo Mật độ Lượt xe theo Khung giờ**
  * *Mô tả:* Thống kê biểu đồ lưu lượng xe theo từng nấc 30 phút/1 giờ trong ngày để Ban quản lý có kế hoạch tăng cường bảo vệ giờ cao điểm.
- **UC14: Xem Báo cáo Doanh thu Vé lượt & Vé tháng**
  * *Mô tả:* Thống kê tổng tiền thu được theo ca/ngày/tháng, phân loại theo tiền mặt và chuyển khoản vé tháng.
- **UC15: Quản lý Tài khoản & Phân quyền RBAC**
  * *Mô tả:* Phân quyền tài khoản bảo vệ (chỉ dùng màn hình Check-in/out) và tài khoản Admin (xem báo cáo, cấu hình bảng giá).

---

## 5. ĐẶC TẢ CHI TIẾT USE CASE TRỌNG TÂM (DETAILED USE CASE SPECIFICATION)

### 5.1. UC07: Cảnh báo Sai lệch Biển số & Khóa Barie (Anti-theft Logic)

* **Primary Actor:** Nhân viên Bảo vệ
* **Secondary Actor:** Hệ thống AI / Hardware Controller
* **Pre-conditions (Điều kiện tiên quyết):**
  * Xe đang ở làn ra và Bảo vệ đã quẹt thẻ RFID lượt ra.
  * Thẻ RFID có dữ liệu lượt vào hợp lệ (`status = IN_PARKING`).
* **Post-conditions (Điều kiện sau khi thực hiện):**
  * Nhật ký lượt ra được lưu với cờ cảnh báo `is_warning = TRUE`.
  * Thanh Barie giữ nguyên trạng thái đóng cho đến khi có xác nhận của Bảo vệ.

#### Luồng sự kiện chính (Main Flow):
1. Khách gửi xe quẹt thẻ RFID tại làn ra.
2. Camera chụp 2 ảnh lượt ra (Toàn cảnh + Biển số ra).
3. Hệ thống AI OCR tiến hành đọc biển số ra, thu được chuỗi `plate_out`.
4. Hệ thống truy vấn thông tin lượt vào của mã thẻ RFID này, lấy ra `plate_in` và ảnh lượt vào.
5. Hệ thống thực hiện so sánh chuỗi: SoSanh(plate_in, plate_out).
6. Nếu chuỗi biển số KHÔNG trùng khớp (hoặc độ tin cậy OCR < 80%):
   * Hệ thống **KHÔNG** gửi tín hiệu mở Barie (Barie giữ đóng).
   * Màn hình Bảo vệ chuyển sang trạng thái cảnh báo màu ĐỎ rực.
   * Loa máy tính phát còi cảnh báo: *"Cảnh báo: Biển số xe ra không trùng khớp!"*.
   * Màn hình hiển thị phóng to 2 ảnh biển số (Lượt vào VS Lượt ra) để Bảo vệ quan sát.
7. Bảo vệ tiếp cận xe, yêu cầu người lái xuất trình Giấy đăng ký xe (Cà-vẹt) và CCCD/Thẻ sinh viên để đối soát thủ công.
8. Nếu kiểm tra giấy tờ chính chủ hợp lệ:
   * Bảo vệ nhấn nút **"Xác nhận cho ra (Override)"** trên màn hình.
   * Hệ thống yêu cầu chọn lý do (ví dụ: *AI đọc nhầm chữ B thành số 8 / Bẩn biển số*).
   * Hệ thống ghi nhận Log và phát tín hiệu mở Barie.

#### Luồng ngoại lệ (Alternative / Exception Flows):
* **A1: Kẻ gian tráo xe / Không chứng minh được chủ sở hữu:**
  * Tại bước 7, nếu người lái không xuất trình được giấy tờ hoặc có dấu hiệu bỏ chạy:
  * Bảo vệ giữ nguyên xe tại làn, bấm nút "Báo động an ninh khẩn cấp".
  * Hệ thống khóa toàn bộ các làn ra còn lại và gửi thông báo tới Trưởng bộ phận bảo vệ.

---

### 5.2. UC02: Đăng ký & Cấp phát Thẻ tháng Sinh viên

* **Primary Actor:** Sinh viên / Cán bộ nhà trường
* **Secondary Actor:** Quản trị viên (Admin)
* **Pre-conditions:** Sinh viên đã đăng nhập thành công vào Cổng thông tin trường.

#### Luồng sự kiện chính (Main Flow):
1. Sinh viên truy cập phân hệ "Đăng ký Vé xe tháng".
2. Sinh viên điền thông tin: Biển số xe, Loại xe (Xe số/Xe tay ga/Xe điện), Thương hiệu/Màu xe.
3. Sinh viên tải lên 2 ảnh: Ảnh mặt trước Cà-vẹt xe + Ảnh Thẻ sinh viên.
4. Sinh viên chọn gói thời hạn (1 tháng / 1 học kỳ 5 tháng) và bấm "Gửi yêu cầu".
5. Hệ thống tạo yêu cầu ở trạng thái `PENDING_APPROVAL` và hiển thị mã QR thanh toán.
6. Sinh viên tiến hành quét mã chuyển khoản đúng số tiền quy định.
7. Sau khi nhận tín hiệu thanh toán thành công từ Cổng thanh toán:
   * Hệ thống chuyển trạng thái yêu cầu thành `PAID`.
   * Thông báo được gửi đến màn hình Admin.
8. Quản trị viên duyệt hồ sơ ảnh cà-vẹt, chọn 1 thẻ RFID vật lý chưa sử dụng, quẹt vào đầu đọc để gán mã `card_uid` với Mã sinh viên.
9. Admin bấm "Xác nhận cấp thẻ". Hệ thống chuyển trạng thái thẻ thành `ACTIVE_MONTHLY` và gửi Email/Notification thông báo cho Sinh viên đến nhận thẻ.
