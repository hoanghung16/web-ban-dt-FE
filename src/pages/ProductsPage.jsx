import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { ProductCardSkeleton } from '../components/Skeleton';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products');
        // Response là pagination object: {data: [...], links: {...}, meta: {...}}
        const productsData = Array.isArray(response) ? response : (response.data || []);
        setProducts(productsData.map(p => ({
          ...p,
          displayPrice: typeof p.price === 'number' ? `${(p.price).toLocaleString('vi-VN')}₫` : p.price,
          price: p.price || 0,
          category: p.category?.slug || p.category?.id || 'unknown',
          image: p.imageUrl ? (p.imageUrl.startsWith('/') ? `http://localhost:8000${p.imageUrl}` : `http://localhost:8000/images/products/${p.imageUrl}`) : (p.image || p.img || '')
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
        const response = await api.get('/categories');
        // Response có thể là pagination object: {data: [...], links: {...}, meta: {...}}
        const categoriesData = Array.isArray(response) ? response : (response.data || []);
        
        // Đếm count từ products
        const allProducts = products;
        const categoriesWithCount = categoriesData.map(c => {
          const count = allProducts.filter(p => p.category?.slug === c.slug || p.categoryid === c.id).length;
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
          { id: 'all', name: 'Tất cả', count: products.length },
          { id: 'iphone', name: 'iPhone', count: 28 },
          { id: 'samsung', name: 'Samsung', count: 15 },
          { id: 'macbook', name: 'MacBook', count: 12 },
          { id: 'ipad', name: 'iPad', count: 10 },
          { id: 'watch', name: 'Watch', count: 8 }
        ]);
      }
    };
    fetchCategories();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryParam === 'all' || p.category === categoryParam;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      // Brands filter - nếu không có brand nào được chọn, tất cả đều match
      // Suy luận brand từ tên sản phẩm (chữ đầu tiên được viết hoa)
      const productBrand = p.name.split(' ')[0].trim();
      const matchBrand = selectedBrands.size === 0 || selectedBrands.has(productBrand);
      return matchCat && matchSearch && matchPrice && matchBrand;
    });
  }, [categoryParam, searchTerm, products, priceRange, selectedBrands]);

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

  const handleBrandToggle = (brand) => {
    const newBrands = new Set(selectedBrands);
    if (newBrands.has(brand)) {
      newBrands.delete(brand);
    } else {
      newBrands.add(brand);
    }
    setSelectedBrands(newBrands);
  };

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
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Danh mục
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-colors ${
                    categoryParam === cat.id
                      ? 'bg-secondary text-on-primary-fixed font-semibold'
                      : 'hover:bg-surface-container-high transition-colors text-on-surface-variant'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Thương hiệu
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Apple', 'Samsung', 'Google', 'Xiaomi'].map((brand) => (
                <label key={brand} className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container-high border border-outline-variant/10">
                  <input 
                    type="checkbox" 
                    checked={selectedBrands.has(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-outline-variant bg-surface text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
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
              Hiển thị {Math.min(sortedProducts.length, 12)} trên {products.length} sản phẩm
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
                  {sortedProducts.slice(0, 12).map((p) => (
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
                  {sortedProducts.slice(0, 12).map((p) => (
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
        </section>
      </div>
    </main>
  );
};

export default ProductsPage;
