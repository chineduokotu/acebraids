import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { trackOrderByCode } from '../api/orders';
import { useCurrency } from '../context/CurrencyContext';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';

export const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  
  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { format } = useCurrency();

  const handleTrack = async (codeToSearch) => {
    const query = codeToSearch || trackingCode;
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await trackOrderByCode(query.trim());
      setOrder(data);
      setSearchParams({ code: query.trim() });
    } catch (err) {
      setError(err.message || 'No active parcel found with this tracking number or order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleTrack(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  // 4 Status steps mapping
  const steps = [
    { key: 'pending', label: 'Order Received', icon: Clock },
    { key: 'processing', label: 'Quality Crafting', icon: Package },
    { key: 'shipped', label: 'In Transit / Dispatched', icon: Truck },
    { key: 'delivered', label: 'Delivered to Door', icon: CheckCircle2 },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 1;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-ace-pink text-xs font-bold uppercase tracking-widest mb-1.5">
            <Truck className="w-4 h-4" />
            <span>Live Parcel Dispatch</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-ace-black">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Enter your Ace tracking number (e.g. <code>ABB-UK-XXXXX</code>) or Order ID to view real-time status.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="relative flex items-center shadow-soft rounded-full">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="e.g. ABB-UK-ABC123"
              className="w-full bg-ace-alt border border-ace-border rounded-full pl-12 pr-32 py-3.5 text-xs sm:text-sm font-mono font-bold tracking-wider focus:outline-none focus:border-ace-pink focus:bg-white transition"
              required
            />
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 pointer-events-none" />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              className="absolute right-1.5 text-xs font-bold uppercase tracking-wider px-5 py-2.5"
            >
              Track
            </Button>
          </form>
        </div>

        {/* Error notice */}
        {error && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mb-8 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading && <Loader text="Fetching tracking updates from carrier..." />}

        {/* Tracking Details View */}
        {order && (
          <div className="bg-ace-alt p-6 sm:p-10 rounded-3xl border border-ace-border/70 shadow-sm space-y-8 animate-fadeIn">
            {/* Top Order Metadata Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ace-border/70">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  Tracking Code
                </span>
                <h3 className="font-mono font-black text-xl text-ace-pink mt-0.5">
                  {order.trackingCode}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Carrier: <strong className="text-ace-black">{order.carrier || 'Royal Mail Tracked'}</strong>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 bg-ace-black text-white text-xs font-extrabold uppercase rounded-full tracking-wider">
                  Status: {order.orderStatus}
                </span>
                <p className="text-xs text-neutral-400 mt-1.5">
                  Placed: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* 4-Step Visual Progress Bar */}
            <div className="py-6">
              <div className="relative flex items-center justify-between">
                {/* Horizontal Progress Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 w-full z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-ace-pink transition-all duration-700 z-0"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                />

                {/* Step Icons */}
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-ace-pink text-white shadow-pink-glow ring-4 ring-white'
                            : 'bg-white text-neutral-400 border border-ace-border'
                        } ${isCurrent ? 'scale-110' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold mt-2.5 text-center max-w-[80px] sm:max-w-[100px] leading-tight ${
                        isCompleted ? 'text-ace-black' : 'text-neutral-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items inside this shipment */}
            <div className="pt-4 border-t border-ace-border/70">
              <h4 className="font-heading font-extrabold text-sm text-ace-black uppercase tracking-wider mb-4">
                Shipment Contents ({order.items?.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-ace-border/60">
                    <img src={item.image || '/uploads/IMG_4065.PNG'} alt={item.name} className="w-12 h-14 object-cover rounded-xl border border-ace-border/60" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ace-black truncate font-heading">{item.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{item.variant?.label || item.variant?.color}</p>
                      <p className="text-[11px] text-neutral-400 font-semibold">Qty: {item.qty} · {format(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Info */}
            <div className="pt-4 border-t border-ace-border/70 flex items-start gap-3 text-xs text-neutral-600">
              <MapPin className="w-4 h-4 text-ace-pink flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-ace-black">Delivering to:</p>
                <p>{order.guestInfo?.firstName} {order.guestInfo?.lastName} — {order.guestInfo?.shippingAddress?.street}, {order.guestInfo?.shippingAddress?.city}, {order.guestInfo?.shippingAddress?.postalCode}, {order.guestInfo?.shippingAddress?.country}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
