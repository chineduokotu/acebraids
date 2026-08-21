import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriceTag } from '../common/PriceTag';
import { Button } from '../common/Button';
import { VariantSelector } from './VariantSelector';
import { useCart } from '../../context/CartContext';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(() => {
    return product?.variants?.[0] || {};
  });
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const currentVariant = selectedVariant?.label ? selectedVariant : (product.variants?.[0] || {});
  const mainImage = product.images?.[0]?.url || '/uploads/IMG_4065.PNG';

  const handleAdd = () => {
    addToCart(product, currentVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-ace-border flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 text-ace-black hover:bg-white hover:text-ace-pink flex items-center justify-center shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 aspect-[4/5] bg-ace-alt relative overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        {/* Product Info & Action */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {product.category?.name && (
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                {product.category.name}
              </span>
            )}
            <h3 className="font-heading font-extrabold text-xl text-ace-black leading-snug">
              {product.name}
            </h3>

            <PriceTag
              price={product.price}
              discountPrice={product.discountPrice}
              size="lg"
            />

            <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            <VariantSelector
              variants={product.variants || []}
              selectedVariant={currentVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>

          <div className="pt-6 space-y-3 border-t border-ace-border/60 mt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-xs font-bold uppercase tracking-wider"
              onClick={handleAdd}
              disabled={currentVariant?.stock === 0}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {currentVariant?.stock === 0 ? 'Sold Out' : 'Add to Bag'}
            </Button>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-ace-pink transition text-center w-full"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
