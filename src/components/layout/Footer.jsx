import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-ace-black text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-ace-pink flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-heading font-bold text-sm">United Kingdom & Germany Dispatch</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Fast tracked delivery on all orders across the UK & Europe.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-ace-pink flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-heading font-bold text-sm">100% Hand-Crafted Luxury</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Ultra-lightweight fibers and flawless HD invisible scalp illusions.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-ace-pink flex-shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-heading font-bold text-sm">VIP Customer Support</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Direct phone, WhatsApp & style consultation assistance.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt="AceBraids_n_extensions"
              className="h-12 w-auto object-contain brightness-0 invert"
              onError={(e) => {
                e.target.src = '/uploads/image.png';
              }}
            />
            <span className="font-heading text-2xl font-black tracking-tight text-white mt-1 block">
              AceBraids<span className="text-ace-pink font-serif italic text-2xl font-normal ml-1">_n_extensions</span>
            </span>
          </Link>

          <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
            Deals in individual ready-to-install boho crochet extensions, premium boho ponytail extensions, premium quality braided wigs, exquisite cap braided wigs and lots more.
          </p>

          {/* Contact Details */}
          <div className="space-y-2 pt-2 text-xs text-neutral-300">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-ace-pink flex-shrink-0" />
              <div className="flex flex-wrap gap-x-3">
                <a href="tel:+447404330112" className="hover:text-ace-pink transition font-medium">
                  +44 7404 330112
                </a>
                <span>·</span>
                <a href="tel:+447881162835" className="hover:text-ace-pink transition font-medium">
                  +44 7881 162835
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-ace-pink flex-shrink-0" />
              <span>United Kingdom</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.instagram.com/acebraidsnextensions?igsh=cnQxc3pyc211cHRz&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-ace-pink transition"
              aria-label="Instagram @acebraidsnextensions"
              title="Instagram @acebraidsnextensions"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@acebraidsnextensi?_r=1&_t=ZG-992lryoorhJ"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-ace-pink transition text-xs font-bold"
              aria-label="TikTok @acebraidsnextensi"
              title="TikTok @acebraidsnextensi"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/447404330112"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-ace-pink transition font-bold text-xs"
              aria-label="WhatsApp Concierge"
              title="Chat on WhatsApp"
            >
              WA
            </a>
          </div>
        </div>

        {/* What We Deal In */}
        <div>
          <h3 className="text-white font-heading font-bold text-sm tracking-wider uppercase mb-4">
            Collections
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/shop?category=ready-to-install-boho-crochet-extensions" className="hover:text-ace-pink transition">
                Individual Boho Crochet
              </Link>
            </li>
            <li>
              <Link to="/shop?category=premium-boho-ponytail-extensions" className="hover:text-ace-pink transition">
                Boho Ponytail Extensions
              </Link>
            </li>
            <li>
              <Link to="/shop?category=premium-braided-wigs" className="hover:text-ace-pink transition">
                Premium Braided Wigs
              </Link>
            </li>
            <li>
              <Link to="/shop?category=exquisite-cap-braided-wigs" className="hover:text-ace-pink transition">
                Exquisite Cap Braided Wigs
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-ace-pink hover:underline inline-block mt-1 font-semibold">
                Shop All & Lots More →
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-white font-heading font-bold text-sm tracking-wider uppercase mb-4">
            Customer Care
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/order-tracking" className="hover:text-ace-pink transition font-medium text-neutral-200">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:text-ace-pink transition">
                About AceBraids
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-ace-pink transition">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-ace-pink transition">
                My Wishlist
              </Link>
            </li>
            <li>
              <a href="tel:+447404330112" className="text-ace-pink hover:underline">
                Call: +44 7404 330112
              </a>
            </li>
          </ul>
        </div>

        {/* VIP Club */}
        <div>
          <h3 className="text-white font-heading font-bold text-sm tracking-wider uppercase mb-4">
            Join The Ace VIPs
          </h3>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Get exclusive early access to new restocks, discounts, and styling guides.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ace-pink transition"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-ace-pink text-white rounded-full flex items-center justify-center hover:bg-ace-dark transition"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {subscribed && (
              <p className="text-[11px] text-pink-400 font-medium animate-fadeIn">
                ✨ Welcome to the Ace VIP Circle!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>© {new Date().getFullYear()} AceBraids_n_extensions. All rights reserved. Located in the United Kingdom.</p>
        <div className="flex items-center gap-6">
          <Link to="/about-us" className="hover:text-neutral-300 transition">About</Link>
          <Link to="/contact-us" className="hover:text-neutral-300 transition">Contact</Link>
          <Link to="/shop" className="hover:text-neutral-300 transition">Shop</Link>
        </div>
      </div>
    </footer>
  );
};
