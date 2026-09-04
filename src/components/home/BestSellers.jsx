import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { QuickViewModal } from "../product/QuickViewModal";

export const BestSellers = ({ products = [], loading = false }) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Display all products for showcase
  const displayProducts =
    Array.isArray(products) && products.length > 0 ? products : [];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Responsive 2-column mobile, 4-column desktop grid matching screenshot */}
        {loading && displayProducts.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-neutral-100 aspect-[3/4]"
              />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="py-10 text-center border border-ace-border rounded-2xl bg-ace-alt px-4">
            <h2 className="font-heading font-extrabold text-lg text-ace-black">Catalog is loading slowly</h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto">
              We could not reach the product server right now. Please refresh in a moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {(Array.isArray(displayProducts) ? displayProducts : []).map(
              (product) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ),
            )}
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
