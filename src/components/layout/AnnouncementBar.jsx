import React from 'react';
import { Truck } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const AnnouncementBar = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-ace-black text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 flex items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <Truck className="w-3.5 h-3.5 text-ace-pink hidden sm:inline flex-shrink-0" />
          <span className="font-medium leading-snug truncate sm:whitespace-normal">
            <span className="text-ace-pink font-semibold">Free UK delivery</span> over GBP 80 - Express 24-48h to Germany & EU
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-neutral-300">
          <div className="flex items-center gap-1 border border-neutral-700 rounded-full px-2 py-0.5 text-[11px]">
            <button
              onClick={() => setCurrency('GBP')}
              className={`px-1.5 py-0.5 rounded transition ${currency === 'GBP' ? 'bg-ace-pink text-white font-bold' : 'hover:text-white'}`}
            >
              GBP
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-1.5 py-0.5 rounded transition ${currency === 'EUR' ? 'bg-ace-pink text-white font-bold' : 'hover:text-white'}`}
            >
              EUR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
