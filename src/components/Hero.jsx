import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[921px] flex items-center overflow-hidden bg-surface-container-lowest pt-16">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover opacity-60 scale-105" 
          alt="Flagship smartphone with dramatic blue rim lighting"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqgr0GIfHfqd-bKJt_sRjeDnw5F3aUiOwRbhmsXZ13VgNdz5qLByHDrtH48FKdA_fLMLPP-KHeRa_Bx3A-LsnscUICq6rzdrKU18g6IDzqr0ccj-vT5rZWgz4Ut6HQmAvSwZaJNdhiTYmLfg80RBrHtqiBz4iQW3b5EeXRTdcMDiYVWAf9bUwGqY_a9Zi9b5k31SNVLXDpn1jxgrrZMhrOFNSA76250qCYFZbAHVHMCBcIqEvi2D3Jx3VXwYNMO-pGI5OrpZi_WBY"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            Flagship Thế Hệ Mới
          </span>
          
          <h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
            THE DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">SOVEREIGN</span>
          </h1>
          
          <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mb-10 font-light leading-relaxed">
            Định nghĩa lại quyền năng công nghệ. iPhone 15 Pro với khung Titanium cấp độ hàng không vũ trụ.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/products"
              className="px-8 py-4 bg-gradient-to-r from-primary-dim to-secondary rounded-xl font-bold text-white shadow-[0_0_20px_rgba(0,193,253,0.3)] hover:scale-105 transition-transform active:scale-95"
            >
              Mua Ngay
            </Link>
            
            <button className="px-8 py-4 glass-card border border-outline-variant/20 rounded-xl font-bold text-white hover:bg-white/10 transition-colors active:scale-95">
              Khám Phá
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
