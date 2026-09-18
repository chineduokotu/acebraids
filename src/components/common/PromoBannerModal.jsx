import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProductBySlug } from '../../api/products';

export const PromoBannerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productSlug, setProductSlug] = useState(null);
  const dialogRef = useRef(null);
  const productPath = productSlug ? `/product/${encodeURIComponent(productSlug)}` : null;

  const handleClose = useCallback(() => {
    sessionStorage.setItem('ace_boho_promo_dismissed', 'true');
    setIsOpen(false);
  }, []);

  useEffect(() => {
    // Check if dismissed during this browser session
    const isDismissed = sessionStorage.getItem('ace_boho_promo_dismissed');
    if (!isDismissed) {
      let cancelled = false;
      // Resolve the saved catalogue entry before showing any product links.
      fetchProductBySlug('individual-boho-crochet-extension-island-twist')
        .then((product) => {
          if (!cancelled) setProductSlug(product?.slug || null);
        })
        .catch(() => {
          // Do not show a promotion with an unavailable product destination.
        });
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !productPath) return;

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    // Native modal behavior keeps keyboard focus inside and the page behind inert.
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, productPath]);

  // Only advertise a product once its real catalogue slug is available.
  if (!isOpen || !productPath) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="boho-promo-title"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="fixed inset-0 m-auto p-0 w-[calc(100%-2rem)] max-w-md max-h-[calc(100vh-2rem)] supports-[height:100dvh]:max-h-[calc(100dvh-2rem)] bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 backdrop:bg-black/60 backdrop:backdrop-blur-xs animate-fadeIn"
    >
      <div className="flex flex-col max-h-[calc(100vh-2rem-2px)] supports-[height:100dvh]:max-h-[calc(100dvh-2rem-2px)]">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-white/90 text-neutral-700 hover:text-black flex items-center justify-center shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ace-pink"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div
          role="region"
          aria-label="Product information"
          tabIndex={0}
          className="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ace-pink"
        >
          {/* Keep the existing video and crop; the whole visual links to the product. */}
          <Link
            to={productPath}
            onClick={handleClose}
            aria-label="View Individual Boho Crochet Extension – Island Twist"
            className="block relative aspect-[16/10] bg-black overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ace-pink"
          >
            <video
              src="/uploads/boho-crochet.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
          </Link>

          <div className="p-5 text-center flex flex-col items-center">
            <h3 id="boho-promo-title" className="font-heading font-extrabold text-lg sm:text-xl text-neutral-900 leading-snug">
              <Link
                to={productPath}
                onClick={handleClose}
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ace-pink"
              >
                Individual Boho Crochet Extension – Island Twist
              </Link>
            </h3>
            <p className="mt-1.5 font-heading font-bold text-lg text-neutral-900">£135</p>
            <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed max-w-xs">
              Elevate your look with our Individual Boho Crochet Extensions, designed to give you a beautiful, effortless Island Twist style.
            </p>

            <div className="mt-4 w-full text-left text-xs text-neutral-600 leading-relaxed">
              <h4 className="font-semibold text-neutral-900">Product Details</h4>
              <ul className="mt-1.5 list-disc pl-4 space-y-1.5">
                <li><span className="font-semibold">Length:</span> 30 inches</li>
                <li><span className="font-semibold">Colour:</span> Black</li>
                <li><span className="font-semibold">Style:</span> Island Twist / Single Braids</li>
                <li><span className="font-semibold">Adjustable Length:</span> The extensions can be cut and customised to your desired length.</li>
                <li><span className="font-semibold">Reusable:</span> Each extension can be carefully reused up to 3 times, making it a great choice for versatile styling.</li>
              </ul>
            </div>
            <p className="mt-4 text-xs text-neutral-600 leading-relaxed max-w-xs">
              Perfect for creating a gorgeous boho-inspired look with less styling time and maximum versatility.
            </p>
          </div>
        </div>

        {/* Actions stay visible while the video and longer copy scroll above. */}
        <div className="shrink-0 p-5 pt-3 flex items-center gap-2.5 w-full bg-white">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 min-h-11 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ace-pink"
          >
            Cancel
          </button>
          <Link
            to={productPath}
            onClick={handleClose}
            className="flex-[2] min-h-11 py-2.5 bg-neutral-900 hover:bg-ace-pink text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ace-pink"
          >
            <span>View Product</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </dialog>
  );
};
