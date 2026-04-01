import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    return parseInt(priceStr.replace(/\D/g, '')) || 0;
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);

  return (
    <main className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-white mb-2">
          Giỏ hàng của bạn
        </h1>
        <p className="text-on-surface-variant text-lg">
          Bạn đang có <span className="text-secondary font-semibold">{cart.length} sản phẩm</span> trong danh sách mua sắm.
        </p>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-outline-variant/20 rounded-[2rem]">
          <p className="text-on-surface-variant font-medium uppercase mb-8">
            Giỏ hàng của bạn đang trống
          </p>
          <Link 
            to="/products"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-dim to-secondary rounded-xl font-bold text-white shadow-[0_0_20px_rgba(0,193,253,0.3)] hover:scale-105 transition-transform"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Product List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div 
                key={item.id}
                className="group relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-surface-container-high transition-all duration-300 hover:bg-surface-container-highest"
              >
                <div className="w-32 h-32 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img
                    alt={item.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                      src={getImageUrl(item.imageUrl)}
                  />
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-headline font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                      {item.variant || 'Standard'}
                    </p>
                    <p className="text-xl font-bold text-secondary mt-2">
                      {(parsePrice(item.price)).toLocaleString('vi-VN')}₫
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-surface-container-lowest rounded-full p-1 border border-white/5">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="px-4 font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button 
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="glass-card p-8 rounded-xl border border-white/5 sticky top-32">
              <h2 className="text-2xl font-headline font-bold text-white mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Phí vận chuyển</span>
                  <span className="text-secondary font-medium">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Tổng cộng</span>
                  <span className="text-2xl font-extrabold text-secondary tracking-tight">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-dim to-secondary text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_20px_rgba(0,193,253,0.3)] transition-all active:scale-95 uppercase tracking-wider"
                >
                  Thanh toán ngay
                </button>

                <div className="p-4 rounded-lg bg-surface-container-low border border-white/5 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Đơn hàng của bạn được bảo vệ bởi Hệ thống bảo mật 256-bit của THE KING.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
