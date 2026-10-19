# USER STORY: US04 - XỬ LÝ XE VÀO & QUÉT THẺ RFID (CHECK-IN)

---

## 1. THÔNG TIN CHUNG (METADATA)

* **Mã User Story:** US04
* **Tên User Story:** Xử lý Xe Vào & Quét Thẻ RFID (Check-in)
* **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
* **Tác nhân chính:** Nhân viên Bảo vệ
* **Mức độ ưu tiên (MoSCoW):** High (Must Have)
* **Trạng thái:** Approved
* **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC04), [SRS.md](../SRS.md) ([FR-POS-01])

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **As a:** Nhân viên Bảo vệ tại làn vào.
* **I want to:** Quẹt thẻ RFID của xe đang vào bãi để hệ thống ghi nhận thời gian vào, mã thẻ và phát tín hiệu mở Barie.
* **So that:** Xe vào bãi nhanh chóng, an toàn và lưu lại dữ liệu lượt vào để đối soát khi ra.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Giờ cao điểm sáng (7h00 - 8h00), lượng xe sinh viên vào trường rất đông. Thao tác quẹt thẻ Check-in phải diễn ra dưới 1.5 giây. Bảo vệ chỉ cần cầm thẻ quẹt vào đầu đọc, hệ thống sẽ tự động bắt sự kiện và ghi nhận log.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

* **BR-01 (Thẻ phải hợp lệ):** Thẻ quẹt vào phải có trạng thái `ACTIVE` trong bảng `Cards`.
* **BR-02 (Không cho phép Check-in kép):** Thẻ đang có trạng thái `IN_PARKING` (chưa Check-out lượt trước) sẽ bị TỪ CHỐI Check-in và báo lỗi "Thẻ đang ở trong bãi!".

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Check-in hợp lệ thành công
* **Given:** Xe dừng trước làn vào, thẻ `RFID_001` có trạng thái `ACTIVE` và không ở trong bãi.
* **When:** Bảo vệ quẹt thẻ `RFID_001` lên đầu đọc.
* **Then:** Hệ thống lưu log `IN_PARKING`, kích hoạt `US05` chụp ảnh, phát tiếng "Bíp" xanh và gửi tín hiệu mở Barie.

### Kịch bản 2: Check-in thẻ bị khóa
* **Given:** Thẻ `RFID_002` có trạng thái `LOCKED`.
* **When:** Bảo vệ quẹt thẻ `RFID_002`.
* **Then:** Hệ thống từ chối, màn hình nháy đỏ báo "THẺ ĐÃ BỊ KHÓA", Barie giữ đóng.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

### Cấu trúc bảng CSDL (`ParkingLogs`)
```sql
CREATE TABLE ParkingLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    status ENUM('IN_PARKING', 'COMPLETED', 'WARNING') DEFAULT 'IN_PARKING',
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);
