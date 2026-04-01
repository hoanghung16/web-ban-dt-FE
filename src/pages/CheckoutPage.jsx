import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { showSuccess, showError } from '../store/useToastStore';
import { formatErrorMessage, logApiError } from '../utils/errorHandler';
import { ArrowRight, Check, Truck, CreditCard, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirm
  const [loading, setLoading] = useState(false);

  // Nếu chưa đăng nhập, redirect đến login
  useEffect(() => {
    if (!isAuthenticated || !user) {
      showError('Vui lòng đăng nhập để thanh toán');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Form states
  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
  });

  const [payment, setPayment] = useState({
    method: 'cod', // cod, bank, card
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    return parseInt(priceStr.replace(/\D/g, '')) || 0;
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);

  const shipping_fee = totalPrice > 1000000 ? 0 : 30000;
  const final_price = totalPrice + shipping_fee;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 text-white min-h-screen text-center">
        <p className="text-zinc-400 mb-6 text-lg">Giỏ hàng trống, không thể thanh toán!</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition-all"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  const handleNextStep = () => {
    if (step === 1 && !shipping.fullName) {
      showError('Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        showError('Lỗi: Không tìm thấy thông tin người dùng');
        setLoading(false);
        return;
      }

      // Chuẩn bị dữ liệu order - PHẢI MATCH VỚI BACKEND FIELD NAMES
      const orderPayload = {
        userid: user.id,
        shipname: shipping.fullName,
        shipaddress: shipping.address,
        shipphone: shipping.phone,
        totalprice: final_price,
        status: 'pending',
        paymentstatus: payment.method === 'cod' ? 'unpaid' : 'unpaid'
      };

      // Gửi order đến API
      const response = await api.post('/orders', orderPayload);
      const orderId = response.data?.id || response.id;
      
      if (!orderId) {
        showError('Lỗi: Không tạo được đơn hàng');
        setLoading(false);
        return;
      }

      // Sau khi tạo order, thêm từng item vào order
      for (const item of cart) {
        try {
          await api.post('/order-items', {
            orderid: orderId,
            productid: item.id,
            quantity: item.quantity,
            unitprice: typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, '')) : item.price
          });
        } catch (itemErr) {
          logApiError(itemErr, 'CheckoutPage.createOrderItem');
          // Tiếp tục tạo items khác nếu cái này lỗi
        }
      }

      showSuccess('Đặt hàng thành công! 🎉');
      
      // Xóa giỏ hàng
      clearCart();
      
      // Chuyển hướng đến trang xác nhận
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderData: {
              orderId,
              shipping,
              payment,
              items: cart,
              total: final_price,
              date: new Date().toLocaleDateString('vi-VN')
            }
          }
        });
      }, 1500);
    } catch (err) {
      // Log lỗi chi tiết
      logApiError(err, 'CheckoutPage.handleSubmitOrder');
      
      // Lấy thông báo lỗi formatted
      const errorMsg = formatErrorMessage(err, true);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Giao hàng', 'Thanh toán', 'Xác nhận'];

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* PROGRESS STEPS */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  backgroundColor: s <= step ? '#3b82f6' : '#27272a',
                  borderColor: s <= step ? '#3b82f6' : '#52525b'
                }}
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg"
              >
                {s < step ? <Check size={20} /> : s}
              </motion.div>
              <span className={s <= step ? 'text-white font-bold' : 'text-zinc-500'}>{stepTitles[s - 1]}</span>
              {s < 3 && <div className={`w-12 h-1 rounded-full ${s < step ? 'bg-blue-600' : 'bg-zinc-700'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* FORM SECTION */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* STEP 1: SHIPPING */}
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <Truck className="text-blue-500" /> Thông tin giao hàng
                </h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Họ và tên"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({...shipping, fullName: e.target.value})}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                    />
                    <input 
                      type="email" 
                      placeholder="Email"
                      value={shipping.email}
                      onChange={(e) => setShipping({...shipping, email: e.target.value})}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                  
                  <input 
                    type="tel" 
                    placeholder="Số điện thoại"
                    value={shipping.phone}
                    onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                  />
                  
                  <input 
                    type="text" 
                    placeholder="Địa chỉ"
                    value={shipping.address}
                    onChange={(e) => setShipping({...shipping, address: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                  />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Thành phố"
                      value={shipping.city}
                      onChange={(e) => setShipping({...shipping, city: e.target.value})}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Quận/Huyện"
                      value={shipping.district}
                      onChange={(e) => setShipping({...shipping, district: e.target.value})}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PAYMENT */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <CreditCard className="text-blue-500" /> Phương thức thanh toán
                </h2>
                
                <div className="space-y-4">
                  {['cod', 'bank', 'card'].map((method) => (
                    <label key={method} className="flex items-center gap-4 p-4 border border-white/10 rounded-lg hover:border-blue-500/30 cursor-pointer transition-all">
                      <input 
                        type="radio" 
                        name="payment"
                        value={method}
                        checked={payment.method === method}
                        onChange={(e) => setPayment({...payment, method: e.target.value})}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="font-bold text-sm uppercase">
                        {method === 'cod' ? '💵 Thanh toán khi nhận hàng' : 
                         method === 'bank' ? '🏦 Chuyển khoản ngân hàng' : 
                         '💳 Thẻ tín dụng'}
                      </span>
                    </label>
                  ))}
                  
                  {payment.method === 'card' && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <input 
                        type="text" 
                        placeholder="Tên chủ thẻ"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Số thẻ (16 chữ số)"
                        maxLength="19"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                        />
                        <input 
                          type="text" 
                          placeholder="CVV"
                          maxLength="3"
                          className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: REVIEW */}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black mb-6 text-green-400">✓ Xác nhận đơn hàng</h2>
                <p className="text-zinc-300 mb-4">Kiểm tra lại thông tin trước khi hoàn thành thanh toán:</p>
                
                <div className="space-y-3 text-sm">
                  <p><span className="text-zinc-400">Người nhận:</span> <span className="text-white font-bold">{shipping.fullName}</span></p>
                  <p><span className="text-zinc-400">Số điện thoại:</span> <span className="text-white font-bold">{shipping.phone}</span></p>
                  <p><span className="text-zinc-400">Địa chỉ giao hàng:</span> <span className="text-white font-bold">{shipping.address}</span></p>
                  <p><span className="text-zinc-400">Phương thức thanh toán:</span> <span className="text-white font-bold uppercase">
                    {payment.method === 'cod' ? 'Thanh toán khi nhận' : 
                     payment.method === 'bank' ? 'Chuyển khoản' : 'Thẻ tín dụng'}
                  </span></p>
                </div>
              </motion.div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-zinc-900/30 border border-white/10 hover:border-white/20 text-white font-bold py-3 rounded-lg transition-all"
                >
                  ← Quay lại
                </button>
              )}
              {step < 3 ? (
                <button 
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Tiếp tục <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? '⏳ Xử lý...' : '✓ HOÀN THÀNH ĐẶT HÀNG'}
                </button>
              )}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32 bg-gradient-to-br from-blue-600/10 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="font-black text-lg mb-6">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-white/10 pb-3">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-zinc-400 text-xs">x{item.quantity}</p>
                    </div>
                    <p className="text-blue-400 font-bold">{(parsePrice(item.price) * item.quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Tạm tính:</span>
                  <span className="text-white font-bold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Vận chuyển:</span>
                  <span className="text-white font-bold">{shipping_fee === 0 ? 'MIỄN PHÍ' : shipping_fee.toLocaleString('vi-VN') + 'đ'}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-3 border-t border-white/10">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-400">{final_price.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {totalPrice <= 1000000 && (
                <p className="text-xs text-blue-400 mt-4 bg-blue-500/10 p-3 rounded-lg">
                  💡 Mua thêm {(1000000 - totalPrice).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
