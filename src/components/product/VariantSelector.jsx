import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

export const VariantSelector = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length === 0) return null;

  // Extract unique colors, lengths, and capSizes
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const lengths = [...new Set(variants.map(v => v.length).filter(Boolean))];
  const capSizes = [...new Set(variants.map(v => v.capSize).filter(Boolean))].filter(cs => cs !== 'N/A');

  const currentColor = selectedVariant?.color || colors[0];
  const currentLength = selectedVariant?.length || lengths[0];
  const currentCapSize = selectedVariant?.capSize || (capSizes.length > 0 ? capSizes[0] : null);

  const handleColorChange = (newColor) => {
    const match = variants.find(v => v.color === newColor && (!currentLength || v.length === currentLength))
      || variants.find(v => v.color === newColor)
      || variants[0];
    onSelectVariant(match);
  };

  const handleLengthChange = (newLength) => {
    const match = variants.find(v => v.length === newLength && (!currentColor || v.color === currentColor))
      || variants.find(v => v.length === newLength)
      || variants[0];
    onSelectVariant(match);
  };

  const handleCapSizeChange = (newCap) => {
    const match = variants.find(v => v.capSize === newCap && (!currentColor || v.color === currentColor))
      || variants.find(v => v.capSize === newCap)
      || variants[0];
    onSelectVariant(match);
  };

  const isLowStock = selectedVariant?.stock > 0 && selectedVariant?.stock <= 5;
  const isOutOfStock = selectedVariant?.stock === 0;

  return (
    <div className="space-y-5">
      {/* Color Swatches / Pills */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Color Tone:
            </span>
            <span className="text-xs font-bold text-ace-black">
              {currentColor}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => {
              const isSelected = currentColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorChange(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-ace-pink bg-ace-light text-ace-pink shadow-xs'
                      : 'border-ace-border bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-ace-pink" />}
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Length Selector Pills */}
      {lengths.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Hair Length:
            </span>
            <span className="text-xs font-bold text-ace-black">
              {currentLength}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {lengths.map((len) => {
              const isSelected = currentLength === len;
              return (
                <button
                  key={len}
                  type="button"
                  onClick={() => handleLengthChange(len)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'border-ace-pink bg-ace-pink text-white shadow-xs'
                      : 'border-ace-border bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {len}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cap Size Selector Pills */}
      {capSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Cap Size:
            </span>
            <span className="text-xs font-bold text-ace-black">
              {currentCapSize}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {capSizes.map((cap) => {
              const isSelected = currentCapSize === cap;
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => handleCapSizeChange(cap)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-ace-pink bg-ace-light text-ace-pink'
                      : 'border-ace-border bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Stock Indicator */}
      <div className="pt-1 flex items-center gap-2 text-xs">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 text-ace-error font-semibold">
            <span className="w-2 h-2 rounded-full bg-ace-error"></span>
            Currently Sold Out (Restocking Soon)
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Hurry! Only {selectedVariant.stock} units left in stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            In Stock — Dispatched within 24h from UK Hub
          </span>
        )}
      </div>
    </div>
  );
};
