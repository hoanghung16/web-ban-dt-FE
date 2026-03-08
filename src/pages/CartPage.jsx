import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('kingCart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId, delta) => {
    const cart = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(cart);
    localStorage.setItem('kingCart', JSON.stringify(cart));
  };

  const removeItem = (productId) => {
    const cart = cartItems.filter(item => item.id !== productId);
    setCartItems(cart);
    localStorage.setItem('kingCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('kingCart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Parse giá từ chuỗi "29.990.000đ" thành số
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(String(priceStr).replace(/[^\d]/g, ''), 10) || 0;
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-king-bg">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white">Giỏ Hàng Của Bạn</h1>
          <span className="text-king-muted font-medium">{cartItems.length} sản phẩm</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart size={64} className="mx-auto mb-6 text-king-border" />
            <h2 className="text-2xl font-bold text-white mb-3">Giỏ hàng đang trống</h2>
            <p className="text-king-muted mb-8">Hãy thêm sản phẩm yêu thích vào giỏ hàng để tiến hành mua sắm.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-king-text text-king-bg rounded-full font-black hover:scale-105 transition-transform">
              <ArrowLeft size={18} /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Danh sách sản phẩm trong giỏ */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="glass rounded-2xl p-5 flex gap-5 items-center group hover:border-king-accent/30 transition-all">
                  {/* Ảnh */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
                    </div>
                  </Link>

                  {/* Thông tin */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="text-white font-bold hover:text-king-accent transition-colors line-clamp-1 block mb-1">
                      {item.name}
                    </Link>
                    <p className="text-king-muted text-sm mb-3">{item.color}</p>
                    
                    {/* Số lượng */}
                    <div className="flex items-center border border-king-border rounded-full w-fit">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1.5 text-king-muted hover:text-white transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1.5 text-white font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1.5 text-king-muted hover:text-white transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Giá + Xóa */}
                  <div className="text-right shrink-0">
                    <p className="text-white font-black text-lg mb-3">{item.price}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm font-medium mt-2 flex items-center gap-1.5">
                <Trash2 size={14} /> Xóa toàn bộ giỏ hàng
              </button>
            </div>

            {/* Bảng tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-black text-white mb-6">Tóm Tắt Đơn Hàng</h3>
                
                <div className="space-y-3 mb-6 border-b border-king-border pb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-king-muted">Tạm tính ({cartItems.reduce((s,i)=>s+i.quantity,0)} sản phẩm)</span>
                    <span className="text-white font-medium">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-king-muted">Phí vận chuyển</span>
                    <span className="text-green-400 font-medium">Miễn phí</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="text-white font-bold">Tổng cộng</span>
                  <span className="text-2xl font-black text-white">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                <button className="w-full py-4 bg-king-text text-king-bg rounded-full font-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4">
                  Tiến Hành Thanh Toán
                </button>

                <Link to="/" className="w-full py-3 border border-king-border text-king-muted hover:text-white hover:border-white/30 rounded-full font-bold text-center block transition-all text-sm">
                  Tiếp tục mua sắm
                </Link>

                <div className="flex items-center gap-2 mt-6 text-king-muted text-xs">
                  <ShieldCheck size={16} className="text-green-400 shrink-0" />
                  Thanh toán an toàn và bảo mật tuyệt đối
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
