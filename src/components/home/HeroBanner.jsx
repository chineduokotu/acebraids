import React from "react";

export const HeroBanner = () => {
  return (
    <section className="relative bg-white pt-4 sm:pt-6 pb-0 overflow-hidden">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        {/* Typographic Hero Headline matching reference screenshot exactly */}
        <div className="space-y-1 mb-3 select-none">
          {/* First Line: "the HAIR" with stylized flourish in Ace Pink */}
          <div className="flex items-baseline justify-center gap-1.5 sm:gap-2 leading-none">
            <span className="font-heading font-normal text-4xl sm:text-6xl text-ace-black tracking-tight">
              the
            </span>
            <span className="font-serif italic font-normal text-5xl sm:text-7xl text-ace-pink tracking-tight relative -top-1">
              HAIR
            </span>
          </div>

          {/* Second Line: "YOUR CARTS" with stylized flourish */}
          <div className="flex items-baseline justify-center gap-1 sm:gap-1.5 leading-none">
            <span className="font-heading font-extrabold text-4xl sm:text-6xl text-ace-black tracking-tight uppercase">
              your
            </span>
            <span className="font-serif italic font-normal text-5xl sm:text-7xl text-ace-black tracking-tight">
              <span className="text-ace-pink font-light">C</span>ARTS
            </span>
          </div>

          {/* Third Line: Letter-spaced kicker */}
          <p className="text-[11px] sm:text-xs tracking-[0.38em] text-ace-black uppercase font-medium pt-3 font-heading">
            B E E N &nbsp; W A I T I N G &nbsp; F O R
          </p>
        </div>

        {/* Model Centerpiece Portrait Photo without background */}
        <div className="relative w-full max-w-[400px] sm:max-w-[440px] mx-auto mt-1 overflow-hidden bg-transparent">
          <img
            src="/hero_model.jpg"
            alt="AceBeautyBraids Signature Boho Curls Model"
            className="w-full h-auto object-cover object-top mx-auto mix-blend-multiply"
            onError={(e) => {
              e.target.src = "/uploads/hero_model.jpg";
            }}
          />
        </div>
      </div>

      {/* Full-width Ace Pink Marquee Ribbon */}
      <div className="w-full bg-ace-pink text-white py-2.5 overflow-hidden whitespace-nowrap border-y border-pink-600/30">
        <div className="inline-flex animate-marquee gap-8 text-xs font-heading font-bold uppercase tracking-widest">
          <span>EXTENSIONS</span>
          <span>★</span>
          <span>PREMIUM QUALITY</span>
          <span>★</span>
          <span>EFFORTLESS GLAM</span>
          <span>★</span>
          <span>24–48H UK & GERMANY DISPATCH</span>
          <span>★</span>
          <span>READY TO INSTALL</span>
          <span>★</span>
          <span>EXTENSIONS</span>
          <span>★</span>
          <span>PREMIUM QUALITY</span>
          <span>★</span>
          <span>EFFORTLESS GLAM</span>
          <span>★</span>
          <span>24–48H UK & GERMANY DISPATCH</span>
          <span>★</span>
          <span>READY TO INSTALL</span>
        </div>
      </div>
    </section>
  );
};
