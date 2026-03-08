import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User, ChevronDown, X } from 'lucide-react';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Điện thoại', href: '/#products' },
    { name: 'Phụ kiện', href: '/#products' },
    { name: 'Khuyến mãi', href: '/#products' },
    { name: 'Liên hệ', href: '/#contact' },
  ];

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('kingCart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center gap-4">

        {/* Logo + Menu Mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-king-text hover:text-king-accent transition">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-black tracking-tight cursor-pointer whitespace-nowrap">
            THE KING <span className="text-gradient">Mobile</span>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="px-3 py-2 text-sm font-medium text-king-muted hover:text-white transition-colors rounded-lg hover:bg-king-border/30 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Thanh tìm kiếm */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-king-muted group-focus-within:text-king-accent transition-colors" size={16} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm siêu phẩm..."
            className="w-full bg-king-bg/60 border border-king-border/80 text-king-text pl-11 pr-4 py-2.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-king-accent/50 focus:border-king-accent/50 focus:bg-king-bg transition-all placeholder:text-king-muted/50"
          />
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Đăng nhập */}
          <Link to="/login" className="hidden sm:flex items-center gap-2 text-king-muted hover:text-king-text transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-king-border/30">
            <User size={18} />
            <span>Đăng nhập</span>
          </Link>

          {/* Giỏ hàng */}
          <Link to="/cart" className="relative bg-king-text text-king-bg px-4 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 overflow-visible">
            <ShoppingCart size={16} />
            <span>Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-king-bg px-1 animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin shortcut */}
          <Link
            to="/admin"
            className="hidden md:flex items-center gap-1.5 text-king-muted hover:text-king-accent text-xs font-bold px-3 py-2 rounded-lg border border-king-border/50 hover:border-king-accent/50 transition-all"
          >
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-king-border/50 bg-king-card/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-king-muted hover:text-white hover:bg-king-border/30 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-king-accent hover:bg-king-accent/10 rounded-lg transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
