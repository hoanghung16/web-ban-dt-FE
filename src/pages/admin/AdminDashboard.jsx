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
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeRange, setTimeRange] = useState(365); // 0=Hôm nay, 7=7 ngày, 30=30 ngày, 365=Năm nay
  const [loading, setLoading] = useState(true);

  // Sample revenue data for chart (động từ API)
  const [revenueData, setRevenueData] = useState([]);

  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
          api.get('/products', { params: { limit: 1000 } }),
          api.get('/categories', { params: { limit: 1000 } }),
          api.get('/users', { params: { limit: 1000 } }).catch(() => ({ data: [] })),
          api.get('/orders', { params: { limit: 1000 } }).catch(() => ({ data: [] }))
        ]);

        const productsList = Array.isArray(productsRes) ? productsRes : (productsRes.data || []);
        const categoriesList = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.data || []);
        const usersList = Array.isArray(usersRes) ? usersRes : (usersRes.data || []);
        const ordersList = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || []);

        setProducts(productsList);
        setOrders(ordersList);

        // Calculate total revenue từ orders
        const revenue = ordersList.reduce((total, order) => total + (parseFloat(order.totalprice) || 0), 0);
        setTotalRevenue(revenue);

        // Generate revenue data by month (mock data distribution)
        const monthlyRevenue = Array(12).fill(0).map((_, idx) => ({
          name: `T${idx + 1}`,
          revenue: Math.round(revenue / 12 * (0.8 + Math.random() * 0.4))
        }));
        setRevenueData(monthlyRevenue);

        setStats({
          productsCount: productsList.length || 0,
          categoriesCount: categoriesList.length || 0,
          usersCount: usersList.length || 0,
          ordersCount: ordersList.length || 0
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
        // Set default revenue data if error
        setRevenueData(Array(12).fill(0).map((_, i) => ({ name: `T${i + 1}`, revenue: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Cập nhật biểu đồ khi timeRange thay đổi
  useEffect(() => {
    if (orders.length > 0) {
      setRevenueData(calculateRevenueData());
    }
  }, [timeRange, orders]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  const getRecentOrders = () => {
    // Lấy 5 đơn hàng gần đây nhất
    return orders.slice(0, 5).sort((a, b) => {
      const dateA = new Date(a.orderdate || a.created_at || 0);
      const dateB = new Date(b.orderdate || b.created_at || 0);
      return dateB - dateA;
    });
  };

  // Lọc orders theo khoảng thời gian
  const getFilteredOrders = () => {
    if (timeRange === 0) {
      // Hôm nay
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return orders.filter(order => {
        const orderDate = new Date(order.orderdate || order.created_at);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
    } else {
      // N ngày qua
      const now = new Date();
      const pastDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);
      return orders.filter(order => {
        const orderDate = new Date(order.orderdate || order.created_at);
        return orderDate >= pastDate && orderDate <= now;
      });
    }
  };

  // Tính toán dữ liệu biểu đồ revenue
  const calculateRevenueData = () => {
    const filteredOrders = getFilteredOrders();
    
    if (timeRange === 0) {
      // Hôm nay: chia thành 24 giờ
      const hourlyData = Array(24).fill(0);
      filteredOrders.forEach(order => {
        const orderDate = new Date(order.orderdate || order.created_at);
        const hour = orderDate.getHours();
        hourlyData[hour] += parseFloat(order.totalprice) || 0;
      });
      return hourlyData.map((revenue, idx) => ({
        name: `${idx}h`,
        revenue: Math.round(revenue)
      }));
    } else if (timeRange === 7) {
      // 7 ngày qua
      const dailyData = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        dailyData[key] = 0;
      }
      filteredOrders.forEach(order => {
        const orderDate = new Date(order.orderdate || order.created_at);
        const key = orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if (dailyData[key] !== undefined) {
          dailyData[key] += parseFloat(order.totalprice) || 0;
        }
      });
      return Object.entries(dailyData).map(([name, revenue]) => ({
        name,
        revenue: Math.round(revenue)
      }));
    } else if (timeRange === 30) {
      // 30 ngày qua
      const dailyData = {};
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        dailyData[key] = 0;
      }
      filteredOrders.forEach(order => {
        const orderDate = new Date(order.orderdate || order.created_at);
        const key = orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if (dailyData[key] !== undefined) {
          dailyData[key] += parseFloat(order.totalprice) || 0;
        }
      });
      return Object.entries(dailyData).map(([name, revenue]) => ({
        name,
        revenue: Math.round(revenue)
      })).slice(-7); // Hiển thị 7 ngày gần nhất
    } else {
      // Năm nay: theo tháng
      const monthlyData = Array(12).fill(0);
      const now = new Date();
      filteredOrders.forEach(order => {
        const orderDate = new Date(order.orderdate || order.created_at);
        if (orderDate.getFullYear() === now.getFullYear()) {
          const month = orderDate.getMonth();
          monthlyData[month] += parseFloat(order.totalprice) || 0;
        }
      });
      return monthlyData.map((revenue, idx) => ({
        name: `T${idx + 1}`,
        revenue: Math.round(revenue)
      }));
    }
  };

  // Tiêu đề biểu đồ
  const getChartTitle = () => {
    switch(timeRange) {
      case 0: return 'Doanh thu Hôm nay';
      case 7: return 'Doanh thu 7 ngày qua';
      case 30: return 'Doanh thu 30 ngày qua';
      case 365: return 'Doanh thu 12 tháng';
      default: return 'Doanh thu';
    }
  };

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: `${(totalRevenue / 1000000).toFixed(1)}M đ`,
      trend: '—',
      isPositive: null,
      icon: <DollarSign className="text-emerald-500" size={24} />,
      bg: 'bg-emerald-100'
    },
    {
      title: 'Sản phẩm',
      value: stats.productsCount,
      trend: '—',
      isPositive: null,
      icon: <Package className="text-blue-500" size={24} />,
      bg: 'bg-blue-100'
    },
    {
      title: 'Đơn hàng mới',
      value: stats.ordersCount,
      trend: '—',
      isPositive: null,
      icon: <ShoppingCart className="text-purple-500" size={24} />,
      bg: 'bg-purple-100'
    },
    {
      title: 'Khách hàng',
      value: stats.usersCount,
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
        <div className="flex space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Hôm nay</option>
            <option value={7}>7 ngày qua</option>
            <option value={30}>30 ngày qua</option>
            <option value={365}>Năm nay</option>
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
                  <span className={`flex items-center font-medium ${stat.isPositive === true ? 'text-emerald-500' : stat.isPositive === false ? 'text-red-500' : 'text-slate-500'}`}>
                    {stat.isPositive === true ? <ArrowUpRight size={16} className="mr-1" /> : stat.isPositive === false ? <ArrowDownRight size={16} className="mr-1" /> : null}
                    {stat.trend}
                  </span>
                  {stat.isPositive !== null && <span className="text-slate-500 ml-2">so với tháng trước</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">{getChartTitle()}</h3>
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
                {loading ? (
                  <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
                ) : products.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">Chưa có sản phẩm</div>
                ) : (
                  products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={getImageUrl(product.imageUrl)} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => e.target.src = 'https://via.placeholder.com/40?text=No+Image'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">{index + 1}</span>
                          <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{product.category?.name || 'N/A'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-end gap-2">
                          {product.IsOnSale && product.saleprice ? (
                            <>
                              <span className="text-xs text-slate-400 line-through">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                              <p className="text-sm font-bold text-red-600">{Number(product.saleprice).toLocaleString('vi-VN')}đ</p>
                            </>
                          ) : (
                            <p className="text-sm font-bold text-slate-800">{Number(product.price).toLocaleString('vi-VN')}đ</p>
                          )}
                        </div>
                        <p className="text-xs text-emerald-500 mt-1">Sẵn có</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-slate-200">
                <Link to="/admin/products" className="w-full block py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
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
                    <th className="px-6 py-4">Ngày đặt</th>
                    <th className="px-6 py-4">Tổng tiền</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getRecentOrders().length > 0 ? (
                    getRecentOrders().map((order) => {
                      const statusAttr = getStatusColor(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-800">#{order.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {order.user?.fullname?.charAt(0).toUpperCase() || 'K'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{order.user?.fullname || 'N/A'}</p>
                                <p className="text-xs text-slate-500 truncate">{order.user?.email || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatDate(order.orderdate || order.created_at)}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">
                            {Number(order.totalprice).toLocaleString('vi-VN')}đ
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusAttr.bg} ${statusAttr.text}`}>
                              {statusAttr.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/admin/orders`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
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
