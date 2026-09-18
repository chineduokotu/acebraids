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
import { PaymentPending } from './pages/PaymentPending';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ManageProducts } from './pages/admin/ManageProducts';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageOrders } from './pages/admin/ManageOrders';
import { ManageCustomerLooks } from './pages/admin/ManageCustomerLooks';
import { useAuth } from './context/AuthContext';

// Protected Route wrapper for admin
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div role="status" className="min-h-screen bg-neutral-950 text-neutral-300 flex items-center justify-center text-sm">Checking your session…</div>;
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
      { path: 'payment-pending/:id', element: <PaymentPending /> },
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
      { path: 'categories', element: <ManageCategories /> },
      { path: 'orders', element: <ManageOrders /> },
      { path: 'notifications', element: <AdminNotifications /> },
      { path: 'customer-looks', element: <ManageCustomerLooks /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
