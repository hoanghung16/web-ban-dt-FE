import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback data in case product prop is not provided yet
  const item = product || {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    category: "Điện thoại",
    badge: "Mới",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400"
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group glass rounded-2xl p-4 overflow-hidden cursor-pointer"
    >
      {/* Animated Gradient Border Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0" />
      
      {/* Badge */}
      {item.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {item.badge}
          </span>
        </div>
      )}

      {/* Favorite Button */}
      <div className="absolute top-4 right-4 z-20">
        <button className="p-2 rounded-full bg-zinc-900/40 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-red-500 hover:bg-zinc-800/60 transition-all duration-300">
          <Heart size={18} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative h-64 w-full mb-6 z-10 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-900/50">
        <motion.img
          src={item.image}
          alt={item.name}
          animate={{ 
            scale: isHovered ? 1.08 : 1,
            y: isHovered ? -5 : 0
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="object-contain h-full w-full p-4 drop-shadow-2xl"
        />
      </div>

      {/* Product Info */}
      <div className="relative z-10">
        <p className="text-zinc-500 text-sm mb-1">{item.category}</p>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {item.name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">
              {formatPrice(item.price)}
            </span>
          </div>
          
          {/* Add to Cart Button (Reveals on Hover) */}
          <button className="relative overflow-hidden bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-sm border border-white/5 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:bg-blue-600 group-hover:border-blue-500">
            <ShoppingCart size={20} className="relative z-10" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
