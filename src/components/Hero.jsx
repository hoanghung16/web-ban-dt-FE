import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ShoppingCart } from 'lucide-react';

const Hero = () => {
  const phoneVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 1, delay: 0.3, type: "spring", stiffness: 60 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-b from-background via-surface-container-low to-background overflow-hidden pt-24">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl"
        ></motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(132,173,255,0.08)_0%,transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center max-w-screen-2xl mx-auto px-6">
        {/* Main content - Split layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full mb-12"
        >
          {/* Left Content */}
          <motion.div className="space-y-8">
            <motion.div variants={textVariants} className="space-y-3">
              <motion.span 
                className="inline-block py-2 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase"
              >
                Nền Tảng Mua Bán Được Tin Cậy
              </motion.span>

              <h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="block text-white">Nơi Tìm Kiếm</span>
                <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Điện Thoại Hoàn Hảo</span>
              </h1>
            </motion.div>

            <motion.p 
              variants={textVariants}
              className="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed font-light"
            >
              Khám phá bộ sưu tập điện thoại flagship từ các thương hiệu hàng đầu thế giới. THE KING mang đến trải nghiệm mua sắm cao cấp với giá cả cạnh tranh và dịch vụ sau bán hàng tuyệt vời.
            </motion.p>

            <motion.div 
              variants={textVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link 
                to="/products"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,102,0,0.4)] transition-all active:scale-95"
              >
                <motion.div 
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                ></motion.div>
                <span className="relative flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Khám Phá Sản Phẩm
                </span>
              </Link>

              <Link to="/about" className="px-8 py-4 border-2 border-primary/50 text-white font-bold rounded-xl hover:bg-primary/10 hover:border-primary transition-all active:scale-95">
                Về Chúng Tôi
              </Link>
            </motion.div>

            {/* Features list */}
            <motion.div 
              variants={textVariants}
              className="grid grid-cols-2 gap-4 pt-8 border-t border-orange-500/10"
            >
              <div>
                <p className="text-orange-400 text-sm font-bold">Sản Phẩm</p>
                <p className="text-white text-xl font-extrabold">9 Danh Mục</p>
              </div>
              <div>
                <p className="text-orange-400 text-sm font-bold">Sỉ Lượng</p>
                <p className="text-white text-xl font-extrabold">26+ Sản Phẩm</p>
              </div>
              <div>
                <p className="text-orange-400 text-sm font-bold">Thương Hiệu</p>
                <p className="text-white text-xl font-extrabold">Top Brands</p>
              </div>
              <div>
                <p className="text-orange-400 text-sm font-bold">Hỗ Trợ</p>
                <p className="text-white text-xl font-extrabold">24/7</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Phone Showcase */}
          <motion.div 
            variants={phoneVariants}
            className="relative h-96 lg:h-screen flex items-center justify-center"
          >
            {/* Glow effect */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-full filter blur-3xl"
            ></motion.div>

            {/* Phone image */}
            <motion.div 
              animate={{ 
                rotateY: [0, 5, -5, 0],
                y: [0, 10, -10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img 
                src="/images/13.jpg"
                alt="Điện Thoại Flagship THE KING"
                className="h-96 lg:h-[500px] object-contain drop-shadow-[0_0_40px_rgba(255,102,0,0.5)] filter"
                style={{
                  textShadow: '0 0 40px rgba(255,102,0,0.5)',
                }}
              />
            </motion.div>

            {/* Floating badges */}
           

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-32 right-0 px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full text-xs font-bold text-primary"
            >
              ⭐ Được Tin Cậy
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 mt-12"
        >
          <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold">Tìm Hiểu Thêm</p>
          <ChevronDown className="text-primary" size={24} />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
