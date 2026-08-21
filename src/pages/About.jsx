import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Title Section */}
      <section className="pt-12 sm:pt-20 pb-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ace-pink font-bold mb-3">
          The AceBraids_n_extensions Story
        </p>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-ace-black tracking-tight leading-tight">
          Elevating the Art of <span className="font-serif italic text-ace-pink font-normal">Braided Glamour</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed max-w-2xl mx-auto">
          Based in the United Kingdom, <strong>AceBraids_n_extensions</strong> is your premier destination for effortless, luxury hair solutions designed to end long salon waits and protect your natural hair.
        </p>
      </section>

      {/* Main Narrative */}
      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <img
              src="/uploads/IMG_4065.PNG"
              alt="AceBraids_n_extensions Craftsmanship"
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = '/hero_model.jpg';
              }}
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="text-ace-pink text-xs font-bold uppercase tracking-widest">
              What We Deal In
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black tracking-tight">
              Premium Quality Extensions & Wigs
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              At <strong>AceBraids_n_extensions</strong>, we specialize in high-end, hand-crafted hair pieces crafted for ultimate comfort, seamless scalp melts, and quick installation:
            </p>

            <ul className="space-y-2.5 text-sm text-neutral-700 font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-ace-pink flex-shrink-0" />
                <span>Individual ready to install boho crochet extensions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-ace-pink flex-shrink-0" />
                <span>Premium boho ponytail extensions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-ace-pink flex-shrink-0" />
                <span>Premium quality braided wigs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-ace-pink flex-shrink-0" />
                <span>Exquisite cap braided wigs and lots more</span>
              </li>
            </ul>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-neutral-200">
              <div>
                <p className="font-heading font-extrabold text-3xl text-ace-pink">UK Based</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Direct Fast Dispatch</p>
              </div>
              <div>
                <p className="font-heading font-extrabold text-3xl text-ace-black">100%</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Handmade Luxury Craft</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flat Brand Promises */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black mb-10 text-center">
          The Ace Quality Promise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-base text-ace-black">Feather-Light Comfort</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We use proprietary lightweight synthetic fiber blends infused with soft human hair curls to keep each unit light on the scalp with zero neck strain.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-base text-ace-black">Edge-Friendly Protection</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Protect your natural edges from traction alopecia with glueless install bands and zero-tension cornrow caps.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-base text-ace-black">UK & German Dispatch</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Direct UK fulfillment with Royal Mail 24/48h tracked services and expedited DHL Express to Germany.
            </p>
          </div>
        </div>
      </section>

      {/* Flat CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4 text-center border-t border-neutral-200">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black">
          Ready to find your signature look?
        </h2>
        <p className="text-sm text-neutral-500 mt-2 mb-6">
          Browse our hand-braided luxury catalog and get instant dispatch to your doorstep.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg" className="text-xs font-bold uppercase tracking-wider">
            Shop The Catalog Now
          </Button>
        </Link>
      </section>
    </div>
  );
};
