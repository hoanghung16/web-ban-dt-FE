import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Cpu, Camera, Battery, ChevronRight, Zap, Star, Shield, Truck, HeadphonesIcon, Filter, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ModernPhoneShop = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const API = 'http://127.0.0.1:8000';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`)
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryid == activeCategory);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-king-accent selection:text-white">
      <Header />
      
      <main className="flex-1 bg-king-bg pb-24 relative">
        {/* Animated background lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 flex justify-center">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-king-border to-transparent ml-[20%]"></div>
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-king-border to-transparent ml-[30%]"></div>
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-king-border to-transparent ml-[30%]"></div>
        </div>

        {/* 1. HERO SECTION */}
        <section className="relative pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between z-10">
          
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>

          {/* Left Text Content */}
          <div className="md:w-1/2 text-center md:text-left mb-16 md:mb-0">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-king-card border border-king-border mb-6">
                <span className="w-2 h-2 rounded-full bg-king-accent animate-pulse"></span>
                <span className="text-xs font-bold text-king-text tracking-widest uppercase">Ra mắt toàn cầu</span>
             </div>
             
             <h2 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                Sức mạnh <br/> <span className="text-gradient">Vượt Giới Hạn.</span>
             </h2>

             <p className="text-lg md:text-xl text-king-muted font-light mb-10 max-w-md mx-auto md:mx-0">
               Trải nghiệm kỷ nguyên AI mới với dòng sản phẩm điện thoại thông minh cao cấp nhất năm {new Date().getFullYear()}.
             </p>

             <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
               <button className="w-full sm:w-auto px-8 py-4 bg-king-text text-king-bg rounded-full font-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                 Mua Ngay Dòng Pro <ChevronRight size={18} />
               </button>
               <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-king-border text-king-text rounded-full font-bold hover:bg-king-card transition-colors flex items-center justify-center">
                 Khám phá tính năng
               </button>
             </div>
          </div>

          {/* Right Hero Image  */}
          <div className="md:w-1/2 relative flex justify-center mt-10 md:mt-0">
             <div className="w-[300px] h-[600px] md:w-[350px] md:h-[700px] bg-gradient-to-br from-zinc-800 to-black rounded-[50px] border-[8px] border-zinc-900 shadow-2xl relative flex items-center justify-center group transform rotate-2 hover:rotate-0 transition-transform duration-700">
               <div className="absolute -bottom-10 w-3/4 h-8 bg-king-accent/40 blur-xl rounded-full"></div>
               <div className="w-[95%] h-[98%] bg-zinc-950 rounded-[40px] overflow-hidden relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-20"></div>
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-black flex items-center justify-center">
                     <span className="text-white/20 font-black tracking-widest text-xl rotate-[-90deg]">SUPER HERO PHONE</span>
                  </div>
               </div>
             </div>
          </div>
        </section>

        {/* 2. TRUST BAR - Thanh tin cậy */}
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-20 z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Giao Hàng Nhanh', desc: 'Nhận hàng trong 24h' },
              { icon: Shield, title: 'Chính Hãng 100%', desc: 'Bảo hành toàn quốc' },
              { icon: HeadphonesIcon, title: 'Hỗ Trợ 24/7', desc: 'Tư vấn miễn phí' },
              { icon: Star, title: 'Uy Tín Hàng Đầu', desc: '10.000+ đánh giá 5 sao' }
            ].map((item, i) => (
              <div key={i} className="glass p-5 rounded-2xl flex items-center gap-4 hover:border-king-accent/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-king-accent/10 flex items-center justify-center group-hover:bg-king-accent/20 transition-colors">
                  <item.icon size={22} className="text-king-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-king-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FEATURES GRID - Glassmorphism */}
        <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-32 z-20">
           <div className="text-center mb-12">
             <span className="text-king-accent uppercase font-black tracking-widest text-xs">Công nghệ đỉnh cao</span>
             <h2 className="text-3xl md:text-5xl font-black text-white mt-3">Tại Sao Chọn Chúng Tôi?</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-8 rounded-[2rem] group hover:border-king-muted/30 transition-all duration-500 overflow-hidden relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Cpu className="text-king-accent mb-6" size={40} />
                  <h3 className="text-2xl font-black text-white mb-2">Chip A17 Pro</h3>
                  <p className="text-king-muted text-sm leading-relaxed">Bộ vi xử lý đồ họa mang lại trải nghiệm chiến game console sắc nét và mượt mà chưa từng có.</p>
                </div>
              </div>

              <div className="glass p-8 rounded-[2rem] group hover:border-king-muted/30 transition-all duration-500 overflow-hidden relative">
                 <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Camera className="text-purple-400 mb-6" size={40} />
                  <h3 className="text-2xl font-black text-white mb-2">Camera Vượt Trội</h3>
                  <p className="text-king-muted text-sm leading-relaxed">Cảm biến 48MP và khả năng chụp thiếu sáng ấn tượng, bắt trọn từng khoảnh khắc đậm chất điện ảnh.</p>
                </div>
              </div>

              <div className="glass p-8 rounded-[2rem] group hover:border-king-muted/30 transition-all duration-500 overflow-hidden relative">
                 <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Battery className="text-green-400 mb-6" size={40} />
                  <h3 className="text-2xl font-black text-white mb-2">Pin Khổng Lồ</h3>
                  <p className="text-king-muted text-sm leading-relaxed">Hỗ trợ sạc nhanh AI thông minh, lên đến 29 giờ xem video liên tục không gián đoạn.</p>
                </div>
              </div>
           </div>
        </section>

        {/* 4. FLASH SALE BANNER */}
        {products.some(p => p.flash_sale) && (
          <section className="relative max-w-7xl mx-auto px-4 md:px-8 mb-20 z-10">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-1">
              <div className="bg-king-bg rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="text-yellow-400 animate-pulse" size={28} />
                    <span className="text-xs font-black tracking-widest uppercase text-yellow-400">Flash Sale đang diễn ra</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-2">Giảm Tới <span className="text-gradient">50%</span> Hôm Nay</h3>
                  <p className="text-king-muted">Ưu đãi có hạn cho các sản phẩm được đánh dấu SALE. Nhanh tay kẻo hết!</p>
                </div>
                <button className="shrink-0 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-black hover:scale-105 transition-transform shadow-lg shadow-red-500/30 flex items-center gap-2">
                  Xem Ngay <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 5. TRENDING PRODUCTS với Category Filter */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32 z-10 relative">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                 <span className="text-king-accent uppercase font-black tracking-widest text-xs">Mới ra mắt</span>
                 <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Dòng Sản Phẩm Hot</h2>
              </div>
              <button className="flex items-center gap-2 text-king-muted hover:text-white transition-colors group">
                <span className="font-bold border-b border-transparent group-hover:border-white">Xem tất cả siêu phẩm</span>
                <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           {/* Category Filter Tabs */}
           <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border ${
                  activeCategory === 'all' 
                    ? 'bg-king-text text-king-bg border-king-text shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                    : 'bg-transparent text-king-muted border-king-border hover:text-white hover:border-king-text/50'
                }`}
              >
                <Filter size={14} /> Tất cả
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border ${
                    activeCategory === cat.id 
                      ? 'bg-king-text text-king-bg border-king-text shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-transparent text-king-muted border-king-border hover:text-white hover:border-king-text/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
           </div>

           {loading ? (
             <div className="flex justify-center my-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-king-accent"></div>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {filteredProducts.map(product => (
                 <Link 
                    to={`/product/${product.id}`}
                    key={product.id}
                  className="bg-king-card border border-king-border rounded-3xl p-5 relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-king-accent/50 cursor-pointer block"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
               >
                  {/* Glow shadow backdrop */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-king-accent/10 to-transparent transition-opacity duration-500 ${hoveredId === product.id ? 'opacity-100' : 'opacity-0'}`}></div>

                  {/* Vùng chứa ảnh */}
                  <div className="aspect-[4/4] bg-white rounded-2xl mb-5 flex flex-col items-center justify-center border border-gray-100 relative overflow-hidden group-hover:border-king-accent/50 transition-colors duration-500">
                     {/* Tag + Flash Sale */}
                     <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                       {product.flash_sale && (
                         <span className="px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/30 flex items-center gap-1">
                           <Zap size={10} /> SALE
                         </span>
                       )}
                       {product.tag && !product.flash_sale && (
                         <span className="px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full bg-king-bg/80 backdrop-blur-md text-white border border-king-border/50">
                           {product.tag}
                         </span>
                       )}
                     </div>
                     
                     {/* Hình ảnh sản phẩm thật */}
                     <img 
                       src={product.image} 
                       alt={product.name}
                       className="w-[85%] h-[85%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 delay-75 z-0"
                     />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="relative z-10">
                     <p className="text-xs text-king-muted font-medium uppercase tracking-wider mb-1.5">{product.color}</p>
                     <h3 className="text-lg font-bold text-white group-hover:text-king-accent transition-colors line-clamp-2 mb-3">{product.name}</h3>

                     {/* Hiển thị giá + giá sale */}
                     <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-baseline gap-2">
                         <span className="text-xl font-black text-white">{product.price}</span>
                       </div>
                       <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white border border-king-border group-hover:bg-king-accent group-hover:text-white group-hover:border-king-accent transition-all shadow-lg shadow-transparent group-hover:shadow-king-accent/20">
                         <ShoppingCart size={16} className={hoveredId === product.id ? 'animate-bounce' : ''} />
                       </button>
                     </div>
                  </div>
               </Link>
              ))}
            </div>
           )}
        </section>

        {/* 6. ĐÁNH GIÁ TỪ KHÁCH HÀNG */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-32 z-10 relative">
          <div className="text-center mb-12">
            <span className="text-king-accent uppercase font-black tracking-widest text-xs">Khách hàng nói gì</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3">Đánh Giá Uy Tín</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Nguyễn Văn Anh', avatar: 'A', rating: 5, text: 'Giao hàng siêu nhanh, sản phẩm chính hãng 100%. Mình rất hài lòng với iPhone 15 Pro Max mua tại đây!' },
              { name: 'Trần Thị Bình', avatar: 'B', rating: 5, text: 'Tư vấn nhiệt tình, giá cả cạnh tranh. Hỗ trợ sau mua hàng rất tốt, trả góp 0% cực tiện.' },
              { name: 'Lê Minh Cường', avatar: 'C', rating: 4, text: 'Poco X6 Pro chất lượng vượt tầm giá. Cảm ơn The King Mobile đã ship nhanh trong ngày!' }
            ].map((review, i) => (
              <div key={i} className="glass p-8 rounded-[2rem] hover:border-king-muted/30 transition-all duration-500 relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-king-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({length: review.rating}).map((_, j) => (
                      <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    {Array.from({length: 5 - review.rating}).map((_, j) => (
                      <Star key={j} size={16} className="text-king-border" />
                    ))}
                  </div>
                  <p className="text-king-muted text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-king-accent/20 flex items-center justify-center text-king-accent font-bold text-sm">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{review.name}</p>
                      <p className="text-king-muted text-xs">Khách hàng thân thiết</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CTA SECTION - Kêu gọi hành động */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 z-10 relative">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-king-accent to-purple-600 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBoMnYyOGgtMlY0em0tNCAxNmgxNnYySDMydi0yek0xNiA0aDE4djJIMTZWNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative z-10 py-16 px-8 md:px-16 text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4">Sẵn Sàng Nâng Cấp?</h3>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Đăng ký nhận thông báo về các đợt giảm giá và sản phẩm mới nhất từ The King Mobile.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                />
                <button className="px-8 py-4 bg-white text-king-accent rounded-full font-black hover:scale-105 transition-transform shadow-xl">
                  Đăng Ký Ngay
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ModernPhoneShop;
