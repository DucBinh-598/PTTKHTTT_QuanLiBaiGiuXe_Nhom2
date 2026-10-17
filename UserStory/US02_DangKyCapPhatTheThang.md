

 📄 File 2: `US02_DangKyCapPhatTheThang.md`
```markdown
# USER STORY: US02 - ĐĂNG KÝ & CẤP PHÁT THỂ THÁNG SINH VIÊN

---

## 1. THÔNG TIN CHUNG (METADATA)

* **Mã User Story:** US02
* **Tên User Story:** Đăng ký & Cấp phát Thẻ tháng Sinh viên
* **Phân hệ:** Phân hệ 1 - Quản lý Danh mục & Cấu hình Hệ thống (Master Data)
* **Tác nhân chính:** Sinh viên / Cán bộ & Quản trị viên (Admin)
* **Mức độ ưu tiên (MoSCoW):** High (Must Have)
* **Trạng thái:** Approved
* **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC02), [SRS.md](../SRS.md) ([FR-MD-02])

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **As a:** Sinh viên / Cán bộ nhà trường.
* **I want to:** Đăng ký vé xe tháng trực tuyến bằng cách tải lên thông tin xe và giấy tờ (Cà-vẹt/Thẻ SV).
* **So that:** Tiết kiệm thời gian làm thủ tục trực tiếp, và Admin có thể phê duyệt, gán mã thẻ RFID để gửi xe không giới hạn lượt trong thời hạn đăng ký.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Đầu mỗi học kỳ, nhu cầu đăng ký vé xe tháng của Sinh viên rất lớn. Việc đăng ký online giúp nhà trường số hóa quy trình, xác minh chính chủ giữa Biển số xe - Mã Sinh viên - Mã thẻ RFID. Khi xe vé tháng ra/vào, hệ thống chỉ tính hạn dùng thay vì trừ tiền lượt.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

* **BR-01 (Mỗi SV tối đa 1 vé tháng active):** Tại một thời điểm, mỗi Sinh viên chỉ được sở hữu 1 thẻ vé tháng có hiệu lực (`status = ACTIVE`).
* **BR-02 (Xác minh thông tin):** Đơn đăng ký phải đính kèm đầy đủ 2 ảnh: Mặt trước Cà-vẹt xe và Mặt trước Thẻ sinh viên.
* **BR-03 (Thời hạn vé tháng):** Tính theo tháng (30 ngày) hoặc theo Học kỳ (150 ngày) tính từ ngày Admin duyệt và thu tiền.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Sinh viên nộp đơn đăng ký vé tháng thành công
* **Given:** Sinh viên đã đăng nhập Cổng thông tin.
* **When:** Nhập biển số `59P1-12345`, loại xe `Xe tay ga`, upload ảnh Cà-vẹt và bấm "Gửi đăng ký".
* **Then:** Hệ thống lưu đơn đăng ký ở trạng thái `PENDING_APPROVAL`, gửi thông báo đến Admin.

### Kịch bản 2: Admin duyệt đơn và gán mã thẻ RFID
* **Given:** Có đơn đăng ký `PENDING_APPROVAL` của Sinh viên A.
* **When:** Admin kiểm tra ảnh hợp lệ, quẹt thẻ RFID vật lý `RFID_888999` để liên kết và bấm "Duyệt đơn".
* **Then:** Hệ thống chuyển trạng thái đơn thành `APPROVED`, thẻ `RFID_888999` cập nhật loại `MONTHLY`, gắn với `student_id` và kích hoạt hạn dùng.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

### Cấu trúc bảng CSDL (`MonthlySubscriptions`)
```sql
CREATE TABLE MonthlySubscriptions (
    subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    card_id INT UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXPIRED') DEFAULT 'PENDING_APPROVAL',
    FOREIGN KEY (card_id) REFERENCES Cards(card_id)
);
