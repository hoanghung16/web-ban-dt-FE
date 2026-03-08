# THE KING Store - Frontend (React + Vite + TailwindCSS)

Đây là giao diện Frontend phong cách Dark Mode độc quyền của thương hiệu THE KING Store.
Dự án kết nối trực tiếp với Laravel Backend thông qua Axios.

## Cấu trúc Routing (React Router v6)
- `/` : **HomePage** - Landing page giới thiệu hệ thống với thành phần Hero sáng tạo và Bento Grid nổi bật.
- `/users` : **UsersPage** - Bảng dữ liệu quản trị tĩnh (Admin UI), hiển thị chi tiết danh sách người dùng được lấy từ Backend thông qua API `/api/users`. Tích hợp đầy đủ các form Thêm, Sửa, Xóa.
- `/users/:id` : **UserDetailPage** - Trang thông tin chi tiết một người dùng cụ thể. Lấy dữ liệu từ API `/api/users/{id}`.

## Cấu hình API Endpoint
Cấu hình tại file `src/services/api.js`. Điểm chốt `baseURL` đang trỏ đến Backend production trên nền tảng Render: `https://web-ban-dt-be.onrender.com`.

## Cài đặt & Chạy cục bộ
1. Cài đặt các thư viện:
   ```bash
   npm install
   ```
2. Khởi động môi trường Dev:
   ```bash
   npm run dev
   ```

## Deploy trên Render (Static Site)
- Build command: `npm run build`
- Publish directory: `dist`
- Chú ý phần thiết lập **Rewrite / Redirect Rules** trên Render:
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`
  *(Biện pháp này để tránh lỗi React Router trả về 404 khi truy cập một link con bất kỳ trên trình duyệt.)*
