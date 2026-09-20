import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, Lock, ArrowLeft, AlertCircle, CheckCircle2, Truck, Copy, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  createBankTransferOrder,
  confirmBankTransferPayment,
  createStripeCheckoutSession,
  fetchBankTransferDetails,
} from '../api/payments';
import { validateEmail } from '../utils/validators';
import { Button } from '../components/common/Button';
import { getCheckoutError } from '../utils/inventory';

export const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { currency, format } = useCurrency();
  const navigate = useNavigate();

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
    customerPaymentNote: '',
  });

  const [bankDetails, setBankDetails] = useState(null);
  const [verificationWindowMinutes, setVerificationWindowMinutes] = useState(30);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const loadBankDetails = async () => {
      try {
        const data = await fetchBankTransferDetails();
        setBankDetails(data.bankDetails);
        setVerificationWindowMinutes(data.verificationWindowMinutes || 30);
      } catch (err) {
        console.error('Failed to load bank transfer details:', err);
      }
    };

    loadBankDetails();
  }, []);

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

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = 'Valid email is required';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postcode is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildOrderDraft = () => ({
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
      },
    },
    items: cart.map(item => ({
      product: String(item.product),
      variantId: item.variantId || item.variant?._id ? String(item.variantId || item.variant?._id) : undefined,
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
    customerPaymentNote: formData.customerPaymentNote,
  });

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      setErrorMsg('Please complete all highlighted required fields.');
      return;
    }

    setProcessing(true);
    try {
      if (paymentMethod === 'stripe') {
        const response = await createStripeCheckoutSession({ orderDraft: buildOrderDraft() });
        setCreatedOrder(response.order);
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
          return;
        }
      } else {
        const response = await createBankTransferOrder({ orderDraft: buildOrderDraft() });
        setCreatedOrder(response.order);
        setBankDetails(response.bankDetails || bankDetails);
        setVerificationWindowMinutes(response.verificationWindowMinutes || verificationWindowMinutes);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(getCheckoutError(err, `Unable to create your ${paymentMethod === 'stripe' ? 'Stripe' : 'bank transfer'} order. Please try again.`));
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!createdOrder?._id) return;

    setConfirming(true);
    setErrorMsg('');
    try {
      const response = await confirmBankTransferPayment(createdOrder._id, formData.customerPaymentNote);
      clearCart();
      navigate(`/payment-pending/${response.order._id}`);
    } catch (err) {
      setErrorMsg(getCheckoutError(err, 'Unable to confirm your transfer right now.'));
    } finally {
      setConfirming(false);
    }
  };

  const copyValue = async (key, value) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  if (cart.length === 0 && !createdOrder) {
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

  return (
    <div className="py-10 sm:py-16 bg-[#FBF9FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-ace-pink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </Link>
        </div>

        {createdOrder && (
          <div className="mb-8 bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-soft">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h1 className="font-heading font-extrabold text-xl text-ace-black">Order created. Complete your transfer.</h1>
                <p className="text-sm text-neutral-600 mt-1">
                  Use reference <strong className="font-mono text-ace-pink">{createdOrder.paymentRef}</strong>. After sending the money, click the confirmation button below to start the {verificationWindowMinutes}-minute verification timer.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleCreateOrder} className="space-y-8">
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
                    <input type="email" name="email" required disabled={Boolean(createdOrder)} value={formData.email} onChange={handleInputChange} placeholder="e.g. yourname@gmail.com" className={`w-full bg-ace-alt border ${fieldErrors.email ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70`} />
                    {fieldErrors.email && <p className="text-[11px] text-ace-error mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">First Name *</label>
                    <input type="text" name="firstName" required disabled={Boolean(createdOrder)} value={formData.firstName} onChange={handleInputChange} placeholder="Jane" className={`w-full bg-ace-alt border ${fieldErrors.firstName ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70`} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Last Name *</label>
                    <input type="text" name="lastName" required disabled={Boolean(createdOrder)} value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className={`w-full bg-ace-alt border ${fieldErrors.lastName ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70`} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Phone Number</label>
                    <input type="tel" name="phone" disabled={Boolean(createdOrder)} value={formData.phone} onChange={handleInputChange} placeholder="+44 7700 900123" className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-soft">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-ace-border/60">
                  <h2 className="font-heading font-extrabold text-base sm:text-lg text-ace-black">
                    2. Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Country / Region *</label>
                    <select name="country" disabled={Boolean(createdOrder)} value={formData.country} onChange={handleInputChange} className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-ace-black focus:outline-none focus:border-ace-pink focus:bg-white cursor-pointer disabled:opacity-70">
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Street Address *</label>
                    <input type="text" name="street" required disabled={Boolean(createdOrder)} value={formData.street} onChange={handleInputChange} placeholder="House number and street name" className={`w-full bg-ace-alt border ${fieldErrors.street ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70`} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Apartment, suite, unit</label>
                    <input type="text" name="apartment" disabled={Boolean(createdOrder)} value={formData.apartment} onChange={handleInputChange} placeholder="Apartment 4B" className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Town / City *</label>
                    <input type="text" name="city" required disabled={Boolean(createdOrder)} value={formData.city} onChange={handleInputChange} placeholder="London / Berlin" className={`w-full bg-ace-alt border ${fieldErrors.city ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70`} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Postal Code *</label>
                    <input type="text" name="postalCode" required disabled={Boolean(createdOrder)} value={formData.postalCode} onChange={handleInputChange} placeholder="SW1A 1AA" className={`w-full bg-ace-alt border ${fieldErrors.postalCode ? 'border-ace-error' : 'border-ace-border'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white disabled:opacity-70`} />
                  </div>
                </div>
              </div>

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
                    <span>Secure Checkout</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`rounded-2xl border p-4 text-left transition ${paymentMethod === 'stripe' ? 'border-ace-pink bg-pink-50' : 'border-ace-border bg-ace-alt'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-ace-pink" />
                      <span className="font-bold text-ace-black text-sm">Stripe Card</span>
                    </div>
                    <p className="text-[11px] text-neutral-600">Pay by card using Stripe checkout.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`rounded-2xl border p-4 text-left transition ${paymentMethod === 'bank_transfer' ? 'border-ace-pink bg-pink-50' : 'border-ace-border bg-ace-alt'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Landmark className="w-4 h-4 text-ace-pink" />
                      <span className="font-bold text-ace-black text-sm">Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-neutral-600">Manual bank transfer and verification.</p>
                  </button>
                </div>

                {paymentMethod === 'bank_transfer' ? (
                  <>
                    <div className="space-y-3 text-xs">
                      {[
                        ['Bank Name', bankDetails?.bankName],
                        ['Account Name', bankDetails?.accountName],
                        ['Account Number', bankDetails?.accountNumber],
                        ['Sort Code', bankDetails?.sortCode],
                        ['IBAN', bankDetails?.iban],
                        ['BIC', bankDetails?.bic],
                        ['Payment Reference', createdOrder?.paymentRef || 'Generated after order is placed'],
                        ['Amount', format(createdOrder?.total || finalTotal)],
                      ].filter(([, value]) => value).map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-3 bg-ace-alt border border-ace-border/70 rounded-xl px-3.5 py-2.5">
                          <span className="text-neutral-500 font-semibold">{label}</span>
                          <button type="button" onClick={() => copyValue(label, String(value))} className="font-mono font-bold text-ace-black text-right inline-flex items-center gap-1.5">
                            <span>{value}</span>
                            {copied === label ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                          </button>
                        </div>
                      ))}
                    </div>

                    <label className="block text-xs font-semibold text-neutral-600 mt-5 mb-1">Transfer Note</label>
                    <textarea name="customerPaymentNote" rows="3" value={formData.customerPaymentNote} onChange={handleInputChange} placeholder="Optional: bank sender name, transfer reference, or note for our team" className="w-full bg-ace-alt border border-ace-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-ace-pink focus:bg-white" />
                  </>
                ) : (
                  <div className="rounded-2xl border border-ace-border bg-ace-alt p-4 text-xs text-neutral-600">
                    You’ll be redirected to Stripe’s secure checkout page to complete payment with your card.
                  </div>
                )}

                {errorMsg && (
                  <div role="alert" aria-live="assertive" className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="mt-8">
                  {!createdOrder ? (
                    <Button type="submit" variant="primary" size="xl" loading={processing} className="w-full text-sm font-extrabold uppercase tracking-wider py-4 shadow-pink-glow">
                      <span>{paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Place Bank Transfer Order'}</span>
                    </Button>
                  ) : (
                    <Button type="button" variant="primary" size="xl" loading={confirming} onClick={handleConfirmTransfer} className="w-full text-sm font-extrabold uppercase tracking-wider py-4 shadow-pink-glow">
                      <span>I Have Sent The Money</span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-soft sticky top-28 space-y-6">
              <h3 className="font-heading font-extrabold text-base text-ace-black">
                Order Review ({cart.length} items)
              </h3>

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

              <div className="flex justify-between items-baseline pt-4 border-t border-ace-border">
                <span className="font-heading font-extrabold text-base text-ace-black">Total to Transfer</span>
                <span className="font-heading font-black text-2xl text-ace-pink">
                  {format(finalTotal)}
                </span>
              </div>

              <div className="pt-2 flex flex-col gap-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verification window starts after you confirm transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fulfillment starts once payment is approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
