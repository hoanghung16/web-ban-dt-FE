import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
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
        {/* Main content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center w-full mb-12 max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={textVariants} className="mb-6">
            <motion.span 
              className="inline-block py-2 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase"
            >
              Về THE KING
            </motion.span>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={textVariants}>
            <h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block text-white mb-3">Câu Chuyện</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Về Chúng Tôi
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={textVariants}
            className="text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed font-light mt-8"
          >
            THE KING được thành lập với tinh thần cải cách thị trường bán lẻ điện thoại di động. 
            Chúng tôi không chỉ bán sản phẩm, mà còn xây dựng mối quan hệ tin tưởng với từng khách hàng.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={textVariants}
            className="flex flex-wrap gap-4 justify-center pt-8 mt-8"
          >
            <a 
              href="#mission"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(132,173,255,0.4)] transition-all active:scale-95"
            >
              <motion.div 
                className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              ></motion.div>
              <span className="relative">Khám Phá Giá Trị Cốt Lõi</span>
            </a>

            <button className="px-8 py-4 border-2 border-primary/50 text-white font-bold rounded-xl hover:bg-primary/10 hover:border-primary transition-all active:scale-95">
              Liên Hệ Chúng Tôi
            </button>
          </motion.div>

          {/* Highlights */}
          <motion.div 
            variants={textVariants}
            className="grid grid-cols-3 gap-6 pt-16 border-t border-primary/10 mt-16 w-full"
          >
            <div className="text-center">
              <p className="text-primary text-sm font-bold mb-1">Thành Lập</p>
              <p className="text-white text-xl font-extrabold">2023</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-sm font-bold mb-1">Nhân Viên</p>
              <p className="text-white text-xl font-extrabold">50+</p>
            </div>
            <div className="text-center">
              <p className="text-primary text-sm font-bold mb-1">Thành Phố</p>
              <p className="text-white text-xl font-extrabold">5+</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default AboutHero;
