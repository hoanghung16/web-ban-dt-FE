import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, List, Tag, Archive, LayoutDashboard, LogOut, Search, Plus, Edit2, Trash2, X, AlertCircle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

// Component Bảng Dữ Liệu Chung (Generic Data Table)
const GenericTable = ({ title, data, columns, onEdit, onDelete, onAdd }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
           <p className="text-sm text-gray-500 mt-1">Quản lý và cập nhật dữ liệu</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
               type="text" 
               placeholder="Tìm kiếm..." 
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={onAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-sm whitespace-nowrap"
          >
            <Plus size={18} className="mr-1" /> Thêm Mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4">{col.label}</th>
              ))}
              <th className="px-6 py-4 text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  <Archive className="mx-auto mb-3 text-gray-300" size={32} />
                  Không có dữ liệu trong hệ thống
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-blue-50/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] || <span className="text-gray-400 italic">Trống</span>)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => onEdit(row)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors mr-2 tooltip-edit">
                       <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(row.id || row.ProductId)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors tooltip-delete">
                       <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Mock */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
         <span>Hiển thị {data.length} kết quả</span>
         <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white transition-colors disabled:opacity-50">Trước</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded shadow-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white transition-colors disabled:opacity-50">Sau</button>
         </div>
      </div>
    </div>
  );
};

// Component Modal CRUD Động
const CrudModal = ({ isOpen, onClose, title, fields, formData, setFormData, onSubmit, isSubmitting }) => {
   if (!isOpen) return null;

   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
         {/* Header */}
         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-800">{title}</h3>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
             <X size={20} />
           </button>
         </div>
         
         {/* Body */}
         <div className="p-6 overflow-y-auto flex-1">
           <form id="crud-form" onSubmit={onSubmit} className="space-y-4">
             {fields.map((field) => {
                 // Ẩn trường password khi đang sửa (không hiện hash cũ)
                 const currentValue = formData[field.key] ?? '';
                 
                 return (
                 <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                       <select 
                          name={field.key} 
                          value={String(currentValue)} 
                          onChange={handleChange}
                          required={field.required !== false}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                       >
                          <option value="">-- Chọn {field.label} --</option>
                          {field.options?.map(opt => <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>)}
                       </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.key}
                        value={field.type === 'password' ? '' : currentValue}
                        onChange={handleChange}
                        placeholder={`Nhập ${field.label.toLowerCase()}...`}
                        required={field.required !== false}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    )}
                 </div>
                 );
              })}
           </form>
         </div>

         {/* Footer */}
         <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} type="button" className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors">
              Hủy
            </button>
            <button 
              type="submit" 
              form="crud-form" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span> : null}
              Lưu Dữ Liệu
            </button>
         </div>
       </div>
     </div>
   );
};

// ====== DASHBOARD OVERVIEW COMPONENT ======
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#f59e0b'];

const DashboardOverview = ({ products, users, orders, categories, API }) => {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/inventories`).then(r => setInventories(r.data)).catch(() => {});
  }, []);

  // Tính tổng doanh thu
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalprice || 0), 0);
  const totalStock = inventories.reduce((sum, i) => sum + (i.QuantityInStock || 0), 0);

  // Dữ liệu biểu đồ doanh thu theo ngày (giả lập từ orders)
  const revenueData = (() => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return days.map((day, i) => ({
      name: day,
      doanhThu: Math.round(totalRevenue / 7 * (0.6 + Math.random() * 0.8)),
      donHang: Math.max(1, Math.round(orders.length / 7 * (0.5 + Math.random()))),
    }));
  })();

  // Dữ liệu PieChart: SP theo danh mục
  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: products.filter(p => p.categoryid == cat.id).length,
  })).filter(d => d.value > 0);

  // Dữ liệu BarChart: Tồn kho Top SP
  const stockData = inventories.map(inv => {
    const prod = products.find(p => p.id == inv.ProductId);
    return { name: prod ? prod.name.substring(0, 15) : `SP #${inv.ProductId}`, soLuong: inv.QuantityInStock };
  }).sort((a, b) => b.soLuong - a.soLuong).slice(0, 6);

  const stats = [
    { title: 'Tổng Sản Phẩm', value: products.length, icon: Package, color: 'bg-indigo-50 text-indigo-600', change: '+2 tuần này' },
    { title: 'Đơn Hàng', value: orders.length, icon: ShoppingCart, color: 'bg-green-50 text-green-600', change: `${orders.filter(o => o.status === 'Chờ xử lý').length} chờ xử lý` },
    { title: 'Người Dùng', value: users.length, icon: Users, color: 'bg-blue-50 text-blue-600', change: `${users.filter(u => u.role === 'Admin').length} admin` },
    { title: 'Doanh Thu', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: DollarSign, color: 'bg-amber-50 text-amber-600', change: 'Tổng tất cả đơn' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Row 1: Doanh Thu + Danh Mục */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Doanh thu */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">Biểu Đồ Doanh Thu</h3>
              <p className="text-xs text-gray-400 mt-0.5">Thống kê 7 ngày gần đây</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold">
              <TrendingUp size={14} /> +12.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => `${v.toLocaleString('vi-VN')}đ`} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="doanhThu" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorRevenue)" name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Danh mục */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-1">SP Theo Danh Mục</h3>
          <p className="text-xs text-gray-400 mb-4">Phân bố sản phẩm</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}></span>
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-bold text-gray-800">{cat.value} SP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Tồn kho + Đơn hàng gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Tồn kho */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-1">Kho Hàng ({totalStock} SP)</h3>
          <p className="text-xs text-gray-400 mb-4">Số lượng tồn theo sản phẩm</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={90} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="soLuong" name="Tồn kho" radius={[0, 8, 8, 0]}>
                {stockData.map((entry, i) => (
                  <Cell key={i} fill={entry.soLuong > 50 ? '#10b981' : entry.soLuong > 20 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Đơn hàng gần đây */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-800">Đơn Hàng Gần Đây</h3>
              <p className="text-xs text-gray-400 mt-0.5">{orders.length} đơn hàng trong hệ thống</p>
            </div>
            <BarChart3 size={20} className="text-gray-300" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
                  <th className="pb-3 font-semibold">Mã đơn</th>
                  <th className="pb-3 font-semibold">Khách hàng</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold">Thanh toán</th>
                  <th className="pb-3 font-semibold text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 5).map(order => {
                  const user = users.find(u => u.id == order.userid);
                  const statusColor = order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : order.status === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';
                  const payColor = order.paymentstatus === 'Đã thanh toán' ? 'text-green-600' : 'text-red-500';
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 font-bold text-indigo-600">#{order.id}</td>
                      <td className="py-3.5">
                        <div>
                          <p className="font-medium text-gray-800">{order.shipname}</p>
                          <p className="text-xs text-gray-400">{user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-3.5"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>{order.status}</span></td>
                      <td className={`py-3.5 font-medium text-xs ${payColor}`}>{order.paymentstatus}</td>
                      <td className="py-3.5 text-right font-bold text-gray-800">{Number(order.totalprice).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-8">Chưa có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dữ liệu tham chiếu (Reference Data) để dùng cho Dropdown liên kết
  const [refCategories, setRefCategories] = useState([]);
  const [refProducts, setRefProducts] = useState([]);
  const [refUsers, setRefUsers] = useState([]);
  const [refOrders, setRefOrders] = useState([]);

  const API = 'http://127.0.0.1:8000';

  const tabs = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, endpoint: null },
    { id: 'categories', label: 'Danh Mục', icon: List, endpoint: '/api/categories' },
    { id: 'products', label: 'Sản Phẩm', icon: Package, endpoint: '/api/products/admin' },
    { id: 'users', label: 'Người Dùng', icon: Users, endpoint: '/api/users' },
    { id: 'inventories', label: 'Kho Hàng', icon: Archive, endpoint: '/api/inventories' },
    { id: 'orders', label: 'Đơn Hàng', icon: ShoppingCart, endpoint: '/api/orders' },
    { id: 'order-items', label: 'Chi Tiết Đơn', icon: Tag, endpoint: '/api/order-items' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  // Tải dữ liệu tham chiếu 1 lần khi component mount
  useEffect(() => {
    const loadRef = async () => {
      try {
        const [catRes, prodRes, userRes, orderRes] = await Promise.all([
          axios.get(`${API}/api/categories`),
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/users`),
          axios.get(`${API}/api/orders`),
        ]);
        setRefCategories(catRes.data);
        setRefProducts(prodRes.data);
        setRefUsers(userRes.data);
        setRefOrders(orderRes.data);
      } catch(e) { console.error('Lỗi tải dữ liệu tham chiếu', e); }
    };
    loadRef();
  }, []);

  // Helper: tìm tên sản phẩm theo ID
  const findProduct = (id) => refProducts.find(p => p.id == id);
  const findUser = (id) => refUsers.find(u => u.id == id);
  const findCategory = (id) => refCategories.find(c => c.id == id);

  const fetchData = async () => {
    if (!currentTab.endpoint) {
      setLoading(false);
      setData([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API}${currentTab.endpoint}`);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setIsModalOpen(false);
  }, [activeTab]);

  const handleDelete = async (id) => {
    if(!window.confirm('Hành động này không thể hoàn tác. Chắc chắn xóa?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000${currentTab.endpoint}/${id}`);
      fetchData(); // Reload list
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  const handleAddClick = () => {
     setFormData({});
     setEditingId(null);
     setIsModalOpen(true);
  };

  const handleEditClick = (row) => {
     setFormData(row);
     setEditingId(row.id || row.ProductId);
     setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);
     
     // Tiền xử lý dữ liệu trước khi gửi để tránh lỗi casting
     let submitData = { ...formData };
     
     try {
        if (editingId) {
           await axios.put(`http://127.0.0.1:8000${currentTab.endpoint}/${editingId}`, submitData);
        } else {
           await axios.post(`http://127.0.0.1:8000${currentTab.endpoint}`, submitData);
        }
        setIsModalOpen(false);
        fetchData(); // Refetch
     } catch (error) {
        console.error("Lưu lỗi", error.response?.data);
        alert("Lưu thất bại: " + (error.response?.data?.message || "Lỗi máy chủ"));
     } finally {
        setIsSubmitting(false);
     }
  };

  // Cấu hình Cột hiển thị
  const getColumns = () => {
    switch (activeTab) {
      case 'categories': return [ { key: 'id', label: 'ID' }, { key: 'name', label: 'Tên Danh Mục' }, { key: 'slug', label: 'Đường dẫn tĩnh (Slug)' } ];
      case 'products': return [
          { key: 'id', label: 'ID' }, 
          { key: 'imageUrl', label: 'Hình ảnh', render: (val) => val ? <img src={val} className="w-12 h-12 object-contain bg-white rounded border border-gray-200" alt="img" /> : <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">N/A</div> },
          { key: 'name', label: 'Tên Sản Phẩm', render: (val) => <span className="font-semibold text-gray-800">{val}</span> }, 
          { key: 'price', label: 'Giá (VNĐ)', render: (val) => <span className="text-indigo-600 font-medium">{Number(val).toLocaleString('vi-VN')}đ</span> }, 
          { key: 'categoryid', label: 'Danh Mục', render: (val) => { const c = findCategory(val); return c ? <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{c.name}</span> : val; } },
          { key: 'IsOnSale', label: 'Sale', render: (val) => val == 1 ? <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">SALE</span> : <span className="text-gray-400 text-xs">—</span> }
        ];
      case 'users': return [ 
          { key: 'id', label: 'ID' }, 
          { key: 'fullname', label: 'Họ Tên', render: (val) => <span className="font-medium text-gray-900">{val}</span> }, 
          { key: 'email', label: 'Email' }, 
          { key: 'role', label: 'Vai Trò', render: (val) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{val || 'Customer'}</span> } 
        ];
      case 'inventories': return [ 
          { key: 'ProductId', label: 'Sản Phẩm', render: (val) => {
            const p = findProduct(val);
            if (!p) return val;
            return (
              <div className="flex items-center gap-3">
                {p.image ? <img src={p.image} className="w-10 h-10 object-contain bg-white rounded border border-gray-200" alt={p.name} /> : <div className="w-10 h-10 bg-gray-100 rounded"></div>}
                <span className="font-medium text-gray-800">{p.name}</span>
              </div>
            );
          }}, 
          { key: 'QuantityInStock', label: 'Số Lượng Tồn Kho', render: (val) => {
            const color = val > 50 ? 'text-green-600 bg-green-50' : val > 20 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
            return <span className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}>{val} sản phẩm</span>;
          }} 
        ];
      case 'orders': return [ 
          { key: 'id', label: 'Mã Đơn' }, 
          { key: 'userid', label: 'Khách Hàng', render: (val) => { const u = findUser(val); return u ? <span className="font-medium">{u.fullname}</span> : val; }}, 
          { key: 'status', label: 'Trạng Thái', render: (val) => {
            const color = val === 'Đã giao' ? 'bg-green-100 text-green-700' : val === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';
            return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{val}</span>;
          }}, 
          { key: 'totalprice', label: 'Tổng Tiền', render: (val) => <span className="font-semibold text-indigo-600">{Number(val).toLocaleString('vi-VN')}đ</span> } 
        ];
      case 'order-items': return [ 
          { key: 'id', label: 'ID' }, 
          { key: 'orderid', label: 'Mã Đơn', render: (val) => <span className="font-medium">#{val}</span> }, 
          { key: 'productid', label: 'Sản Phẩm', render: (val) => { const p = findProduct(val); return p ? <span className="font-medium">{p.name}</span> : val; }}, 
          { key: 'quantity', label: 'SL', render: (val) => <span className="font-bold">x{val}</span> }, 
          { key: 'unitprice', label: 'Đơn Giá', render: (val) => <span className="text-indigo-600">{Number(val).toLocaleString('vi-VN')}đ</span> } 
        ];
      default: return [];
    }
  };

  // Cấu hình Biểu mẫu (Form fields) — Dùng Dropdown thay cho nhập ID thủ công
  const getFormFields = () => {
    const catOptions = refCategories.map(c => ({ value: c.id, label: c.name }));
    const prodOptions = refProducts.map(p => ({ value: p.id, label: p.name }));
    const userOptions = refUsers.map(u => ({ value: u.id, label: `${u.fullname} (${u.email})` }));
    const orderOptions = refOrders.map(o => ({ value: o.id, label: `Đơn #${o.id} — ${o.shipname}` }));

    switch (activeTab) {
       case 'categories': return [
         { key: 'name', label: 'Tên Danh Mục' }, 
         { key: 'slug', label: 'Đường Dẫn Slug' }
       ];
       case 'products': return [
         { key: 'name', label: 'Tên Sản Phẩm' },
         { key: 'categoryid', label: 'Danh Mục', type: 'select', options: catOptions },
         { key: 'price', label: 'Giá Gốc', type: 'number' },
         { key: 'saleprice', label: 'Giá Sale', type: 'number', required: false },
         { key: 'imageUrl', label: 'URL Hình Ảnh', required: false },
         { key: 'IsOnSale', label: 'Đang Khuyến Mãi', type: 'select', options: [{value: 0, label: 'Không'}, {value: 1, label: 'Có'}] }
       ];
       case 'users': return [
         { key: 'fullname', label: 'Họ Tên' },
         { key: 'email', label: 'Email', type: 'email' },
         { key: 'password', label: 'Mật Khẩu', type: 'password', required: !editingId },
         { key: 'role', label: 'Vai Trò', type: 'select', options: [{value: 'Customer', label: 'Khách Hàng'}, {value: 'Admin', label: 'Quản Trị Viên'}] }
       ];
       case 'inventories': return [
         { key: 'ProductId', label: 'Chọn Sản Phẩm', type: 'select', options: prodOptions },
         { key: 'QuantityInStock', label: 'Số Lượng Tồn Kho', type: 'number' }
       ];
       case 'orders': return [
         { key: 'userid', label: 'Chọn Khách Hàng', type: 'select', options: userOptions },
         { key: 'orderdate', label: 'Ngày Đặt', type: 'date' },
         { key: 'status', label: 'Trạng Thái', type: 'select', options: [{value: 'Chờ xử lý', label: 'Chờ xử lý'}, {value: 'Đang giao', label: 'Đang giao'}, {value: 'Đã giao', label: 'Đã giao'}, {value: 'Đã huỷ', label: 'Đã huỷ'}] },
         { key: 'paymentstatus', label: 'Thanh Toán', type: 'select', options: [{value: 'Chưa thanh toán', label: 'Chưa thanh toán'}, {value: 'Đã thanh toán', label: 'Đã thanh toán'}] },
         { key: 'totalprice', label: 'Tổng Tiền', type: 'number' },
         { key: 'shipname', label: 'Tên Người Nhận' },
         { key: 'shipaddress', label: 'Địa Chỉ Giao' },
         { key: 'shipphone', label: 'Số Điện Thoại Giao' }
       ];
       case 'order-items': return [
         { key: 'orderid', label: 'Chọn Đơn Hàng', type: 'select', options: orderOptions },
         { key: 'productid', label: 'Chọn Sản Phẩm', type: 'select', options: prodOptions },
         { key: 'quantity', label: 'Số Lượng', type: 'number' },
         { key: 'unitprice', label: 'Đơn Giá', type: 'number' }
       ];
       default: return [];
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar Navbar (Light Mode Style) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="p-6 h-20 flex items-center border-b border-gray-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-indigo-200">
             <Package className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
            King<span className="font-medium text-gray-500">Admin</span>
          </h1>
        </div>
        
        <div className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
           Menu Quản Lý
        </div>

        <nav className="flex-1 px-3 space-y-1 py-2 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                     ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50' 
                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={() => window.location.href='/'} className="flex items-center gap-3 px-3 py-2.5 w-full text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors border border-transparent hover:border-red-100">
            <LogOut size={18} /> Thoát hệ thống
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-0">
           <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              {currentTab.label}
           </h1>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                 <div className="w-9 h-9 bg-gray-100 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff" alt="admin" className="w-full h-full object-cover" />
                 </div>
                 <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-700">Quản Trị Viên</p>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                    </p>
                 </div>
              </div>
           </div>
        </header>

        {/* Dash/Table Workspace */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
           {activeTab === 'dashboard' ? (
                 <DashboardOverview 
                  products={refProducts} 
                  users={refUsers} 
                  orders={refOrders} 
                  categories={refCategories} 
                  inventories={data} 
                  API={API}
               />
           ) : loading ? (
             <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
               <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 mb-4"></div>
                  <p className="text-gray-500 font-medium">Đang tải dữ liệu {currentTab.label}...</p>
               </div>
             </div>
           ) : (
             <GenericTable 
               title={`Danh sách ${currentTab.label}`} 
               data={data} 
               columns={getColumns()} 
               onDelete={handleDelete}
               onEdit={handleEditClick}
               onAdd={handleAddClick}
             />
           )}
        </div>
      </main>

      {/* CRUD Modal Form */}
      <CrudModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title={editingId ? `Cập nhật ${currentTab.label}` : `Thêm mới ${currentTab.label}`}
         fields={getFormFields()}
         formData={formData}
         setFormData={setFormData}
         onSubmit={handleFormSubmit}
         isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
