import React from 'react';

export const VariantSelector = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length === 0) return null;

  // Extract unique colors and capSizes
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const capSizes = [...new Set(variants.map(v => v.capSize).filter(Boolean))].filter(cs => cs !== 'N/A' && cs !== 'Standard');

  const currentColor = selectedVariant?.color || colors[0];
  const currentCapSize = selectedVariant?.capSize || (capSizes.length > 0 ? capSizes[0] : null);

  const handleColorChange = (newColor) => {
    const match = variants.find(v => v.color === newColor && (!currentCapSize || v.capSize === currentCapSize))
      || variants.find(v => v.color === newColor)
      || variants[0];
    onSelectVariant(match);
  };

  const handleCapSizeChange = (newCap) => {
    const match = variants.find(v => v.capSize === newCap && (!currentColor || v.color === currentColor))
      || variants.find(v => v.capSize === newCap)
      || variants[0];
    onSelectVariant(match);
  };

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      {colors.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Color Tone
            </span>
            <span className="text-xs font-semibold text-neutral-900">
              {currentColor}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const isSelected = currentColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorChange(c)}
                  className={`px-3.5 py-1.5 text-xs transition-all ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cap Size Selection */}
      {capSizes.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Cap Size
            </span>
            <span className="text-xs font-semibold text-neutral-900">
              {currentCapSize}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {capSizes.map((cap) => {
              const isSelected = currentCapSize === cap;
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => handleCapSizeChange(cap)}
                  className={`px-3.5 py-1.5 text-xs transition-all ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
