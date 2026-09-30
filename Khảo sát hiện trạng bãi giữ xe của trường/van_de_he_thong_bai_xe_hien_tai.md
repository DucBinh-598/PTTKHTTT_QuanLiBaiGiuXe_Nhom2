# Vấn đề của hệ thống giữ xe hiện tại

## 1. Quy trình hiện tại

**Tới bãi giữ xe → Vào trạm → Nhận thẻ giữ xe → Tới chỗ để xe**

## 2. Các vấn đề của hệ thống

### 2.1. Quy trình còn thủ công

-   Người gửi xe phải **tới trạm** và thực hiện các thao tác trực tiếp.
-   Nhân viên phải **phát thẻ và quản lý thẻ** bằng thủ công.
-   Dễ xảy ra chậm trễ khi lượng xe đông.

### 2.2. Chưa có giao dịch thời gian thực

Hệ thống chưa thể hiện việc ghi nhận ngay:

-   Xe vào bãi.
-   Thời gian vào.
-   Vị trí gửi xe.
-   Loại vé/thẻ.
-   Trạng thái bãi xe.

Người quản lý khó biết **bãi còn bao nhiêu chỗ trống tại thời điểm hiện
tại**.

### 2.3. Khó kiểm soát xe và thẻ

-   Quy trình chỉ ghi nhận **"Nhận thẻ giữ xe"**, chưa có bước xác thực
    người/xe.
-   Nếu thẻ bị mất hoặc bị trao nhầm, việc xác định xe có thể gặp khó
    khăn.
-   Chưa thể hiện việc đối chiếu **thẻ ↔ phương tiện ↔ người gửi**.

### 2.4. Chưa phân loại đối tượng gửi xe

Quy trình hiện tại chưa thể hiện các loại:

-   **Thẻ kỳ**
-   **VS**
-   **Vãng lai**

Mỗi loại có thể có cách tính phí, thời hạn và quy trình xử lý khác nhau.

### 2.5. Chưa quản lý vị trí đỗ xe

Sau bước **"Tới chỗ để xe"**, hệ thống không biết:

-   Xe đang ở khu vực nào.
-   Vị trí nào còn trống.
-   Xe nào đang chiếm vị trí nào.
-   Khi lấy xe có thể tìm xe nhanh hay không.

### 2.6. Chưa có bước xử lý khi xe ra

Đây là vấn đề lớn của sơ đồ hiện tại.

Quy trình mới chỉ mô tả **xe vào**, chưa có:

> **Tới lấy xe → Xác thực thẻ/xe → Tính phí → Thanh toán → Trả xe → Cập
> nhật chỗ trống**

Do đó chưa hình thành được **quy trình gửi xe hoàn chỉnh từ lúc vào đến
lúc ra**.

### 2.7. Khó thống kê và quản lý

Chưa thể hiện hệ thống lưu trữ:

-   Lịch sử giao dịch.
-   Số xe vào/ra.
-   Doanh thu.
-   Xe đang gửi.
-   Thẻ đang hoạt động.
-   Lịch sử mất/hủy thẻ.

## 3. Tổng hợp vấn đề

  -----------------------------------------------------------------------
  Vấn đề                              Hệ quả
  ----------------------------------- -----------------------------------
  Quy trình thủ công                  Mất thời gian, dễ sai

  Không có giao dịch thời gian thực   Không biết trạng thái bãi hiện tại

  Quản lý thẻ thủ công                Dễ mất/nhầm thẻ

  Không xác thực xe rõ ràng           Khó kiểm soát xe

  Chưa phân loại thẻ kỳ/VS/vãng lai   Khó áp dụng chính sách riêng

  Không quản lý vị trí                Khó tìm và điều phối xe

  Chưa có quy trình xe ra             Không hoàn thiện giao dịch

  Thiếu lịch sử giao dịch             Khó thống kê, kiểm tra
  -----------------------------------------------------------------------

## 4. Định hướng hệ thống mới

Điểm nhấn của hệ thống mới là **"Giao dịch thời gian thực"**.

Khi xe vào/ra, hệ thống lập tức cập nhật:

-   **Thẻ**
-   **Phương tiện**
-   **Thời gian**
-   **Vị trí**
-   **Trạng thái chỗ**
-   **Giao dịch**

Đồng thời hệ thống xử lý riêng các nhóm:

-   **Thẻ kỳ**
-   **VS**
-   **Vãng lai**

Mục tiêu là xây dựng quy trình quản lý bãi xe đầy đủ từ **xe vào → gửi
xe → xe ra → thanh toán → cập nhật trạng thái bãi**.
