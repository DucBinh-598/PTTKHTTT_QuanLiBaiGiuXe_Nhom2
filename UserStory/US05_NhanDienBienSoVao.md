# USER STORY: US05 - TỰ ĐỘNG CHỤP ẢNH & NHẬN DIỆN BIỂN SỐ VÀO (AI ALPR)

---
## 1. THÔNG TIN CHUNG (METADATA)

* **Mã User Story:** US05
* **Tên User Story:** Tự động Chụp ảnh & Nhận diện Biển số Vào (AI ALPR)
* **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
* **Tác nhân chính:** Hệ thống Tự động (AI Worker) / Bảo vệ
* **Mức độ ưu tiên (MoSCoW):** High (Must Have)
* **Trạng thái:** Approved
* **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC05), [SRS.md](../SRS.md) ([FR-POS-02])

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **As a:** Hệ thống nhận diện AI tự động.
* **I want to:** Tự động kích hoạt 2 camera chụp ảnh mặt người lái và biển số xe, sau đó chạy OCR nhận diện chuỗi biển số khi có sự kiện quẹt thẻ Check-in.
* **So that:** Lưu lại đầy đủ bằng chứng hình ảnh và dữ liệu biển số xe vào CSDL trong vòng < 1.5s.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Hình ảnh chụp lúc vào là căn cứ pháp lý duy nhất để so sánh với hình ảnh lúc ra. AI ALPR sẽ cắt khung hình biển số, chuyển đổi hình ảnh thành xâu ký tự (VD: "59P1-123.45") để máy tính tự động so sánh.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

* **BR-01 (Lưu trữ ảnh):** Ảnh toàn cảnh (`image_face_in`) và ảnh biển số (`image_plate_in`) phải được lưu vào thư mục/MinIO server và lưu URL vào DB.
* **BR-02 (Xử lý ngoại lệ AI):** Nếu biển số bị che/mờ khiến độ tin cậy AI `< 60%`, hệ thống lưu chuỗi `UNREADABLE` và cho phép Bảo vệ gõ tay sửa lại.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: AI đọc đúng biển số rõ ràng
* **Given:** Sự kiện Check-in thẻ `RFID_001` kích hoạt.
* **When:** Camera chụp ảnh, mô hình AI ALPR xử lý ảnh biển số `59P112345`.
* **Then:** Hệ thống lưu 2 đường dẫn ảnh, lưu `plate_in = "59P112345"` vào lượt gửi `IN_PARKING` trong < 1 giây.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

### Bảng CSDL cập nhật thêm trường
`image_face_in` (VARCHAR), `image_plate_in` (VARCHAR), `plate_in` (VARCHAR).

---

## 7. TRUY VẾT & ĐIỀU KIỆN PHỤ THUỘC (TRACEABILITY & DEPENDENCIES)

* **Thành phần phụ thuộc trước (Pre-dependencies):** `US04` (Sự kiện quẹt thẻ Check-in).
* **Thành phần phụ thuộc sau (Post-dependencies):** `US06`, `US07` (Đối soát lượt ra).
