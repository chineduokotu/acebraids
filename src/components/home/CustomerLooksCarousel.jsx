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
          {(Array.isArray(looks) ? looks : []).map((look) => {
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

                {/* Dark Subtle Bottom Gradient for Button Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Centered BUY Button */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLook(look);
                    }}
                    className="px-6 py-2.5 rounded-full bg-ace-pink hover:bg-neutral-900 text-white font-heading font-bold text-xs uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    aria-label="Buy look"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
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
