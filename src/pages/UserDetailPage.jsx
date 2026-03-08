import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const UserDetailPage = () => {
  const { id } = useParams(); // Lấy ID từ URL /users/:id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Gọi API backend (route GET /api/users/{id})
        const response = await api.get(`/api/users/${id}`); 
        setUser(response || null);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu API:", error);
        setErrorInfo(error?.response?.data?.message || 'Không tìm thấy người dùng này');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  return (
    <main className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
      <div className="mb-6 flex items-center">
        <Link to="/users" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
          <span>&larr;</span> Quay lại danh sách
        </Link>
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Chi Tiết Người Dùng</h2>
        
        {loading ? (
          <div className="text-center py-10 text-zinc-500">Đang tải thông tin...</div>
        ) : errorInfo ? (
          <div className="text-center py-10 text-red-400">
             <p className="text-xl mb-2">⚠️</p>
             <p>{errorInfo}</p>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            <div>
              <p className="text-sm text-zinc-500 mb-1">Mã định danh (ID)</p>
              <p className="text-lg font-mono text-zinc-300">#{user.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-zinc-500 mb-1">Vai trò (Role)</p>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium border ${user.role === 'Admin' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                {user.role || 'Customer'}
              </span>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Tên hiển thị (Name)</p>
              <p className="text-xl font-semibold text-white">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Địa chỉ Email</p>
              <p className="text-lg text-zinc-300">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Ngày tạo</p>
              <p className="text-zinc-400 truncate">
                {user.created_at ? new Date(user.created_at).toLocaleString('vi-VN') : 'Không có'}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500 mb-1">Lần cập nhật cuối</p>
              <p className="text-zinc-400 truncate">
                {user.updated_at ? new Date(user.updated_at).toLocaleString('vi-VN') : 'Không có'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default UserDetailPage;
