import React from 'react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizes[size]} border-ace-pink border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">{text}</p>}
    </div>
  );
};
