import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { getImageUrl } from '../utils/imageHelper';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -8 }}
      className="group product-card-hover relative bg-[#1A1A1A] rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(0,112,235,0.4)] flex flex-col border border-white/5 hover:border-blue-500/30 cursor-pointer"
    >
      {product.tag && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/20 backdrop-blur-md">
            {product.tag}
          </span>
        </div>
      )}

      <div className="relative aspect-square overflow-hidden bg-[#111111] p-8 flex flex-col items-center justify-center">
        <img
          src={getImageUrl(product.imageUrl || product.image || product.img)}
          alt={product.name}
        />
        
        {/* Quick Buy Overlay */}
        <div className="quick-buy absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
          <button
            onClick={handleViewDetails}
            className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-8 py-3 rounded-2xl font-semibold text-sm transform transition-all duration-300 w-[160px] tracking-wide"
          >
            CHI TIẾT
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-2xl font-semibold text-sm transform transition-all duration-300 w-[160px] tracking-wide shadow-lg shadow-blue-600/30"
          >
            MUA NGAY
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-[#1A1A1A] to-[#121212]">
        <div className="flex justify-between items-start mb-3 h-14">
          <h2 className="text-[16px] leading-snug font-semibold text-white/90 group-hover:text-blue-400 transition-colors line-clamp-2 pr-3">
            {product.name}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-white/30 hover:text-rose-500 transition-colors bg-white/5 hover:bg-rose-500/10 p-2 rounded-full flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </button>
        </div>

        <p className="text-white/40 text-[13px] mb-5 flex-1 line-clamp-2 leading-relaxed">
          {product.description || product.specs || "Sản phẩm công nghệ chính hãng với chất lượng và trải nghiệm tuyệt vời."}
        </p>

        <div className="flex items-end justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            {product.saleprice && product.saleprice < product.price && (
              <p className="text-white/30 text-[12px] line-through mb-1">
                {product.price?.toLocaleString('vi-VN')}₫
              </p>
            )}
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-mono text-[20px] font-bold tracking-tight">
              {(product.saleprice && product.saleprice < product.price ? product.saleprice : product.price)?.toLocaleString('vi-VN')}₫
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
            className="text-white bg-white/5 hover:bg-blue-600 hover:scale-110 transition-all duration-300 p-3 rounded-2xl group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <span className="material-symbols-outlined text-[20px] block">shopping_cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
