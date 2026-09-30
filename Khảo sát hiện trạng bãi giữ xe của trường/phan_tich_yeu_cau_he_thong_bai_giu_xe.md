# PHÂN TÍCH YÊU CẦU HỆ THỐNG QUẢN LÝ BÃI GIỮ XE

## 1. Tổng quan

Hệ thống quản lý bãi giữ xe được xây dựng nhằm quản lý toàn bộ quá trình gửi và lấy xe tại bãi xe trường học. Quy trình hiện tại gồm hai luồng chính:

- **Quy trình gửi xe:** Tới bãi giữ xe → Vào trạm → Nhận thẻ giữ xe → Tới chỗ đỗ xe.
- **Quy trình lấy xe:** Tới chỗ đỗ xe và lấy xe → Đi ra trạm → Trả thẻ xe và tiền → Rời khỏi bãi xe.

Hệ thống mới hướng tới việc số hóa các thao tác trên, quản lý chính xác thông tin xe, thẻ xe, giao dịch và doanh thu; đồng thời hỗ trợ **giao dịch thời gian thực**.

---

# 2. Đối tượng sử dụng hệ thống

## 2.1. Khách gửi xe

Bao gồm:

- Học sinh/sinh viên.
- Giáo viên, giảng viên.
- Nhân viên nhà trường.
- Khách vãng lai.
- Người sử dụng thẻ kỳ.

## 2.2. Nhân viên giữ xe

Có nhiệm vụ:

- Tiếp nhận xe.
- Ghi nhận giao dịch gửi xe.
- Cấp thẻ hoặc xác nhận thẻ.
- Kiểm tra thông tin xe khi lấy xe.
- Thu phí.
- Xác nhận xe đã rời bãi.

## 2.3. Quản trị viên

Có nhiệm vụ:

- Quản lý người dùng.
- Quản lý nhân viên.
- Quản lý loại xe.
- Quản lý loại thẻ.
- Quản lý mức phí.
- Quản lý bãi xe.
- Theo dõi giao dịch.
- Xem báo cáo và thống kê.
- Quản lý cấu hình hệ thống.

---

# 3. Yêu cầu chức năng

## 3.1. Quản lý tài khoản và phân quyền

### FR01 - Đăng nhập

Hệ thống phải cho phép nhân viên và quản trị viên đăng nhập bằng tài khoản được cấp.

### FR02 - Đăng xuất

Người dùng có thể đăng xuất khỏi hệ thống sau khi hoàn thành công việc.

### FR03 - Phân quyền

Hệ thống phải phân quyền theo vai trò, tối thiểu:

- Quản trị viên.
- Nhân viên giữ xe.

Mỗi vai trò chỉ được phép thực hiện những chức năng phù hợp.

---

# 4. Quản lý thông tin xe

### FR04 - Thêm thông tin xe

Nhân viên có thể ghi nhận thông tin xe khi xe vào bãi.

Thông tin có thể gồm:

- Biển số xe.
- Loại xe.
- Màu xe.
- Thời gian vào.
- Người gửi.
- Loại hình gửi xe.

### FR05 - Cập nhật thông tin xe

Cho phép cập nhật thông tin xe khi có thay đổi.

### FR06 - Tra cứu xe

Cho phép tìm kiếm xe theo:

- Biển số.
- Mã thẻ.
- Thời gian gửi.
- Loại xe.
- Trạng thái xe.

### FR07 - Kiểm tra trạng thái xe

Hệ thống phải xác định được xe đang:

- Trong bãi.
- Đã lấy ra.
- Chưa hoàn tất giao dịch.
- Có vấn đề cần kiểm tra.

---

# 5. Quản lý thẻ giữ xe

### FR08 - Cấp thẻ giữ xe

Khi xe vào bãi, hệ thống cho phép nhân viên cấp/gán thẻ giữ xe cho giao dịch.

### FR09 - Quản lý mã thẻ

Mỗi thẻ phải có mã định danh duy nhất để tránh nhầm lẫn.

### FR10 - Kiểm tra thẻ

Khi lấy xe, nhân viên kiểm tra thẻ và đối chiếu với thông tin giao dịch.

### FR11 - Trả thẻ

Sau khi xe được xác nhận lấy ra, hệ thống ghi nhận thẻ đã được trả hoặc trở về trạng thái có thể sử dụng lại.

### FR12 - Xử lý mất thẻ

Hệ thống phải hỗ trợ trường hợp khách mất thẻ, cho phép nhân viên xác minh thông tin trước khi cho xe ra.

---

# 6. Quản lý gửi xe

## FR13 - Tiếp nhận xe

Nhân viên ghi nhận xe khi khách đưa xe vào bãi.

## FR14 - Tạo giao dịch gửi xe

Hệ thống tạo một giao dịch mới khi xe vào bãi.

Thông tin giao dịch gồm:

- Mã giao dịch.
- Biển số xe.
- Mã thẻ.
- Loại xe.
- Loại khách.
- Thời gian vào.
- Nhân viên thực hiện.
- Trạng thái giao dịch.

## FR15 - Xác nhận xe vào bãi

Sau khi giao dịch được tạo, hệ thống chuyển trạng thái xe thành **Đang gửi**.

## FR16 - Xác định vị trí đỗ

Hệ thống có thể ghi nhận vị trí/khu vực đỗ xe nếu bãi xe có quản lý vị trí.

## FR17 - Phân loại hình thức gửi

Hệ thống hỗ trợ tối thiểu:

- **Thẻ kỳ:** dành cho người gửi xe theo kỳ/tháng.
- **VS:** loại hình được nhà trường quy định.
- **Vãng lai:** khách gửi xe không theo kỳ.

---

# 7. Quản lý lấy xe

## FR18 - Tiếp nhận yêu cầu lấy xe

Nhân viên tiếp nhận yêu cầu lấy xe của khách.

## FR19 - Tra cứu giao dịch

Nhân viên tìm giao dịch dựa trên:

- Mã thẻ.
- Biển số xe.
- Thông tin giao dịch.

## FR20 - Đối chiếu thông tin

Hệ thống cho phép đối chiếu:

- Mã thẻ.
- Biển số.
- Loại xe.
- Thời gian vào.
- Thông tin giao dịch.

## FR21 - Tính phí gửi xe

Hệ thống tự động tính phí dựa trên:

- Loại xe.
- Loại hình gửi xe.
- Thời gian gửi.
- Mức phí hiện hành.
- Chính sách miễn/giảm nếu có.

## FR22 - Thanh toán

Nhân viên ghi nhận số tiền khách phải trả và xác nhận thanh toán.

## FR23 - Xác nhận xe ra

Sau khi hoàn tất kiểm tra và thanh toán, hệ thống cập nhật trạng thái giao dịch thành **Đã hoàn tất** và xe thành **Đã ra khỏi bãi**.

## FR24 - Hoàn tất quy trình

Hệ thống ghi nhận thời gian xe ra và nhân viên thực hiện giao dịch.

---

# 8. Giao dịch thời gian thực

Đây là chức năng trọng tâm của hệ thống.

## FR25 - Cập nhật giao dịch theo thời gian thực

Khi xe vào hoặc ra, dữ liệu phải được cập nhật ngay trên hệ thống.

## FR26 - Theo dõi số lượng xe trong bãi

Hệ thống hiển thị số lượng xe:

- Đang trong bãi.
- Đã ra.
- Số chỗ còn trống.

## FR27 - Cập nhật trạng thái tức thời

Khi một giao dịch thay đổi trạng thái, các màn hình có quyền truy cập phải nhận được trạng thái mới.

## FR28 - Cảnh báo giao dịch bất thường

Hệ thống có thể cảnh báo khi:

- Thẻ không tồn tại.
- Thẻ đã được sử dụng cho giao dịch khác.
- Biển số không khớp.
- Xe không có giao dịch gửi.
- Giao dịch có dấu hiệu bất thường.

---

# 9. Quản lý phí và thanh toán

## FR29 - Quản lý bảng giá

Quản trị viên có thể:

- Thêm mức phí.
- Sửa mức phí.
- Xóa/ngừng sử dụng mức phí.
- Thiết lập mức phí theo loại xe.

## FR30 - Tính tiền tự động

Hệ thống tự động tính tiền thay vì nhân viên phải tính thủ công.

## FR31 - Ghi nhận thanh toán

Mỗi lần thanh toán phải được lưu lại cùng giao dịch tương ứng.

## FR32 - Quản lý doanh thu

Hệ thống tổng hợp doanh thu theo:

- Ngày.
- Tuần.
- Tháng.
- Khoảng thời gian.
- Loại xe.
- Loại hình gửi xe.

---

# 10. Quản lý thẻ kỳ

## FR33 - Đăng ký thẻ kỳ

Cho phép đăng ký thẻ kỳ cho người sử dụng.

## FR34 - Quản lý thời hạn thẻ

Hệ thống lưu:

- Ngày bắt đầu.
- Ngày hết hạn.
- Trạng thái thẻ.

## FR35 - Gia hạn thẻ

Cho phép gia hạn khi thẻ sắp hết hạn hoặc đã hết hạn.

## FR36 - Kiểm tra hiệu lực

Khi xe vào bãi, hệ thống kiểm tra thẻ kỳ còn hiệu lực hay không.

---

# 11. Quản lý khách vãng lai

## FR37 - Tạo giao dịch vãng lai

Khi khách không sử dụng thẻ kỳ, hệ thống tạo giao dịch vãng lai.

## FR38 - Tính phí vãng lai

Phí được tính theo bảng giá hiện hành.

## FR39 - Hoàn tất giao dịch vãng lai

Sau khi khách thanh toán và lấy xe, giao dịch được chuyển sang trạng thái hoàn tất.

---

# 12. Quản lý bãi xe

## FR40 - Quản lý khu vực

Cho phép quản lý các khu vực trong bãi.

## FR41 - Theo dõi sức chứa

Hệ thống theo dõi:

- Tổng số chỗ.
- Số chỗ đang sử dụng.
- Số chỗ còn trống.

## FR42 - Cảnh báo bãi đầy

Khi số lượng xe đạt giới hạn, hệ thống cảnh báo tình trạng bãi gần đầy hoặc đầy.

---

# 13. Báo cáo và thống kê

## FR43 - Báo cáo số lượng xe

Thống kê số lượng xe vào/ra theo thời gian.

## FR44 - Báo cáo doanh thu

Thống kê doanh thu theo khoảng thời gian.

## FR45 - Báo cáo loại hình gửi

Thống kê:

- Thẻ kỳ.
- VS.
- Vãng lai.

## FR46 - Báo cáo giao dịch

Cho phép tra cứu lịch sử giao dịch.

## FR47 - Xuất báo cáo

Có thể hỗ trợ xuất dữ liệu ra các định dạng như:

- Excel.
- CSV.
- PDF.

---

# 14. Quản lý lịch sử và nhật ký

## FR48 - Lưu lịch sử giao dịch

Hệ thống phải lưu lịch sử tất cả giao dịch gửi và lấy xe.

## FR49 - Nhật ký hoạt động

Ghi nhận các thao tác quan trọng:

- Người đăng nhập.
- Thời gian thao tác.
- Nội dung thao tác.
- Người thực hiện.

## FR50 - Tra cứu lịch sử

Quản trị viên có thể tìm kiếm và lọc lịch sử theo thời gian, người dùng hoặc loại giao dịch.

---

# 15. Yêu cầu phi chức năng

## 15.1. Hiệu năng

### NFR01 - Thời gian phản hồi

Các thao tác thông thường phải có thời gian phản hồi nhanh, mục tiêu không quá vài giây trong điều kiện hệ thống hoạt động bình thường.

### NFR02 - Giao dịch thời gian thực

Thông tin xe vào/ra và trạng thái bãi phải được cập nhật gần như ngay lập tức.

### NFR03 - Khả năng xử lý đồng thời

Hệ thống phải hỗ trợ nhiều nhân viên sử dụng cùng lúc mà không làm sai lệch dữ liệu.

---

# 16. Tính chính xác

### NFR04 - Tính chính xác dữ liệu

Thông tin biển số, thẻ, thời gian và phí phải được lưu chính xác.

### NFR05 - Không trùng giao dịch

Một giao dịch gửi xe phải có mã duy nhất.

### NFR06 - Đồng bộ trạng thái

Trạng thái xe và giao dịch phải nhất quán giữa các màn hình và người dùng.

---

# 17. Bảo mật

### NFR07 - Xác thực người dùng

Người dùng phải đăng nhập trước khi sử dụng các chức năng yêu cầu quyền truy cập.

### NFR08 - Phân quyền

Người dùng chỉ được truy cập chức năng được cấp quyền.

### NFR09 - Bảo vệ dữ liệu

Thông tin tài khoản và dữ liệu giao dịch phải được bảo vệ khỏi truy cập trái phép.

### NFR10 - Nhật ký bảo mật

Các thao tác quan trọng phải được ghi lại để phục vụ kiểm tra và truy vết.

---

# 18. Độ tin cậy

### NFR11 - Hoạt động ổn định

Hệ thống phải hoạt động ổn định trong thời gian dài.

### NFR12 - Không mất dữ liệu

Dữ liệu giao dịch phải được lưu trữ an toàn và hạn chế tối đa nguy cơ mất dữ liệu.

### NFR13 - Sao lưu

Cơ sở dữ liệu cần được sao lưu định kỳ.

### NFR14 - Khôi phục

Hệ thống cần có khả năng khôi phục dữ liệu khi xảy ra sự cố.

---

# 19. Khả năng sử dụng

### NFR15 - Giao diện dễ sử dụng

Giao diện phải đơn giản, rõ ràng và phù hợp với nhân viên giữ xe.

### NFR16 - Thao tác nhanh

Các thao tác gửi xe và lấy xe phải được tối ưu để nhân viên có thể xử lý nhiều xe liên tục.

### NFR17 - Hiển thị trạng thái rõ ràng

Các trạng thái như:

- Đang gửi.
- Đã thanh toán.
- Đã lấy xe.
- Thẻ hết hạn.
- Giao dịch lỗi.

phải được hiển thị dễ nhận biết.

---

# 20. Khả năng mở rộng

### NFR18 - Mở rộng người dùng

Có thể bổ sung thêm nhân viên hoặc quản trị viên.

### NFR19 - Mở rộng bãi xe

Hệ thống có thể quản lý nhiều khu vực hoặc nhiều bãi xe.

### NFR20 - Mở rộng loại xe

Có thể bổ sung các loại phương tiện mới mà không cần thay đổi toàn bộ hệ thống.

### NFR21 - Mở rộng hình thức thanh toán

Có thể mở rộng từ thanh toán tiền mặt sang các phương thức điện tử trong tương lai.

---

# 21. Khả năng bảo trì

### NFR22 - Kiến trúc dễ bảo trì

Hệ thống nên được tổ chức thành các module độc lập như:

- Quản lý người dùng.
- Quản lý xe.
- Quản lý thẻ.
- Quản lý gửi xe.
- Quản lý lấy xe.
- Thanh toán.
- Báo cáo.
- Quản trị.

### NFR23 - Dễ cập nhật

Có thể thay đổi bảng giá, chính sách thẻ hoặc quy trình mà không ảnh hưởng lớn đến các module khác.

### NFR24 - Ghi log lỗi

Hệ thống phải ghi nhận lỗi để hỗ trợ kiểm tra và bảo trì.

---

# 22. Khả năng tương thích

### NFR25 - Thiết bị

Hệ thống có thể hoạt động trên:

- Máy tính tại trạm giữ xe.
- Laptop.
- Máy tính bảng nếu cần.

### NFR26 - Trình duyệt

Nếu triển khai dưới dạng web, hệ thống nên hỗ trợ các trình duyệt phổ biến như Chrome, Edge và Firefox.

---

# 23. Yêu cầu về dữ liệu

Hệ thống cần quản lý tối thiểu các nhóm dữ liệu:

| Nhóm dữ liệu | Nội dung |
|---|---|
| Người dùng | Mã, tên, tài khoản, vai trò |
| Xe | Biển số, loại xe, màu xe |
| Thẻ | Mã thẻ, loại thẻ, trạng thái |
| Giao dịch | Mã giao dịch, thời gian vào/ra, trạng thái |
| Thanh toán | Số tiền, phương thức, thời gian |
| Bãi xe | Khu vực, sức chứa, số xe hiện tại |
| Bảng giá | Loại xe, loại gửi, mức phí |
| Nhật ký | Người thao tác, thời gian, hành động |

---

# 24. Quy trình nghiệp vụ sau khi xây dựng hệ thống

## 24.1. Quy trình gửi xe

1. Khách tới bãi xe.
2. Nhân viên tiếp nhận xe.
3. Hệ thống xác định loại hình gửi: thẻ kỳ, VS hoặc vãng lai.
4. Hệ thống kiểm tra thẻ nếu có.
5. Tạo giao dịch gửi xe.
6. Ghi nhận biển số và thông tin xe.
7. Ghi nhận thời gian vào.
8. Cấp/gán thẻ nếu cần.
9. Cập nhật trạng thái xe thành **Đang gửi**.
10. Cập nhật số lượng xe trong bãi theo thời gian thực.
11. Khách đưa xe vào khu vực đỗ.

## 24.2. Quy trình lấy xe

1. Khách tới khu vực lấy xe.
2. Khách lấy xe.
3. Tới trạm ra.
4. Nhân viên tiếp nhận thẻ/thông tin xe.
5. Hệ thống tìm giao dịch.
6. Đối chiếu thông tin.
7. Hệ thống tính phí.
8. Khách thanh toán.
9. Nhân viên xác nhận giao dịch.
10. Hệ thống ghi nhận thời gian ra.
11. Cập nhật xe thành **Đã ra khỏi bãi**.
12. Cập nhật số lượng xe trong bãi theo thời gian thực.
13. Hoàn tất giao dịch.

---

# 25. Các vấn đề hệ thống mới cần giải quyết

Hệ thống cần tập trung giải quyết các vấn đề của quy trình thủ công:

- Ghi nhận thông tin xe thủ công.
- Dễ xảy ra nhầm lẫn thẻ xe.
- Khó tra cứu lịch sử gửi xe.
- Tính tiền thủ công có thể xảy ra sai sót.
- Khó theo dõi số lượng xe đang có trong bãi.
- Khó kiểm soát doanh thu.
- Khó quản lý thẻ kỳ.
- Khó phân biệt và thống kê thẻ kỳ, VS và vãng lai.
- Khó phát hiện giao dịch bất thường.
- Dữ liệu không được cập nhật tập trung.
- Khó theo dõi hoạt động của nhân viên.
- Mất nhiều thời gian khi khách lấy xe vào giờ cao điểm.

---

# 26. Ưu tiên triển khai chức năng

## Giai đoạn 1 - Chức năng cốt lõi

- Đăng nhập.
- Quản lý người dùng.
- Quản lý xe.
- Quản lý thẻ.
- Gửi xe.
- Lấy xe.
- Tính phí.
- Thanh toán.
- Lịch sử giao dịch.

## Giai đoạn 2 - Quản lý nâng cao

- Thẻ kỳ.
- VS.
- Vãng lai.
- Quản lý khu vực bãi.
- Báo cáo doanh thu.
- Báo cáo số lượng xe.
- Phân quyền nâng cao.

## Giai đoạn 3 - Điểm nhấn thời gian thực

- Dashboard thời gian thực.
- Cập nhật xe vào/ra tức thời.
- Theo dõi số chỗ trống.
- Cảnh báo bãi đầy.
- Cảnh báo giao dịch bất thường.
- Đồng bộ trạng thái giữa các trạm.

---

# 27. Kết luận

Hệ thống quản lý bãi giữ xe cần số hóa toàn bộ quy trình từ lúc xe vào bãi đến khi xe rời khỏi bãi. Hai nhóm chức năng quan trọng nhất là **quản lý giao dịch gửi/lấy xe** và **quản lý dữ liệu theo thời gian thực**.

Bên cạnh đó, hệ thống cần hỗ trợ đầy đủ các hình thức **thẻ kỳ, VS và vãng lai**, quản lý phí, thanh toán, báo cáo, lịch sử và phân quyền.

Các yêu cầu phi chức năng tập trung vào:

- Hiệu năng.
- Tính chính xác.
- Giao dịch thời gian thực.
- Bảo mật.
- Độ tin cậy.
- Khả năng sử dụng.
- Khả năng mở rộng.
- Khả năng bảo trì.
- Khả năng tương thích.

Mục tiêu cuối cùng là xây dựng một hệ thống giúp quy trình gửi và lấy xe **nhanh hơn, chính xác hơn, dễ kiểm soát hơn và có dữ liệu được cập nhật tập trung theo thời gian thực**.
