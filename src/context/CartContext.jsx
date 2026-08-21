import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ace_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('ace_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, variant = {}, qty = 1, openDrawer = true) => {
    const unitPrice = variant.priceOverride || product.discountPrice || product.price;
    const variantKey = `${product._id}-${variant.color || ''}-${variant.length || ''}-${variant.capSize || ''}`;
    
    // Choose thumbnail
    const image = product.images?.[0]?.url || '/uploads/IMG_4065.PNG';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.variantKey === variantKey);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            variantKey,
            product: product._id,
            name: product.name,
            slug: product.slug,
            image,
            price: unitPrice,
            regularPrice: product.price,
            variant: {
              label: variant.label || `${variant.color || ''} ${variant.length ? `/ ${variant.length}` : ''}`,
              color: variant.color || 'Natural Black',
              length: variant.length || 'Standard',
              capSize: variant.capSize || 'Standard',
              sku: variant.sku || '',
            },
            qty,
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to your bag!`);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (variantKey) => {
    setCart(prev => prev.filter(item => item.variantKey !== variantKey));
  };

  const updateQuantity = (variantKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(variantKey);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.variantKey === variantKey ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
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
