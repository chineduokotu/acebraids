import React from 'react';
import { Sparkles, Truck } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const AnnouncementBar = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-ace-black text-white text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left / Center Message */}
        <div className="flex-1 flex items-center justify-center md:justify-start gap-2">
          <Truck className="w-3.5 h-3.5 text-ace-pink hidden sm:inline" />
          <span className="font-medium tracking-wide">
            <span className="text-ace-pink font-semibold">FREE UK Delivery</span> on orders over £80 · Express 24-48h Shipping to Germany & EU
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="hidden md:flex items-center gap-3 text-neutral-300">
          <div className="flex items-center gap-1 border border-neutral-700 rounded-full px-2 py-0.5 text-[11px]">
            <button
              onClick={() => setCurrency('GBP')}
              className={`px-1.5 py-0.5 rounded transition ${currency === 'GBP' ? 'bg-ace-pink text-white font-bold' : 'hover:text-white'}`}
            >
              GBP (£)
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-1.5 py-0.5 rounded transition ${currency === 'EUR' ? 'bg-ace-pink text-white font-bold' : 'hover:text-white'}`}
            >
              EUR (€)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
