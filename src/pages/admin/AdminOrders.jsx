import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Eye, Trash2, Search, Filter } from 'lucide-react';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../../constants';
import { formatDate, formatPrice } from '../../utils/helpers';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/orders', { params });
      setOrders(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { paymentstatus: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentstatus: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentstatus: newStatus });
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thanh toán:", error);
      alert("Không thể cập nhật trạng thái thanh toán");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await api.delete(`/orders/${id}`);
        setOrders(orders.filter(order => order.id !== id));
        setShowDetailModal(false);
      } catch (error) {
        console.error("Lỗi xóa đơn hàng:", error);
        alert("Không thể xóa đơn hàng này");
      }
    }
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(searchTerm) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower) ||
      order.shipname?.toLowerCase().includes(searchLower) ||
      order.shipphone?.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h2>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Tổng: {orders.length} đơn
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50 flex-wrap">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đã gửi</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Mã ĐH</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">TT Thanh toán</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statAttr = { ...ORDER_STATUS_COLORS[order.status], label: ORDER_STATUS_LABELS[order.status] } || { bg: 'bg-gray-100', text: 'text-gray-700', label: order.status };
                    const payStatAttr = { ...PAYMENT_STATUS_COLORS[order.paymentstatus], label: PAYMENT_STATUS_LABELS[order.paymentstatus] } || { bg: 'bg-gray-100', text: 'text-gray-700', label: order.paymentstatus };
                    
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">#{order.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-800">{order.user?.name || 'N/A'}</p>
                            <p className="text-xs text-slate-500">{order.user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(order.orderdate || order.created_at)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-red-600">
                          {formatPrice(order.totalprice)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statAttr.bg} ${statAttr.text}`}>
                            {statAttr.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${payStatAttr.bg} ${payStatAttr.text}`}>
                            {payStatAttr.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => viewOrderDetail(order)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
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

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Đặt lúc: {formatDate(selectedOrder.orderdate || selectedOrder.created_at)}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Khách hàng</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.user?.name}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Liên hệ giao hàng</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.shipname}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.shipphone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Địa chỉ giao hàng</p>
                <p className="text-sm text-slate-800 mt-1">{selectedOrder.shipaddress}</p>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-3">Sản phẩm đã đặt</p>
                <div className="space-y-2 bg-slate-50 rounded-lg p-4 border border-slate-200">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{item.product?.name || `Sản phẩm #${item.productid}`}</p>
                          <p className="text-xs text-slate-500">
                            {item.quantity}x @ {formatPrice(item.unitprice)}
                          </p>
                        </div>
                        <p className="font-semibold text-red-600 ml-4">
                          {formatPrice(item.quantity * item.unitprice)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-2">Không có sản phẩm</p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-slate-800 font-semibold">Tổng cộng:</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatPrice(selectedOrder.totalprice)}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Trạng thái đơn hàng</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã gửi</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-semibold">Trạng thái thanh toán</label>
                  <select
                    value={selectedOrder.paymentstatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unpaid">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="refunded">Hoàn tiền</option>
                  </select>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
