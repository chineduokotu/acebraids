import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { fetchProductBySlug, fetchProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/product/ProductCard';
import { fallbackProducts } from '../data/fallbackData';

export const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { format } = useCurrency();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accordion tabs state
  const [openTab, setOpenTab] = useState('details');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const prodData = await fetchProductBySlug(slug);
        if (prodData && prodData.name) {
          setProduct(prodData);
          setSelectedVariant(prodData.variants?.[0] || null);

          // Load related items
          if (prodData.category?._id) {
            const related = await fetchProducts({ category: prodData.category._id, limit: 4 });
            setRelatedProducts(related.products?.filter(p => p._id !== prodData._id) || []);
          }
        } else {
          throw new Error('Product not found via API');
        }
      } catch (err) {
        // Fallback to local catalog
        const localProd = fallbackProducts.find(p => p.slug === slug);
        if (localProd) {
          setProduct(localProd);
          setSelectedVariant(localProd.variants?.[0] || null);
          setRelatedProducts(fallbackProducts.filter(p => p.slug !== slug).slice(0, 4));
        } else {
          setError('Unable to load product. It may have been removed.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return <div className="py-24"><Loader text="Loading..." /></div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">{error || "We couldn't find the requested hair style."}</p>
        <Link to="/shop">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);
  const activeVariant = selectedVariant || product.variants?.[0] || {};
  const isOutOfStock = activeVariant.stock === 0;
  const effectivePrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity, true);
  };

  return (
    <div className="py-6 sm:py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6 sm:mb-8 font-normal">
          <Link to="/" className="hover:text-neutral-900 transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-neutral-900 transition">Shop</Link>
          {product.category?.name && (
            <>
              <span>/</span>
              <span className="text-neutral-500">{product.category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Gallery Stage */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images || []}
              videos={product.videos || []}
              productName={product.name}
            />
          </div>

          {/* Right Column: Buying Options & Product Details */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header: Title, Category & Price */}
            <div>
              {product.category?.name && (
                <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                  {product.category.name}
                </p>
              )}

              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-heading font-bold text-neutral-900">
                  {format(effectivePrice)}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {format(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <VariantSelector
                  variants={product.variants || []}
                  selectedVariant={activeVariant}
                  onSelectVariant={setSelectedVariant}
                />
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-200 bg-white h-12 px-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-500 hover:text-neutral-900 transition px-2 text-base font-semibold"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold text-neutral-900 min-w-[24px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-neutral-500 hover:text-neutral-900 transition px-2 text-base font-semibold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-12 bg-neutral-900 hover:bg-ace-pink text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 active:scale-[0.99] disabled:bg-neutral-300"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                    isSaved
                      ? 'border-ace-pink bg-ace-pink text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-900'
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Information Accordion */}
            <div className="border-t border-neutral-200 pt-2 divide-y divide-neutral-200 text-sm">
              {/* Tab 1: Product Features */}
              {product.details && product.details.length > 0 && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenTab(openTab === 'details' ? '' : 'details')}
                    className="w-full flex items-center justify-between text-left font-medium text-neutral-900"
                  >
                    <span>Features & Details</span>
                    {openTab === 'details' ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>
                  {openTab === 'details' && (
                    <div className="pt-3 pb-1 text-xs text-neutral-600 space-y-1.5 animate-fadeIn">
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.details.map((detail, idx) => (
                          <li key={idx} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Maintenance & Hair Care */}
              {product.hairCareTips && product.hairCareTips.length > 0 && (
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenTab(openTab === 'care' ? '' : 'care')}
                    className="w-full flex items-center justify-between text-left font-medium text-neutral-900"
                  >
                    <span>Maintenance & Care</span>
                    {openTab === 'care' ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </button>
                  {openTab === 'care' && (
                    <div className="pt-3 pb-1 text-xs text-neutral-600 space-y-1.5 animate-fadeIn">
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.hairCareTips.map((tip, idx) => (
                          <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Shipping & Delivery */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenTab(openTab === 'shipping' ? '' : 'shipping')}
                  className="w-full flex items-center justify-between text-left font-medium text-neutral-900"
                >
                  <span>Shipping & Delivery</span>
                  {openTab === 'shipping' ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openTab === 'shipping' && (
                  <div className="pt-3 pb-1 text-xs text-neutral-600 space-y-2 animate-fadeIn leading-relaxed">
                    <p>All units are carefully inspected and dispatched directly from our UK fulfillment center.</p>
                    <p>Standard tracked shipping available across the UK, Europe, and worldwide.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 mb-6 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id || rel.slug} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
