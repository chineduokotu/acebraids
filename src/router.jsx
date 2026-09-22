import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { useAuth } from './context/AuthContext';
import { PageLoader } from './components/common/PageLoader';

// ---------------------------------------------------------------------------
// Lazy-loaded public pages — each becomes a separate chunk.
// ---------------------------------------------------------------------------
const Home            = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop            = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail   = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart            = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout        = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const OrderTracking   = lazy(() => import('./pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const PaymentPending  = lazy(() => import('./pages/PaymentPending').then(m => ({ default: m.PaymentPending })));
const Wishlist        = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));
const About           = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact         = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

// ---------------------------------------------------------------------------
// Admin pages — bundled into a single "admin" chunk via a barrel import.
// ---------------------------------------------------------------------------
const AdminLogin         = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const Dashboard          = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ManageProducts     = lazy(() => import('./pages/admin/ManageProducts').then(m => ({ default: m.ManageProducts })));
const ManageCategories   = lazy(() => import('./pages/admin/ManageCategories').then(m => ({ default: m.ManageCategories })));
const ManageOrders       = lazy(() => import('./pages/admin/ManageOrders').then(m => ({ default: m.ManageOrders })));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications').then(m => ({ default: m.AdminNotifications })));
const ManageCustomerLooks = lazy(() => import('./pages/admin/ManageCustomerLooks').then(m => ({ default: m.ManageCustomerLooks })));
const AdminSettings      = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

// Protected Route wrapper for admin
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Wrap element in Suspense with shared fallback
const s = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,                              element: s(<Home />) },
      { path: 'shop',                             element: s(<Shop />) },
      { path: 'shop/:categorySlug',               element: s(<Shop />) },
      { path: 'product/:slug',                    element: s(<ProductDetail />) },
      { path: 'cart',                             element: s(<Cart />) },
      { path: 'checkout',                         element: s(<Checkout />) },
      { path: 'order-confirmation/:id',           element: s(<OrderConfirmation />) },
      { path: 'payment-pending/:id',              element: s(<PaymentPending />) },
      { path: 'order-tracking',                   element: s(<OrderTracking />) },
      { path: 'wishlist',                         element: s(<Wishlist />) },
      { path: 'about-us',                         element: s(<About />) },
      { path: 'contact-us',                       element: s(<Contact />) },
    ],
  },
  {
    path: '/admin/login',
    element: s(<AdminLogin />),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true,               element: s(<Dashboard />) },
      { path: 'products',          element: s(<ManageProducts />) },
      { path: 'categories',        element: s(<ManageCategories />) },
      { path: 'orders',            element: s(<ManageOrders />) },
      { path: 'orders/:orderId',    element: s(<ManageOrders />) },
      { path: 'notifications',     element: s(<AdminNotifications />) },
      { path: 'customer-looks',    element: s(<ManageCustomerLooks />) },
      { path: 'settings',          element: s(<AdminSettings />) },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
