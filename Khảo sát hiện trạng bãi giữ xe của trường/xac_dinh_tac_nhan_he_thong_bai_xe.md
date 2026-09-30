# Xác định tác nhân của hệ thống quản lý bãi giữ xe

Dựa trên quy trình gửi xe và lấy xe hiện tại, hệ thống có 3 tác nhân chính:

1. Sinh viên
2. Bảo vệ
3. Quản trị viên

---

## 1. Tác nhân: Sinh viên

### Vai trò

Sinh viên là người trực tiếp sử dụng dịch vụ gửi và lấy xe tại bãi giữ xe của trường.

### Các hoạt động chính

- Đến bãi giữ xe.
- Đưa xe vào khu vực gửi xe.
- Thực hiện gửi xe tại trạm.
- Nhận thẻ giữ xe.
- Đưa xe đến vị trí đỗ.
- Bảo quản thẻ giữ xe trong thời gian gửi.
- Khi lấy xe, đến vị trí đỗ xe.
- Di chuyển xe đến trạm/điểm kiểm soát.
- Xuất trình thẻ giữ xe.
- Thanh toán tiền gửi xe đối với trường hợp có tính phí.
- Nhận xe và rời khỏi bãi xe.
- Sử dụng thẻ kỳ trong thời hạn được cấp.
- Tra cứu thông tin vé/thẻ và lịch sử gửi xe nếu hệ thống hỗ trợ.

### Chức năng tương tác với hệ thống

- Gửi xe.
- Nhận/đăng ký thẻ giữ xe.
- Lấy xe.
- Thanh toán phí gửi xe.
- Kiểm tra thông tin thẻ kỳ.
- Tra cứu lịch sử gửi xe.
- Xử lý trường hợp mất thẻ theo quy định.

---

## 2. Tác nhân: Bảo vệ

### Vai trò

Bảo vệ là người trực tiếp vận hành và kiểm soát hoạt động xe ra/vào bãi giữ xe.

Đây là tác nhân tương tác nhiều nhất với hệ thống trong quy trình thực tế.

### Khi sinh viên gửi xe

- Tiếp nhận xe.
- Xác định loại khách/loại vé:
  - Thẻ kỳ.
  - VS.
  - Vãng lai.
- Kiểm tra thông tin thẻ.
- Ghi nhận xe vào hệ thống.
- Cấp thẻ/vé giữ xe.
- Ghi nhận thời gian gửi.
- Xác định vị trí đỗ xe.
- Cập nhật trạng thái chỗ đỗ.
- Kiểm tra giao dịch gửi xe thành công.

### Khi sinh viên lấy xe

- Tiếp nhận yêu cầu lấy xe.
- Kiểm tra thẻ giữ xe.
- Kiểm tra thông tin xe.
- Đối chiếu dữ liệu gửi xe.
- Kiểm tra thời gian gửi.
- Tính phí gửi xe nếu có.
- Thu tiền.
- Xác nhận thanh toán.
- Cập nhật trạng thái xe đã rời bãi.
- Cập nhật chỗ đỗ thành trống.
- Hoàn tất giao dịch.
- Cho phép xe ra khỏi bãi.

### Các chức năng quản lý khác

- Kiểm tra xe đang có trong bãi.
- Tra cứu xe theo mã thẻ hoặc biển số.
- Xử lý mất thẻ.
- Xử lý trường hợp thông tin không khớp.
- Hủy/sửa giao dịch theo quyền được cấp.
- Theo dõi các giao dịch thời gian thực.
- Kiểm tra số lượng xe hiện tại trong bãi.
- Xem lịch sử gửi/lấy xe.
- Báo cáo sự cố cho quản trị viên.

---

## 3. Tác nhân: Quản trị viên

### Vai trò

Quản trị viên là người quản lý toàn bộ hệ thống, dữ liệu, người dùng, cấu hình và hoạt động của bãi xe.

Quản trị viên không nhất thiết trực tiếp thực hiện giao dịch gửi/lấy xe mà chủ yếu quản lý và giám sát hệ thống.

### Quản lý tài khoản

- Đăng nhập hệ thống.
- Tạo tài khoản bảo vệ.
- Cập nhật thông tin tài khoản.
- Phân quyền người dùng.
- Khóa/mở khóa tài khoản.
- Quản lý tài khoản sinh viên nếu hệ thống có chức năng này.

### Quản lý thẻ/vé

- Quản lý thẻ kỳ.
- Cấp thẻ kỳ.
- Gia hạn thẻ kỳ.
- Khóa thẻ.
- Hủy thẻ.
- Kiểm tra thời hạn thẻ.
- Quản lý loại vé VS.
- Quản lý vé vãng lai.
- Cấu hình loại vé và mức phí.

### Quản lý bãi xe

- Quản lý khu vực đỗ xe.
- Quản lý vị trí/chỗ đỗ.
- Theo dõi số lượng xe trong bãi.
- Theo dõi số chỗ còn trống.
- Theo dõi trạng thái bãi xe.
- Cấu hình sức chứa bãi xe.

### Quản lý giao dịch

- Xem giao dịch gửi xe.
- Xem giao dịch lấy xe.
- Xem giao dịch thanh toán.
- Tra cứu giao dịch theo:
  - Mã thẻ.
  - Biển số xe.
  - Thời gian.
  - Loại vé.
  - Nhân viên thực hiện.
- Kiểm tra giao dịch bất thường.
- Theo dõi giao dịch thời gian thực.

### Báo cáo và thống kê

- Thống kê số lượng xe gửi.
- Thống kê xe đang trong bãi.
- Thống kê xe đã ra.
- Thống kê doanh thu.
- Thống kê theo ngày/tháng/năm.
- Thống kê theo loại vé:
  - Thẻ kỳ.
  - VS.
  - Vãng lai.
- Xuất báo cáo.

---

# Bảng tổng hợp tác nhân

| Tác nhân | Vai trò | Chức năng chính |
|---|---|---|
| **Sinh viên** | Người gửi xe | Gửi xe, nhận thẻ, lấy xe, thanh toán, tra cứu thông tin |
| **Bảo vệ** | Người vận hành bãi xe | Tiếp nhận xe, cấp vé, kiểm tra thẻ, ghi nhận xe vào/ra, thu phí, quản lý chỗ đỗ |
| **Quản trị viên** | Người quản lý hệ thống | Quản lý tài khoản, thẻ/vé, bãi xe, phí, giao dịch, báo cáo và phân quyền |

---

# Quan hệ giữa các tác nhân và hệ thống

```text
                    HỆ THỐNG QUẢN LÝ BÃI XE
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
      SINH VIÊN            BẢO VỆ          QUẢN TRỊ VIÊN
          |                   |                   |
          |                   |                   |
     +----+----+       +------+-------+      +----+--------+
     |         |       |              |      |             |
   Gửi xe    Lấy xe   Xe vào        Xe ra   Quản lý      Báo cáo
     |         |       |              |      hệ thống
     |         |       |              |
     +---------+-------+--------------+
                       |
                       v
              Giao dịch thời gian thực
```

---

# Phân quyền đề xuất

| Chức năng | Sinh viên | Bảo vệ | Quản trị viên |
|---|:---:|:---:|:---:|
| Gửi xe | ✓ | ✓ | ✓ |
| Lấy xe | ✓ | ✓ | ✓ |
| Nhận thẻ/vé | ✓ | ✓ | ✓ |
| Kiểm tra thẻ |  | ✓ | ✓ |
| Ghi nhận xe vào |  | ✓ | ✓ |
| Ghi nhận xe ra |  | ✓ | ✓ |
| Thu phí |  | ✓ | ✓ |
| Quản lý thẻ kỳ |  | ✓ | ✓ |
| Quản lý VS/vãng lai |  | ✓ | ✓ |
| Theo dõi xe trong bãi |  | ✓ | ✓ |
| Theo dõi giao dịch thời gian thực |  | ✓ | ✓ |
| Quản lý tài khoản |  |  | ✓ |
| Phân quyền |  |  | ✓ |
| Quản lý mức phí |  |  | ✓ |
| Quản lý khu vực/chỗ đỗ |  |  | ✓ |
| Báo cáo thống kê |  | Có thể xem | ✓ |
| Cấu hình hệ thống |  |  | ✓ |

---

# Kết luận

Hệ thống quản lý bãi giữ xe có 3 tác nhân chính:

1. **Sinh viên**: sử dụng dịch vụ gửi và lấy xe.
2. **Bảo vệ**: trực tiếp vận hành các giao dịch xe vào/ra, kiểm tra thẻ và thu phí.
3. **Quản trị viên**: quản lý dữ liệu, người dùng, thẻ/vé, bãi xe, giao dịch và báo cáo.

Trong đó:

- **Bảo vệ** là tác nhân trung tâm của quy trình giao dịch.
- **Sinh viên** là tác nhân sử dụng dịch vụ.
- **Quản trị viên** là tác nhân quản lý và giám sát hệ thống.
- **Giao dịch thời gian thực** là điểm quan trọng giúp bảo vệ và quản trị viên theo dõi trạng thái xe vào/ra, chỗ đỗ và các giao dịch ngay khi phát sinh.
