# QuanLiBaiGiuXe
Nguyen Duc Binh MSSV 2606042016 <br>
Nguyen Cong Anh MSSV 2606042012 <br>
Duong Anh Tuan MSSV 2606042056  <br>

# 🚗 Campus Parking Management System (CPMS)
> **Hệ thống Quản lý Bãi xe Thông minh dành cho Mô hình Trường học / Đại học**

---

## 📌 Tổng quan dự án (Overview)
Dự án **Campus Parking Management System (CPMS)** được thiết kế nhằm giải quyết bài toán ùn tắc giao điểm giờ cao điểm, kiểm soát an ninh tài sản và tối ưu hóa quy trình quản lý bãi xe tại các cơ sở giáo dục. Hệ thống được phân tích và phát triển dựa trên phương pháp luận **Impact Mapping (Bản đồ Tác động)**[cite: 1], tập trung vào 3 trụ cột kỹ thuật chính: **Thẻ Kỳ**, **Thẻ Vãng Lai** và **Giao dịch Theo Thời Gian Thực (Real-time)**.

---

## 🎯 Bản đồ Tác động (Impact Mapping - 4 Tầng)[cite: 1]

+---------------------------------------------------------------------------------+
| TẦNG 1: MỤC TIÊU (WHY)                                                          |
|  • Giảm thời gian kiểm soát < 3s/lượt xe                                        |
|  • Giải tỏa kẹt xe cổng trường < 5 phút vào giờ cao điểm                        |
|  • Tỷ lệ thất thoát/mất tài sản = 0%                                            |
|  • Tự động hóa 90% quy trình vé tháng                                           |
+---------------------------------------------------------------------------------+
|
v
+---------------------------------------------------------------------------------+
| TẦNG 2: TÁC NHÂN (WHO)                                                          |
|  • Học sinh / Sinh viên / Cán bộ Nhân viên (HS-SV/CBNV)                         |
|  • Đội ngũ Bảo vệ / Quản lý bãi xe                                              |
|  • Phụ huynh / Khách vãng lai                                                   |
+---------------------------------------------------------------------------------+
|
v
+---------------------------------------------------------------------------------+
| TẦNG 3: TÁC ĐỘNG / THAY ĐỔI HÀNH VI (HOW)                                       |
|  • HS-SV chuẩn bị sẵn thẻ/mã QR trước khi đến trạm kiểm soát                   |
|  • Đỗ xe đúng khu vực phân chia                                                 |
|  • Bảo vệ chuyển từ thao tác thủ công sang giám sát & xử lý sự cố               |
|  • Khách đi đúng làn riêng, không làm gián đoạn luồng ưu tiên                   |
+---------------------------------------------------------------------------------+
|
v
+---------------------------------------------------------------------------------+
| TẦNG 4: BÀN GIAO / TÍNH NĂNG (WHAT)                                            |
|  • Tích hợp thẻ sinh viên / thẻ cán bộ nội bộ                                   |
|  • Phân làn thông minh & Camera AI nhận diện biển số (ANPR)                     |
|  • Thanh toán QR tự động & Cổng soát vé tự động (Barrier)                       |
|  • Bảng LED hiển thị sức chứa & hướng dẫn luồng theo thời gian thực            |
|  • Quy trình xử lý ngoại lệ Fast-track (quên thẻ/mất thẻ)                       |
+---------------------------------------------------------------------------------+


### 1. Tại sao (Goal / Why)[cite: 1]
* **Giải quyết ùn tắc cực điểm:**
  * Giảm thời gian quẹt thẻ/kiểm soát ra vào xuống **< 3 giây/lượt xe**.
  * Không để tình trạng kẹt xe kéo dài ra ngoài cổng trường quá **5 phút** vào khung giờ cao điểm (07h15 - 07h45 & 11h30 - 12h15).
* **An toàn tài sản tuyệt đối:**
  * Tỷ lệ mất mát xe / mũ bảo hiểm: **0%**.
  * Tỷ lệ nhận diện biển số xe đúng khi ra/vào: **≥ 98%**.
* **Tối ưu hóa quản lý:**
  * Tự động hóa **90%** quy trình đăng ký và gia hạn vé tháng.
  * Giảm **30%** chi phí vận hành nhân sự trực ca.

### 2. Ai (Actors / Who)[cite: 1]
* **Tác nhân hỗ trợ đạt mục tiêu:**
  * **HS-SV / Cán bộ nhân viên (CBNV):** Luồng người dùng cố định, lưu lượng lớn.
  * **Đội ngũ Bảo vệ / Ca trưởng:** Vận hành trực tiếp, điều tiết giao thông và xử lý sự cố.
  * **Ban Giám Hiệu / Phòng Hành chính - Tài sản:** Duyệt chính sách và kết nối dữ liệu người dùng.
* **Tác nhân có thể gây cản trở / Rủi ro:**
  * **Khách vãng lai / Phụ huynh:** Không quen quy trình, ra vào ngẫu nhiên gây ùn tắc.
  * **Người dùng gian lận:** Mượn thẻ, quẹt thẻ hộ, vi phạm quy tắc gửi xe.

### 3. Tác động (Impacts / How)[cite: 1]
* **Đối với HS-SV & CBNV:**
  * Đổi từ hành vi tìm thẻ/quẹt thủ công sang **chủ động chuẩn bị thẻ/mã QR trước khi đến barrier**.
  * Tuân thủ việc đỗ xe đúng khu vực quy định (xe tay ga, xe số, xe điện, xe đạp).
* **Đối với Bảo vệ:**
  * Chuyển vai trò từ "ghi vé/thu tiền" sang **"giám sát hệ thống, điều tiết luồng xe và xử lý ngoại lệ"**.
* **Đối với Khách vãng lai:**
  * Di chuyển theo làn riêng biệt, không đi vào làn ưu tiên của HS-SV.

### 4. Bàn giao (Deliverables / What)[cite: 1]
* **Hệ thống Nhận diện Biển số AI (ANPR) & Multi-lane:** Camera kép chụp trước/sau, phản hồi trong <1 giây.
* **Tích hợp Thẻ Sinh viên / Thẻ Cán bộ:** Sử dụng chính thẻ sinh viên làm thẻ gửi xe.
* **Bảng LED & Cảm biến luồng real-time:** Cập nhật số chỗ trống tại từng khu vực đỗ xe.
* **Hệ thống Xử lý ngoại lệ (Fast-track Exception Handling):** Xác thực ứng dụng mobile khi quên thẻ.

---

## 🔍 Phân tích Chuyên sâu 3 Điểm nhấn Trọng yếu

                ┌─────────────────────────────────────────┐
                │     TRỤ CỘT KỸ THUẬT HỆ THỐNG CPMS       │
                └────────────────────┬────────────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────┐
    │                                │                                │
    ▼                                ▼                                ▼
┌───────────────┐                ┌───────────────┐                ┌───────────────┐
│    THẺ KỲ     │                │ THẺ VÃNG LAI  │                │   REAL-TIME   │
│  (Vé tháng)   │                │  (Vé lượt)    │                │ (Giao dịch)   │
└───────┬───────┘                └───────┬───────┘                └───────┬───────┘
│                                │                                │
├─ Quy tắc Anti-Passback         ├─ Khung giá lũy tiến vắt ca     ├─ Độ trễ latency < 200ms
├─ Cache Local Database          ├─ Xử lý mất thẻ / Sai biển     ├─ Mạng Offline Mode / Queue
└─ Sync tự động với nhà trường  └─ Kiểm soát thất thoát tiền      └─ Sync dữ liệu nhất quán


### 1. Thẻ Kỳ (Vé Tháng / Thẻ Cán bộ & Sinh viên)
* **Quy tắc Anti-Passback (Chống quay vòng thẻ):** Đảm bảo 1 thẻ không thể quẹt vào 2 lần liên tiếp nếu chưa có lượt ra tương ứng để tránh tình trạng cho mượn thẻ gian lận.
* **Local Caching & Tốc độ xử lý:** Dữ liệu thẻ kỳ được cache tại trạm kiểm soát cục bộ (Local DB) giúp thời gian truy vấn < 100ms, cho phép barrier mở ngay cả khi mất kết nối mạng WAN.
* **Đồng bộ dữ liệu học vụ:** Tự động khóa/mở thẻ dựa trên trạng thái sinh viên (còn học, bảo lưu, đã đóng phí gửi xe) từ cơ sở dữ liệu nhà trường.

### 2. Thẻ Vãng Lai (Vé Lượt / Khách & Phụ huynh)
* **Lĩnh vực tính giá phức tạp:** Hỗ trợ công thức tính tiền theo khung giờ, vắt ca qua đêm, miễn phí N phút đầu cho phụ huynh đón con.
* **Kịch bản ngoại lệ (Edge Cases):**
  * Xử lý mất thẻ: Đối soát hình ảnh khuôn mặt + biển số lúc vào từ hệ thống lưu trữ.
  * Biển số bị mờ/bẩn: Cho phép bảo vệ xác nhận thủ công bằng 1-click trên màn hình giám sát.
* **Chống thất thoát doanh thu:** Mọi giao dịch mở barrier thủ công bằng nút bấm của bảo vệ đều phải ghi nhận log kèm hình ảnh snapshot để đối soát định kỳ.

### 3. Giao dịch Theo Thời gian thực (Real-time Transactions)
* **Đồng bộ Đa làn (Multi-lane Synchronization):** Sử dụng Message Broker (RabbitMQ / MQTT / Redis Pub-Sub) để cập nhật trạng thái xe ra/vào tức thì giữa các máy trạm kiểm soát.
* **Chế độ Chịu lỗi (Offline Mode & Buffering):** Khi mất kết nối mạng, mọi giao dịch được ghi tạm vào bộ nhớ Queue tại trạm local. Ngay khi có mạng trở lại, hệ thống sẽ tự động đồng bộ (sync) về Server trung tâm mà không mất mát dữ liệu.
* **Cập nhật trạng thái chỗ trống (Slot Management):** Bảng hiển thị LED tại cổng báo chính xác số ô trống còn lại theo thời gian thực với độ trễ < 200ms.

---

## 🛠️ Kiến trúc Hệ thống & Công nghệ dự kiến (Tech Stack)

| Thành phần | Công nghệ / Thiết bị |
| :--- | :--- |
| **Phần cứng (Hardware)** | Camera IP ANPR (Độ phân giải 2MP-4MP), Cổng Barrier tự động, Đầu đọc thẻ RFID/Smartcard, Bảng LED hiển thị, Bộ vòng từ cảm biến (Loop Detector). |
| **Trạm kiểm soát (Client Edge)** | Python (OpenCV, PyTorch/TensorRT cho AI ANPR), PyQt/Electron JS cho giao diện trạm. |
| **Backend API Server** | Node.js (NestJS) / Go / Java Spring Boot. |
| **Real-time & Messaging** | WebSockets, Redis Pub/Sub, RabbitMQ. |
| **Cơ sở dữ liệu (Database)** | PostgreSQL / MySQL (Lưu trữ giao dịch), Redis (Cache dữ liệu thẻ kỳ). |

---

## 📝 Nhật ký Phát triển & Sử dụng AI (AI Usage Log)
*Dự án áp dụng quy tắc làm việc **Think - Prompt - Verify** khi tương tác với AI.*

| Ngày | Hạng mục / Nhiệm vụ | Prompt / Câu hỏi | Kết quả & Kiểm chứng cá nhân |
| :--- | :--- | :--- | :--- |
| *19/09/2026* | Lập Impact Mapping | *"Phân tích bãi xe mô hình trường học theo 4 tầng Impact Mapping"* | Đã chọn lọc các mục tiêu tốc độ <3s và xử lý ngoại lệ phù hợp với môi trường đại học. |
| *19/09/2026* | Thiết kế luồng xử lý thẻ | *"Phân tích rủi ro kỹ thuật đối với Thẻ kỳ, Thẻ vãng lai và Real-time"* | Bổ sung thêm giải pháp Anti-Passback và cơ chế Queue khi mất mạng. |

---

## 🚀 Hướng dẫn Đóng góp & Phát triển (Workflow)
1. Fork repository này.
2. Tạo nhánh tính năng mới (`git checkout -b feature/AntiPassbackLogic`).
3. Cam kết thay đổi (`git commit -m 'Add Anti-Passback validation for monthly cards'`).
4. Push lên nhánh (`git push origin feature/AntiPassbackLogic`).
5. Mở một Pull Request để kiểm duyệt.
