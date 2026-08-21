import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { format } = useCurrency();

  if (!product) return null;

  const mainImage = product.images?.[0]?.url || '/uploads/IMG_6241.PNG';
  const effectivePrice = product.discountPrice || product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants && product.variants.length > 1) {
      if (onQuickView) {
        onQuickView(product);
      } else {
        addToCart(product, product.variants[0], 1);
      }
    } else {
      addToCart(product, product.variants?.[0] || {}, 1);
    }
  };

  return (
    <div className="group flex flex-col bg-transparent select-none">
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-[#EFEFEF] overflow-hidden rounded-none">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-103"
            onError={(e) => {
              e.target.src = '/uploads/IMG_4065.PNG';
            }}
          />
        </Link>

        {/* Floating Dark Charcoal Basket Button (matches screenshot exactly) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 bg-[#242424]/90 hover:bg-ace-pink text-white rounded-md flex items-center justify-center shadow-md transition-colors active:scale-95"
          aria-label="Add to bag"
          title="Add to shopping bag"
        >
          <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>

      {/* Product Info (Minimalist matching screenshot) */}
      <div className="pt-3 pb-1 flex flex-col">
        <Link
          to={`/product/${product.slug}`}
          className="font-heading font-medium text-[13.5px] sm:text-sm text-neutral-800 hover:text-ace-pink transition-colors line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        {/* Price ("From £X") */}
        <p className="mt-1 font-heading font-medium text-[13px] sm:text-sm text-neutral-700">
          From {format(effectivePrice)}
        </p>
      </div>
    </div>
  );
};
