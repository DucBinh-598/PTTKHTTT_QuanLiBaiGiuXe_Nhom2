# Hồ sơ cơ sở dữ liệu — SPMS

**Dự án:** Hệ thống quản lý bãi giữ xe trường học (School Parking Management System)

## Tệp đính kèm
- `database_schema.sql`: cấu trúc cơ sở dữ liệu PostgreSQL, gồm bảng, khóa chính/khóa ngoại, ràng buộc, chỉ mục và view tra cứu xe đang ở trong bãi.

## Công nghệ
Tệp SQL được viết cho **PostgreSQL**. Tài liệu SRS của dự án nêu PostgreSQL/MySQL; bảng theo dõi tiến độ ghi thiết kế CSDL PostgreSQL, nên bản này chọn PostgreSQL để thống nhất.

## Cách sử dụng
1. Mở PostgreSQL bằng pgAdmin hoặc công cụ tương thích.
2. Tạo database mới tên `spms_db`.
3. Chọn database `spms_db`, mở Query Tool.
4. Mở và chạy toàn bộ nội dung `database_schema.sql`.
5. Làm mới mục Schemas > public > Tables để xem các bảng vừa tạo.

> Tệp này tạo cấu trúc bảng, chưa tạo tài khoản đăng nhập mẫu và chưa thêm dữ liệu demo. Cột `password_hash` chỉ lưu mật khẩu đã băm, không lưu mật khẩu dạng chữ thường.

## Danh sách bảng
| Bảng | Mục đích |
|---|---|
| `users` | Tài khoản sinh viên, bảo vệ và quản trị viên |
| `parking_lots` | Danh sách bãi xe và sức chứa |
| `vehicles` | Thông tin phương tiện, biển số và chủ xe |
| `cards` | Thẻ RFID, loại thẻ, trạng thái và hạn sử dụng |
| `monthly_card_registrations` | Hồ sơ đăng ký vé tháng và quá trình duyệt |
| `tariff_rules` | Bảng giá theo loại xe/loại thẻ/khung giờ |
| `parking_logs` | Nhật ký xe vào-ra, biển số, thời gian, ảnh và phí |
| `payments` | Thanh toán vé lượt hoặc đăng ký vé tháng |
| `incidents` | Sự cố mất thẻ, sai biển số, xe tồn lâu và xử lý |
| `audit_logs` | Nhật ký thao tác phục vụ kiểm tra và bảo mật |

## Lưu ý
Đây là bản schema ban đầu phù hợp với tài liệu yêu cầu hiện có. Trước khi tích hợp backend, cần đối chiếu tên bảng/cột với model/API thực tế và điều chỉnh nếu code đang dùng tên khác.
