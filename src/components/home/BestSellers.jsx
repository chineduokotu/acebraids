import React, { useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { QuickViewModal } from '../product/QuickViewModal';

export const BestSellers = ({ products = [], loading = false }) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Take top 4-8 products for homepage showcase
  const displayProducts = products.length > 0
    ? products.slice(0, 6)
    : [];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Responsive 2-column mobile, 4-column desktop grid matching screenshot */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-100 aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
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
    </section>
  );
};
