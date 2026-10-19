# USER STORY: US03 - THIẾT LẬP BẢNG GIÁ & KHUNG GIỜ GỬI XE

---

## 1. THÔNG TIN CHUNG (METADATA)

* **Mã User Story:** US03
* **Tên User Story:** Thiết lập Bảng giá & Khung giờ Gửi xe
* **Phân hệ:** Phân hệ 1 - Quản lý Danh mục & Cấu hình Hệ thống (Master Data)
* **Tác nhân chính:** Quản trị viên (Admin)
* **Mức độ ưu tiên (MoSCoW):** High (Must Have)
* **Trạng thái:** Approved
* **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC03), [SRS.md](../SRS.md) ([FR-MD-03])

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **As a:** Quản trị viên hệ thống (Admin).
* **I want to:** Cấu hình biểu giá tiền gửi xe theo từng loại phương tiện và khung giờ (Ban ngày / Ban đêm / Qua đêm).
* **So that:** Hệ thống tự động tính chính xác số tiền xe ra tại làn Check-out theo quy định tài chính của nhà trường.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Trường học áp dụng các mức giá gửi xe khác nhau cho Sinh viên/Khách vãng lai. Thường ca ngày áp dụng phí cố định nhẹ nhàng (VD: 3.000đ/lượt), nhưng nếu gửi qua đêm (sau 22:00) sẽ áp dụng mức phí cao hơn (VD: 15.000đ/đêm) để hạn chế việc để xe qua đêm trong trường.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

* **BR-01 (Khung giờ mặc định):**
  * Ca Ngày: `06:00:00` đến `21:59:59`.
  * Ca Đêm / Qua Đêm: `22:00:00` đến `05:59:59` sáng hôm sau.
* **BR-02 (Miễn phí vé tháng):** Các thẻ thuộc loại `MONTHLY` còn hiệu lực sẽ có `price = 0 VNĐ` ở mọi khung giờ.
* **BR-03 (Công thức tính tiền):** Nếu lượt gửi vắt qua 2 khung giờ, tiền phí bằng `Giá_Ca_Ngày + Giá_Ca_Đêm`.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Admin cấu hình lại bảng giá ca đêm
* **Given:** Admin ở màn hình Cấu hình Giá vé.
* **When:** Chọn loại xe "Xe máy", khung giờ "Qua đêm (22h - 6h)", nhập giá `15000` VNĐ và bấm "Lưu".
* **Then:** Hệ thống cập nhật bảng giá. Các xe Check-out trong khung giờ này sau đó sẽ áp dụng phí 15.000 VNĐ.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

### Cấu trúc bảng CSDL (`Tariffs`)
```sql
CREATE TABLE Tariffs (
    tariff_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_type ENUM('MOTORBIKE', 'BICYCLE', 'ELECTRIC_BIKE') NOT NULL,
    day_rate DECIMAL(10,2) NOT NULL DEFAULT 3000.00,
    night_rate DECIMAL(10,2) NOT NULL DEFAULT 15000.00,
    effective_date DATE NOT NULL
);
