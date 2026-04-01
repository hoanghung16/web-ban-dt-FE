import React from 'react';
import { motion } from 'framer-motion';
import AboutHero from '../components/about/AboutHero';
import MissionValues from '../components/about/MissionValues';
import Stats from '../components/about/Stats';
import Team from '../components/about/Team';

const AboutPage = () => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.main 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <AboutHero />

      {/* Mission & Values Section */}
      <section id="mission">
        <MissionValues />
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Team Section */}
      <Team />

      {/* Contact CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-gradient-to-b from-background to-surface-container-low"
      >
        <div className="max-w-screen-2xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Bạn Có Các Câu Hỏi?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-8"
          >
            Đội ngũ chúng tôi luôn sẵn sàng giúp đỡ và trả lời những thắc mắc của bạn.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a 
              href="mailto:contact@theking.vn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(132,173,255,0.4)] transition-all"
            >
              Gửi Email
            </motion.a>

            <motion.a 
              href="tel:+84xxx"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-primary/50 text-white font-bold rounded-xl hover:bg-primary/10 hover:border-primary transition-all"
            >
              Gọi Chúng Tôi
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default AboutPage;
