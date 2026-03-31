import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Edit, Trash2, Search, Shield, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error("Lỗi xóa người dùng:", error);
        alert("Không thể xóa người dùng này. Có thể liên quan đến các dữ liệu khác.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h2>
        <Link
          to="/admin/users/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Thêm người dùng</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng qua tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Hồ sơ</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Vai trò (Role)</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Không tìm thấy người dùng
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.name || 'N/A'}</p>
                            <p className="text-xs text-slate-500">ID: #{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {user.role === 'admin' ? (
                            <>
                              <Shield size={16} className="text-indigo-500" />
                              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                Quản trị viên
                              </span>
                            </>
                          ) : (
                            <>
                              <UserIcon size={16} className="text-slate-400" />
                              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider">
                                Khách hàng
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className={`p-2 rounded-lg transition-colors ${user.role === 'admin' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                            title="Xóa"
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
