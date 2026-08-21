import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export const BohoCrochetSpotlight = () => {
  return (
    <section id="boho-crochet-spotlight" className="py-12 sm:py-20 bg-neutral-50 border-t border-b border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Autoplaying Video Reel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-neutral-300">
              <video
                src="/uploads/boho-crochet.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Editorial Content & Features */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-neutral-900 leading-tight">
                Individual Ready-to-Install Boho Crochet Extensions
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              Experience the effortless beauty of salon-quality boho crochet braids. Pre-separated and pre-looped with lush bohemian ringlets for a fast, tension-free installation that protects your natural hairline.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pre-looped for 90-min install</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Ultra-lightweight & zero neck tension</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Tangle-resistant bohemian curl blend</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Natural finish with seamless blending</span>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Starting Price</p>
                <p className="font-heading font-bold text-2xl text-neutral-900">£110.00</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/shop"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-ace-pink text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-7 py-3.5 transition-colors active:scale-95"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/447404330112?text=Hello%2C%20I%20would%20like%20to%20order%20the%20Individual%20Boho%20Crochet%20Extensions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-neutral-300 hover:border-neutral-900 bg-white text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider px-5 py-3.5 transition-colors"
                >
                  WhatsApp Order
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
