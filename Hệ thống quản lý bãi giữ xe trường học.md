**Hệ thống quản lý bãi giữ xe trường học**

**1\. Tác nhân (Actor)**

| **STT** | **Tác nhân**     | **Vai trò**                  |
| ------- | ---------------- | ---------------------------- |
| 1       | Sinh viên        | Gửi xe, nhận xe              |
| 2       | Giảng viên       | Gửi xe, nhận xe              |
| 3       | Nhân viên giữ xe | Kiểm tra, ghi nhận xe vào/ra |
| 4       | Quản trị viên    | Quản lý toàn bộ hệ thống     |

**2\. Dữ liệu cần quản lý**

| **Đối tượng**  | **Thông tin**                          |
| -------------- | -------------------------------------- |
| Người gửi xe   | Mã người dùng, họ tên, loại người dùng |
| Xe             | Biển số, loại xe, màu xe               |
| Vé xe          | Mã vé, thời gian gửi                   |
| Khu vực giữ xe | Mã khu vực, tên khu vực, sức chứa      |
| Phiếu gửi xe   | Thời gian vào, thời gian ra            |
| Nhân viên      | Mã NV, họ tên, ca trực                 |

**3\. Chức năng hệ thống**

**Đối với nhân viên giữ xe**

- Tiếp nhận xe
- Cấp vé xe
- Kiểm tra vé
- Cho xe ra
- Ghi nhận thời gian ra vào

**Đối với quản trị viên**

- Quản lý sinh viên
- Quản lý giảng viên
- Quản lý nhân viên
- Quản lý khu vực giữ xe
- Xem thống kê
- Báo cáo doanh thu (nếu có thu phí)

**Bảng hệ thống hoàn chỉnh**

| **Mã chức năng** | **Tên chức năng**      | **Người thực hiện** | **Mô tả**              |
| ---------------- | ---------------------- | ------------------- | ---------------------- |
| CN01             | Đăng nhập              | Nhân viên, Admin    | Truy cập hệ thống      |
| CN02             | Quản lý sinh viên      | Admin               | Thêm, sửa, xóa         |
| CN03             | Quản lý giảng viên     | Admin               | Thêm, sửa, xóa         |
| CN04             | Quản lý nhân viên      | Admin               | Thêm, sửa, xóa         |
| CN05             | Quản lý xe             | Admin               | Quản lý thông tin xe   |
| CN06             | Quản lý bãi xe         | Admin               | Quản lý vị trí đỗ      |
| CN07             | Tiếp nhận xe           | Nhân viên           | Ghi nhận xe vào        |
| CN08             | Cấp vé xe              | Nhân viên           | In hoặc tạo vé         |
| CN09             | Nhận xe ra             | Nhân viên           | Kiểm tra vé            |
| CN10             | Tính phí giữ xe        | Nhân viên           | Tính tiền gửi xe       |
| CN11             | Thống kê xe            | Admin               | Xe trong bãi           |
| CN12             | Báo cáo doanh thu      | Admin               | Thống kê tiền gửi      |
| CN13             | Tra cứu lịch sử gửi xe | Admin               | Xem lịch sử xe         |
| CN14             | Đổi mật khẩu           | Tất cả              | Đổi mật khẩu đăng nhập |
| CN15             | Đăng xuất              | Tất cả              | Thoát hệ thống         |

**Sơ đồ phân cấp chức năng (BFD)**

```
HỆ THỐNG QUẢN LÝ BÃI GIỮ XE TRƯỜNG
├── 1. Quản lý người dùng
│   ├── Quản lý sinh viên
│   ├── Quản lý giảng viên
│   └── Quản lý nhân viên
│
├── 2. Quản lý xe
│   ├── Thêm xe
│   ├── Cập nhật xe
│   └── Xóa xe
│
├── 3. Quản lý gửi xe
│   ├── Tiếp nhận xe
│   ├── Cấp vé xe
│   ├── Trả xe
│   └── Tính phí
│
├── 4. Quản lý bãi xe
│   ├── Khu vực xe máy
│   ├── Khu vực ô tô
│   └── Kiểm tra chỗ trống
│
└── 5. Báo cáo - Thống kê
    ├── Thống kê lượt gửi xe
    ├── Thống kê xe hiện có
    └── Báo cáo doanh thu
```

**Các bảng cơ sở dữ liệu đề xuất**

**Bảng NGUOIDUNG**

| **Thuộc tính** |
| -------------- |
| MaND (PK)      |
| HoTen          |
| LoaiND         |
| SDT            |

**Bảng XE**

| **Thuộc tính** |
| -------------- |
| BienSo (PK)    |
| LoaiXe         |
| MauXe          |
| MaND (FK)      |

**Bảng NHANVIEN**

| **Thuộc tính** |
| -------------- |
| MaNV (PK)      |
| HoTen          |
| SDT            |
| CaTruc         |

**Bảng BAIXE**

| **Thuộc tính** |
| -------------- |
| MaBai (PK)     |
| TenBai         |
| SucChua        |

**Bảng PHIEUGUIXE**

| **Thuộc tính** |
| -------------- |
| MaPhieu (PK)   |
| BienSo (FK)    |
| MaNV (FK)      |
| MaBai (FK)     |
| ThoiGianVao    |
| ThoiGianRa     |
| PhiGuiXe       |

Đây là bộ khung khá đầy đủ cho môn **Phân tích thiết kế hệ thống thông tin**, đủ để tiếp tục vẽ:

- Biểu đồ ngữ cảnh (Context Diagram)
- BFD (Biểu đồ phân rã chức năng)
- DFD mức 0, mức 1
- ERD (Mô hình thực thể liên kết)
- Use Case Diagram