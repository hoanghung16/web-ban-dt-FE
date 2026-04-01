import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Crown, LayoutDashboard, Tags, Package, Warehouse, Users, Settings, LogOut, Bell, ShoppingCart, X, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Đơn hàng mới', message: 'Bạn có 1 đơn hàng mới từ khách hàng', icon: '🛒', read: false, time: 'Bây giờ' },
    { id: 2, title: 'Sản phẩm bán chạy', message: 'iPhone 15 Pro Max đã bán được 5 chiếc hôm nay', icon: '📈', read: false, time: '10 phút' },
    { id: 3, title: 'Cảnh báo kho', message: 'Xiaomi 14 Ultra sắp hết hàng (còn 2 cái)', icon: '⚠️', read: false, time: '1 giờ' },
    { id: 4, title: 'Người dùng mới', message: 'hung@gmail.com vừa đăng ký tài khoản', icon: '👤', read: true, time: '2 giờ' },
  ]);
  const notificationRef = useRef(null);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={toggleNotifications}
                className="relative w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Thông báo ({unreadCount})</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Không có thông báo</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">{notif.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-800 text-sm">{notif.title}</p>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-slate-200 text-center">
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 text-center w-full py-1">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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

