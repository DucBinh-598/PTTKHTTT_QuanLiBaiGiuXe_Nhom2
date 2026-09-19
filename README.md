# QuanLiBaiGiuXe
Nguyen Duc Binh MSSV 2606042016 <br>
Nguyen Cong Anh MSSV 2606042012 <br>
Duong Anh Tuan MSSV 2606042056  <br>

# 🚗 Campus Parking Management System (CPMS)

Hệ thống Quản lý Bãi xe Thông minh dành cho Mô hình Trường học / Đại học, được thiết kế theo phương pháp luận **Impact Mapping (Bản đồ Tác động)**[cite: 1] nhằm giải quyết bài toán giao thông giờ cao điểm, chống thất thoát tài chính và đảm bảo an ninh tài sản.

---

## 🗺️ 1. Bản đồ Tác động (Impact Mapping - 4 Tầng)[cite: 1]

+---------------------------------------------------------------------------------+
| TẦNG 1: MỤC TIÊU (WHY)                                                          |
|  • Giảm thời gian soát vé < 3s/lượt; giải tỏa kẹt xe cổng trường < 5 phút       |
|  • Tỷ lệ mất mát tài sản = 0%; tự động hóa 90% quy trình đăng ký vé tháng       |
+---------------------------------------------------------------------------------+
│
▼
+---------------------------------------------------------------------------------+
| TẦNG 2: TÁC NHÂN (WHO)                                                          |
|  • Học sinh / Sinh viên / Cán bộ Nhân viên (HS-SV/CBNV)                         |
|  • Đội ngũ Bảo vệ / Quản lý bãi xe                                              |
|  • Phụ huynh / Khách vãng lai                                                   |
+---------------------------------------------------------------------------------+
│
▼
+---------------------------------------------------------------------------------+
| TẦNG 3: TÁC ĐỘNG / THAY ĐỔI HÀNH VI (HOW)                                       |
|  • HS-SV chuẩn bị sẵn thẻ/mã QR trước khi tới trạm kiểm soát                   |
|  • Bảo vệ chuyển từ soát vé thủ công sang giám sát hệ thống & xử lý sự cố       |
|  • Khách vãng lai đi đúng làn riêng, không làm nghẽn luồng ưu tiên              |
+---------------------------------------------------------------------------------+
│
▼
+---------------------------------------------------------------------------------+
| TẦNG 4: BÀN GIAO / TÍNH NĂNG (WHAT)                                            |
|  • Tích hợp Thẻ sinh viên / Thẻ cán bộ làm thẻ gửi xe cố định                   |
|  • Phân làn thông minh & Camera AI nhận diện biển số (ANPR) kép                 |
|  • Thanh toán QR / Ví điện tử tự động & Bảng LED hướng dẫn luồng real-time      |
+---------------------------------------------------------------------------------+


---

## 🎯 2. Trọng tâm Phân tích 3 Trụ cột Kỹ thuật

                 ┌─────────────────────────────────────────┐
                 │     TRỤ CỘT KỸ THUẬT HỆ THỐNG CPMS       │
                 └────────────────────┬────────────────────┘
                                      │
    ┌─────────────────────────────────┼─────────────────────────────────┐
    │                                 │                                 │
    ▼                                 ▼                                 ▼
┌───────────────┐                 ┌───────────────┐                 ┌───────────────┐
│    THẺ KỲ     │                 │ THẺ VÃNG LAI  │                 │   REAL-TIME   │
│  (Vé tháng)   │                 │  (Vé lượt)    │                │ (Giao dịch)   │
└───────┬───────┘                 └───────┬───────┘                 └───────┬───────┘
│                                 │                                 │
├─ Tốc độ quẹt thẻ < 1s           ├─ Tính phí lũy tiến / Khung giờ  ├─ Đồng bộ đa làn < 200ms
├─ Quy tắc Anti-Passback          ├─ Xử lý mất thẻ & Ngoại lệ       ├─ Chế độ Offline & Queue
└─ Sync dữ liệu sinh viên         └─ Chống thất thoát doanh thu     └─ Cập nhật chỗ trống LED


### 📋 2.1. Thẻ Kỳ (Vé Tháng / Thẻ HS-SV & Cán bộ)
* **Tối ưu Tốc độ & Luồng chính:** Xử lý xác thực tại làn cục bộ (Local Cache) với tốc độ **< 1 giây/lượt**, giải quyết 80% lưu lượng xe ra vào giờ cao điểm.
* **Kiểm soát Gian lận (Anti-Passback):** Ngăn chặn việc 1 thẻ quẹt cho 2 xe vào cùng lúc bằng quy tắc xác thực chuỗi trạng thái Vào - Ra hợp lệ.
* **Đồng bộ Dữ liệu Trường:** Tự động mở/khóa quyền gửi xe theo trạng thái học tập (còn học, nghỉ học, đã đóng phí) từ hệ thống quản lý sinh viên.

### 🎟️ 2.2. Thẻ Vãng Lai (Vé Lượt / Khách & Phụ huynh)
* **Thuật toán Tính phí Phức tạp:** Hỗ trợ công thức tính tiền theo giờ, vắt ca qua đêm, miễn phí N phút đầu cho phụ huynh đón con.
* **Quản lý Sự cố & Ngoại lệ (Edge Cases):** Cung cấp quy trình xử lý nhanh (Fast-track) khi khách mất thẻ, sai biển số hoặc hệ thống mờ biển số thông qua ảnh chụp đối soát.
* **Chống Thất thoát Doanh thu:** Lưu lại lịch sử và snapshot hình ảnh cho mọi giao dịch thu tiền mặt hoặc mở barrier thủ công của bảo vệ.

### ⚡ 2.3. Giao dịch Theo Thời gian thực (Real-time Transactions)
* **Đồng bộ Đa làn (Multi-lane Sync):** Đảm bảo dữ liệu giao dịch giữa các làn xe vào/ra cập nhật tức thì (**latency < 200ms**), tránh xung đột trạng thái xe.
* **Chịu lỗi & Chạy Offline (Offline Mode & Buffering):** Khi mất kết nối mạng, máy trạm tự động lưu giao dịch vào bộ nhớ hàng đợi (Queue) và tự đồng bộ lên Server ngay khi có mạng trở lại.
* **Quản lý Sức chứa (Slot Management):** Cập nhật chính xác số chỗ trống còn lại lên bảng LED tại cổng và ứng dụng di động theo thời gian thực.

---

## 🛠️ 3. Tóm tắt Công nghệ Dự kiến (Tech Stack)

* **Hardware:** Camera AI ANPR (nhận diện biển số), Cổng Barrier tự động, Đầu đọc thẻ RFID, Bảng LED hiển thị.
* **Edge/Client:** Python (OpenCV / PyTorch) nhận diện biển số tại trạm local.
* **Backend:** Node.js (NestJS) / Go, Redis (Cache & Pub/Sub), PostgreSQL (Lưu trữ giao dịch).
* **Communication:** WebSockets / MQTT xử lý tín hiệu Real-time.
