import React from 'react';
import { motion } from 'framer-motion';

const BentoGrid = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Danh mục Nổi bật</h2>
          <p className="text-zinc-400">Xu hướng công nghệ được yêu thích nhất.</p>
        </div>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-4 grid-rows-[300px_300px] gap-6"
      >
        {/* iPhone Banner - Large */}
        <motion.div variants={item} className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent z-0"></div>
          <h3 className="text-3xl font-bold mb-2 z-10 relative">iPhone 15 Series</h3>
          <p className="text-zinc-400 z-10 relative">Titanium Đẳng Cấp. Đột Phá.</p>
          <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800" alt="iPhone 15" className="absolute bottom-0 right-[-10%] w-[90%] md:w-[80%] object-contain translate-y-12 group-hover:translate-y-8 group-hover:scale-105 transition-all duration-700 ease-out brightness-90 group-hover:brightness-100" />
        </motion.div>
        
        {/* Android Banner */}
        <motion.div variants={item} className="md:col-span-2 glass rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-colors">
          <h3 className="text-2xl font-bold mb-2">Android Flagship</h3>
          <p className="text-zinc-400">Đỉnh cao hiệu năng. Trải nghiệm vô tận.</p>
        </motion.div>
        
        {/* Accessories */}
        <motion.div variants={item} className="glass rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-colors">
          <h3 className="text-xl font-bold z-10">Phụ kiện</h3>
          <div className="text-zinc-400 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">Khám phá →</div>
        </motion.div>
        
        {/* Sale Block */}
        <motion.div variants={item} className="glass rounded-3xl p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all">
          <motion.div 
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
            className="text-5xl"
          >
            🔥
          </motion.div>
          <h3 className="text-xl font-bold mt-3 text-white">Sale Tới Bến</h3>
          <p className="text-sm text-blue-300 mt-1">Lên đến 50%</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BentoGrid;
