import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

export const App = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
