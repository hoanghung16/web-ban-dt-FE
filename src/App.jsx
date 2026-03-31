import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryForm from './pages/admin/AdminCategoryForm';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserForm from './pages/admin/AdminUserForm';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import { useAuthStore } from './store/useAuthStore';

function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-on-background relative">
      <div className="fixed inset-0 bg-background -z-20"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(133,173,255,0.08)_0%,_rgba(0,0,0,0)_50%)] -z-10 pointer-events-none"></div>
      <Navbar />
      <main className="relative z-0 pt-20">
        <Outlet />
      </main>
      <footer className="bg-[#000000] w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-screen-2xl mx-auto font-body text-sm">
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-primary mb-4">THE KING</div>
            <p className="text-on-surface-variant leading-relaxed mb-6">Trải nghiệm mua sắm công nghệ đẳng cấp Hoàng gia. Cam kết chính hãng và dịch vụ hậu mãi số 1.</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary transition-colors">social_leaderboard</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary transition-colors">phone_iphone</span>
            </div>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-6">Dịch vụ</h4>
            <ul className="space-y-4">
              <li className="text-on-surface-variant hover:text-on-surface transition-transform duration-200 hover:translate-x-1 cursor-pointer">Chính sách bảo hành</li>
              <li className="text-on-surface-variant hover:text-on-surface transition-transform duration-200 hover:translate-x-1 cursor-pointer">Trả góp 0%</li>
              <li className="text-on-surface-variant hover:text-on-surface transition-transform duration-200 hover:translate-x-1 cursor-pointer">Giao hàng tận nơi</li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-6">Hệ thống</h4>
            <ul className="space-y-4">
              <li className="text-on-surface-variant hover:text-on-surface transition-transform duration-200 hover:translate-x-1 cursor-pointer">Hệ thống cửa hàng</li>
              <li className="text-on-surface-variant hover:text-on-surface transition-transform duration-200 hover:translate-x-1 cursor-pointer">Tuyển dụng</li>
              <li className="text-on-surface-variant hover:text-on-surface transition-transform duration-200 hover:translate-x-1 cursor-pointer">Liên hệ</li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-6">Đăng ký nhận tin</h4>
            <div className="flex gap-2">
              <input className="bg-surface-container-low border-white/5 rounded-lg text-white text-sm focus:ring-primary focus:border-primary w-full" placeholder="Email của bạn" type="email"/>
              <button className="bg-primary text-on-primary-fixed p-2 rounded-lg hover:bg-primary/80 transition-colors">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <p className="mt-8 text-on-surface-variant text-xs uppercase tracking-widest">© 2026 THE KING Premium Smartphone Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toast />
    </div>
  );
}

function App() {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    // Kiểm tra auth khi app khởi động
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<div className="text-center py-20 text-zinc-500 font-bold">404 - TRANG KHÔNG TỒN TẠI</div>} />
          </Route>

          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="categories/new" element={<AdminCategoryForm />} />
              <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/new" element={<AdminUserForm />} />
              <Route path="users/edit/:id" element={<AdminUserForm />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
