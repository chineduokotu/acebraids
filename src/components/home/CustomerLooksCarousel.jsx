import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Video, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoModal } from '../common/VideoModal';

export const CustomerLooksCarousel = ({ looks = [], loading = false }) => {
  const scrollContainerRef = useRef(null);
  const [activeLook, setActiveLook] = useState(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-ace-alt border-y border-ace-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-ace-pink text-xs font-bold uppercase tracking-widest mb-1.5">
              <Video className="w-3.5 h-3.5" />
              <span>Real Babes · Real Installs</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ace-black">
              Shop Real Customer Looks
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="text-sm font-bold text-ace-black hover:text-ace-pink transition hidden sm:inline"
            >
              See more
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-9 h-9 rounded-full bg-white border border-ace-border text-ace-black hover:bg-ace-pink hover:text-white hover:border-ace-pink flex items-center justify-center transition shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-9 h-9 rounded-full bg-white border border-ace-border text-ace-black hover:bg-ace-pink hover:text-white hover:border-ace-pink flex items-center justify-center transition shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel with Auto-Playing Video Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 snap-x snap-mandatory"
        >
          {looks.map((look) => {
            const product = look.linkedProduct;
            return (
              <div
                key={look._id}
                className="group relative flex-shrink-0 w-[240px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden shadow-soft bg-neutral-900 border border-ace-border/50 snap-start select-none cursor-pointer"
                onClick={() => setActiveLook(look)}
              >
                {/* Auto-Playing Video Element */}
                <video
                  src={look.videoUrl}
                  poster={look.posterUrl || '/uploads/IMG_4065.PNG'}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 group-hover:from-black/90 transition-colors pointer-events-none" />

                {/* Customer Tag (Top) */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-semibold text-white border border-white/10">
                    {look.customerName || 'Ace Customer'}
                  </span>
                </div>

                {/* Bottom Tagged Product Info & Pinned BUY Button */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-2">
                  <div className="min-w-0 pr-2">
                    <p className="text-white font-heading font-bold text-sm line-clamp-1">
                      {look.title || product?.name}
                    </p>
                    {product && (
                      <p className="text-xs text-neutral-300 mt-0.5 truncate">
                        £{product.price?.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLook(look);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-ace-pink hover:bg-ace-dark text-white font-heading font-bold text-xs uppercase tracking-wider shadow-md transition-transform transform active:scale-95 flex items-center gap-1 flex-shrink-0"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>BUY</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Full-Screen Video Modal Player */}
      <VideoModal
        look={activeLook}
        isOpen={Boolean(activeLook)}
        onClose={() => setActiveLook(null)}
      />
    </section>
  );
};
