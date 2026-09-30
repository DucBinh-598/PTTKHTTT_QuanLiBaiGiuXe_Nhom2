# PHÂN TÍCH CÁC VẤN ĐỀ CỦA HỆ THỐNG GIỮ XE HIỆN TẠI

## 1. Tổng quan quy trình hiện tại

### 1.1. Quy trình gửi xe

Quy trình gửi xe hiện tại gồm các bước:

**Tới bãi giữ xe → Vào trạm → Nhận thẻ giữ xe → Tới chỗ đỗ xe**

### 1.2. Quy trình lấy xe

Quy trình lấy xe hiện tại gồm các bước:

**Tới chỗ đỗ xe và lấy xe → Đi ra trạm → Trả thẻ xe và tiền → Rời khỏi bãi xe**

---

# 2. Các vấn đề trong quy trình gửi xe

## 2.1. Quản lý thông tin còn thủ công

Nhân viên phải thực hiện nhiều thao tác trực tiếp như tiếp nhận xe, phát thẻ và kiểm tra xe.

Điều này làm tăng khối lượng công việc và phụ thuộc nhiều vào con người.

## 2.2. Khó xác định chính xác thông tin xe

Quy trình hiện tại chủ yếu dựa vào thẻ giữ xe nên việc xác định xe có thể gặp khó khăn nếu không có thông tin bổ sung như:

- Biển số xe.
- Loại xe.
- Thời gian xe vào.
- Vị trí gửi xe.
- Người gửi xe.
- Loại vé hoặc loại khách hàng.

## 2.3. Nguy cơ mất hoặc nhầm thẻ

Thẻ giữ xe là thành phần quan trọng trong quá trình nhận xe.

Các trường hợp có thể xảy ra:

- Khách hàng làm mất thẻ.
- Nhân viên đưa nhầm thẻ.
- Khách hàng lấy nhầm thẻ.
- Thẻ bị hư hỏng hoặc không thể sử dụng.
- Khó xác minh xe khi không có thẻ.

## 2.4. Không quản lý được trạng thái bãi xe theo thời gian thực

Quy trình hiện tại chưa thể hiện cơ chế cập nhật tự động:

- Tổng số xe đang gửi.
- Số chỗ còn trống.
- Số xe đang vào.
- Số xe đang ra.
- Khu vực còn chỗ.
- Tình trạng đầy của từng khu vực.

Do đó nhân viên khó nắm được tình trạng bãi xe tại thời điểm hiện tại.

## 2.5. Dễ xảy ra ùn tắc tại cổng vào

Khi số lượng người gửi xe tăng cao, đặc biệt vào giờ cao điểm:

- Người gửi phải chờ nhận thẻ.
- Nhân viên phải xử lý từng lượt xe.
- Khó phân luồng xe.
- Thời gian xử lý mỗi lượt có thể tăng.

Điều này có thể gây ùn tắc tại khu vực vào bãi.

---

# 3. Các vấn đề trong quá trình lấy xe

## 3.1. Kiểm tra xe còn phụ thuộc vào thẻ

Khi người dùng lấy xe, việc xác minh chủ yếu dựa vào thẻ.

Nếu mất thẻ, quy trình xác minh có thể trở nên phức tạp và mất nhiều thời gian.

## 3.2. Thu tiền thủ công

Nhân viên phải:

1. Nhận thẻ.
2. Kiểm tra thông tin.
3. Xác định số tiền.
4. Thu tiền.
5. Trả lại tiền thừa nếu có.
6. Trả thẻ hoặc hoàn tất giao dịch.

Các thao tác này có thể dẫn đến:

- Tính sai phí.
- Thu sai tiền.
- Trả nhầm tiền.
- Khó kiểm tra lại giao dịch.

## 3.3. Khó xác định chính xác thời gian gửi xe

Nếu thời gian vào và thời gian ra không được ghi nhận tự động, việc tính phí có thể phụ thuộc vào thao tác của nhân viên.

Điều này gây khó khăn trong việc đảm bảo tính chính xác của phí gửi xe.

## 3.4. Dễ xảy ra ùn tắc tại cổng ra

Vào giờ cao điểm, nhiều người cùng lấy xe có thể khiến:

- Hàng xe chờ thanh toán.
- Nhân viên phải xử lý nhiều giao dịch liên tục.
- Thời gian thanh toán tăng.
- Khó kiểm soát lượng xe đang chờ ra.

## 3.5. Khó xử lý trường hợp mất thẻ

Khi khách hàng mất thẻ, hệ thống hiện tại cần có quy trình xác minh bổ sung.

Nếu không có dữ liệu điện tử đầy đủ, việc xác minh có thể mất nhiều thời gian và tiềm ẩn rủi ro.

---

# 4. Vấn đề về quản lý dữ liệu

## 4.1. Thiếu dữ liệu tập trung

Thông tin về xe, người gửi, thẻ và giao dịch chưa được thể hiện là được lưu trữ tập trung trên một hệ thống.

Điều này gây khó khăn cho việc quản lý và tra cứu.

## 4.2. Khó tra cứu lịch sử

Khi cần kiểm tra:

- Xe đã vào lúc nào.
- Xe đã ra lúc nào.
- Ai gửi xe.
- Loại vé nào.
- Đã thanh toán bao nhiêu.
- Một ngày có bao nhiêu lượt gửi.

nhân viên có thể phải kiểm tra thủ công.

## 4.3. Khó đối soát dữ liệu

Cuối ngày hoặc cuối ca, việc đối chiếu giữa:

- Số lượt xe.
- Số vé đã sử dụng.
- Số tiền thu được.
- Số xe đang gửi.

có thể mất nhiều thời gian nếu không có hệ thống tự động.

---

# 5. Vấn đề về quản lý loại khách hàng và loại vé

Hệ thống cần phân biệt rõ các nhóm gửi xe, ví dụ:

- **Thẻ kỳ**.
- **VS**.
- **Vãng lai**.

Nếu quản lý thủ công, có thể xảy ra:

- Nhầm loại vé.
- Tính sai mức phí.
- Khó theo dõi thời hạn thẻ kỳ.
- Khó thống kê số lượng từng loại khách hàng.
- Khó quản lý doanh thu theo từng loại vé.

---

# 6. Vấn đề về giao dịch

## 6.1. Chưa có giao dịch thời gian thực

Quy trình hiện tại chưa thể hiện việc cập nhật giao dịch ngay khi:

- Xe vào.
- Xe nhận thẻ.
- Xe đỗ.
- Xe thanh toán.
- Xe ra khỏi bãi.

Do đó dữ liệu có thể không được cập nhật đồng bộ ngay lập tức.

## 6.2. Khó theo dõi giao dịch đang diễn ra

Nhân viên quản lý khó biết chính xác tại một thời điểm:

- Có bao nhiêu xe đang vào.
- Có bao nhiêu xe đang ra.
- Có bao nhiêu giao dịch đang chờ xử lý.
- Có giao dịch nào bất thường.

## 6.3. Khó phát hiện giao dịch bất thường

Ví dụ:

- Thẻ không hợp lệ.
- Thẻ đã hết hạn.
- Thẻ đã được sử dụng nhưng tiếp tục xuất hiện.
- Thông tin xe không khớp.
- Giao dịch thanh toán không đúng.

---

# 7. Vấn đề về bảo mật và an toàn

## 7.1. Khó kiểm soát quyền truy cập

Nếu không có hệ thống tài khoản và phân quyền, khó kiểm soát:

- Ai được quản lý vé.
- Ai được thu tiền.
- Ai được xem doanh thu.
- Ai được sửa thông tin.
- Ai được xem lịch sử giao dịch.

## 7.2. Khó truy vết thao tác

Khi xảy ra sai sót, cần xác định:

- Ai thực hiện giao dịch.
- Thời gian thực hiện.
- Nội dung thay đổi.
- Giao dịch nào bị thay đổi.

Quy trình thủ công gây khó khăn cho việc truy vết.

---

# 8. Vấn đề về báo cáo và thống kê

Hệ thống hiện tại chưa thể hiện chức năng báo cáo tự động.

Do đó khó thống kê:

- Tổng số lượt gửi xe trong ngày.
- Tổng số xe đang trong bãi.
- Tổng số xe đã ra.
- Doanh thu theo ngày.
- Doanh thu theo tháng.
- Số lượng thẻ kỳ.
- Số lượng khách vãng lai.
- Số lượt xe theo từng loại.
- Các giao dịch bất thường.

Việc lập báo cáo thủ công sẽ tốn thời gian và dễ xảy ra sai sót.

---

# 9. Vấn đề đối với nhân viên

Nhân viên phải thực hiện nhiều công việc thủ công:

- Nhận xe.
- Phát thẻ.
- Kiểm tra thẻ.
- Thu tiền.
- Xác minh xe.
- Xử lý mất thẻ.
- Theo dõi số xe.
- Đối soát tiền.
- Thống kê giao dịch.

Khi lượng xe tăng cao, áp lực xử lý của nhân viên cũng tăng theo.

---

# 10. Vấn đề đối với người gửi xe

Người gửi xe có thể gặp các vấn đề:

- Phải chờ lâu khi gửi xe.
- Phải chờ lâu khi lấy xe.
- Dễ xảy ra ùn tắc vào giờ cao điểm.
- Khó xử lý khi mất thẻ.
- Có thể xảy ra sai sót khi tính phí.
- Không có thông tin rõ ràng về trạng thái giao dịch.
- Không có phương thức tra cứu lịch sử gửi xe thuận tiện.

---

# 11. Vấn đề đối với người quản lý

Người quản lý khó nắm bắt tình trạng hoạt động của bãi xe theo thời gian thực.

Các thông tin cần thiết nhưng khó theo dõi gồm:

- Số xe hiện đang trong bãi.
- Số chỗ còn trống.
- Doanh thu hiện tại.
- Số lượt xe vào/ra.
- Tình trạng từng khu vực.
- Giao dịch bất thường.
- Hiệu suất hoạt động của nhân viên.

---

# 12. Các vấn đề tổng hợp

| STT | Vấn đề | Nguyên nhân | Hậu quả |
|---|---|---|---|
| 1 | Quản lý thủ công | Phụ thuộc vào nhân viên | Chậm, dễ sai |
| 2 | Quản lý thẻ hạn chế | Dựa nhiều vào thẻ vật lý | Mất thẻ, nhầm thẻ |
| 3 | Thiếu dữ liệu thời gian thực | Chưa cập nhật tự động | Khó kiểm soát bãi |
| 4 | Tính phí thủ công | Nhân viên tự tính và thu tiền | Dễ sai doanh thu |
| 5 | Khó xác minh xe | Thiếu dữ liệu xe đầy đủ | Tăng rủi ro mất xe |
| 6 | Ùn tắc cổng vào | Xử lý từng xe thủ công | Tăng thời gian chờ |
| 7 | Ùn tắc cổng ra | Thanh toán thủ công | Giảm tốc độ xử lý |
| 8 | Khó tra cứu | Dữ liệu chưa tập trung | Mất thời gian |
| 9 | Khó đối soát | Thiếu dữ liệu giao dịch tự động | Sai lệch doanh thu |
| 10 | Khó thống kê | Báo cáo thủ công | Tốn thời gian |
| 11 | Khó quản lý thẻ kỳ | Chưa quản lý thời hạn tự động | Dễ tính sai phí |
| 12 | Khó phân loại khách hàng | Quản lý thủ công | Nhầm loại vé |
| 13 | Thiếu kiểm soát quyền | Chưa có phân quyền rõ ràng | Rủi ro bảo mật |
| 14 | Khó truy vết | Không có nhật ký thao tác đầy đủ | Khó xử lý sự cố |
| 15 | Khó phát hiện bất thường | Thiếu cảnh báo tự động | Tăng rủi ro |
| 16 | Thiếu báo cáo | Không có hệ thống thống kê | Khó ra quyết định |
| 17 | Khó mở rộng | Quy trình phụ thuộc con người | Khó đáp ứng khi lượng xe tăng |

---

# 13. Các nguyên nhân cốt lõi

Có thể quy các vấn đề hiện tại về các nguyên nhân chính:

### 13.1. Phụ thuộc vào con người

Nhiều bước trong quy trình phải được thực hiện thủ công bởi nhân viên.

### 13.2. Thiếu tự động hóa

Chưa có cơ chế tự động ghi nhận, kiểm tra và cập nhật dữ liệu.

### 13.3. Dữ liệu chưa được quản lý tập trung

Thông tin về xe, thẻ, giao dịch và thanh toán chưa được kết nối thành một hệ thống thống nhất.

### 13.4. Thiếu giao dịch thời gian thực

Thông tin xe vào/ra và thanh toán chưa được cập nhật đồng bộ ngay lập tức.

### 13.5. Thiếu khả năng kiểm soát và giám sát

Người quản lý chưa có cái nhìn tổng thể về hoạt động của bãi xe.

---

# 14. Hậu quả của hệ thống hiện tại

Nếu tiếp tục sử dụng quy trình hiện tại khi số lượng xe tăng, có thể dẫn đến:

- Thời gian gửi xe tăng.
- Thời gian lấy xe tăng.
- Ùn tắc tại cổng.
- Sai sót trong thu phí.
- Khó kiểm soát xe.
- Khó xử lý mất thẻ.
- Khó quản lý thẻ kỳ.
- Khó phân biệt khách vãng lai và các loại khách khác.
- Khó kiểm soát doanh thu.
- Khó truy xuất lịch sử giao dịch.
- Khó phát hiện giao dịch bất thường.
- Tăng khối lượng công việc cho nhân viên.
- Khó mở rộng quy mô bãi xe.

---

# 15. Định hướng giải quyết

Từ các vấn đề trên, hệ thống mới nên tập trung vào các hướng sau:

## 15.1. Quản lý giao dịch thời gian thực

Mọi giao dịch cần được cập nhật ngay khi phát sinh:

**Xe vào → Ghi nhận giao dịch → Xe đỗ → Xe lấy → Thanh toán → Xe ra**

## 15.2. Quản lý các loại khách hàng/vé

Hệ thống cần hỗ trợ rõ ràng:

- **Thẻ kỳ**.
- **VS**.
- **Vãng lai**.

Mỗi loại có quy tắc quản lý và tính phí phù hợp.

## 15.3. Quản lý thông tin xe

Lưu trữ:

- Biển số.
- Loại xe.
- Thời gian vào.
- Thời gian ra.
- Loại vé.
- Trạng thái xe.
- Lịch sử giao dịch.

## 15.4. Tự động tính phí

Hệ thống tự động xác định:

**Thời gian gửi + loại vé + quy định phí → Số tiền phải thanh toán**

Giúp giảm sai sót khi thu tiền.

## 15.5. Theo dõi trạng thái bãi xe

Hiển thị theo thời gian thực:

- Tổng số chỗ.
- Số chỗ đã sử dụng.
- Số chỗ còn trống.
- Số xe đang trong bãi.
- Số xe đang vào/ra.

## 15.6. Báo cáo và thống kê

Hệ thống cần cung cấp báo cáo:

- Doanh thu.
- Lượt xe.
- Xe đang gửi.
- Xe đã ra.
- Thống kê thẻ kỳ.
- Thống kê VS.
- Thống kê vãng lai.
- Lịch sử giao dịch.
- Giao dịch bất thường.

---

# 16. Kết luận

Hệ thống giữ xe hiện tại có hạn chế lớn nhất là **phụ thuộc nhiều vào thao tác thủ công, thiếu dữ liệu tập trung và chưa hỗ trợ quản lý giao dịch theo thời gian thực**.

Các vấn đề chính có thể tóm tắt:

> **Quy trình thủ công → xử lý chậm → dễ sai sót → khó kiểm soát → khó thống kê → khó mở rộng.**

Vì vậy, hệ thống mới nên hướng tới một mô hình **quản lý bãi xe tập trung và thời gian thực**, trong đó trọng tâm là **quản lý xe vào/ra, giao dịch thời gian thực, thẻ kỳ, VS, vãng lai, thanh toán, kiểm soát và báo cáo**.
