import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Crown, LayoutDashboard, Tags, Package, Warehouse, Users, Settings, LogOut, Bell, Search, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Danh mục', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Kho hàng', path: '/admin/inventory', icon: <Warehouse size={20} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7f8] text-slate-900 font-['Inter']">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007bff] rounded-lg flex items-center justify-center text-white">
            <Crown size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">THE KING</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#007bff] text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="space-y-1">
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Settings size={20} />
              <span className="text-sm font-medium">Cài đặt hệ thống</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
               {/* Placeholder avatar */}
              <div className="w-full h-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold">
                {user?.fullname?.charAt(0) || 'A'}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user?.fullname || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@theking.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:border-[#007bff] focus:ring focus:ring-[#007bff]/20 w-64 transition-all"
                placeholder="Tìm kiếm..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Về cửa hàng
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

