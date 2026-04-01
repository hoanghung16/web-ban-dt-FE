import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories', { params: { limit: 1000 } });
      setCategories(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    if (category.products_count > 0) {
      alert(`Không thể xóa danh mục "${category.name}" vì đang có ${category.products_count} sản phẩm trong danh mục này.\n\nVui lòng xóa hoặc chuyển các sản phẩm sang danh mục khác trước.`);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}" không? Hành động này không thể hoàn tác.`)) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(c => c.id !== id));
        alert("Xóa danh mục thành công!");
      } catch (error) {
        console.error("Lỗi xóa danh mục:", error);
        const errorMsg = error?.response?.data?.message || "Không thể xóa danh mục. Vui lòng thử lại.";
        alert(errorMsg);
      }
    }
  };

  // Lọc danh mục theo search term
  const filteredCategories = categories.filter(category => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.id.toString().includes(searchTerm) ||
      category.name?.toLowerCase().includes(searchLower) ||
      category.slug?.toLowerCase().includes(searchLower)
    );
  });

  // Phân trang
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Danh mục</h2>
        <Link
          to="/admin/categories/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Thêm danh mục</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="px-6 py-4 w-20">ID</th>
                  <th className="px-6 py-4">Tên Danh mục</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-center">Sản phẩm</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Không có danh mục nào
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        #{category.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-md">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                          {category.products_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            disabled={category.products_count > 0}
                            className={`p-2 rounded-lg transition-colors ${category.products_count > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                            title={category.products_count > 0 ? `Không thể xóa: có ${category.products_count} sản phẩm` : "Xóa"}
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

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị <span className="font-semibold">{startIndex + 1}</span> đến <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredCategories.length)}</span> trong <span className="font-semibold">{filteredCategories.length}</span> kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
