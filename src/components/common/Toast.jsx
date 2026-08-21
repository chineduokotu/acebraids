import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 max-w-sm">
      <div className="bg-ace-black text-white px-5 py-3.5 rounded-2xl shadow-elevated flex items-center gap-3 border border-neutral-800">
        <CheckCircle className="w-5 h-5 text-ace-pink flex-shrink-0" />
        <p className="text-sm font-medium text-neutral-100">{toastMessage}</p>
      </div>
    </div>
  );
};
