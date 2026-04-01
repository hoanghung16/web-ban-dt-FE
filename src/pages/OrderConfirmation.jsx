import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="pt-32 pb-20 px-4 text-white min-h-screen text-center">
        <p className="text-zinc-400 mb-6 text-lg">Không tìm thấy thông tin đơn hàng</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition-all"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // Tạo mã đơn hàng
  const orderId = `ORD-${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 text-white min-h-screen bg-gradient-to-b from-green-600/5 to-transparent">
      <div className="max-w-3xl mx-auto">
        
        {/* SUCCESS ICON */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <CheckCircle size={120} className="text-green-500 relative" />
          </div>
        </motion.div>

        {/* HEADING */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black mb-4 text-green-400">Đặt hàng thành công! 🎉</h1>
          <p className="text-zinc-400 text-lg">Cảm ơn bạn đã tin tưởng THE KING Store</p>
        </motion.div>

        {/* ORDER ID & DATE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-600/10 border border-green-500/30 rounded-2xl p-6 mb-8 text-center"
        >
          <p className="text-zinc-400 text-sm mb-2">MÃ ĐƠN HÀNG</p>
          <p className="text-3xl font-black text-green-400 font-mono mb-6">{orderId}</p>
          <p className="text-zinc-400 text-sm">Ngày đặt: {orderData.date}</p>
        </motion.div>

        {/* ORDER TIMELINE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-black mb-8 text-white">Các bước tiếp theo</h2>
          
          <div className="space-y-6">
            {[
              { icon: Package, title: 'Chuẩn bị hàng', desc: 'Chúng tôi sẽ chuẩn bị đơn hàng của bạn' },
              { icon: Truck, title: 'Đang vận chuyển', desc: `Dự kiến giao hàng: ${estimatedDelivery.toLocaleDateString('vi-VN')}` },
              { icon: CheckCircle, title: 'Giao hàng thành công', desc: 'Bạn sẽ nhận được thông báo khi giao hàng' }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      i === 0 ? 'bg-green-600/20 border border-green-500/50' : 'bg-zinc-800/50 border border-zinc-700'
                    }`}>
                      <Icon size={24} className={i === 0 ? 'text-green-400' : 'text-zinc-500'} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-zinc-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* DELIVERY INFO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          
          {/* SHIPPING ADDRESS */}
          <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6">
            <h3 className="font-black text-white mb-4 flex items-center gap-2">
              <Truck size={20} className="text-blue-500" /> Địa chỉ giao hàng
            </h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-bold text-white">{orderData.shipping.fullName}</p>
              <p>{orderData.shipping.phone}</p>
              <p>{orderData.shipping.address}</p>
              <p>{orderData.shipping.district}, {orderData.shipping.city}</p>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6">
            <h3 className="font-black text-white mb-4 flex items-center gap-2">
              💳 Phương thức thanh toán
            </h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-bold text-white uppercase">
                {orderData.payment.method === 'cod' ? '💵 Thanh toán khi nhận hàng' : 
                 orderData.payment.method === 'bank' ? '🏦 Chuyển khoản ngân hàng' : 
                 '💳 Thẻ tín dụng'}
              </p>
              <p className="text-blue-400 font-bold">Tổng tiền: {orderData.total.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </motion.div>

        {/* ORDER ITEMS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <h3 className="font-black text-white mb-6">Chi tiết đón hàng</h3>
          
          <div className="space-y-4">
            {orderData.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={getImageUrl(item.imageUrl)} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-zinc-400 text-sm">Số lượng: {item.quantity}</p>
                </div>
                <p className="font-bold text-blue-400 min-w-fit">{(parseInt(item.price.replace(/\D/g, '')) * item.quantity).toLocaleString('vi-VN')}đ</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6">
            <span className="font-black text-white text-lg">Tổng cộng:</span>
            <span className="font-black text-3xl text-blue-400">{orderData.total.toLocaleString('vi-VN')}đ</span>
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 flex-col md:flex-row"
        >
          <button 
            onClick={() => navigate('/orders')}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl transition-all"
          >
            📦 Theo dõi đơn hàng
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all"
          >
            Quay về trang chủ
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="flex-1 bg-zinc-900/50 border border-white/10 hover:border-blue-500/30 text-white font-black py-4 rounded-xl transition-all"
          >
            Tiếp tục mua sắm
          </button>
        </motion.div>

        {/* SUPPORT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 text-center"
        >
          <p className="text-zinc-500 text-sm mb-2">Nếu bạn có bất kỳ câu hỏi nào</p>
          <p className="text-white font-bold">📞 Liên hệ hỗ trợ: 1900.1234 | 📧 support@theking.com</p>
          <p className="text-zinc-400 text-xs mt-3">Chúng tôi hỗ trợ bạn 24/7 🌟</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
