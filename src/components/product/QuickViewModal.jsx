import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriceTag } from '../common/PriceTag';
import { Button } from '../common/Button';
import { VariantSelector } from './VariantSelector';
import { useCart } from '../../context/CartContext';
import { getAvailableStock, getInitialVariant, getLowStockThreshold, resolveVariant } from '../../utils/inventory';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart, getAvailableQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(() => {
    return getInitialVariant(product);
  });
  const [quantity, setQuantity] = useState(1);

  const currentVariant = resolveVariant(product, selectedVariant) || getInitialVariant(product);
  const stock = getAvailableStock(product, currentVariant);
  const availableQuantity = getAvailableQuantity(product, currentVariant);
  const threshold = getLowStockThreshold(product, currentVariant);

  useEffect(() => {
    setSelectedVariant(getInitialVariant(product));
    setQuantity(1);
  }, [product?._id, isOpen]);

  useEffect(() => {
    setQuantity((current) => Math.max(1, Math.min(current, availableQuantity)));
  }, [availableQuantity]);

  if (!isOpen || !product) return null;

  const mainImage = product.images?.[0]?.url || '/uploads/IMG_4065.PNG';

  const handleAdd = () => {
    if (addToCart(product, currentVariant, quantity)) onClose();
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
              price={currentVariant?.priceOverride ?? product.price}
              discountPrice={currentVariant?.priceOverride != null ? undefined : product.discountPrice}
              size="lg"
            />

            <p className="text-xs text-neutral-500 line-clamp-4 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Variants */}
            <VariantSelector
              variants={product.variants || []}
              selectedVariant={currentVariant}
              onSelectVariant={(variant) => { setSelectedVariant(variant); setQuantity(1); }}
              lowStockThreshold={product.lowStockThreshold}
              isSoldOut={product.isSoldOut}
            />
          </div>

          <div className="pt-6 space-y-3 border-t border-ace-border/60 mt-4">
            <div role="status" aria-live="polite" className="text-xs font-semibold">
              {stock === 0 ? <p className="text-rose-700">Out of Stock</p> : stock <= threshold ? <p className="text-amber-700">Only {stock} left in stock - order soon</p> : null}
              {stock > 0 && availableQuantity === 0 && <p className="text-amber-700">All available stock is already in your bag.</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Quantity</span>
              <div className="flex items-center gap-4 border border-ace-border px-2 py-1">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} className="px-2 disabled:opacity-30" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase quantity" disabled={quantity >= availableQuantity} className="px-2 disabled:opacity-30" onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}>+</button>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full text-xs font-bold uppercase tracking-wider"
              onClick={handleAdd}
              disabled={availableQuantity === 0}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {stock === 0 ? 'Out of Stock' : availableQuantity === 0 ? 'All Stock in Bag' : 'Add to Bag'}
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
