import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from './ProductCard';

const BentoGrid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products?limit=6');
        // Response là pagination object: {data: [...], links: {...}, meta: {...}}
        const productsArray = Array.isArray(data) ? data : (data.data || []);
        setProducts(productsArray.slice(0, 6));
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

  const itemFadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Product Collection Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2 uppercase">
              Bộ sưu tập MỚI NHẤT
            </h2>
            <div className="h-1 w-20 bg-secondary rounded-full"></div>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="text-primary font-medium hover:underline transition-all"
          >
            Xem tất cả sản phẩm
          </button>
        </div>

        {/* Product Grid */}
        {!loading && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemFadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Skeleton loaders */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-high rounded-3xl h-96 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Trade-in Banner Section */}
        <section className="py-12 mt-24">
          <div className="relative rounded-2xl overflow-hidden bg-primary-container p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dim to-secondary opacity-20"></div>
            <div className="relative z-10 flex-1">
              <h2 className="font-headline text-4xl font-extrabold text-on-primary-container mb-4">
                CHƯƠNG TRÌNH THU CŨ ĐỔI MỚI
              </h2>
              <p className="text-on-primary-container/80 text-lg mb-8 max-w-xl">
                Nâng cấp lên flagship đời mới nhất với trợ giá cực khủng lên đến 5.000.000đ. Thủ tục nhanh chóng chỉ trong 15 phút.
              </p>
              <button 
                onClick={() => navigate('/trade-in')}
                className="px-8 py-4 bg-on-primary-fixed text-primary rounded-xl font-bold shadow-xl hover:scale-105 transition-transform"
              >
                Định Giá Máy Ngay
              </button>
            </div>
            <div className="relative z-10 flex-1 hidden md:block">
              <img 
                className="rounded-2xl shadow-2xl rotate-3" 
                alt="Two high-end smartphones"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAIMIQDCgh4UsdOOZSQlzcGexeWLXg_51FRQVvc9D6qjPwO2r3Gs02Y6tEgQ_g0HHjYJc7VOeF1lR7-I3JMJxNXc9EnKzRcXqJGUNKfOM_VgmeWfyd8-D9vylLGo9-tJZdHAnh1ZJ2Qg_c-dM6rkCWizbYd9Uwd8pWUm7lJWaeX2JR9xryOsqDYT1tdWyROLmnEKJZLZ99PPybxsrWVTdUuYF4IuAv9EHUSfxew8YXg4BEGPKVFrgkpZMq38qlpXQ8ZONdSvfe2VQ"
              />
            </div>
          </div>
        </section>

        {/* Brand Categories */}
        <section className="py-20 bg-surface-container-low mt-12 -mx-6 px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {[
                { icon: 'ios', name: 'Apple', brand: 'Apple' },
                { icon: 'smartphone', name: 'Samsung', brand: 'Samsung' },
                { icon: 'terminal', name: 'Xiaomi', brand: 'Xiaomi' },
                { icon: 'diamond', name: 'Vertu', brand: 'Vertu' },
                { icon: 'watch', name: 'Garmin', brand: 'Garmin' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleCategoryClick(item.brand)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-4xl group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default BentoGrid;
