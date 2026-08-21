import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';

export const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const { format } = useCurrency();

  return (
    <div className="flex items-start gap-4 py-4 border-b border-ace-border/80">
      {/* Product Image */}
      <Link
        to={`/product/${item.slug}`}
        className="w-20 h-24 rounded-2xl bg-ace-alt overflow-hidden flex-shrink-0 border border-ace-border/60 hover:opacity-90 transition"
      >
        <img
          src={item.image || '/uploads/IMG_4065.PNG'}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=300&q=80';
          }}
        />
      </Link>

      {/* Info & Variants */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/product/${item.slug}`}
            className="font-heading font-bold text-sm text-ace-black hover:text-ace-pink transition line-clamp-1"
          >
            {item.name}
          </Link>
          <button
            onClick={() => onRemove(item.variantKey)}
            className="text-neutral-400 hover:text-ace-error transition p-1"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Variant summary tags */}
        <div className="text-xs text-neutral-500 mt-1 space-y-0.5">
          {item.variant?.color && <p className="truncate">Color: <span className="font-medium text-ace-soft">{item.variant.color}</span></p>}
          {item.variant?.length && <p>Length: <span className="font-medium text-ace-soft">{item.variant.length}</span></p>}
          {item.variant?.capSize && item.variant.capSize !== 'N/A' && (
            <p>Cap: <span className="font-medium text-ace-soft">{item.variant.capSize}</span></p>
          )}
        </div>

        {/* Price & Quantity Stepper */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-ace-border rounded-full bg-white px-2 py-0.5">
            <button
              onClick={() => onUpdateQty(item.variantKey, item.qty - 1)}
              className="p-1 text-neutral-500 hover:text-ace-black transition disabled:opacity-30"
              disabled={item.qty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold text-ace-black min-w-[20px] text-center">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdateQty(item.variantKey, item.qty + 1)}
              className="p-1 text-neutral-500 hover:text-ace-black transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <span className="font-heading font-bold text-sm text-ace-black">
              {format(item.price * item.qty)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
