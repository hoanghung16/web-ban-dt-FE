import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, History, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh sách kho:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Kho hàng</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <ArrowDownToLine size={20} />
            <span>Nhập kho</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            <ArrowUpToLine size={20} />
            <span>Xuất kho</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng sản phẩm trong kho</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {products.reduce((acc, curr) => acc + (curr.inventory?.QuantityInStock || 0), 0)}
          </h3>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Sắp hết hàng (&lt; 10)</p>
          <h3 className="text-2xl font-bold text-amber-500">
            {products.filter(p => (p.inventory?.QuantityInStock || 0) < 10 && (p.inventory?.QuantityInStock || 0) > 0).length}
          </h3>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Hết hàng</p>
          <h3 className="text-2xl font-bold text-red-500">
            {products.filter(p => (p.inventory?.QuantityInStock || 0) === 0).length}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm mã hoặc tên sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <History size={18} />
            Lịch sử giao dịch kho
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-slate-500">Đang tải dữ liệu kho...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Số lượng tồn</th>
                  <th className="px-6 py-4">Tình trạng</th>
                  <th className="px-6 py-4 text-right">Lần cập nhật cuối</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <img
                            src={product.imageUrl || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">#{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {product.inventory?.QuantityInStock || 0}
                      </td>
                      <td className="px-6 py-4">
                        {(product.inventory?.QuantityInStock || 0) > 10 ? (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Tốt</span>
                        ) : (product.inventory?.QuantityInStock || 0) > 0 ? (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Sắp hết</span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Hết hàng</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right">
                        {new Date(product.updated_at || Date.now()).toLocaleDateString('vi-VN')}
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

export default AdminInventory;
