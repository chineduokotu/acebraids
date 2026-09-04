import React from 'react';

export const HeroBanner = () => {
  return (
    <section className="relative bg-white pt-4 sm:pt-6 pb-0 overflow-hidden">
      <div className="max-w-xl mx-auto px-3 sm:px-6 text-center">
        <div className="space-y-1.5 sm:space-y-1 mb-3 select-none overflow-hidden">
          <div className="flex items-baseline justify-center gap-1 sm:gap-2 leading-none whitespace-nowrap">
            <span className="font-heading font-normal text-[34px] min-[390px]:text-4xl sm:text-6xl text-ace-black">
              the
            </span>
            <span className="font-serif italic font-normal text-[44px] min-[390px]:text-5xl sm:text-7xl text-ace-pink">
              HAIR
            </span>
          </div>

          <div className="flex items-baseline justify-center gap-1 sm:gap-1.5 leading-none whitespace-nowrap">
            <span className="font-heading font-extrabold text-[33px] min-[390px]:text-4xl sm:text-6xl text-ace-black uppercase">
              your
            </span>
            <span className="font-serif italic font-normal text-[43px] min-[390px]:text-5xl sm:text-7xl text-ace-black">
              <span className="text-ace-pink font-light">C</span>ARTS
            </span>
          </div>

          <p className="text-[9px] min-[390px]:text-[10px] sm:text-xs tracking-[0.26em] sm:tracking-[0.38em] text-ace-black uppercase font-medium pt-2 sm:pt-3 font-heading whitespace-nowrap">
            BEEN WAITING FOR
          </p>
        </div>

        <div className="relative w-full max-w-[360px] sm:max-w-[440px] mx-auto mt-1 overflow-hidden bg-transparent">
          <img
            src="/hero_model.jpg"
            alt="AceBeautyBraids Signature Boho Curls Model"
            className="w-full h-auto object-cover object-top mx-auto mix-blend-multiply"
            onError={(e) => {
              e.target.src = '/uploads/hero_model.jpg';
            }}
          />
        </div>
      </div>

      <div className="w-full bg-ace-pink text-white py-2.5 overflow-hidden whitespace-nowrap border-y border-pink-600/30">
        <div className="inline-flex animate-marquee gap-8 text-xs font-heading font-bold uppercase tracking-widest">
          <span>EXTENSIONS</span>
          <span>*</span>
          <span>PREMIUM QUALITY</span>
          <span>*</span>
          <span>EFFORTLESS GLAM</span>
          <span>*</span>
          <span>24-48H UK & GERMANY DISPATCH</span>
          <span>*</span>
          <span>READY TO INSTALL</span>
          <span>*</span>
          <span>EXTENSIONS</span>
          <span>*</span>
          <span>PREMIUM QUALITY</span>
          <span>*</span>
          <span>EFFORTLESS GLAM</span>
          <span>*</span>
          <span>24-48H UK & GERMANY DISPATCH</span>
          <span>*</span>
          <span>READY TO INSTALL</span>
        </div>
      </div>
    </section>
  );
};
