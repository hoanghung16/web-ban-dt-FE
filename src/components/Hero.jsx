import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-400 backdrop-blur-sm"
          >
            ✨ Ra mắt Bộ sưu tập Mùa Hè 2026
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Khám phá <span className="text-gradient">Tinh Hoa</span><br />
            Công Nghệ Mới
          </h1>
          <p className="mt-4 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trải nghiệm không gian mua sắm đẳng cấp với các dòng smartphone cao cấp nhất. Mượt mà, tinh tế và dẫn đầu xu hướng tương lai.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Khám phá ngay
            </button>
            <button className="w-full sm:w-auto glass hover:bg-zinc-800/80 text-white px-8 py-3.5 rounded-full font-medium transition-all">
              Tìm hiểu thêm
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
