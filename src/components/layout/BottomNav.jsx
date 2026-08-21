import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Settings } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const BottomNav = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 lg:hidden py-2 px-6 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center p-1 transition ${
              isActive ? 'text-ace-pink' : 'text-neutral-600 hover:text-ace-black'
            }`
          }
          aria-label="Home"
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
        </NavLink>

        {/* Shopping Bag */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center p-1 text-neutral-600 hover:text-ace-black transition"
          aria-label="Shopping Bag"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-ace-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItemsCount}
            </span>
          )}
        </button>

        {/* Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center p-1 transition ${
              isActive ? 'text-ace-pink' : 'text-neutral-600 hover:text-ace-black'
            }`
          }
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5 stroke-[1.8]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-ace-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </NavLink>

        {/* Settings / Order Tracking */}
        <NavLink
          to="/order-tracking"
          className={({ isActive }) =>
            `flex flex-col items-center p-1 transition ${
              isActive ? 'text-ace-pink' : 'text-neutral-600 hover:text-ace-black'
            }`
          }
          aria-label="Track Order & Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </NavLink>
      </div>
    </div>
  );
};
