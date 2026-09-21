import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
