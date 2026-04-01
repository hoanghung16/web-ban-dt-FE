import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { showSuccess, showError } from '../store/useToastStore';
import api from '../services/api';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // login, register, forgot
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Login State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  // Loading State
  const [loading, setLoading] = useState(false);

  // Show Password State
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    registerConfirm: false,
    forgot: false
  });

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      showSuccess('Đăng nhập thành công! 🎉');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      showError('Mật khẩu không khớp!');
      return;
    }

    if (registerData.password.length < 6) {
      showError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        fullname: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.confirmPassword
      });
      showSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => setActiveTab('login'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Đăng ký thất bại!";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      showSuccess('Kiểm tra email của bạn để đặt lại mật khẩu!');
      setForgotEmail('');
      setTimeout(() => setActiveTab('login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Không thể gửi yêu cầu đặt lại mật khẩu!";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest via-background to-surface-container-highest"></div>

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-6 text-center">
            <h1 className="text-3xl font-headline font-black text-white tracking-tighter">
              THE KING
            </h1>
            <p className="text-blue-100 text-sm font-medium mt-1">Authentication System</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'login', label: 'Đăng nhập', icon: 'login' },
              { id: 'register', label: 'Đăng ký', icon: 'person_add' },
              { id: 'forgot', label: 'Quên MK', icon: 'lock_reset' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 font-medium text-sm transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              {/* Login Form */}
              {activeTab === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Email</label>
                    <input 
                      type="email" 
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Tên đăng nhập hoặc email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Mật khẩu</label>
                    <div className="relative">
                      <input 
                        type={showPassword.login ? 'text' : 'password'} 
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword.login ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Quên mật khẩu?
                  </button>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 disabled:opacity-50 text-on-primary-fixed font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    {loading ? '⏳ Đang xử lý...' : 'ĐĂNG NHẬP'}
                  </button>

                  <p className="text-center text-sm text-on-surface-variant">
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Đăng ký ngay
                    </button>
                  </p>
                </motion.form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Tên đầy đủ</label>
                    <input 
                      type="text" 
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Email</label>
                    <input 
                      type="email" 
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Mật khẩu</label>
                    <div className="relative">
                      <input 
                        type={showPassword.register ? 'text' : 'password'} 
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword.register ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <input 
                        type={showPassword.registerConfirm ? 'text' : 'password'} 
                        required
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, registerConfirm: !showPassword.registerConfirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword.registerConfirm ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 disabled:opacity-50 text-on-primary-fixed font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    {loading ? '⏳ Đang xử lý...' : 'ĐĂNG KÝ'}
                  </button>

                  <p className="text-center text-sm text-on-surface-variant">
                    Đã có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Đăng nhập
                    </button>
                  </p>
                </motion.form>
              )}

              {/* Forgot Password Form */}
              {activeTab === 'forgot' && (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-5"
                >
                  <p className="text-sm text-on-surface-variant">
                    Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Email</label>
                    <input 
                      type="email" 
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary p-3 rounded-xl text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 disabled:opacity-50 text-on-primary-fixed font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    {loading ? '⏳ Đang xử lý...' : 'GỬI HƯỚNG DẪN'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-full text-primary hover:text-primary/80 font-semibold py-2 transition-colors"
                  >
                    Quay lại đăng nhập
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-8 py-4 text-center text-xs text-on-surface-variant">
            <p>© 2026 The King - Luxury Mobile Marketplace</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
