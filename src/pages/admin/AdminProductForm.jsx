import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';
import { showSuccess, showError } from '../../store/useToastStore';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      showError('Vui lòng chọn một tệp hình ảnh');
      return;
    }

    // Kiểm tra kích thước (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Kích thước tệp không được vượt quá 5MB');
      return;
    }

    // Hiển thị preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewFile(event.target.result);
    };
    reader.readAsDataURL(file);

    // Tự động upload ngay
    handleUploadFile(file);
  };

  const handleUploadFile = async (file) => {
    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.post('/products/upload-image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.imageUrl) {
        setFormData({ ...formData, imageUrl: response.imageUrl });
        showSuccess('Tải lên hình ảnh thành công!');
      }
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      showError(error.response?.data?.message || 'Lỗi tải lên hình ảnh');
      setPreviewFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setPreviewFile(null);
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh sản phẩm</label>
            
            {/* Upload Area */}
            <div className="mb-4">
              <label className="block relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="relative w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors group-hover:border-blue-400 text-center">
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className="text-sm text-slate-600">Đang tải lên...</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                      <p className="text-sm font-medium text-slate-700">Kéo thả ảnh hoặc nhấp để chọn</p>
                      <p className="text-xs text-slate-500 mt-1">JPEG, PNG, GIF, WebP • Max 5MB</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Or Text Input */}
            <div className="relative mb-4">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Hoặc dán URL ảnh..."
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>

            {/* Preview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Live preview từ file select */}
              {previewFile && (
                <div className="relative group">
                  <img src={previewFile} alt="Live preview" className="w-full h-24 object-cover rounded-lg border-2 border-blue-400" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Đợi upload...</span>
                  </div>
                </div>
              )}

              {/* Ảnh đã upload */}
              {formData.imageUrl && (
                <div className="relative group">
                  <img src={getImageUrl(formData.imageUrl)} alt="Product preview" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
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
