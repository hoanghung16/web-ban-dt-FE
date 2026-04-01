import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Package, TrendingUp } from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState([
    { icon: TrendingUp, label: 'Năm Hoạt Động', value: 3, suffix: '+' },
    { icon: Users, label: 'Khách Hàng Hài Lòng', value: 5000, suffix: '+' },
    { icon: Package, label: 'Sản Phẩm Bán Ra', value: 15000, suffix: '+' },
    { icon: BarChart3, label: 'Thương Hiệu Hợp Tác', value: 9, suffix: '' }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  const Counter = ({ end, suffix }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const duration = 2000;
      const increment = end / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [end]);

    return (
      <span>{count.toLocaleString('vi-VN')}{suffix}</span>
    );
  };

  return (
    <section className="py-24 bg-gradient-to-r from-primary via-primary-dim to-secondary relative overflow-hidden">
      {/* Animated background */}
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
      ></motion.div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Những Con Số Ấn Tượng
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Minh chứng cho sự phát triển mạnh mẽ của THE KING trên thị trường.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group"
              >
                <div className="relative p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 hover:border-white/40 transition-all">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 rounded-xl bg-white/20 p-2.5 mb-6 flex items-center justify-center"
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>

                  <div className="mb-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-5xl font-extrabold text-white mb-2"
                    >
                      <Counter 
                        end={stat.value} 
                        suffix={stat.suffix}
                      />
                    </motion.div>
                  </div>

                  <p className="text-white/80 font-medium">
                    {stat.label}
                  </p>

                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 40 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    className="h-1 bg-white/30 rounded-full mt-4 group-hover:bg-white/60 transition-colors"
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative circles */}
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-10 left-10 w-20 h-20 bg-white/5 rounded-full"
      ></motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
        className="absolute top-1/2 right-10 w-32 h-32 bg-white/3 rounded-full"
      ></motion.div>
    </section>
  );
};

export default Stats;
