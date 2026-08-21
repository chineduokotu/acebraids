import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { MobileMenu } from './MobileMenu';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-ace-border/80'
            : 'bg-white border-b border-ace-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Hamburger Trigger (Left) */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-ace-black hover:text-ace-pink transition-colors focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            {/* Brand Logo (Centered on mobile, left on desktop) */}
            <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/logo.png"
                  alt="AceBeautyBraids"
                  className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/uploads/image.png';
                  }}
                />
                <span className="hidden font-heading text-xl sm:text-2xl font-black tracking-tight text-ace-black">
                  ACE<span className="text-ace-pink font-serif italic text-2xl sm:text-3xl font-normal ml-0.5">Beauty</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-ace-pink font-bold' : 'text-ace-black hover:text-ace-pink'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-ace-pink font-bold' : 'text-ace-black hover:text-ace-pink'
                  }`
                }
              >
                Shop All
              </NavLink>
              <NavLink
                to="/shop?category=ready-to-install-boho-crochet-extensions"
                className="text-sm font-semibold tracking-wide text-ace-black hover:text-ace-pink transition-colors"
              >
                Crochet Extensions
              </NavLink>
              <NavLink
                to="/shop?category=premium-braided-wigs"
                className="text-sm font-semibold tracking-wide text-ace-black hover:text-ace-pink transition-colors"
              >
                Braided Wigs
              </NavLink>
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-ace-pink font-bold' : 'text-ace-black hover:text-ace-pink'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact-us"
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-ace-pink font-bold' : 'text-ace-black hover:text-ace-pink'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Actions: Search, Wishlist, Bag */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-ace-black hover:text-ace-pink transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Wishlist Link (Desktop) */}
              <Link
                to="/wishlist"
                className="relative p-2 text-ace-black hover:text-ace-pink transition-colors hidden sm:inline-flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.8]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-ace-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger (Desktop) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-ace-black hover:text-ace-pink transition-colors hidden sm:inline-flex"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-ace-pink text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Admin Shortcut */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-ace-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-ace-pink" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Search Dropdown Drawer */}
          {isSearchOpen && (
            <div className="py-3 border-t border-ace-border animate-fadeIn">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search boho crochet, wigs, ponytails..."
                  className="w-full bg-ace-alt border border-ace-border rounded-full pl-11 pr-24 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white transition"
                  autoFocus
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1 bg-ace-pink text-white text-xs font-semibold rounded-full hover:bg-ace-dark transition"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Full-Screen Mobile Overlay Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
};
