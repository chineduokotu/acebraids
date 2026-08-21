import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';

export const CategoryGrid = ({ categories = [] }) => {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-ace-pink text-xs font-bold uppercase tracking-widest mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ace-black">
            Shop by Category
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Handcrafted with feather-light braiding fibers and breathable HD mesh foundations.
          </p>
        </div>

        {/* 4 Category Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft bg-neutral-900 border border-ace-border/50 block"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors" />

              {/* Content Box */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Top Item Count Pill */}
                <div className="self-end">
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                    {cat.itemCount || 'Popular'} Styles
                  </span>
                </div>

                {/* Bottom Category Name & Arrow */}
                <div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-tight group-hover:text-ace-light transition-colors">
                    {cat.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-ace-pink uppercase tracking-wider">
                    <span>Explore Collection</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
