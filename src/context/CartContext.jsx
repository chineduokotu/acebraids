import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchProductBySlug } from '../api/products';
import { addCartItem, getRemainingStock, refreshCartStock, updateCartQuantity } from '../utils/inventory';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ace_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => item?.product && Number.isSafeInteger(item.qty) && item.qty > 0) : [];
    } catch {
      return [];
    }
  });
  const cartRef = useRef(cart);
  const toastTimer = useRef(null);

  const commitCart = (items) => {
    cartRef.current = items;
    setCart(items);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const slugs = [...new Set(cartRef.current.map((item) => item.slug).filter(Boolean))];
      await Promise.all(slugs.map(async (slug) => {
        try {
          const product = await fetchProductBySlug(slug);
          if (active && product?._id) commitCart(refreshCartStock(cartRef.current, product));
        } catch {
          // Checkout still checks current server stock if the catalogue is unavailable.
        }
      }));
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
      clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ace_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, variant = {}, qty = 1, openDrawer = true) => {
    const result = addCartItem(cartRef.current, product, variant, qty);
    commitCart(result.cart);
    showToast(result.message);
    if (result.added && openDrawer) setIsCartOpen(true);
    return result.added;
  };

  const removeFromCart = (variantKey) => {
    commitCart(cartRef.current.filter(item => item.variantKey !== variantKey));
  };

  const updateQuantity = (variantKey, newQty) => {
    const result = updateCartQuantity(cartRef.current, variantKey, newQty);
    commitCart(result.cart);
    if (result.message) showToast(result.message);
  };

  const clearCart = () => {
    commitCart([]);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Free UK shipping threshold at £80
  const freeShippingThreshold = 80;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        getAvailableQuantity: (product, variant) => getRemainingStock(cart, product, variant),
        clearCart,
        totalItemsCount,
        subtotal,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        freeShippingProgress,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
