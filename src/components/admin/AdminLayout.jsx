import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Film, LogOut, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ScrollToTop } from '../common/ScrollToTop';

export const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customer Looks', path: '/admin/customer-looks', icon: Film },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col md:flex-row">
      <ScrollToTop />
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ace-pink animate-pulse"></span>
              <h2 className="font-heading font-extrabold text-lg text-white">
                Ace<span className="text-ace-pink font-serif italic text-xl">Admin</span>
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-ace-pink px-2 py-0.5 rounded-full border border-neutral-700">
              Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-ace-pink text-white shadow-pink-glow'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-neutral-950">
        <Outlet />
      </main>
    </div>
  );
};
