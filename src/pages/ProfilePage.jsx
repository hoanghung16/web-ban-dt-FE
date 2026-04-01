import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { showSuccess, showError } from '../store/useToastStore';
import api from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  // Show Password State
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Initialize profile data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setProfileData({
        fullname: user.fullname || '',
        email: user.email || '',
      });
    }
  }, [user, isAuthenticated, navigate]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', profileData);
      showSuccess('Thông tin cá nhân đã được cập nhật!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Không thể cập nhật thông tin';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.password_confirmation) {
      showError('Mật khẩu mới không khớp!');
      return;
    }

    if (passwordData.password.length < 6) {
      showError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation
      });
      showSuccess('Mật khẩu đã được thay đổi thành công!');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    } catch (err) {
      // Handle different error scenarios
      const response = err.response?.data;
      
      // Check if it's a validation error (Laravel returns errors object)
      if (response?.errors) {
        // Get first error from validation errors
        const firstErrorKey = Object.keys(response.errors)[0];
        const errorMsg = response.errors[firstErrorKey]?.[0] || response.message || 'Không thể thay đổi mật khẩu';
        showError(errorMsg);
      } else {
        // Fallback to message field or generic error
        const errorMsg = response?.message || err.message || 'Không thể thay đổi mật khẩu';
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Đang tải...</p>
      </div>
    );
  }

  return (
    <main className="pt-20 pb-20 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-4 text-white">
          Hồ sơ cá nhân
        </h1>
        <p className="text-on-surface-variant text-lg">
          Quản lý thông tin tài khoản và bảo mật
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-outline-variant/20 overflow-x-auto">
        {[
          { id: 'profile', label: 'Thông tin cá nhân', icon: 'person' },
          { id: 'password', label: 'Đổi mật khẩu', icon: 'lock' },
          { id: 'orders', label: 'Đơn hàng', icon: 'local_shipping' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'orders') {
                navigate('/orders');
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* User Info Card */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-8">
            <h2 className="text-2xl font-headline font-bold text-white mb-6">Thông tin tài khoản</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fullname */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                    Tên đầy đủ
                  </label>
                  <input
                    type="text"
                    value={profileData.fullname}
                    onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 rounded-xl text-on-surface-variant outline-none cursor-not-allowed"
                    placeholder="email@example.com"
                  />
                  <p className="text-xs text-on-surface-variant mt-2">Email không thể thay đổi</p>
                </div>
              </div>

              {/* Role Display */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                  Vai trò
                </label>
                <div className="px-4 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/20 text-on-surface">
                  {user?.role || 'Customer'}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 disabled:opacity-50 text-on-primary-fixed font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                {loading ? '⏳ Đang cập nhật...' : 'Cập nhật thông tin'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Change Password Card */}
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-8">
            <h2 className="text-2xl font-headline font-bold text-white mb-6">Đổi mật khẩu</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    required
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword.current ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    required
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword.new ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    required
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword.confirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
                <p className="text-sm text-secondary font-medium">
                  💡 Mật khẩu mới phải khác mật khẩu cũ và chứa ít nhất 6 ký tự
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 disabled:opacity-50 text-on-primary-fixed font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                {loading ? '⏳ Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default ProfilePage;
