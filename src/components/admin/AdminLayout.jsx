import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, ShoppingCart, Film, LogOut, Store, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminNotificationsProvider, useAdminNotifications } from '../../context/AdminNotificationsContext';
import { ScrollToTop } from '../common/ScrollToTop';

const AdminLayoutContent = () => {
  const { logout } = useAuth();
  const { unreadCount, connection } = useAdminNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Customer Looks', path: '/admin/customer-looks', icon: Film },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col lg:flex-row">
      <ScrollToTop />
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-neutral-900 border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col justify-between flex-shrink-0 lg:min-h-screen sticky top-0 z-40">
        <div className="min-w-0">
          {/* Admin Header */}
          <div className="px-4 py-3 sm:px-5 lg:p-6 border-b border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-ace-pink animate-pulse"></span>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white whitespace-nowrap">
                Ace<span className="text-ace-pink font-serif italic text-xl">Admin</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-ace-pink px-2 py-0.5 rounded-full border border-neutral-700">
                Portal
              </span>
              <NavLink
                to="/"
                className="lg:hidden w-9 h-9 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center"
                aria-label="View public store"
              >
                <Store className="w-4 h-4" />
              </NavLink>
              <button
                onClick={handleLogout}
                className="lg:hidden w-9 h-9 rounded-xl bg-rose-950/50 text-rose-300 hover:text-white flex items-center justify-center"
                aria-label="Log out admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex lg:block gap-2 lg:space-y-1.5 overflow-x-auto no-scrollbar px-3 py-3 lg:p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex flex-shrink-0 items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-semibold transition ${
                      isActive
                        ? 'bg-ace-pink text-white shadow-pink-glow'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.name === 'Notifications' && unreadCount > 0 && <span aria-label={`${unreadCount} unread notifications`} className="rounded-full bg-white text-pink-700 px-1.5 py-0.5 text-[10px] font-bold">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="hidden lg:block p-4 border-t border-neutral-800 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <Store className="w-4 h-4 text-neutral-500" />
            <span>View Public Store</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-x-hidden overflow-y-auto bg-neutral-950">
        <div className="flex justify-end items-center gap-3 mb-5">
          <span role="status" className="text-[11px] text-neutral-400">{connection === 'live' ? 'Payment updates connected' : connection === 'connecting' ? 'Connecting payment updates…' : 'Reconnecting payment updates…'}</span>
          <NavLink to="/admin/notifications" aria-label={`Payment notifications, ${unreadCount} unread`} className="relative inline-flex w-10 h-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-ace-pink hover:bg-neutral-800">
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && <span aria-hidden="true" className="absolute -top-1 -right-1 rounded-full bg-ace-pink text-white px-1.5 text-[10px] font-bold">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </NavLink>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export const AdminLayout = () => <AdminNotificationsProvider><AdminLayoutContent /></AdminNotificationsProvider>;
