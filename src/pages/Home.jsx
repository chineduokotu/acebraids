import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { BestSellers } from '../components/home/BestSellers';
import { CustomerLooksCarousel } from '../components/home/CustomerLooksCarousel';
import { BohoCrochetSpotlight } from '../components/home/BohoCrochetSpotlight';
import { PromoBannerModal } from '../components/common/PromoBannerModal';
import { fetchProducts } from '../api/products';
import { fetchCustomerLooks } from '../api/customerLooks';
import { fallbackProducts, fallbackCustomerLooks } from '../data/fallbackData';

export const Home = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [customerLooks, setCustomerLooks] = useState(fallbackCustomerLooks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodData, looksData] = await Promise.allSettled([
          fetchProducts({ limit: 12 }),
          fetchCustomerLooks(),
        ]);

        if (prodData.status === 'fulfilled' && prodData.value?.products && Array.isArray(prodData.value.products)) {
          setProducts(prodData.value.products);
        }

        if (looksData.status === 'fulfilled' && Array.isArray(looksData.value)) {
          setCustomerLooks(looksData.value);
        }
      } catch (err) {
        console.error('Failed to load homepage data, using cached catalog:', err);
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
      {Array.isArray(customerLooks) && customerLooks.length > 0 && (
        <CustomerLooksCarousel looks={customerLooks} loading={loading} />
      )}

      {/* 4. Autoplaying Boho Crochet Spotlight Section */}
      <BohoCrochetSpotlight />

      {/* 5. Welcome Announcement Banner Modal with Cancel Button */}
      <PromoBannerModal />
    </div>
  );
};
