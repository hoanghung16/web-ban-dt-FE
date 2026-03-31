import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Sản phẩm</h2>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Lọc
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Giá gốc</th>
                  <th className="px-6 py-4">Giá khuyến mãi</th>
                  <th className="px-6 py-4">Tồn kho</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const hasDiscount = product.saleprice && product.saleprice < product.price;
                    return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/48'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-2 max-w-xs">{product.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Danh mục: {product.category?.name || `ID: ${product.categoryid}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${hasDiscount ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}`}>
                        {Number(product.price).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {hasDiscount ? Number(product.saleprice).toLocaleString('vi-VN') + 'đ' : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          (product.inventory?.QuantityInStock ?? 0) > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.inventory?.QuantityInStock ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
