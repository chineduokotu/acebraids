import React from 'react';
import { Feather, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

export const WhyChooseUs = () => {
  const perks = [
    {
      icon: Feather,
      title: 'Feather-Light Density',
      desc: 'Zero tension on your natural hairline. Handcrafted with ultra-light premium synthetic & human curl blends.',
    },
    {
      icon: Zap,
      title: 'Ready in Minutes',
      desc: 'Skip 8+ hours in the braiding chair. Pre-looped crochet & glueless wigs ready straight from the luxury box.',
    },
    {
      icon: ShieldCheck,
      title: 'HD Invisible Scalp Melt',
      desc: 'Bleached micro-knots with ultra-thin transparent HD Swiss lace for undetectable scalp illusion.',
    },
    {
      icon: HeartHandshake,
      title: 'UK & Germany Dedicated',
      desc: 'Local customer support, tracked dispatch, and hassle-free returns with no customs delays.',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-ace-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-3xl bg-ace-alt border border-ace-border/50">
                <div className="w-12 h-12 rounded-2xl bg-white border border-ace-border text-ace-pink flex items-center justify-center mb-4 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base text-ace-black mb-2">
                  {perk.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
