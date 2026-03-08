import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setLoading(true);
        // Gọi API backend (route GET /api/users)
        const response = await api.get('/users'); 
        setUsers(response || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu API:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAPI();
  }, []);

  return (
    <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Quản lý Users</h2>
          <p className="text-zinc-400">Danh sách Users lấy từ Database (API /users)</p>
        </div>
      </div>
      
      {loading ? (
          <div className="text-center py-20 text-zinc-500">Đang lấy dữ liệu từ Render Server...</div>
      ) : users.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">Chưa có dữ liệu. Hãy chắc chắn bạn đã chạy Seeder!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map(user => (
            <ProductCard 
              key={user.id}
              product={{
                id: user.id, 
                // Sử dụng user.name (Đã được đổi từ fullname sang name ở API Backend)
                name: user.name || 'Không tên', 
                price: 0, // Giá giả do user ko có giá
                category: `Quyền: ${user.role || 'Khách'}`, 
                badge: `ID: ${user.id}`,
                image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }} 
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default UsersPage;
