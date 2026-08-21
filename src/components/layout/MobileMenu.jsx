import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';

export const MobileMenu = ({ isOpen, onClose, onOpenSearch }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F7F5F6] transition-all duration-300 ease-out animate-fadeIn">
      {/* Top Bar: Close (X) on left, Centered Logo, Search Icon on right */}
      <div className="h-16 px-4 bg-white border-b border-[#E5E1E3] flex items-center justify-between flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 text-[#1A1A1A] hover:text-ace-pink transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 stroke-[2]" />
        </button>

        <div className="flex items-center justify-center flex-1">
          <img
            src="/logo.png"
            alt="AceBraids_n_extensions"
            className="h-10 object-contain max-w-[170px]"
            onError={(e) => {
              e.target.src = '/uploads/image.png';
            }}
          />
        </div>

        <button
          onClick={() => {
            onClose();
            if (onOpenSearch) onOpenSearch();
            else navigate('/shop');
          }}
          className="p-2 text-[#1A1A1A] hover:text-ace-pink transition-colors"
          aria-label="Search store"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Stacked list of nav links on light background */}
      <div className="flex-1 overflow-y-auto bg-[#F7F5F6]">
        <nav className="flex flex-col">
          {navLinks.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full px-6 py-[1.1rem] text-left text-[17px] tracking-wide border-b border-[#E5E1E3] transition-colors ${
                  isActive
                    ? 'text-ace-pink font-bold'
                    : 'text-[#1A1A1A] font-normal hover:text-ace-pink'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
