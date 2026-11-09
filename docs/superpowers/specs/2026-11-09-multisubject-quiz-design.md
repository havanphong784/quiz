# Thiết kế: Quiz ôn tập đa môn

## Mục đích

Chuyển ứng dụng từ trang ôn CTDL&GT sang nền tảng quiz dùng được cho nhiều
môn học, đồng thời giữ nguyên cách chọn bộ đề, làm bài, xem kết quả và import
JSON hiện tại.

## Mục tiêu

- Tiêu đề, mô tả và nhãn dùng ngôn ngữ trung lập theo môn học.
- Màn chọn đề ưu tiên thẻ môn học/bộ đề dễ quét và dễ tiếp tục học.
- Giao diện phẳng, thoáng: nền sáng, xanh navy–teal dịu, giảm viền đậm,
  bóng đổ và hiệu ứng trang trí.
- Các bộ dữ liệu CTDL&GT hiện có vẫn hoạt động và được trình bày như các bộ đề
  của một môn học.

## Không làm

- Không thay đổi định dạng JSON, thuật toán chấm điểm hay lưu lịch sử.
- Không thêm hệ thống tài khoản, máy chủ hoặc thư viện mới.
- Không tạo dữ liệu câu hỏi cho môn học mới; giao diện chỉ sẵn sàng để import.

## Các hướng đã cân nhắc

1. Chỉ đổi tiêu đề và bảng màu: nhanh nhưng vẫn mang cấu trúc trang ôn CTDL.
2. Đổi màn chọn thành trải nghiệm đa môn với phần giới thiệu, thống kê học tập,
   danh sách bộ đề và cấu hình phiên học rõ ràng: **được chọn** vì phù hợp định
   vị mới mà không đụng vào logic quiz.

## Phạm vi triển khai

- Chỉnh `index.html` để dùng nội dung như “Quiz ôn tập”, “Môn học” và “Bộ đề”.
- Chỉnh `src/css/styles.css` thành hệ thống màu và bề mặt tối giản; dùng khoảng
  trắng, màu nền nhẹ và trạng thái tương phản thay cho border/bóng nặng.
- Bổ sung các chi tiết giao diện thuần HTML/CSS cần thiết để diễn đạt đa môn;
  `src/js/script.js` chỉ được đổi nếu nhãn tạo từ JavaScript còn ghi CTDL.

## Kiểm chứng

- Mở trang trong trình duyệt và kiểm tra màn chọn đề ở desktop lẫn mobile.
- Xác nhận chọn bộ đề CTDL, bắt đầu quiz, chuyển câu và import JSON vẫn hoạt động.
