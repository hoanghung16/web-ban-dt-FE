import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart } = useCartStore();

  // Tính tổng tiền từ giỏ hàng
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="pt-32 p-6 md:p-10 text-white min-h-screen max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <ShoppingBag className="text-blue-500" size={32} />
        <h1 className="text-4xl font-black tracking-tighter uppercase">Giỏ hàng <span className="text-blue-500">Của bạn</span></h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
          <p className="text-zinc-500 text-lg mb-6 italic">Giỏ hàng của bạn đang trống rỗng...</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20">
            MUA SẮM NGAY
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 bg-zinc-900/50 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-20 h-20 bg-white rounded-xl p-2 shrink-0">
                   <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{item.name}</h3>
                  <p className="text-zinc-500 text-sm font-mono italic">Số lượng: {item.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-400 mb-2">{(item.price * item.quantity).toLocaleString()}đ</p>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT HÓA ĐƠN */}
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl h-fit sticky top-32 shadow-2xl">
            <h2 className="text-xl font-black uppercase mb-6 border-b border-white/5 pb-4">Tạm tính</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-zinc-400">
                <span>Số lượng sản phẩm:</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển:</span>
                <span className="text-green-500 font-bold italic font-mono uppercase">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-lg font-bold">Tổng cộng:</span>
                <span className="text-2xl font-black text-blue-500 font-mono">
                  {totalPrice.toLocaleString()}đ
                </span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/30 uppercase tracking-widest">
              THANH TOÁN <ArrowRight size={20} />
            </button>
            
            <p className="text-[10px] text-zinc-500 text-center mt-4 uppercase font-bold tracking-tighter italic">
              * Cam kết bảo mật thông tin & Hàng chính hãng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;