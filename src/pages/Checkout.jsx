import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, AlertCircle, CheckCircle2, Truck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { processMockCheckout } from '../api/payments';
import { formatCardNumber, formatExpiryDate, validateEmail } from '../utils/validators';
import { Button } from '../components/common/Button';

// MOCK PAYMENT — replace with real Stripe/PayPal integration later
export const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { currency, format } = useCurrency();
  const navigate = useNavigate();

  // Contact & Shipping Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'United Kingdom',
    notes: '',
  });

  // Mock Card Form State (Captured locally only for mock gateway verification)
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h2 className="font-heading font-extrabold text-2xl text-ace-black mb-2">No Items in Bag</h2>
        <p className="text-sm text-neutral-500 mb-6">Please add items to your shopping bag before proceeding.</p>
        <Link to="/shop">
          <Button variant="primary">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  // Shipping calculation
  const shippingFee = formData.country === 'Germany' 
    ? 8.99 
    : (subtotal >= 80 ? 0 : 5.99);

  const finalTotal = Number((subtotal + shippingFee).toFixed(2));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/[^\d]/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = 'Valid email is required';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postcode is required';

    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 15) {
      errors.cardNumber = 'Valid 16-digit card number is required';
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
      errors.expiryDate = 'Valid MM/YY expiry is required';
    }
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      errors.cvc = 'CVC required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      setErrorMsg('Please complete all highlighted required fields.');
      return;
    }

    setProcessing(true);

    try {
      // MOCK PAYMENT PAYLOAD
      const orderDraft = {
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          shippingAddress: {
            street: formData.street,
            apartment: formData.apartment,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          }
        },
        items: cart.map(item => ({
          product: item.product,
          name: item.name,
          slug: item.slug,
          image: item.image,
          variant: item.variant,
          qty: item.qty,
          price: item.price,
        })),
        shippingFee,
        currency,
        notes: formData.notes,
      };

      // Call mock checkout endpoint
      const response = await processMockCheckout({
        orderDraft,
        cardDetails,
      });

      if (response.success && response.order) {
        // Trigger celebratory confetti animation
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (_) {}

        clearCart();
        navigate(`/order-confirmation/${response.order._id}`);
      } else {
        setErrorMsg(response.message || 'Payment simulation failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment declined by mock processor. Try another test card.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FBF9FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Back Link */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-ace-pink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Checkout & Mock Stripe Card Form */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Customer Contact */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-soft">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-ace-border/60">
                  <h2 className="font-heading font-extrabold text-base sm:text-lg text-ace-black">
                    1. Contact Information
                  </h2>
                  <span className="text-xs text-neutral-400">Guest Checkout</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. yourname@gmail.com"
                      className={`w-full bg-ace-alt border ${fieldErrors.email ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white`}
                    />
                    {fieldErrors.email && <p className="text-[11px] text-ace-error mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className={`w-full bg-ace-alt border ${fieldErrors.firstName ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`w-full bg-ace-alt border ${fieldErrors.lastName ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Phone Number (Optional - for courier SMS alerts)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+44 7700 900123"
                      className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-soft">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-ace-border/60">
                  <h2 className="font-heading font-extrabold text-base sm:text-lg text-ace-black">
                    2. Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Country / Region *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-ace-black focus:outline-none focus:border-ace-pink focus:bg-white cursor-pointer"
                    >
                      <option value="United Kingdom">United Kingdom (Free over £80 / £5.99)</option>
                      <option value="Germany">Germany (Express Tracked / €8.99)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="House number and street name"
                      className={`w-full bg-ace-alt border ${fieldErrors.street ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Apartment, suite, unit (optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apartment 4B"
                      className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Town / City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="London / Berlin"
                      className={`w-full bg-ace-alt border ${fieldErrors.city ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="SW1A 1AA"
                      className={`w-full bg-ace-alt border ${fieldErrors.postalCode ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white`}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Realistic Stripe-Style Mock Payment Card UI */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-soft">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-ace-border/60">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-ace-pink" />
                    <h2 className="font-heading font-extrabold text-base sm:text-lg text-ace-black">
                      3. Payment Method
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    <Lock className="w-3 h-3" />
                    <span>256-bit Encrypted</span>
                  </div>
                </div>

                {/* Notice pill explaining the isolated mock sandbox */}
                <div className="mb-5 p-3 rounded-2xl bg-pink-50/70 border border-pink-100 text-xs text-ace-dark flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-ace-pink flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Simulated Mock Payment Active</p>
                    <p className="text-[11px] text-neutral-600">
                      Use any test numbers (e.g. <code>4242 ···· 4242</code>, expiry <code>12/28</code>, CVC <code>123</code>). 
                      Ending with <code>0000</code> or <code>9999</code> will test failure scenarios.
                    </p>
                  </div>
                </div>

                {/* Stripe-like Card Input Container */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Name on Card</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={cardDetails.cardholderName}
                      onChange={handleCardChange}
                      placeholder="Jane Doe"
                      className="w-full bg-white border border-ace-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-ace-black focus:outline-none focus:border-ace-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        maxLength="19"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        placeholder="4242 4242 4242 4242"
                        className={`w-full bg-white border ${fieldErrors.cardNumber ? 'border-ace-error' : 'border-ace-border'} rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold tracking-wider text-ace-black focus:outline-none focus:border-ace-pink`}
                      />
                      <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    </div>
                    {fieldErrors.cardNumber && <p className="text-[11px] text-ace-error mt-1">{fieldErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Expiration Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        maxLength="5"
                        value={cardDetails.expiryDate}
                        onChange={handleCardChange}
                        placeholder="MM / YY"
                        className={`w-full bg-white border ${fieldErrors.expiryDate ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-center text-ace-black focus:outline-none focus:border-ace-pink`}
                      />
                      {fieldErrors.expiryDate && <p className="text-[11px] text-ace-error mt-1">{fieldErrors.expiryDate}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Security Code (CVC)</label>
                      <input
                        type="password"
                        name="cvc"
                        maxLength="4"
                        value={cardDetails.cvc}
                        onChange={handleCardChange}
                        placeholder="CVC"
                        className={`w-full bg-white border ${fieldErrors.cvc ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-center text-ace-black focus:outline-none focus:border-ace-pink`}
                      />
                      {fieldErrors.cvc && <p className="text-[11px] text-ace-error mt-1">{fieldErrors.cvc}</p>}
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Pay Now Button */}
                <div className="mt-8">
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    loading={processing}
                    className="w-full text-sm font-extrabold uppercase tracking-wider py-4 shadow-pink-glow"
                  >
                    <span>Pay {format(finalTotal)} Now</span>
                  </Button>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-soft sticky top-28 space-y-6">
              <h3 className="font-heading font-extrabold text-base text-ace-black">
                Order Review ({cart.length} items)
              </h3>

              {/* Items Mini List */}
              <div className="divide-y divide-ace-border/60 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.variantKey} className="flex items-center gap-3 py-3">
                    <div className="relative w-14 h-16 rounded-xl bg-ace-alt overflow-hidden border border-ace-border/60 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-ace-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-ace-black truncate font-heading">{item.name}</h4>
                      <p className="text-[11px] text-neutral-500 truncate">{item.variant?.label || item.variant?.color}</p>
                    </div>
                    <span className="text-xs font-bold text-ace-black">
                      {format(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-ace-border/60 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-ace-black">{format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({formData.country})</span>
                  <span className="font-bold text-ace-black">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : format(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Estimated Tax</span>
                  <span>Included</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-baseline pt-4 border-t border-ace-border">
                <span className="font-heading font-extrabold text-base text-ace-black">Total to Pay</span>
                <span className="font-heading font-black text-2xl text-ace-pink">
                  {format(finalTotal)}
                </span>
              </div>

              {/* Guarantee badges */}
              <div className="pt-2 flex flex-col gap-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dispatched via Tracked Priority Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Order Confirmation & Tracking Code</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
