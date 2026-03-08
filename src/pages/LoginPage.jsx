import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đăng nhập với: ${email} (Chức năng xác thực sẽ được tích hợp sau)`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-king-bg">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        {/* Glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-0"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-0"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2">
              THE KING <span className="text-gradient">Mobile</span>
            </h1>
            <p className="text-king-muted text-sm">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {/* Form Card */}
          <div className="glass rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-king-muted" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-king-bg/60 border border-king-border text-white pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-king-accent/50 focus:border-king-accent/50 transition-all placeholder:text-king-muted/50"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-king-muted" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-king-bg/60 border border-king-border text-white pl-12 pr-12 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-king-accent/50 focus:border-king-accent/50 transition-all placeholder:text-king-muted/50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-king-muted hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Quên mật khẩu */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-king-muted cursor-pointer">
                  <input type="checkbox" className="rounded border-king-border accent-king-accent" />
                  Ghi nhớ đăng nhập
                </label>
                <a href="#" className="text-king-accent hover:underline font-medium">Quên mật khẩu?</a>
              </div>

              {/* Nút đăng nhập */}
              <button type="submit" className="w-full py-4 bg-king-text text-king-bg rounded-full font-black hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 text-sm">
                Đăng Nhập <ChevronRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-king-border"></div>
              <span className="text-king-muted text-xs font-medium">HOẶC</span>
              <div className="flex-1 h-px bg-king-border"></div>
            </div>

            {/* Social Login mẫu */}
            <button className="w-full py-3.5 border border-king-border rounded-full text-king-muted hover:text-white hover:border-white/30 font-medium text-sm flex items-center justify-center gap-2 transition-all">
              Đăng nhập với Google
            </button>
          </div>

          {/* Đăng ký */}
          <p className="text-center text-king-muted text-sm mt-6">
            Chưa có tài khoản? <a href="#" className="text-king-accent font-bold hover:underline">Đăng ký ngay</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
