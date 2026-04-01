import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { showError } from '../store/useToastStore';
import { formatErrorMessage, logApiError } from '../utils/errorHandler';
import { Package, ChevronRight, Calendar, MapPin, Phone, CreditCard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, shipped, delivered

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated || !user) {
      showError('Vui lòng đăng nhập để xem đơn hàng');
      navigate('/login', { replace: true });
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders?userid=${user.id}&limit=100`);
      const ordersData = response.data || response;
      // Nếu ordersData là pagination object
      const ordersList = ordersData.data ? ordersData.data : Array.isArray(ordersData) ? ordersData : [];
      setOrders(ordersList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      logApiError(err, 'OrderTracking.fetchOrders');
      showError(formatErrorMessage(err));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Map status colors
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-600/20', text: 'text-yellow-400', label: '⏳ Chờ xác nhận' };
      case 'confirmed':
        return { bg: 'bg-blue-600/20', text: 'text-blue-400', label: '✓ Đã xác nhận' };
      case 'processing':
        return { bg: 'bg-purple-600/20', text: 'text-purple-400', label: '📦 Đang chuẩn bị' };
      case 'shipped':
        return { bg: 'bg-indigo-600/20', text: 'text-indigo-400', label: '🚚 Đang vận chuyển' };
      case 'delivered':
        return { bg: 'bg-green-600/20', text: 'text-green-400', label: '✅ Đã giao' };
      case 'cancelled':
        return { bg: 'bg-red-600/20', text: 'text-red-400', label: '❌ Đã hủy' };
      default:
        return { bg: 'bg-zinc-600/20', text: 'text-zinc-400', label: '❓ Không xác định' };
    }
  };

  const getPaymentStatusDisplay = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return '✅ Đã thanh toán';
      case 'unpaid':
        return '⏳ Chưa thanh toán';
      case 'refunded':
        return '💰 Đã hoàn tiền';
      default:
        return '❓ ' + status;
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === filter);

  // Timeline status order
  const getTimelineProgress = (status) => {
    const statusOrder = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    return statusOrder[status?.toLowerCase()] || 0;
  };

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 text-white min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-blue-500" size={32} />
            <h1 className="text-4xl font-black">Theo dõi đơn hàng</h1>
          </div>
          <p className="text-zinc-400">Kiểm tra tiến độ giao hàng của bạn</p>
        </motion.div>

        {/* FILTER BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {[
            { id: 'all', label: '📋 Tất cả' },
            { id: 'pending', label: '⏳ Chờ xác nhận' },
            { id: 'shipped', label: '🚚 Vận chuyển' },
            { id: 'delivered', label: '✅ Đã giao' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-6 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                filter === btn.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900/50 border border-white/10 text-zinc-300 hover:border-blue-500/50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-zinc-400 mt-4">Đang tải đơn hàng...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package size={64} className="mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400 mb-6 text-lg">
              {filter === 'all' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng trong danh mục này'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition-all"
            >
              Tiếp tục mua sắm
            </button>
          </motion.div>
        )}

        {/* ORDERS LIST */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => {
              const statusInfo = getStatusColor(order.status);
              const progress = getTimelineProgress(order.status);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  className="bg-zinc-900/50 border border-white/10 hover:border-blue-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all"
                >
                  {/* ORDER HEADER */}
                  <div className="p-6 hover:bg-zinc-900/70 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div>
                            <p className="text-xs text-zinc-500 mb-1">MÃ ĐƠN HÀNG</p>
                            <p className="font-bold text-lg font-mono">#{order.id}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${statusInfo.text} font-bold px-3 py-1 rounded-full ${statusInfo.bg}`}>
                              {statusInfo.label}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(order.created_at || order.orderdate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 mb-1">TỔNG TIỀN</p>
                        <p className="text-2xl font-black text-blue-400">
                          {parseInt(order.totalprice).toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
                        <motion.div
                          animate={{ rotate: selectedOrder?.id === order.id ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight size={24} className="text-zinc-500" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="px-6 py-3 bg-zinc-900/30 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={14} className="text-zinc-500" />
                      <p className="text-xs text-zinc-500 font-bold">TIẾN ĐỘ</p>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 h-2 rounded-full transition-colors ${
                            step <= progress ? 'bg-blue-500' : 'bg-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 mt-2">
                      <span>Chờ xác nhận</span>
                      <span>Đã giao</span>
                    </div>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 bg-gradient-to-b from-zinc-900/50 to-transparent"
                    >
                      {/* TIMELINE */}
                      <div className="p-6">
                        <h3 className="font-bold text-white mb-6 text-lg">Quy trình xử lý</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Đã đặt hàng', icon: '📋', status: 'pending' },
                            { label: 'Đã xác nhận', icon: '✓', status: 'confirmed' },
                            { label: 'Đang chuẩn bị', icon: '📦', status: 'processing' },
                            { label: 'Đang vận chuyển', icon: '🚚', status: 'shipped' },
                            { label: 'Đã giao', icon: '✅', status: 'delivered' }
                          ].map((step, i) => {
                            const isActive = getTimelineProgress(order.status) >= getTimelineProgress(step.status);
                            return (
                              <div key={i} className="flex gap-4 items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                                  isActive ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-zinc-800/50 border border-zinc-700'
                                }`}>
                                  {step.icon}
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className={`font-bold ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                                    {step.label}
                                  </p>
                                  {isActive && i < 4 && (
                                    <p className="text-xs text-zinc-400 mt-1">Hoàn thành</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SHIPPING INFO */}
                      <div className="border-t border-white/10 px-6 py-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <MapPin size={18} /> Địa chỉ giao hàng
                        </h3>
                        <div className="bg-zinc-900/50 rounded-lg p-4 space-y-2">
                          <p className="font-bold text-white">{order.shipname}</p>
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <Phone size={14} /> {order.shipphone}
                          </p>
                          <p className="text-sm text-zinc-300">{order.shipaddress}</p>
                        </div>
                      </div>

                      {/* PAYMENT INFO */}
                      <div className="border-t border-white/10 px-6 py-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <CreditCard size={18} /> Thông tin thanh toán
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-xs text-zinc-500 mb-1">PHƯƠNG THỨC</p>
                            <p className="font-bold text-white">
                              {order.paymentstatus === 'paid' ? '💳 Đã thanh toán' : '⏳ Chưa thanh toán'}
                            </p>
                          </div>
                          <div className="bg-zinc-900/50 rounded-lg p-4">
                            <p className="text-xs text-zinc-500 mb-1">TRẠNG THÁI</p>
                            <p className={`font-bold ${statusInfo.text}`}>
                              {statusInfo.label}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="border-t border-white/10 px-6 py-6 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/');
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold transition-all"
                        >
                          Quay về trang chủ
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(null);
                          }}
                          className="flex-1 bg-zinc-900/50 border border-white/10 hover:border-white/20 px-6 py-2 rounded-lg font-bold transition-all"
                        >
                          Đóng
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
