import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Plus, Minus, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { showSuccess, showError } from '../store/useToastStore';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product từ API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        // API interceptor đã extract .data, response lúc này là object
        const productData = response;
        const hasDiscount = productData.saleprice && productData.saleprice < productData.price;
        const displayPrice = hasDiscount ? productData.saleprice : productData.price;
        
        setProduct({
          ...productData,
          price: typeof displayPrice === 'number' ? `${displayPrice.toLocaleString('vi-VN')}₫` : displayPrice,
          originalPrice: hasDiscount ? (typeof productData.price === 'number' ? `${productData.price.toLocaleString('vi-VN')}₫` : productData.price) : null,
          rating: productData.rating || 4.7,
          reviews: productData.reviews || 0
        });

        // Fetch related products (cùng category)
        const allProducts = await api.get('/products');
        const productsData = Array.isArray(allProducts) ? allProducts : (allProducts.data || []);
        const related = productsData
          .filter(p => p.category?.slug === productData.category?.slug && p.id !== productData.id)
          .slice(0, 3)
          .map(p => {
            const hasDiscount = p.saleprice && p.saleprice < p.price;
            const displayPrice = hasDiscount ? p.saleprice : p.price;
            return {
              ...p,
              price: typeof displayPrice === 'number' ? `${displayPrice.toLocaleString('vi-VN')}₫` : displayPrice,
            };
          });
        setRelatedProducts(related);
      } catch (error) {
        console.error('Lỗi fetch product:', error);
        showError('Không thể tải chi tiết sản phẩm');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddCart = () => {
    const cartItem = { ...product, quantity };
    addToCart(cartItem);
    setIsAdded(true);
    showSuccess(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
    setTimeout(() => setIsAdded(false), 500);
  };

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 text-white min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin text-blue-500" size={48} />
        </div>
      ) : !product ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-center text-zinc-400 text-xl">Sản phẩm không tìm thấy</p>
        </div>
      ) : (
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Trang chủ</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">Sản phẩm</button>
          <span>/</span>
          <span className="text-blue-500">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* PRODUCT IMAGES */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/30 rounded-2xl p-8 border border-white/10 flex items-center justify-center min-h-96"
          >
            <div className="w-full h-96 flex items-center justify-center">
                <img src={product.imageUrl ? `http://localhost:8000${product.imageUrl}` : (product.image || product.img)} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
          >
            
            {/* Tag & Category */}
            <div className="flex items-center gap-3">
              {product.tag && (
                <span className="bg-blue-600/30 border border-blue-500/50 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {product.tag}
                </span>
              )}
              <span className="text-zinc-500 text-sm capitalize">
                {product.category?.name || product.category?.slug || 'Không xác định'}
              </span>
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}
                    />
                  ))}
                </div>
                <span className="text-yellow-400 font-bold">{product.rating}</span>
                <span className="text-zinc-500 text-sm">({product.reviews} đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6">
              <p className="text-zinc-400 text-sm mb-2">GIÁ BÁN</p>
              {product.originalPrice && (
                <p className="text-lg text-white/40 line-through mb-2">{product.originalPrice}</p>
              )}
              <p className="text-4xl font-black text-blue-400">{product.price}</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase">Số lượng</p>
              <div className="flex items-center gap-4 bg-zinc-900/30 border border-white/10 rounded-xl p-3 w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-blue-600/20 rounded-lg transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold min-w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-blue-600/20 rounded-lg transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCart}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30"
              >
                <ShoppingCart size={20} />
                {isAdded ? 'Đã thêm!' : 'THÊM VÀO GIỎ'}
              </motion.button>
              <button className="p-4 bg-zinc-900/30 border border-white/10 rounded-xl hover:border-red-500/30 hover:bg-red-500/10 transition-all">
                <Heart size={20} />
              </button>
              <button className="p-4 bg-zinc-900/30 border border-white/10 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/10 transition-all">
                <Share2 size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-white/10 pt-8 space-y-4">
              <h3 className="font-black text-sm uppercase text-zinc-400">ĐẶC ĐIỂM NỔI BẬT</h3>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Bảo hành chính hãng 12 tháng
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Giao hàng miễn phí toàn quốc
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Đổi trả trong 30 ngày
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Hỗ trợ khách hàng 24/7
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-black mb-8 text-white">Sản phẩm liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <motion.div
                  key={rel.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  className="bg-zinc-900/30 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-blue-500/30 transition-all"
                >
                  <div className="aspect-square bg-white/5 rounded-xl flex items-center justify-center mb-4">
                      <img src={rel.imageUrl ? `http://localhost:8000${rel.imageUrl}` : (rel.image || rel.img)} alt={rel.name} className="max-w-full max-h-full object-contain p-4" />
                  </div>
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">{rel.name}</h3>
                  <p className="text-blue-400 font-black">{rel.price}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      )}
    </div>
  );
};

export default ProductDetail;
