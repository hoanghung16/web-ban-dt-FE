import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Zap, Shield } from 'lucide-react';

const MissionValues = () => {
  const values = [
    {
      icon: Target,
      title: 'Sứ Mệnh',
      description: 'Cung cấp điện thoại chất lượng cao với giá cả hợp lý, mang công nghệ tiên tiến đến tay mỗi khách hàng.',
      color: 'from-primary to-secondary'
    },
    {
      icon: Heart,
      title: 'Tầm Nhìn',
      description: 'Trở thành nền tảng mua bán điện thoại hàng đầu Việt Nam, nơi khách hàng tin tưởng và yêu thích.',
      color: 'from-secondary to-primary'
    },
    {
      icon: Zap,
      title: 'Sáng Tạo',
      description: 'Không ngừng đổi mới trải nghiệm mua sắm, ứng dụng công nghệ mới để phục vụ khách hàng tốt hơn.',
      color: 'from-primary via-secondary to-primary'
    },
    {
      icon: Shield,
      title: 'Uy Tín',
      description: 'Cam kết chất lượng sản phẩm, dịch vụ hậu bán hàng tốt nhất và bảo vệ quyền lợi khách hàng.',
      color: 'from-secondary to-primary'
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-surface-container-low">
      <div className="max-w-screen-2xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Giá Trị Cốt Lõi Của <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">THE KING</span>
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 200 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"
          ></motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                
                <div className="relative p-8 bg-surface-container border border-outline-variant/30 rounded-2xl hover:border-primary/50 transition-all h-full">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} p-3 mb-4 flex items-center justify-center`}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>

                  <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
                    {value.title}
                  </h3>
                  
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default MissionValues;
