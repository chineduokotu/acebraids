import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Sparkles, X } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Loader } from '../components/common/Loader';
import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';
import { fallbackProducts, fallbackCategories } from '../data/fallbackData';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // URL parameters
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await fetchCategories();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: currentCategory || undefined,
          search: currentSearch || undefined,
          sort: currentSort || undefined,
        };
        const data = await fetchProducts(params);
        if (data?.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products, using cached catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentCategory, currentSearch, currentSort]);

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortSelect = (sortVal) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortVal) {
      newParams.set('sort', sortVal);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-ace-pink font-bold mb-2">
            The Complete Collection
          </p>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ace-black">
            Shop Luxury Braids & Wigs
          </h1>
          <p className="text-sm text-neutral-500 mt-3">
            Effortless installation, realistic HD scalp melts, and feather-weight comfort.
          </p>
        </div>

        {/* Category Pills Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              !currentCategory
                ? 'bg-ace-pink text-white shadow-sm'
                : 'bg-ace-alt text-ace-black hover:bg-neutral-200'
            }`}
          >
            All Collections ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                currentCategory === cat.slug
                  ? 'bg-ace-pink text-white shadow-sm'
                  : 'bg-ace-alt text-ace-black hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Controls Bar: Results Count, Active Tags & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-ace-border/70 mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium flex-wrap">
            <span>Showing <strong className="text-ace-black">{products.length}</strong> styles</span>
            
            {currentCategory && (
              <span className="inline-flex items-center gap-1 bg-ace-light text-ace-pink px-2.5 py-1 rounded-full text-xs font-bold">
                {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
                <button onClick={() => handleCategorySelect('')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {currentSearch && (
              <span className="inline-flex items-center gap-1 bg-neutral-100 text-ace-black px-2.5 py-1 rounded-full text-xs font-semibold">
                Search: "{currentSearch}"
                <button onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}><X className="w-3 h-3" /></button>
              </span>
            )}

            {(currentCategory || currentSearch) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-neutral-400 hover:text-ace-pink underline ml-2"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <select
              value={currentSort}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="text-xs font-bold text-ace-black bg-ace-alt border border-ace-border rounded-xl px-3 py-2 focus:outline-none focus:border-ace-pink cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <Loader text="Loading luxury catalog..." />
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-ace-alt rounded-3xl border border-ace-border">
            <h3 className="font-heading font-extrabold text-xl text-ace-black mb-2">No styles found</h3>
            <p className="text-sm text-neutral-500 mb-6">Try clearing your filters or search terms.</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-ace-pink text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
