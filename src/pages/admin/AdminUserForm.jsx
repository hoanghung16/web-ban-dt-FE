import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const AdminUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // Default to customer for new users
  });

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${id}`);
      const user = data?.data || data;
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        role: user.role || 'customer',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {};
      
      // Validate password match for new user
      if (!isEditMode && formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        setLoading(false);
        return;
      }
      
      // Validate password match for update with password
      if (isEditMode && formData.password && formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        setLoading(false);
        return;
      }
      
      // Build payload - only include fields that have values
      if (formData.fullname) {
        payload.fullname = formData.fullname;
      }
      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.confirmPassword; // Send as password_confirmation
      }
      if (formData.role) {
        payload.role = formData.role;
      }
      
      // For create, ensure required fields
      if (!isEditMode) {
        if (!formData.fullname) {
          alert("Vui lòng nhập họ và tên");
          setLoading(false);
          return;
        }
        if (!formData.password) {
          alert("Vui lòng nhập mật khẩu");
          setLoading(false);
          return;
        }
        // Email must be provided for creation
        payload.email = formData.email;
      }
      
      console.log("Submitting payload:", payload);
      
      if (isEditMode) {
        await api.put(`/users/${id}`, payload);
        alert("Cập nhật người dùng thành công!");
      } else {
        await api.post('/users', payload);
        alert("Thêm người dùng mới thành công!");
      }
      navigate('/admin/users');
    } catch (error) {
      console.error("Lỗi lưu người dùng:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle specific validation errors
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const errorMsg = errorData.errors[firstErrorKey]?.[0] || errorData.message;
        alert(errorMsg);
      } else {
        alert(errorData?.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/users"
          className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">
          {isEditMode ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Họ và Tên *</label>
              <input
                type="text"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vai trò (Role) *</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="customer">Khách hàng (Customer)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isEditMode} // Usually you don't let them edit email, or it needs careful handling
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isEditMode ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
            />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              {isEditMode ? 'Cập nhật Mật khẩu (Bỏ trống nếu không đổi)' : 'Thiết lập Mật khẩu *'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu{!isEditMode ? ' *' : ''}</label>
                <div className="relative">
                  <input
                    type={showPassword.password ? 'text' : 'password'}
                    name="password"
                    required={!isEditMode}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEditMode ? "Để trống nếu không thay đổi" : "Nhập mật khẩu mới"}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword.password ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Xác nhận Mật khẩu{!isEditMode ? ' *' : ''}</label>
                <div className="relative">
                  <input
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required={!isEditMode}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={isEditMode ? "Để trống nếu không thay đổi" : "Xác nhận mật khẩu"}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword.confirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <Link
            to="/admin/users"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Đang xử lý...' : 'Lưu tài khoản'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;
