import React from 'react';
import { ShoppingCart, Menu, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-white cursor-pointer">
              THE<span className="text-blue-500">KING</span>
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Trang chủ</a>
              <a href="#" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Sản phẩm</a>
              <a href="#" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Giới thiệu</a>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <button className="text-zinc-300 hover:text-white transition-colors">
              <ShoppingCart size={22} />
            </button>
            <button className="text-zinc-300 hover:text-white transition-colors">
              <UserCircle size={22} />
            </button>
            <button className="md:hidden text-zinc-300 hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
