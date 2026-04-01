import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import ProductCard from './ProductCard';

const BentoGrid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products', { params: { limit: 1000 } });
        // Response là pagination object: {data: [...], links: {...}, meta: {...}}
        const productsArray = Array.isArray(data) ? data : (data.data || []);
        setProducts(productsArray.slice(0, 8)); // Lấy 8 sản phẩm thay vì 6
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(Math.max(0, currentSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(Math.min(products.length - 4, currentSlide + 1));
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const brands = [
    { icon: 'ios', name: 'Apple', brand: 'iphone', color: '#000' },
    { icon: 'smartphone', name: 'Samsung', brand: 'samsung', color: '#1428A0' },
    { icon: 'terminal', name: 'Xiaomi', brand: 'xiaomi', color: '#FF6900' },
    { icon: 'shopping_bag', name: 'Phụ Kiện', brand: 'phụ kiện', color: '#00A86B' },
    { icon: 'watch_later', name: 'Sạc & Cáp', brand: 'sạc & cáp', color: '#FF1744' }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-surface-container-low to-background">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Section Header với animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-3 uppercase bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Bộ Sưu Tập Mới Nhất
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 100 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"
            ></motion.div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="text-primary font-medium hover:text-secondary transition-colors flex items-center gap-2"
          >
            Xem Tất Cả
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>

        {/* Product Grid với enhanced layout */}
        {!loading && products.length > 0 ? (
          <div className="mb-16">
            {/* Desktop Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="hidden lg:grid grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemFadeUp}
                  whileHover={{ y: -8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Tablet Grid */}
            <div className="hidden md:grid lg:hidden grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Mobile Grid */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden lg:grid grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-high rounded-3xl h-96 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Trade-in Banner Section - Enhanced */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 mt-24"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dim to-secondary p-8 md:p-20 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-white to-transparent"
              ></motion.div>
            </div>

            <div className="relative z-10 flex-1">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-headline text-3xl md:text-5xl font-extrabold text-white mb-4"
              >
                CHƯƠNG TRÌNH THU CŨ ĐỔI MỚI
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/90 text-lg mb-8 max-w-xl leading-relaxed"
              >
                Nâng cấp lên flagship đời mới nhất với trợ giá cực khủng lên đến <span className="font-bold text-2xl">5.000.000đ</span>. Thủ tục nhanh chóng chỉ trong <span className="font-bold">15 phút</span>.
              </motion.p>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/trade-in')}
                className="px-10 py-4 bg-white text-primary rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all"
              >
                Định Giá Máy Ngay →
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 40, rotate: -5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 flex-1 hidden md:block"
            >
              <div className="relative">
                <img 
                  className="rounded-2xl shadow-2xl" 
                  alt="Two high-end smartphones"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAIMIQDCgh4UsdOOZSQlzcGexeWLXg_51FRQVvc9D6qjPwO2r3Gs02Y6tEgQ_g0HHjYJc7VOeF1lR7-I3JMJxNXc9EnKzRcXqJGUNKfOM_VgmeWfyd8-D9vylLGo9-tJZdHAnh1ZJ2Qg_c-dM6rkCWizbYd9Uwd8pWUm7lJWaeX2JR9xryOsqDYT1tdWyROLmnEKJZLZ99PPybxsrWVTdUuYF4IuAv9EHUSfxew8YXg4BEGPKVFrgkpZMq38qlpXQ8ZONdSvfe2VQ"
                />
                {/* Decorative elements */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-full opacity-20"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Brand Categories - Enhanced */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-20 bg-surface-container-low mt-20 rounded-3xl -mx-6 px-6 md:mx-0 md:px-12 shadow-lg"
        >
          <div className="max-w-screen-2xl mx-auto">
            <h3 className="text-center text-2xl font-extrabold mb-12 text-on-surface">Các Thương Hiệu Hàng Đầu</h3>
            <div className="flex flex-wrap justify-center gap-6 md:gap-16">
              {brands.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.15, y: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCategoryClick(item.brand)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-all cursor-pointer group"
                >
                  <motion.span 
                    className="material-symbols-outlined text-5xl transition-colors"
                    style={{ color: item.color }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    whileHover={{ scale: 1.2, rotate: 0 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-sm uppercase tracking-widest font-bold text-on-surface group-hover:text-primary transition-colors">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default BentoGrid;
