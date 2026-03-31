import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    usersCount: 0,
    ordersCount: 0
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample revenue data for chart
  const revenueData = [
    { name: 'T1', revenue: 4000 },
    { name: 'T2', revenue: 3000 },
    { name: 'T3', revenue: 2000 },
    { name: 'T4', revenue: 2780 },
    { name: 'T5', revenue: 1890 },
    { name: 'T6', revenue: 2390 },
    { name: 'T7', revenue: 3490 },
    { name: 'T8', revenue: 4200 },
    { name: 'T9', revenue: 3800 },
    { name: 'T10', revenue: 4500 },
    { name: 'T11', revenue: 4100 },
    { name: 'T12', revenue: 5200 }
  ];

  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, usersRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/users').catch(() => ([]))
        ]);

        const productsList = Array.isArray(productsRes) ? productsRes : (productsRes.data || []);
        const categoriesList = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.data || []);
        const usersList = Array.isArray(usersRes) ? usersRes : (usersRes.data || []);

        setProducts(productsList);

        setStats({
          productsCount: productsList.length || 0,
          categoriesCount: categoriesList.length || 0,
          usersCount: usersList.length || 0,
          ordersCount: 156
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: '24.500.000đ',
      trend: '+12.5%',
      isPositive: true,
      icon: <DollarSign className="text-emerald-500" size={24} />,
      bg: 'bg-emerald-100'
    },
    {
      title: 'Sản phẩm',
      value: stats.productsCount,
      trend: '+5.2%',
      isPositive: true,
      icon: <Package className="text-blue-500" size={24} />,
      bg: 'bg-blue-100'
    },
    {
      title: 'Đơn hàng mới',
      value: stats.ordersCount,
      trend: '-2.1%',
      isPositive: false,
      icon: <ShoppingCart className="text-purple-500" size={24} />,
      bg: 'bg-purple-100'
    },
    {
      title: 'Khách hàng',
      value: stats.usersCount,
      trend: '+18.2%',
      isPositive: true,
      icon: <Users className="text-orange-500" size={24} />,
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan Dashboard</h2>
        <div className="flex space-x-2">
          <select className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Hôm nay</option>
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={`flex items-center font-medium ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                    {stat.trend}
                  </span>
                  <span className="text-slate-500 ml-2">so với tháng trước</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Doanh thu 12 tháng</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                      formatter={(value) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      dot={{ fill: '#0ea5e9', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Doanh thu"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Sản phẩm bán chạy</h3>
              </div>
              <div className="p-0 max-h-96 overflow-y-auto">
                {products.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center text-blue-600 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{product.category?.name || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{Number(product.price).toLocaleString('vi-VN')}đ</p>
                      <p className="text-xs text-emerald-500">Sẵn có</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <button className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Xem tất cả
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Placeholder */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h3>
              <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                Xem tất cả
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Mã đơn</th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Ngày đặt</th>
                    <th className="px-6 py-4">Tổng tiền</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <tr key={order} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">#ORD-2026{order}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            KH
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">Khách hàng {order}</p>
                            <p className="text-xs text-slate-500">khachhang{order}@example.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">31/03/2026</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {(order * 1500000).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          order % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order % 2 === 0 ? 'Đã giao' : 'Đang xử lý'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
