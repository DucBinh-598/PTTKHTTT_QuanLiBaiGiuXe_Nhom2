# USER STORY: US06 - XỬ LÝ XE RA & ĐỐI SOÁT BIỂN SỐ (CHECK-OUT)

---

## 1. THÔNG TIN CHUNG (METADATA)

* **Mã User Story:** US06
* **Tên User Story:** Xử lý Xe Ra & Đối soát Biển số (Check-out)
* **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
* **Tác nhân chính:** Nhân viên Bảo vệ
* **Mức độ ưu tiên (MoSCoW):** High (Must Have)
* **Trạng thái:** Approved
* **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC06), [SRS.md](../SRS.md) ([FR-POS-03])

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **As a:** Nhân viên Bảo vệ tại làn ra.
* **I want to:** Quẹt thẻ RFID lượt ra để hệ thống chụp ảnh lượt ra, hiển thị đối sánh 4 ảnh (mặt/biển vào - mặt/biển ra) và tính số tiền gửi.
* **So that:** Kiểm tra đúng xe, đúng người và thu tiền chính xác trước khi cho xe rời khỏi bãi.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Tại làn ra, Bảo vệ nhận lại thẻ từ người lái và quẹt. Màn hình sẽ chia làm 4 ô vuông hiển thị đồng thời ảnh lúc vào và ảnh vừa chụp lúc ra. Nếu biển số trùng khớp, hệ thống tính tiền và mở cổng.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

* **BR-01 (So sánh tự động):** Chuỗi `plate_in` và `plate_out` được so sánh tự động bằng thuật toán so sánh chuỗi Levenshtein Distance (cho phép lệch tối đa 1 ký tự do nhiễu AI).
* **BR-02 (Tính phí):** Áp dụng bảng giá từ `US03`. Nếu là thẻ `MONTHLY` còn hiệu lực -> Giá = 0 VNĐ.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xe ra hợp lệ và biển số khớp
* **Given:** Thẻ `RFID_001` đang gửi trong bãi với `plate_in = "59P112345"`.
* **When:** Bảo vệ quẹt thẻ tại làn ra, AI đọc `plate_out = "59P112345"`.
* **Then:** Màn hình hiển thị 4 ảnh khớp nhau, ô số tiền hiện `3,000 VNĐ`, Barie tự động mở sau khi ghi nhận thanh toán.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

### Cập nhật CSDL
Cập nhật `check_out_time`, `plate_out`, `fee`, `status = 'COMPLETED'` cho bản ghi `ParkingLogs`.

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

* **Thành phần phụ thuộc trước (Pre-dependencies):** `US04`, `US05`.
* **Thành phần phụ thuộc sau (Post-dependencies):** `US07` (Kích hoạt cảnh báo nếu sai biển).
