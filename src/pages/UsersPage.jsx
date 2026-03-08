import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý việc Thêm / Sửa
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', password: '', role: 'Customer' });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users'); 
      setUsers(response || []);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ id: null, name: '', email: '', password: '', role: 'Customer' });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      password: '', // Để trống password khi sửa, BE phải xử lý
      role: user.role || 'Customer' 
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      if (formData.id) {
        // Cập nhật (Sửa)
        const submitData = { ...formData };
        if (!submitData.password) delete submitData.password; // Bỏ pass nếu ko nhập
        await api.put(`/api/users/${formData.id}`, submitData);
      } else {
        // Thêm mới
        await api.post('/api/users', formData);
      }
      setShowModal(false);
      fetchUsers(); // Tải lại danh sách
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error?.response?.data?.error || "Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await api.delete(`/api/users/${id}`);
        fetchUsers(); // Tải lại danh sách
      } catch (error) {
        alert("Lỗi khi xóa: " + (error?.response?.data?.message || ""));
      }
    }
  };

  return (
    <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Quản lý Users</h2>
          <p className="text-zinc-400">Xem, thêm, sửa, xóa dữ liệu người dùng (CRUD)</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          + Thêm User
        </button>
      </div>
      
      {/* Bảng dữ liệu */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-zinc-300">
            <thead className="bg-zinc-800/50 text-xs uppercase font-medium text-zinc-400 border-b border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-4">ID</th>
                <th scope="col" className="px-6 py-4">Tên (Name)</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Quyền</th>
                <th scope="col" className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">Đang tải dữ liệu...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">Chưa có người dùng nào.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-zinc-500">#{user.id}</td>
                    <td className="px-6 py-4 font-medium text-white">
                      <Link to={`/users/${user.id}`} className="hover:text-blue-400 hover:underline transition-colors">
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${user.role === 'Admin' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                        {user.role || 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openEditModal(user)} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sửa</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{formData.id ? 'Sửa thông tin User' : 'Thêm User Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">{errorMsg}</div>}
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Tên (Name)</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Nguyễn Văn A" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="email@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Mật khẩu {formData.id && <span className="text-zinc-600 text-xs font-normal">(Bỏ trống nếu không đổi)</span>}
                </label>
                <input required={!formData.id} type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Quyền hạn (Role)</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-4 py-2.5 rounded-lg font-medium transition-colors">
                  Hủy
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  {formData.id ? 'Lưu Thay Đổi' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default UsersPage;
