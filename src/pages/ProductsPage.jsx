import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { ProductCardSkeleton } from '../components/Skeleton';
import { getImageUrl } from '../utils/imageHelper';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // Tăng lên để hiện đủ sản phẩm

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products', { params: { limit: 1000 } });
        // Response là pagination object: {data: [...], links: {...}, meta: {...}}
        const productsData = Array.isArray(response) ? response : (response.data || []);
        setProducts(productsData.map(p => ({
          ...p,
          displayPrice: typeof p.price === 'number' ? `${(p.price).toLocaleString('vi-VN')}₫` : p.price,
          price: p.price || 0,
          category: p.category?.slug || p.category?.id || 'unknown',
          image: getImageUrl(p.imageUrl)
        })));
      } catch (error) {
        console.error('Lỗi fetch products:', error);
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', { params: { limit: 1000 } });
        // Response có thể là pagination object: {data: [...], links: {...}, meta: {...}}
        const categoriesData = Array.isArray(response) ? response : (response.data || []);
        
        // Đếm count từ products
        const allProducts = products;
        const categoriesWithCount = categoriesData.map(c => {
          const count = allProducts.filter(p => 
            p.categoryid === c.id || 
            p.category?.id === c.id || 
            p.category?.slug === c.slug ||
            p.category === c.slug ||
            p.category === c.id.toString()
          ).length;
          return {
            id: c.slug || c.id, 
            name: c.name,
            count: count
          };
        });
        
        const totalCount = allProducts.length;
        setCategories([
          { id: 'all', name: 'Tất cả', count: totalCount },
          ...categoriesWithCount
        ]);
      } catch (error) {
        console.error('Lỗi fetch categories:', error);
        setCategories([
          { id: 'all', name: 'Tất cả', count: products.length }
        ]);
      }
    };
    fetchCategories();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let matchCat = categoryParam === 'all';
      if (!matchCat) {
        matchCat = 
          p.category === categoryParam ||
          p.categoryid === categoryParam ||
          p.category?.id === categoryParam ||
          p.category?.slug === categoryParam;
      }
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchCat && matchSearch && matchPrice;
    });
  }, [categoryParam, searchTerm, products, priceRange]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch(sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popular':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
  }, [filteredProducts, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, searchTerm, priceRange, sortBy]);

  // Calculate paginated products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="pt-20 pb-20 px-6 max-w-screen-2xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-label">
        <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-medium">Sản phẩm</span>
      </nav>

      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-4 text-white">
          THE COLLECTION
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
          Khám phá những thiết bị di động đẳng cấp nhất thế giới, được tuyển chọn kỹ lưỡng dành riêng cho giới thượng lưu công nghệ.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-headline font-bold text-sm mb-3 flex items-center gap-2 text-white uppercase tracking-wider">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              Danh mục
            </h3>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all ${
                    categoryParam === cat.id
                      ? 'bg-primary text-white font-semibold'
                      : 'text-on-surface-variant hover:bg-slate-800 hover:text-on-surface'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className={`text-xs ml-2 flex-shrink-0 px-2 py-0.5 rounded font-medium ${
                    categoryParam === cat.id ? 'bg-white/20 text-white' : 'bg-slate-700/50 text-on-surface-variant'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Khoảng giá
            </h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="100000000" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-1 bg-surface-container-low rounded-md">0đ</span>
                <span className="px-3 py-1 bg-surface-container-low rounded-md">
                  {(priceRange[1]).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1">
          {/* Search Box */}
          <div className="mb-8">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-4 pr-10 text-sm focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant"
            />
          </div>

          {/* Sorting & View Options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-surface-container-low p-4 rounded-2xl">
            <span className="text-on-surface-variant font-medium">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} trên {sortedProducts.length} sản phẩm
            </span>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container-highest border-none rounded-xl text-sm py-2 pl-4 pr-10 focus:ring-primary appearance-none cursor-pointer font-medium text-on-surface"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="popular">Bán chạy nhất</option>
              </select>
              <div className="flex border border-outline-variant/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-on-primary-fixed' 
                      : 'hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary text-on-primary-fixed' 
                      : 'hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-surface-container-low rounded-xl animate-pulse" />
                ))}
              </div>
            )
          ) : sortedProducts.length > 0 ? (
            viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                  {paginatedProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              // List View
              <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                  {paginatedProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container transition-all group cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-surface-container-highest rounded-xl overflow-hidden">
                        <img 
                          src={p.image || p.img} 
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-headline font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-sm text-on-surface-variant truncate">
                          {p.category}
                        </p>
                        <p className="text-sm text-on-surface-variant line-clamp-1 mt-1">
                          {p.description || 'Sản phẩm chất lượng cao'}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end flex-shrink-0 gap-2">
                        <span className="font-headline font-bold text-lg text-primary">
                          {p.displayPrice || `${(p.price).toLocaleString('vi-VN')}₫`}
                        </span>
                        <Link 
                          to={`/products/${p.id}`}
                          className="px-4 py-1.5 bg-primary hover:bg-primary/80 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )
          ) : (
            <div className="text-center py-20 border border-dashed border-outline-variant/20 rounded-[2rem]">
              <p className="text-on-surface-variant font-medium uppercase">
                Không tìm thấy sản phẩm
              </p>
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-low hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Trang trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant/20 hover:bg-surface-container-low hover:border-primary/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-low hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Trang sau
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductsPage;
