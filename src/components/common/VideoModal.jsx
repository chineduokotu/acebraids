import React from 'react';
import { X, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriceTag } from './PriceTag';
import { Button } from './Button';
import { useCart } from '../../context/CartContext';

export const VideoModal = ({ look, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !look) return null;

  const product = look.linkedProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player */}
        <div className="relative aspect-[9/16] max-h-[70vh] bg-black">
          <video
            src={look.videoUrl}
            poster={look.posterUrl}
            controls
            autoPlay
            playsInline
            loop
            className="w-full h-full object-contain"
          />
        </div>

        {/* Linked Product Bar */}
        {product && (
          <div className="p-4 bg-ace-black border-t border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {product.images?.[0]?.url && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-700 flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h4 className="text-white text-sm font-medium truncate font-heading">
                  {product.name}
                </h4>
                <PriceTag
                  price={product.price}
                  discountPrice={product.discountPrice}
                  size="sm"
                  className="text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="p-2.5 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition"
                title="View Product Details"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  addToCart(product, product.variants?.[0] || {}, 1);
                  onClose();
                }}
                className="px-4 py-2 text-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                BUY
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
