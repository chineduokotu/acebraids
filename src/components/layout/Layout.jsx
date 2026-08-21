import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { CartDrawer } from '../cart/CartDrawer';
import { Toast } from '../common/Toast';
import { ScrollToTop } from '../common/ScrollToTop';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-ace-soft pb-14 lg:pb-0">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <Toast />
    </div>
  );
};
