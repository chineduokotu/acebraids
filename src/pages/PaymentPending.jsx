import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';
import { fetchOrderPaymentStatus } from '../api/orders';
import { useCurrency } from '../context/CurrencyContext';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';

const formatRemaining = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const PaymentPending = () => {
  const { id } = useParams();
  const { format } = useCurrency();
  const [status, setStatus] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const deadlineMs = useMemo(() => {
    if (!status?.paymentVerificationDeadline) return 0;
    return new Date(status.paymentVerificationDeadline).getTime();
  }, [status?.paymentVerificationDeadline]);

  const fetchStatus = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError('');

    try {
      const data = await fetchOrderPaymentStatus(id);
      setStatus(data);
      if (data.paymentVerificationDeadline) {
        setRemainingMs(new Date(data.paymentVerificationDeadline).getTime() - Date.now());
      }
    } catch (err) {
      setError(err.message || 'Unable to load payment status.');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [id]);

  useEffect(() => {
    if (!deadlineMs || ['paid', 'rejected'].includes(status?.paymentStatus)) return undefined;

    const timer = setInterval(() => {
      setRemainingMs(deadlineMs - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineMs, status?.paymentStatus]);

  useEffect(() => {
    if (['paid', 'rejected'].includes(status?.paymentStatus)) return undefined;

    const poller = setInterval(() => {
      fetchStatus({ quiet: true });
    }, 7000);

    return () => clearInterval(poller);
  }, [id, status?.paymentStatus]);

  if (loading) {
    return <div className="py-24"><Loader text="Loading payment verification status..." /></div>;
  }

  if (error || !status) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-ace-error mx-auto mb-3" />
        <h1 className="font-heading font-extrabold text-2xl text-ace-black mb-2">Payment Status Unavailable</h1>
        <p className="text-sm text-neutral-500 mb-6">{error || 'We could not retrieve this order.'}</p>
        <Button variant="primary" onClick={() => fetchStatus()}>Try Again</Button>
      </div>
    );
  }

  const isPaid = status.paymentStatus === 'paid';
  const isRejected = status.paymentStatus === 'rejected';
  const isExpired = remainingMs <= 0 && status.paymentStatus === 'awaiting_verification';

  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ace-alt border border-ace-border/70 rounded-3xl p-6 sm:p-10 text-center shadow-soft">
          <div className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center border ${
            isPaid
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : isRejected
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-ace-pink border-ace-border'
          }`}>
            {isPaid ? <CheckCircle2 className="w-8 h-8" /> : isRejected ? <XCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
            Order {status.trackingCode}
          </p>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ace-black">
            {isPaid ? 'Payment Approved' : isRejected ? 'Payment Needs Attention' : 'Awaiting Payment Verification'}
          </h1>

          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {isPaid
              ? 'Your transfer has been verified and your order is now being prepared.'
              : isRejected
                ? (status.paymentRejectionReason || 'We could not verify this transfer. Please contact our team for help.')
                : isExpired
                  ? 'Verification is taking longer than expected. Our team is reviewing your payment and will update your order shortly.'
                  : 'Thanks for confirming your transfer. This page updates automatically as soon as our admin team approves your payment.'}
          </p>

          {!isPaid && !isRejected && (
            <div className="my-8">
              <div className={`font-mono font-black text-5xl sm:text-6xl ${isExpired ? 'text-neutral-400' : 'text-ace-pink'}`}>
                {formatRemaining(remainingMs)}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Expected verification window
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left bg-white rounded-2xl border border-ace-border/70 p-4 my-6">
            <div>
              <span className="block text-neutral-500 font-semibold mb-0.5">Payment Reference</span>
              <strong className="font-mono text-ace-black">{status.paymentRef}</strong>
            </div>
            <div>
              <span className="block text-neutral-500 font-semibold mb-0.5">Amount</span>
              <strong className="text-ace-black">{format(status.total)}</strong>
            </div>
            <div>
              <span className="block text-neutral-500 font-semibold mb-0.5">Payment Status</span>
              <strong className="text-ace-black capitalize">{status.paymentStatus.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span className="block text-neutral-500 font-semibold mb-0.5">Order Status</span>
              <strong className="text-ace-black capitalize">{status.orderStatus}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="md" className="flex-1 text-xs font-bold" onClick={() => fetchStatus()}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              <span>Refresh Status</span>
            </Button>
            <Link to={isPaid ? `/order-confirmation/${status._id}` : `/order-tracking?code=${status.trackingCode}`} className="flex-1">
              <Button variant="primary" size="md" className="w-full text-xs font-bold uppercase tracking-wider">
                {isPaid ? 'View Receipt' : 'View Order'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
