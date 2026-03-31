# 🏗️ Frontend Project Structure Guide

## Thư mục chính

### `/src/components`
Chứa tất cả các component React.

#### `/admin` - Admin Panel Components
- Components chỉ dùng trong admin panel
- Ví dụ: `AdminLayout.jsx`, admin-specific widgets
- **Quy tắc**: Mỗi component có thể có folder riêng nếu có sub-components

#### `/public` - Public Page Components
- Components dùng trong public pages (Navbar, Hero, etc.)
- Không chứa logic admin

#### `/forms` - Reusable Form Components  
- `BaseForm.jsx` - Base form component (DRY)
- `CategoryForm.jsx`, `ProductForm.jsx`, `UserForm.jsx` - Reusable forms
- **Mục đích**: Tránh duplicate form logic giữa Create và Edit pages

**Cấu trúc form:**
```jsx
// Usage: AdminCategories.jsx (List) + Admin form pages dùng chung CategoryForm
<CategoryForm 
  mode="create|edit"  // Chế độ create hay edit
  initialData={null}  // Dữ liệu ban đầu (khi edit)
  onSuccess={refetch} // Callback sau submit
  onCancel={close}    // Callback cancel
/>
```

---

### `/src/pages`
Chứa các trang (Page Components).

#### `/admin` - Admin Pages
- `Dashboard.jsx` - Admin dashboard
- `Products.jsx` - Product list & management
- `Categories.jsx` - Category management
- `Orders.jsx` - Order management
- `Users.jsx` - User management
- `Inventory.jsx` - Stock management
- `Settings.jsx` - System settings

#### `/public` - Public Pages
- `Home.jsx` - Landing/home page
- `Products.jsx` - Product catalog
- `Cart.jsx` - Shopping cart
- `Login.jsx` - Login page
- `Users.jsx` - User directory
- `UserDetail.jsx` - User profile

---

### `/src/constants`
Tập trung các giá trị cố định (enums, colors, labels).

**Files:**
- `orderStatus.js` - Order status (pending, shipped, delivered, etc.)
- `userRole.js` - User roles (admin, customer)
- `index.js` - Export tất cả constants

**Sử dụng:**
```jsx
import { ORDER_STATUS, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../constants';

// Thay vì:
const status = 'pending';
const color = { bg: 'bg-yellow-100', text: 'text-yellow-700' };

// Dùng:
const status = ORDER_STATUS.PENDING;
const color = ORDER_STATUS_COLORS[status];
const label = ORDER_STATUS_LABELS[status];
```

---

### `/src/utils`
Các hàm tiện ích (helpers).

**Files:**
- `helpers.js` - Date, price, string formatting, validation
- `format.js` - Formatting functions
- `validation.js` - Validation functions

**Ví dụ:**
```jsx
import { formatPrice, formatDate, isValidEmail } from '../utils/helpers';

// Sử dụng
<span>{formatPrice(1500000)}</span> // Output: 1.500.000đ
<p>{formatDate(order.createdAt)}</p> // Output: 31/03/2026
```

---

### `/src/hooks`
Custom React hooks cho API và form operations.

**Hooks có sẵn:**
- `useAsync()` - Handle async operations
- `useFetch()` - Data fetching
- `useForm()` - Form state management
- `usePagination()` - Pagination logic
- `useMutation()` - POST/PUT/DELETE operations

**Ví dụ:**
```jsx
import { useFetch, useForm, useMutation } from '../hooks';

const { data: products, loading, refetch } = useFetch('/products');
const { values, handleChange, handleSubmit } = useForm(initialValues, onSubmit);
const { mutate, loading: submitting } = useMutation();
```

---

### `/src/services`
API service layer - tập trung các API calls.

**Files:**
- `api.js` - Axios client configuration
- `auth.js` - Auth API endpoints
- `product.js` - Product API endpoints
- `order.js` - Order API endpoints
- Etc.

**Structure:**
```jsx
// services/product.js
import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Usage in component
import { productService } from '../services';
const { data } = await productService.getAll();
```

---

### `/src/store`
Global state management (Zustand/Pinia/Redux).

**Files:**
- `useCartStore.js` - Cart state
- `useAuthStore.js` - Auth state

**Ví dụ:**
```jsx
import { useCartStore } from '../store';

const cart = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
```

---

### `/public/images`
Organized image directory.

```
public/images/
├── products/
│   ├── phones/
│   ├── accessories/
│   └── ...
├── icons/
├── backgrounds/
└── avatars/
```

Sử dụng:
```jsx
<img src="/images/products/phones/iphone13.jpg" alt="iPhone 13" />
```

---

## ✅ Best Practices

### 1. Component Organization
```jsx
// ✅ Good: Clear purpose, organized sub-components
components/
├── forms/
│   └── ProductForm.jsx
├── admin/
│   └── AdminLayout.jsx
└── public/
    └── Navbar.jsx
```

### 2. Constants Usage
```jsx
// ❌ Bad: Hardcoded values
<span className="bg-yellow-100 text-yellow-700">Chờ xử lý</span>

// ✅ Good: Use constants
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '../constants';
const color = ORDER_STATUS_COLORS[ORDER_STATUS.PENDING];
<span className={`${color.bg} ${color.text}`}>Chờ xử lý</span>
```

### 3. Reusable Forms
```jsx
// ❌ Bad: Duplicate form logic
AdminProductForm.jsx
AdminUserForm.jsx
AdminCategoryForm.jsx

// ✅ Good: Unified form component
components/forms/BaseForm.jsx
components/forms/ProductForm.jsx
// Sử dụng trong pages/admin/Products.jsx (create/edit modal)
```

### 4. API Service Layer
```jsx
// ❌ Bad: Direct API calls in components
const handleFetch = async () => {
  const { data } = await api.get('/products');
  setProducts(data);
};

// ✅ Good: Use service layer
import { productService } from '../services';
const { data } = await productService.getAll();
```

### 5. Utils for Common Operations
```jsx
// ❌ Bad: Repetitive formatting
{new Date(date).toLocaleDateString('vi-VN')}
{Number(price).toLocaleString('vi-VN') + 'đ'}

// ✅ Good: Use utils
import { formatDate, formatPrice } from '../utils/helpers';
{formatDate(date)}
{formatPrice(price)}
```

---

## 📋 Migration Steps

1. **Move components**
   ```bash
   # Admin components to components/admin/
   mv src/components/AdminLayout.jsx src/components/admin/
   
   # Public components to components/public/
   mv src/components/Navbar.jsx src/components/public/
   mv src/components/Hero.jsx src/components/public/
   ```

2. **Move pages**
   ```bash
   # Admin pages to pages/admin/
   mv src/pages/Admin*.jsx src/pages/admin/
   
   # Public pages to pages/public/
   mv src/pages/*Page.jsx src/pages/public/
   ```

3. **Update imports in Router** (`App.jsx`)
   ```jsx
   // From
   import AdminLayout from './components/AdminLayout';
   
   // To
   import AdminLayout from './components/admin/AdminLayout';
   ```

4. **Start using constants**
   ```jsx
   import { ORDER_STATUS, ORDER_STATUS_COLORS } from '../constants';
   ```

5. **Start using utils & hooks**
   ```jsx
   import { formatPrice } from '../utils/helpers';
   import { useFetch } from '../hooks';
   ```

---

## 🚀 Performance Tips

1. **Use `useFetch` hook instead of `useEffect` + `useState`**
2. **Memoize expensive components**: `React.memo()`
3. **Use `useCallback` for callbacks in hooks**
4. **Lazy load admin pages**: `React.lazy()`
5. **Split bundle**: Admin and public routes separate builds

---

## 📚 References

- See `ARCHITECTURE.md` for full project structure
- See individual service files for API documentation
- See `constants/` folder for available enums
