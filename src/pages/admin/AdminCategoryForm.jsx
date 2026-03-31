import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const AdminCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${id}`);
      // API interceptor đã extract .data
      const category = response;
      setFormData({
        name: category.name || '',
        slug: category.slug || ''
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin danh mục:", error);
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
      if (isEditMode) {
        await api.put(`/categories/${id}`, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await api.post('/categories', formData);
        alert("Thêm danh mục mới thành công!");
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/categories"
          className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">
          {isEditMode ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tên danh mục *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Điện thoại, Laptop..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Đường dẫn (Slug) *</label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              placeholder="Ví dụ: dien-thoai, laptop..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <Link
            to="/admin/categories"
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
            {loading ? 'Đang lưu...' : 'Lưu Danh mục'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategoryForm;
