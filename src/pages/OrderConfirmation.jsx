import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Truck, ArrowRight, Printer, Sparkles, MapPin, CreditCard } from 'lucide-react';
import { fetchOrderById } from '../api/orders';
import { useCurrency } from '../context/CurrencyContext';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const { format } = useCurrency();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleCopyTracking = () => {
    if (order?.trackingCode) {
      navigator.clipboard.writeText(order.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="py-24"><Loader text="Retrieving your order confirmation..." /></div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h2 className="font-heading font-extrabold text-2xl text-ace-black mb-2">Order Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">Could not retrieve order details.</p>
        <Link to="/shop"><Button variant="primary">Return to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header with Great Vibes Script Accent */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <p className="font-script text-4xl sm:text-5xl text-ace-pink mb-1">
            Thank you for your order!
          </p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black mt-2">
            We're preparing your luxury crown
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            A confirmation receipt has been simulated and sent to <strong className="text-ace-black">{order.guestInfo?.email}</strong>.
          </p>
        </div>

        {/* Tracking Code Highlight Box */}
        <div className="bg-ace-black text-white p-6 rounded-3xl shadow-xl border border-neutral-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              Your Official Tracking Code
            </span>
            <p className="font-mono font-black text-2xl text-ace-pink tracking-wider mt-0.5">
              {order.trackingCode}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Carrier: {order.carrier || 'Royal Mail 24 Tracked'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTracking}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>

            <Link to={`/order-tracking?code=${order.trackingCode}`}>
              <Button variant="primary" size="sm" className="text-xs">
                <span>Live Tracker</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-ace-alt p-6 sm:p-8 rounded-3xl border border-ace-border/70 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ace-border/60 text-xs text-neutral-500">
            <div>
              <span>Order Ref: </span>
              <strong className="text-ace-black font-mono">{order._id}</strong>
            </div>
            <div>
              <span>Mock Payment: </span>
              <strong className="text-emerald-700 font-mono">{order.paymentRef}</strong>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="font-heading font-extrabold text-sm text-ace-black uppercase tracking-wider mb-4">
              Items Ordered ({order.items?.length})
            </h3>
            <div className="divide-y divide-ace-border/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-16 rounded-xl bg-white border border-ace-border/60 overflow-hidden flex-shrink-0">
                      <img src={item.image || '/uploads/IMG_4065.PNG'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-ace-black truncate">{item.name}</h4>
                      <p className="text-[11px] text-neutral-500 truncate">{item.variant?.label || item.variant?.color}</p>
                      <p className="text-[11px] text-neutral-400 font-medium">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-xs sm:text-sm text-ace-black whitespace-nowrap">
                    {format(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-ace-border/60 space-y-2 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-ace-black">{format(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-ace-black">
                {order.shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : format(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-ace-border/60">
              <span className="font-heading font-extrabold text-ace-black">Total Paid</span>
              <span className="font-heading font-black text-xl text-ace-pink">
                {format(order.total)}
              </span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="pt-4 border-t border-ace-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-ace-black mb-1">
                <MapPin className="w-3.5 h-3.5 text-ace-pink" />
                <span>Shipping Address</span>
              </div>
              <p className="text-neutral-600">
                {order.guestInfo?.firstName} {order.guestInfo?.lastName}<br />
                {order.guestInfo?.shippingAddress?.street}<br />
                {order.guestInfo?.shippingAddress?.city}, {order.guestInfo?.shippingAddress?.postalCode}<br />
                {order.guestInfo?.shippingAddress?.country}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-ace-black mb-1">
                <Truck className="w-3.5 h-3.5 text-ace-pink" />
                <span>Delivery Expectation</span>
              </div>
              <p className="text-neutral-600">
                Estimated Delivery: <strong className="text-ace-black">24–48 Hours (UK)</strong> / 2-4 Days (Germany)<br />
                Status: <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] mt-1">{order.orderStatus}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-ace-border/60 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="md"
              className="flex-1 text-xs font-bold"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Print Receipt</span>
            </Button>
            <Link to="/shop" className="flex-1">
              <Button variant="primary" size="md" className="w-full text-xs font-bold uppercase tracking-wider">
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
