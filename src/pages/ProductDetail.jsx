import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RotateCcw, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { PriceTag } from '../components/common/PriceTag';
import { Button } from '../components/common/Button';
import { fetchProductBySlug, fetchProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { fallbackProducts } from '../data/fallbackData';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
          setRelatedProducts(fallbackProducts.filter(p => p.slug !== slug).slice(0, 3));
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
    return <div className="py-24"><Loader text="Loading product details..." /></div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="font-heading font-extrabold text-2xl text-ace-black mb-2">Product Not Found</h2>
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

  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, activeVariant, quantity, false);
    navigate('/checkout');
  };

  return (
    <div className="py-8 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-medium">
          <Link to="/" className="hover:text-ace-pink transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ace-pink transition">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-ace-pink transition">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-ace-black font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Gallery Stage */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images || []}
              videos={product.videos || []}
              productName={product.name}
            />
          </div>

          {/* Right Column: Buying Options & Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category Kicker */}
              {product.category?.name && (
                <p className="text-xs font-bold uppercase tracking-widest text-ace-pink mb-1">
                  {product.category.name}
                </p>
              )}

              {/* Product Title */}
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Count */}
              <div className="flex items-center gap-3 mt-2.5 pb-4 border-b border-ace-border/60">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ace-black">{product.rating || 4.9}</span>
                <span className="text-xs text-neutral-400 font-medium">({product.reviewsCount || 24} Verified Reviews)</span>
              </div>

              {/* Pricing */}
              <div className="py-4">
                <PriceTag
                  price={product.price}
                  discountPrice={product.discountPrice}
                  size="xl"
                />
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                  Tax included · Free UK shipping over £80 · 24-48h Dispatch
                </p>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pb-4">
                {product.description}
              </p>

              {/* Variants Selector */}
              <div className="py-4 border-t border-ace-border/60">
                <VariantSelector
                  variants={product.variants || []}
                  selectedVariant={activeVariant}
                  onSelectVariant={setSelectedVariant}
                />
              </div>

              {/* Quantity Stepper & CTAs */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-ace-border rounded-full bg-ace-alt px-3 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-neutral-500 hover:text-ace-black transition font-bold px-1"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-ace-black">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-neutral-500 hover:text-ace-black transition font-bold px-1"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-pink-glow"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                  </Button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 rounded-full border border-ace-border flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-ace-pink text-white border-ace-pink'
                        : 'bg-white text-ace-black hover:border-ace-pink hover:text-ace-pink'
                    }`}
                    aria-label="Save to wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full text-xs font-bold uppercase tracking-wider py-3"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  Buy It Now (Instant Mock Checkout)
                </Button>
              </div>

              {/* Delivery Highlights */}
              <div className="mt-6 bg-ace-alt p-4 rounded-2xl border border-ace-border/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-ace-black">
                  <Truck className="w-4 h-4 text-ace-pink flex-shrink-0" />
                  <span><strong>UK Delivery:</strong> Next Day & 48h Tracked via Royal Mail</span>
                </div>
                <div className="flex items-center gap-2 text-ace-black">
                  <Truck className="w-4 h-4 text-ace-pink flex-shrink-0" />
                  <span><strong>Germany & EU Delivery:</strong> 2–4 Business Days via DHL Express</span>
                </div>
                <div className="flex items-center gap-2 text-ace-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Quality & Scalp Melt Satisfaction Promise</span>
                </div>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-ace-border/70 pt-4 divide-y divide-ace-border/60">
              {/* Tab 1: Product Features & Specifications */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenTab(openTab === 'details' ? '' : 'details')}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm text-ace-black py-1"
                >
                  <span>Features & Construction</span>
                  {openTab === 'details' ? <ChevronUp className="w-4 h-4 text-ace-pink" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openTab === 'details' && (
                  <div className="pt-3 pb-2 text-xs text-neutral-600 space-y-2 animate-fadeIn">
                    {product.details && product.details.length > 0 ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.details.map((detail, idx) => (
                          <li key={idx} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Hand-crafted with luxury fibers, reinforced knots, and ultra-comfortable stretch foundation.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tab 2: Hair Care & Longevity */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenTab(openTab === 'care' ? '' : 'care')}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm text-ace-black py-1"
                >
                  <span>Maintenance & Hair Care Guide</span>
                  {openTab === 'care' ? <ChevronUp className="w-4 h-4 text-ace-pink" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openTab === 'care' && (
                  <div className="pt-3 pb-2 text-xs text-neutral-600 space-y-2 animate-fadeIn">
                    {product.hairCareTips && product.hairCareTips.length > 0 ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.hairCareTips.map((tip, idx) => (
                          <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Use a lightweight curl mousse to refresh bohemian curls. Sleep with a satin bonnet for maximum longevity.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tab 3: Shipping & Returns */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenTab(openTab === 'shipping' ? '' : 'shipping')}
                  className="w-full flex items-center justify-between text-left font-heading font-bold text-sm text-ace-black py-1"
                >
                  <span>UK & Germany Shipping Policy</span>
                  {openTab === 'shipping' ? <ChevronUp className="w-4 h-4 text-ace-pink" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openTab === 'shipping' && (
                  <div className="pt-3 pb-2 text-xs text-neutral-600 space-y-2 animate-fadeIn">
                    <p>All items are carefully inspected and dispatched directly from our UK fulfillment center.</p>
                    <p>Standard UK tracked shipping is £5.99 (Free on orders over £80). Germany tracked shipping is €8.99.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-ace-border">
            <h3 className="font-heading font-extrabold text-2xl text-ace-black mb-8 text-center">
              You May Also Love
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
