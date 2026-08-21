import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export const PriceTag = ({
  price,
  discountPrice,
  from = false,
  size = 'md',
  className = '',
}) => {
  const { format } = useCurrency();

  const finalPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl lg:text-3xl font-extrabold',
  };

  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`}>
      {from && (
        <span className="text-xs text-neutral-500 font-normal uppercase tracking-wider">
          From
        </span>
      )}
      <span className={`text-ace-black font-heading ${sizeStyles[size]}`}>
        {format(finalPrice)}
      </span>
      {hasDiscount && (
        <span className="text-xs lg:text-sm text-neutral-400 line-through font-normal">
          {format(price)}
        </span>
      )}
    </div>
  );
};
