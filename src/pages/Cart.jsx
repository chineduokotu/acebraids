import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/common/Button';

export const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const { format } = useCurrency();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 5.99;
  const discountAmount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ACE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "ACE10" for 10% off.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-ace-light text-ace-pink flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black mb-2">
          Your Bag is Empty
        </h1>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-8">
          You haven't added any luxury hair extensions or braided wigs yet.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Discover Our Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-ace-border">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ace-black">
            Shopping Bag ({cart.length})
          </h1>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-ace-pink hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Meter */}
            <div className="bg-ace-alt p-4 rounded-2xl border border-ace-border/60">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>
                  {amountNeededForFreeShipping > 0 ? (
                    <>Add <strong className="text-ace-pink">{format(amountNeededForFreeShipping)}</strong> more to get <strong>FREE UK Delivery</strong></>
                  ) : (
                    <strong className="text-ace-pink">🎉 You have qualified for FREE UK Delivery!</strong>
                  )}
                </span>
                <span className="text-neutral-500">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ace-pink transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-ace-border/70 border-t border-ace-border/70">
              {cart.map((item) => (
                <CartItem
                  key={item.variantKey}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-ace-alt p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-sm space-y-6">
              <h2 className="font-heading font-extrabold text-lg text-ace-black">
                Order Summary
              </h2>

              {/* Promo Code Box */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo Code (try ACE10)"
                      className="w-full bg-white border border-ace-border rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-ace-pink"
                    />
                    <Tag className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ace-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    ✓ 10% VIP Promo Applied!
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-rose-500 font-medium">
                    {promoError}
                  </p>
                )}
              </form>

              {/* Subtotal, Shipping, Discount breakdown */}
              <div className="space-y-3 text-xs text-neutral-600 border-t border-b border-ace-border/60 py-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-ace-black">{format(subtotal)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount (10%)</span>
                    <span className="font-bold">-{format(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>UK Tracked Shipping</span>
                  <span className="font-bold text-ace-black">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : format(shippingFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="font-heading font-extrabold text-base text-ace-black">Estimated Total</span>
                <span className="font-heading font-black text-2xl text-ace-pink">
                  {format(finalTotal)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full text-xs font-bold uppercase tracking-wider shadow-pink-glow py-3.5"
                onClick={() => navigate('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulated Mock Payment (Ready to test)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
