# About Page Components

Thư mục này chứa các components khác nhau cho trang "Về Chúng Tôi" (About Us).

## Cấu Trúc

```
components/about/
├── index.js              # Export centralized
├── AboutHero.jsx         # Hero section - Giới thiệu chính
├── MissionValues.jsx     # Phần Sứ mệnh, Tầm nhìn, Giá trị
├── Stats.jsx             # Phần thống kê công ty
├── Team.jsx              # Phần giới thiệu đội ngũ
└── README.md             # File này
```

## Các Components

### AboutHero.jsx
- **Mục đích**: Hero section của trang About
- **Nội dung**: Tiêu đề, mô tả ngắn, CTA buttons
- **Props**: Không có props
- **Animations**: Fade-in, stagger effects
- **Design Tokens**: Sử dụng color từ theme

### MissionValues.jsx
- **Mục đích**: Hiển thị sứ mệnh, tầm nhìn, giá trị cốt lõi
- **Nội dung**: 4 giá trị chính (Sứ Mệnh, Tầm Nhìn, Sáng Tạo, Uy Tín)
- **Props**: Không có props
- **Animations**: Card hover effects, icon animations
- **Design Tokens**: Gradients, colors

### Stats.jsx
- **Mục đích**: Hiển thị thống kê công ty
- **Nội dung**: 4 KPIs (Năm hoạt động, Khách hàng, Sản phẩm bán, Thương hiệu)
- **Props**: Không có props
- **Animations**: Counter animation, element float
- **Features**: Số đếm animated, gradient background

### Team.jsx
- **Mục đích**: Giới thiệu đội ngũ
- **Nội dung**: 4 thành viên team với vai trò
- **Props**: Không có props
- **Animations**: Hover effects, social icons
- **Interactive**: Hover để thấy social links

## Cách Sử Dụng

### Import Riêng Lẻ
```jsx
import AboutHero from '../components/about/AboutHero';
import MissionValues from '../components/about/MissionValues';
```

### Import Từ Index
```jsx
import { AboutHero, MissionValues, Stats, Team } from '../components/about';
```

### Sử Dụng Trong Page
```jsx
import AboutPage from '../pages/AboutPage';

// Trong App.jsx routing
<Route path="/about" element={<AboutPage />} />
```

## Design System

Tất cả components sử dụng:
- **Design Tokens** từ `tailwind.config.js`: `primary`, `secondary`, `background`, v.v.
- **Framer Motion** để animations
- **Lucide React** cho icons
- **Responsive Design**: Mobile-first approach

## Quản Lý Vấn Đề

Cấu trúc này cho phép:
1. **Dễ bảo trì**: Mỗi component độc lập với logic riêng
2. **Dễ mở rộng**: Thêm components mới mà không ảnh hưởng hiện tại
3. **Reusable**: Components có thể tái sử dụng ở nơi khác
4. **Testable**: Từng component có thể test riêng

## Chỉnh Sửa Content

### Để cập nhật Mission Values:
Chỉnh sửa mảng `values` trong `MissionValues.jsx`

### Để cập nhật Stats:
Chỉnh sửa mảng `stats` trong `Stats.jsx`

### Để cập nhật Team:
Chỉnh sửa mảng `team` trong `Team.jsx`

## Styling

- Sử dụng Tailwind CSS
- Design tokens từ theme
- Animations với Framer Motion
- Responsive: `sm:` → `md:` → `lg:`

## Dependencies

- `react`: UI library
- `framer-motion`: Animations
- `lucide-react`: Icons
- `react-router-dom`: Routing
- `tailwindcss`: Styling

## Lưu Ý

- Tất cả text là tiếng Việt
- Icons có thể thay đổi từ Material Icons hoặc Lucide React
- Colors tuân theo design system nhất quán
