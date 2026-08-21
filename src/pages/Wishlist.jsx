import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';

export const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-ace-light text-ace-pink flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 fill-ace-pink" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-ace-black mb-2">
          Your Wishlist is Empty
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          Save your favorite boho braids, ponytails, and braided wigs to purchase later.
        </p>
        <Link to="/shop">
          <Button variant="primary">Explore Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-ace-border">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-ace-black">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-neutral-500 mt-1">{wishlist.length} item(s) saved</p>
          </div>
          <Link to="/shop">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              Shop More Styles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
