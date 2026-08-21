import React from 'react';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { CartItem } from './CartItem';
import { Button } from '../common/Button';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalItemsCount,
    subtotal,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const { format } = useCurrency();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-ace-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ace-pink" />
              <h2 className="font-heading font-extrabold text-lg text-ace-black">
                Your Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-ace-black transition rounded-full hover:bg-ace-alt"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-ace-alt px-6 py-3.5 border-b border-ace-border/60">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-ace-black">
                <Truck className="w-4 h-4 text-ace-pink" />
                {amountNeededForFreeShipping > 0 ? (
                  <>Add <strong className="text-ace-pink">{format(amountNeededForFreeShipping)}</strong> for <strong>FREE UK Delivery</strong></>
                ) : (
                  <strong className="text-ace-pink">🎉 You unlocked FREE UK Shipping!</strong>
                )}
              </span>
              <span className="text-neutral-500 font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-ace-pink transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 divide-y divide-ace-border/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-ace-light text-ace-pink flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-ace-black">Your bag is empty</h3>
                <p className="text-sm text-neutral-500 max-w-xs mt-1 mb-6">
                  Explore our luxury boho crochet braids, ponytails, and HD wigs.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.variantKey}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-ace-border bg-white shadow-lg space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-neutral-600">Subtotal</span>
                <span className="font-heading font-extrabold text-xl text-ace-black">
                  {format(subtotal)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full group text-sm font-bold uppercase tracking-wider"
                  onClick={handleCheckoutClick}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-ace-pink py-1 transition"
                >
                  View Full Cart & Summary
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Secure 256-bit Mock Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
