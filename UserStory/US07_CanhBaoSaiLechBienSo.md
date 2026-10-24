# USER STORY: US07 - CẢNH BÁO SAI LỆCH BIỂN SỐ & KHÓA BAREM (ANTI-THEFT)

---

## 1. THÔNG TIN CHUNG (METADATA)

* **Mã User Story:** US07
* **Tên User Story:** Cảnh báo Sai lệch Biển số & Khóa Barem (Anti-theft)
* **Phân hệ:** Phân hệ 2 - Quản lý Luồng xe Vào/Ra & Nhận diện AI (Check-in / Check-out)
* **Tác nhân chính:** Bảo vệ / Hệ thống Tự động
* **Mức độ ưu tiên (MoSCoW):** High (Must Have)
* **Trạng thái:** Approved
* **Tài liệu tham chiếu:** [DacTa.md](../DacTa.md) (UC07), [SRS.md](../SRS.md) ([FR-POS-04])

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **As a:** Hệ thống Giám sát An ninh Bãi xe.
* **I want to:** Khóa thanh Barie, nháy màn hình cảnh báo đỏ và phát còi âm thanh ngay lập tức khi phát hiện biển số lượt ra KHÔNG khớp với biển số lượt vào.
* **So that:** Ngăn chặn kịp thời hành vi tráo biển số, dùng sai thẻ hoặc trộm xe ra khỏi trường.

---

## 3. BỐI CẢNH & NGHIỆP VỤ THỰC TẾ (BUSINESS CONTEXT)

Kẻ gian có thể nhặt được thẻ xe hoặc cố tình tráo thẻ giữa 2 xe gửi trong bãi để lấy xe xịn ra. Logic Anti-theft là "lá chắn" quan trọng nhất của phần mềm bãi xe.

---

## 4. QUY TẮC NGHIỆP VỤ & THUẬT TOÁN (BUSINESS RULES & ALGORITHMS)

* **BR-01 (Cảnh báo lệch biển):** Nếu `plate_in != plate_out` (và khoảng cách ký tự khác biệt > 1), cờ `is_warning` được bật `= TRUE`.
* **BR-02 (Khóa Barie tuyệt đối):** Không phát tín hiệu mở Barie dưới bất kỳ hình thức tự động nào khi cờ `is_warning = TRUE`.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Phát hiện tráo xe khi quẹt ra
* **Given:** Thẻ `RFID_001` lúc vào đi xe `59P1-11111`.
* **When:** Kẻ gian cầm thẻ `RFID_001` quẹt ra trên xe `59P1-99999`.
* **Then:** Barie giữ đóng, loa phát còi "CẢNH BÁO SAI BIỂN SỐ", màn hình nháy đỏ rực và cập nhật trạng thái `status = 'WARNING'`.

---

## 6. ĐẶC TẢ KỸ THUẬT & CSDL LIÊN QUAN (TECHNICAL & DATA SPECS)

```json
{
  "event": "CHECKOUT_WARNING",
  "log_id": 1052,
  "card_uid": "RFID_001",
  "plate_in": "59P1-11111",
  "plate_out": "59P1-99999",
  "action": "LOCK_BARRIER"
}
