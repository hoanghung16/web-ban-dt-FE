import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

const MotionNav = motion.nav;
const MotionDiv = motion.div;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const { user, isAuthenticated, logout } = useAuthStore();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        const categoriesData = Array.isArray(response) ? response : (response.data || []);
        const formattedCategories = categoriesData.map(cat => ({
          name: cat.name,
          path: `/products?category=${cat.slug || cat.id}`
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Lỗi fetch categories:', error);
        // Fallback to default categories
        setCategories([
          { name: 'iPhone', path: '/products?category=iphone' },
          { name: 'Samsung', path: '/products?category=samsung' },
          { name: 'Phụ Kiện', path: '/products?category=phụ kiện' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <MotionNav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto font-headline tracking-tight gap-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-white uppercase flex-shrink-0">
          THE KING
        </Link>

        {/* Desktop Layout: Danh mục Dropdown | Search | Cart | Login */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {/* About Link */}
          <Link to="/about" className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-on-surface hover:text-white font-medium text-sm">
            Về Chúng Tôi
          </Link>

          {/* Categories Dropdown */}
          <div className="relative group flex-shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-on-surface hover:text-white">
              <span className="material-symbols-outlined text-lg">category</span>
              <span className="font-medium text-sm">Danh mục</span>
            </button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 mt-2 w-48 bg-surface-container rounded-xl border border-outline-variant/20 shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all"
              >
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      className="block px-4 py-2 text-on-surface hover:text-white hover:bg-surface-container-highest transition-colors text-sm"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <input 
              type="text" 
              placeholder="Bạn muốn mua gì hôm nay?" 
              className="w-full bg-surface-container-lowest border-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg cursor-pointer hover:text-white">search</span>
          </div>
        </div>

        {/* Icons Group */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Cart */}
          <Link to="/cart" className="p-2 hover:bg-white/5 rounded-lg transition-all duration-300 active:scale-95 text-blue-400 relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Login / User Account */}
          {isAuthenticated ? (
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-blue-400">account_circle</span>
                <span className="text-sm font-medium text-on-surface">{user?.fullname || user?.name || 'Tài khoản'}</span>
              </button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                <MotionDiv
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-surface-container rounded-xl border border-outline-variant/20 shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50"
                >
                  <div className="p-4 space-y-3">
                    <div className="pb-3 border-b border-outline-variant/20">
                      <p className="text-sm text-on-surface-variant mb-1">Xin chào</p>
                      <p className="text-sm font-semibold text-on-surface">{user?.fullname || user?.name || 'Người dùng'}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{user?.email}</p>
                    </div>

                  {/* Profile */}
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface font-medium text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    Hồ sơ cá nhân
                  </Link>

                  {/* Order Tracking */}
                  <Link 
                    to="/orders" 
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface font-medium text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    Đơn hàng của tôi
                  </Link>

                  {/* Admin Dashboard */}
                  {user?.role && (user?.role.toLowerCase() === 'admin' || user?.role.toLowerCase() === 'administrator') && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">dashboard</span>
                      Quản lý cửa hàng
                    </Link>
                  )}

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-error/10 text-error rounded-lg text-sm font-medium hover:bg-error/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                </MotionDiv>
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors font-medium text-sm">
              <span className="material-symbols-outlined text-lg">login</span>
              Đăng nhập
            </Link>
          )}

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-outline-variant/20"
          >
            <div className="px-6 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="Bạn muốn mua gì hôm nay?" 
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2 border-t border-outline-variant/20 pt-4">
                <p className="text-sm font-medium text-on-surface-variant px-3">Danh mục</p>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-on-surface hover:text-white hover:bg-surface-container rounded-lg transition-colors"
                >
                  Về Chúng Tôi
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-on-surface hover:text-white hover:bg-surface-container rounded-lg transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Login / Account */}
              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <span className="material-symbols-outlined">login</span>
                  Đăng nhập
                </Link>
              )}

              {isAuthenticated && (
                <div className="border-t border-outline-variant/20 pt-4 space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-xs text-on-surface-variant">Đăng nhập với</p>
                    <p className="text-sm font-semibold text-on-surface">{user?.fullname || user?.name}</p>
                  </div>

                  {/* Profile */}
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface font-medium text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined">person</span>
                    Hồ sơ cá nhân
                  </Link>
                  
                  {/* Order Tracking */}
                  <Link 
                    to="/orders" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface font-medium text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined">local_shipping</span>
                    Đơn hàng của tôi
                  </Link>
                  
                  {/* Admin Dashboard */}
                  {user?.role && (user?.role.toLowerCase() === 'admin' || user?.role.toLowerCase() === 'administrator') && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-sm transition-colors"
                    >
                      <span className="material-symbols-outlined">dashboard</span>
                      Quản lý cửa hàng
                    </Link>
                  )}

                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-error/10 text-error rounded-lg text-sm font-medium hover:bg-error/20 transition-colors"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionNav>
  );
};

export default Navbar;
