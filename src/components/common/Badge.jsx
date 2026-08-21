import React from 'react';

export const Badge = ({ children, variant = 'pink', className = '' }) => {
  const variants = {
    pink: 'bg-ace-light text-ace-pink font-semibold border border-pink-200/60',
    black: 'bg-ace-black text-white font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold',
    muted: 'bg-ace-alt text-ace-soft border border-ace-border font-medium',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wide uppercase ${variants[variant] || variants.pink} ${className}`}>
      {children}
    </span>
  );
};
