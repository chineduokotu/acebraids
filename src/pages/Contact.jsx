import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Instagram } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', orderNumber: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', orderNumber: '', message: '' });
    setTimeout(() => setSent(false), 6000);
  };

  const faqs = [
    {
      q: 'How fast will my order arrive in the UK and Germany?',
      a: 'UK orders are dispatched within 24 hours via Royal Mail Tracked (1–2 business days). Germany orders arrive in 2–4 business days with full end-to-end tracking.'
    },
    {
      q: 'Are the braided wigs glueless and ready to wear?',
      a: 'Yes! All our braided wigs and exquisite cap braided units feature pre-plucked hairlines, bleached knots, and inner adjustable security bands for 100% glueless installation.'
    },
    {
      q: 'How many packs of individual boho crochet do I need for a full head?',
      a: 'Our standard bundle includes 6–7 packs which provides full, luxurious volume for a standard install without extra purchases needed.'
    },
    {
      q: 'Can I wash and refresh the boho curls?',
      a: 'Absolutely. Use lukewarm water with sulfate-free shampoo and apply a lightweight styling mousse to keep your bohemian ringlets defined and bouncy.'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Title Section */}
      <section className="pt-12 sm:pt-20 pb-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ace-pink font-bold mb-3">
          AceBraids_n_extensions
        </p>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-ace-black tracking-tight leading-tight">
          Get in <span className="font-serif italic text-ace-pink font-normal">Touch</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed max-w-2xl mx-auto">
          Have questions about our ready-to-install boho crochet, ponytail extensions, braided wigs, or custom requests? We’re here to help you achieve effortless glam.
        </p>
      </section>

      {/* Main Content Grid: Flat Contact Info & Clean Form */}
      <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Left Column: Flat Business Information & Direct Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-ace-pink text-xs font-bold uppercase tracking-widest mb-1">
                Direct Channels
              </p>
              <h2 className="font-heading font-extrabold text-2xl text-ace-black tracking-tight">
                Customer Care & Inquiries
              </h2>
            </div>

            <div className="space-y-6 text-sm">
              {/* Direct Phone Lines */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Phone Lines</p>
                <div className="flex flex-col gap-1 text-base font-semibold text-ace-black">
                  <a href="tel:+447404330112" className="hover:text-ace-pink transition">
                    +44 7404 330112
                  </a>
                  <a href="tel:+447881162835" className="hover:text-ace-pink transition">
                    +44 7881 162835
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">WhatsApp Concierge</p>
                <a
                  href="https://wa.me/447404330112"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-semibold text-ace-pink hover:underline inline-block"
                >
                  +44 7404 330112 (Chat Now)
                </a>
              </div>

              {/* Social Channels */}
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Social Media</p>
                <div className="flex flex-col gap-1 text-sm text-neutral-700">
                  <a
                    href="https://www.instagram.com/acebraidsnextensions?igsh=cnQxc3pyc211cHRz&utm_source=qr"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ace-pink transition"
                  >
                    Instagram: <span className="font-semibold text-ace-black">@acebraidsnextensions</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@acebraidsnextensi?_r=1&_t=ZG-992lryoorhJ"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ace-pink transition"
                  >
                    TikTok: <span className="font-semibold text-ace-black">@acebraidsnextensi</span>
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Location & Dispatch</p>
                <p className="text-neutral-700 font-medium">United Kingdom</p>
                <p className="text-xs text-neutral-500">Fast dispatch to UK & Germany</p>
              </div>
            </div>
          </div>

          {/* Right Column: Flat Clean Form */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div>
                <p className="text-ace-pink text-xs font-bold uppercase tracking-widest mb-1">
                  Send A Message
                </p>
                <h2 className="font-heading font-extrabold text-2xl text-ace-black tracking-tight">
                  How can we help?
                </h2>
              </div>

              {sent ? (
                <div className="py-8 text-neutral-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-ace-pink" />
                  <h4 className="font-heading font-bold text-lg">Thank you! Your message has been sent.</h4>
                  <p className="text-sm text-neutral-600">Our team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vanessa Cole"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-none px-3.5 py-3 text-sm focus:outline-none focus:border-ace-pink focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-none px-3.5 py-3 text-sm focus:outline-none focus:border-ace-pink focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Order Tracking Number (Optional)</label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. ABB-UK-789012"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-none px-3.5 py-3 text-sm focus:outline-none focus:border-ace-pink focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what style, length, or assistance you need..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-none px-3.5 py-3 text-sm focus:outline-none focus:border-ace-pink focus:bg-white resize-none transition"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3 text-xs uppercase tracking-wider font-bold">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Flat FAQs Section (Matching About page format) */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 mt-12">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black mb-10 text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-heading font-bold text-base text-ace-black">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
