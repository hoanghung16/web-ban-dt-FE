import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    saleprice: '',
    categoryid: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      // API interceptor đã extract .data
      const product = response;
      setFormData({
        name: product.name || '',
        price: product.price || '',
        saleprice: product.saleprice || '',
        categoryid: product.categoryid || '',
        imageUrl: product.imageUrl || ''
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin sản phẩm:", error);
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
        await api.put(`/products/${id}`, formData);
        alert("Cập nhật thành công!");
      } else {
        await api.post('/products', formData);
        alert("Thêm mới thành công!");
      }
      navigate('/admin/products');
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditMode ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: iPhone 15 Pro Max"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Danh mục *</label>
              <select
                name="categoryid"
                required
                value={formData.categoryid}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Giá bán */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Giá gốc (VNĐ) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Giá khuyến mãi */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Giá khuyến mãi (VNĐ)</label>
              <input
                type="number"
                name="saleprice"
                min="0"
                value={formData.saleprice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">URL Hình ảnh</label>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            {formData.imageUrl && (
              <div className="mt-4">
                <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-slate-200" />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <Link
            to="/admin/products"
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
            {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
