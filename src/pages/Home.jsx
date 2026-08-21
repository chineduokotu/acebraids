import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { BestSellers } from '../components/home/BestSellers';
import { CustomerLooksCarousel } from '../components/home/CustomerLooksCarousel';
import { fetchProducts } from '../api/products';
import { fetchCustomerLooks } from '../api/customerLooks';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [customerLooks, setCustomerLooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodData, looksData] = await Promise.all([
          fetchProducts({ limit: 12 }),
          fetchCustomerLooks(),
        ]);
        setProducts(prodData.products || []);
        setCustomerLooks(looksData || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Products Grid */}
      <BestSellers products={products} loading={loading} />

      {/* 3. Real Customer Looks Video Carousel */}
      {customerLooks.length > 0 && (
        <CustomerLooksCarousel looks={customerLooks} loading={loading} />
      )}
    </div>
  );
};
