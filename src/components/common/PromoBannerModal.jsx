import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PromoBannerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if dismissed during this browser session
    const isDismissed = sessionStorage.getItem('ace_boho_promo_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('ace_boho_promo_dismissed', 'true');
    setIsOpen(false);
  };

  const handleAction = () => {
    handleClose();
    const spotlightEl = document.getElementById('boho-crochet-spotlight');
    if (spotlightEl) {
      spotlightEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/shop');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-neutral-700 hover:text-black flex items-center justify-center shadow-sm transition"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video Reel Stage */}
        <div className="relative aspect-[16/10] bg-black overflow-hidden">
          <video
            src="/uploads/boho-crochet.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-white bg-ace-pink px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              New In Store
            </span>
          </div>
        </div>

        {/* Content & Actions */}
        <div className="p-5 text-center flex flex-col items-center">
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-neutral-900 leading-snug">
            See Our Individual Boho Crochet Extensions
          </h3>
          <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed max-w-xs">
            Pre-looped ready-to-install bohemian crochet braids. Ultra-lightweight and protective for your natural hair.
          </p>

          <div className="mt-5 flex items-center gap-2.5 w-full">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAction}
              className="flex-[2] py-2.5 bg-neutral-900 hover:bg-ace-pink text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
