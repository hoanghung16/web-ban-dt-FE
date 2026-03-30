import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Edit3, 
  Search,
  TrendingUp
} from 'lucide-react';


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    // Lấy danh sách sản phẩm từ Backend qua file api.js của bạn
    api.get('/products')
      .then(res => setProducts(res))
      .catch(err => console.error("Lỗi lấy dữ liệu:", err));
  }, []);

  // Các thẻ thống kê nhanh
  const stats = [
    { label: 'Tổng doanh thu', value: '1.2B đ', icon: <TrendingUp className="text-green-400" />, color: 'shadow-green-500/10' },
    { label: 'Sản phẩm', value: products.length, icon: <Package className="text-blue-400" />, color: 'shadow-blue-500/10' },
    { label: 'Đơn hàng', value: '156', icon: <ShoppingCart className="text-purple-400" />, color: 'shadow-purple-500/10' },
    { label: 'Khách hàng', value: '890', icon: <Users className="text-pink-400" />, color: 'shadow-pink-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex">
      
      {/* 1. SIDEBAR TRÁI */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950/50 backdrop-blur-md hidden lg:flex flex-col pt-24 p-6">
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5 text-zinc-400'}`}
          >
            <LayoutDashboard size={20} /> <span className="font-bold text-sm">Quản lý kho</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-all">
            <Users size={20} /> <span className="font-bold text-sm">Người dùng</span>
          </button>
        </div>
      </aside>

      {/* 2. NỘI DUNG CHÍNH */}
      <main className="flex-1 pt-24 p-6 lg:p-10 overflow-y-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Hệ thống <span className="text-blue-500">Quản trị</span></h1>
            <p className="text-zinc-500 text-sm mt-1">Chào mừng trở lại, Admin. Đây là những gì đang diễn ra hôm nay.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20 text-sm">
            <Plus size={18} /> THÊM SẢN PHẨM MỚI
          </button>
        </div>

        {/* Thẻ thống kê nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item, idx) => (
            <div key={idx} className={`bg-zinc-900/50 border border-white/5 p-6 rounded-2xl shadow-xl ${item.color}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">{item.icon}</div>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black mt-1 font-mono">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Bảng Danh sách Sản phẩm (Glass Table) */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-xl font-bold">Danh sách kho hàng</h2>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Tìm tên máy..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 shadow-lg">
                          <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-sm group-hover:text-blue-400 transition-colors">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.IsOnSale ? (
                        <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded-full border border-orange-500/20">GIẢM GIÁ</span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full border border-blue-500/20">THƯỜNG</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {Number(product.price).toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 bg-zinc-800 hover:bg-blue-600 rounded-lg transition-all text-zinc-400 hover:text-white">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 bg-zinc-800 hover:bg-red-600 rounded-lg transition-all text-zinc-400 hover:text-white">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;