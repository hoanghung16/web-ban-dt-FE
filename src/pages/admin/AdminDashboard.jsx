import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageHelper';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/admin/dashboard');
        // API returns { success: true, data: {...} } - lấy phần data
        setDashboardData(response.data.data || response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard:", error);
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN');
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xử lý' },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã xác nhận' },
      'processing': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Đang xử lý' },
      'shipped': { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Đã gửi' },
      'delivered': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã giao' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
    };
    return statusMap[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status || 'N/A' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        {error || "Không thể tải dữ liệu dashboard"}
      </div>
    );
  }

  const data = dashboardData;
  const revenueData = Object.entries(data.revenue_trend || {}).map(([date, amount]) => ({
    name: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    revenue: amount
  }));

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: `${formatCurrency(data.total_revenue)}đ`,
      trend: '—',
      isPositive: null,
      icon: <DollarSign className="text-emerald-500" size={24} />,
      bg: 'bg-emerald-100'
    },
    {
      title: 'Sản phẩm',
      value: data.total_products,
      trend: '—',
      isPositive: null,
      icon: <Package className="text-blue-500" size={24} />,
      bg: 'bg-blue-100'
    },
    {
      title: 'Tổng đơn hàng',
      value: data.total_orders,
      trend: '—',
      isPositive: null,
      icon: <ShoppingCart className="text-purple-500" size={24} />,
      bg: 'bg-purple-100'
    },
    {
      title: 'Khách hàng',
      value: data.total_customers,
      trend: '—',
      isPositive: null,
      icon: <Users className="text-orange-500" size={24} />,
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan Dashboard</h2>
      </div>

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
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-yellow-600" size={24} />
            <h3 className="text-lg font-bold text-yellow-800">Cảnh báo hàng hết</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{data.low_stock_alerts}</p>
          <p className="text-sm text-yellow-600 mt-2">Sản phẩm sắp hết hàng</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="text-blue-600" size={24} />
            <h3 className="text-lg font-bold text-blue-800">Đơn hàng chờ xử lý</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">{data.pending_orders}</p>
          <p className="text-sm text-blue-600 mt-2">Chờ xác nhận hoặc xử lý</p>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Doanh thu 7 ngày qua</h3>
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
                  formatter={(value) => [`${formatCurrency(value)}đ`, 'Doanh thu']}
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
            {data.top_products.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Chưa có dữ liệu</div>
            ) : (
              data.top_products.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-500">{product.sales} sold</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h3>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recent_orders.length > 0 ? (
                data.recent_orders.map((order) => {
                  const statusAttr = getStatusColor(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">{order.customer_name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {formatCurrency(order.total_amount)}đ
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusAttr.bg} ${statusAttr.text}`}>
                          {statusAttr.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(order.created_at)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Khách hàng mới</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recent_customers.length > 0 ? (
                data.recent_customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-slate-800">{customer.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(customer.joined_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                    Không có khách hàng mới
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
