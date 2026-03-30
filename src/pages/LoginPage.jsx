import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Kết nối tới API của Thành viên 03
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      
      localStorage.setItem('auth_token', res.data.token);
      
      navigate('/');
    } catch (err) {
      console.error("Chi tiết lỗi đăng nhập:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 relative">
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tighter uppercase">
          The King <span className="text-blue-500">Auth</span>
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:ring-2 ring-blue-500 mt-1"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theking.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:ring-2 ring-blue-500 mt-1"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

// Đảm bảo chỉ export duy nhất component này
export default LoginPage;