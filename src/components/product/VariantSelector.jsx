import React from 'react';
import { getLowStockThreshold, getVariantLabel } from '../../utils/inventory';

export const VariantSelector = ({ variants = [], selectedVariant, onSelectVariant, lowStockThreshold = 5, isSoldOut = false }) => {
  if (!variants.length) return null;

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Choose your option</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Product options">
        {variants.map((variant, index) => {
          const isSelected = variant === selectedVariant || Boolean(variant._id && String(variant._id) === String(selectedVariant?._id));
          const stock = isSoldOut ? 0 : Math.max(0, Number(variant.stock) || 0);
          const threshold = getLowStockThreshold({ lowStockThreshold }, variant);
          const label = getVariantLabel(variant) || variant.sku || `Option ${index + 1}`;
          return (
            <button
              key={variant._id || variant.sku || index}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectVariant(variant)}
              className={`px-3.5 py-2 text-left text-xs transition-all ${isSelected ? 'bg-neutral-900 text-white font-medium' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
            >
              {label}
              {stock === 0 ? <span className="block mt-1 text-[11px]">Sold Out</span> : stock <= threshold ? <span className="block mt-1 text-[11px]">Only {stock} left</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
