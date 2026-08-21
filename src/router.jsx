import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderTracking } from './pages/OrderTracking';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ManageProducts } from './pages/admin/ManageProducts';
import { ManageOrders } from './pages/admin/ManageOrders';
import { ManageCustomerLooks } from './pages/admin/ManageCustomerLooks';
import { useAuth } from './context/AuthContext';

// Protected Route wrapper for admin
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:categorySlug', element: <Shop /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'order-confirmation/:id', element: <OrderConfirmation /> },
      { path: 'order-tracking', element: <OrderTracking /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'about-us', element: <About /> },
      { path: 'contact-us', element: <Contact /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ManageProducts /> },
      { path: 'orders', element: <ManageOrders /> },
      { path: 'customer-looks', element: <ManageCustomerLooks /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
