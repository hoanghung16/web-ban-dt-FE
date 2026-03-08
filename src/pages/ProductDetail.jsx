import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, ChevronRight, Star, Shield, Truck, Zap, Minus, Plus, Heart, Share2 } from 'lucide-react';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const API = 'http://127.0.0.1:8000';

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const allRes = await axios.get(`${API}/api/products`);
        const allProducts = allRes.data;
        const found = allProducts.find(p => p.id == id);
        setProduct(found);
        // Sản phẩm liên quan (cùng danh mục, khác ID)
        if (found) {
          setRelatedProducts(allProducts.filter(p => p.categoryid === found.categoryid && p.id !== found.id).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    // Lưu vào localStorage
    const cart = JSON.parse(localStorage.getItem('kingCart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('kingCart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // Cập nhật badge header
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-king-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-king-accent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-king-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-king-muted text-xl">Không tìm thấy sản phẩm.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-king-bg">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-king-muted mb-8">
          <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Ảnh sản phẩm */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-3xl border border-king-border/50 flex items-center justify-center overflow-hidden group relative">
              {product.flash_sale && (
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-4 py-2 text-xs uppercase font-black tracking-widest rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/30 flex items-center gap-2">
                    <Zap size={14} /> Flash Sale
                  </span>
                </div>
              )}
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col justify-center">
            {product.tag && (
              <span className="inline-flex self-start px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full bg-king-accent/10 text-king-accent border border-king-accent/20 mb-4">
                {product.tag}
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{product.name}</h1>
            
            {/* Đánh giá giả */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <span className="text-king-muted text-sm">(128 đánh giá)</span>
            </div>

            {/* Giá */}
            <div className="mb-8">
              <span className="text-4xl font-black text-white">{product.price}</span>
              {product.flash_sale && (
                <span className="ml-3 text-sm text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full">Giảm giá đặc biệt</span>
              )}
            </div>

            {/* Mô tả ngắn */}
            <p className="text-king-muted leading-relaxed mb-8">
              Sản phẩm chính hãng, bảo hành 12 tháng toàn quốc. Hỗ trợ trả góp 0% lãi suất qua các ngân hàng đối tác. 
              Miễn phí giao hàng nhanh trong 24 giờ tại các tỉnh thành lớn.
            </p>

            {/* Số lượng + Nút mua */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-king-border rounded-full overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-king-muted hover:text-white hover:bg-king-card transition-colors">
                  <Minus size={16} />
                </button>
                <span className="px-6 py-3 text-white font-bold text-center min-w-[60px]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-king-muted hover:text-white hover:bg-king-card transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className={`flex-1 px-8 py-4 rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  addedToCart 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-king-text text-king-bg hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                }`}
              >
                <ShoppingCart size={18} />
                {addedToCart ? '✓ Đã thêm thành công!' : 'Thêm Vào Giỏ Hàng'}
              </button>
            </div>

            {/* Nút phụ */}
            <div className="flex gap-3 mb-8">
              <button className="flex items-center gap-2 px-5 py-3 border border-king-border rounded-full text-king-muted hover:text-white hover:border-white/30 transition-all text-sm font-medium">
                <Heart size={16} /> Yêu thích
              </button>
              <button className="flex items-center gap-2 px-5 py-3 border border-king-border rounded-full text-king-muted hover:text-white hover:border-white/30 transition-all text-sm font-medium">
                <Share2 size={16} /> Chia sẻ
              </button>
            </div>

            {/* Cam kết */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 glass p-3 rounded-xl">
                <Shield size={18} className="text-king-accent shrink-0" />
                <span className="text-xs text-king-muted">Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3 glass p-3 rounded-xl">
                <Truck size={18} className="text-king-accent shrink-0" />
                <span className="text-xs text-king-muted">Giao hàng miễn phí</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-white mb-8">Sản Phẩm Liên Quan</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map(rp => (
                <Link to={`/product/${rp.id}`} key={rp.id} className="bg-king-card border border-king-border rounded-2xl p-4 group hover:-translate-y-1 hover:border-king-accent/50 transition-all duration-300">
                  <div className="aspect-square bg-white rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    <img src={rp.image} alt={rp.name} className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-king-accent transition-colors line-clamp-2 mb-2">{rp.name}</h3>
                  <span className="text-sm font-black text-white">{rp.price}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
