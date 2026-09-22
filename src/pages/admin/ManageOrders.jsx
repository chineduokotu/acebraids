import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Eye, Search, CheckCircle2, Clock, AlertCircle, X, XCircle, Trash2 } from 'lucide-react';
import { fetchAdminOrders, fetchOrderById, updateOrderStatus, approveOrderPayment, rejectOrderPayment, deleteOrder } from '../../api/orders';
import { useAdminNotifications } from '../../context/AdminNotificationsContext';
import { formatPaymentAmount, paymentStatusLabel, canVerifyBankTransfer } from '../../utils/paymentDisplay';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { paymentRevision } = useAdminNotifications();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedOrderId = orderId || searchParams.get('order');
  const requestVersion = useRef(0);

  const loadOrders = async ({ quiet = false } = {}) => {
    const version = ++requestVersion.current;
    if (!quiet) setLoading(true);
    try {
      const data = await fetchAdminOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
      });
      if (version !== requestVersion.current) return;
      setOrders(data.orders || []);
      setSelectedOrder((selected) => selected ? data.orders?.find((order) => order._id === selected._id) || selected : null);
    } catch (err) {
      if (version === requestVersion.current) setFeedback({ type: 'error', text: err.message || 'Failed to load orders. Please try again.' });
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (paymentRevision > 0) loadOrders({ quiet: true });
  }, [paymentRevision]);

  useEffect(() => {
    if (!requestedOrderId) return undefined;
    let active = true;
    fetchOrderById(requestedOrderId).then((order) => {
      if (active) setSelectedOrder(order);
    }).catch((err) => {
      if (active) setFeedback({ type: 'error', text: err.message || 'Unable to open this order.' });
    });
    return () => { active = false; };
  }, [requestedOrderId, paymentRevision]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusChange = async (orderId, newStatus, carrier, trackingCode) => {
    setStatusUpdating(true);
    setFeedback(null);
    try {
      const updated = await updateOrderStatus(orderId, {
        orderStatus: newStatus,
        carrier,
        trackingCode,
      });
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updated);
      }
      setFeedback({ type: 'success', text: `Order updated to "${newStatus}"` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update order' });
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleApprovePayment = async (orderId) => {
    setPaymentUpdating(true);
    setFeedback(null);
    try {
      const updated = await approveOrderPayment(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updated);
      }
      setFeedback({ type: 'success', text: 'Payment approved and order moved to processing' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to approve payment' });
    } finally {
      setPaymentUpdating(false);
    }
  };

  const handleRejectPayment = async (orderId) => {
    const reason = window.prompt('Reason for rejecting this payment:');
    if (reason === null) return;

    setPaymentUpdating(true);
    setFeedback(null);
    try {
      const updated = await rejectOrderPayment(orderId, reason.trim());
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updated);
      }
      setFeedback({ type: 'success', text: 'Payment rejected and customer notification queued' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to reject payment' });
    } finally {
      setPaymentUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
      case 'shipped':
        return 'bg-sky-950 text-sky-400 border border-sky-800';
      case 'processing':
        return 'bg-pink-950 text-ace-pink border border-pink-800';
      default:
        return 'bg-amber-950 text-amber-400 border border-amber-800';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'mock_paid':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
      case 'awaiting_verification':
        return 'bg-amber-950 text-amber-400 border border-amber-800';
      case 'rejected':
      case 'failed':
        return 'bg-rose-950 text-rose-400 border border-rose-800';
      default:
        return 'bg-neutral-800 text-neutral-300 border border-neutral-700';
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setDeleting(true);
    setFeedback(null);
    try {
      const res = await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
      setOrderToDelete(null);
      const restoredText = res.restoredCount > 0 ? ` (${res.restoredCount} inventory item(s) restored to stock)` : '';
      setFeedback({ type: 'success', text: `Order permanently deleted${restoredText}.` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to delete order.' });
    } finally {
      setDeleting(false);
    }
  };

  const pendingTransfers = orders.filter(canVerifyBankTransfer);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Manage Orders
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track customer shipments, view addresses, and update fulfillment statuses.
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border border-rose-800 text-rose-300'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking code, email, name..."
            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-ace-pink"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                statusFilter === st
                  ? 'bg-ace-pink text-white shadow-pink-glow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={() => setStatusFilter('awaiting_verification')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition ${
              statusFilter === 'awaiting_verification'
                ? 'bg-ace-pink text-white shadow-pink-glow'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Pending Transfers
          </button>
        </div>
      </div>

      {pendingTransfers.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white">Pending Bank Transfers</h2>
              <p className="text-xs text-amber-300/80">Customer-reported transfers are not yet verified. Check your bank before approving payment.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-100 text-xs font-bold">
              {pendingTransfers.length} awaiting review
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {pendingTransfers.map((ord) => (
              <div key={ord._id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <p className="font-mono font-bold text-ace-pink">{ord.paymentRef}</p>
                  <p className="font-bold text-white mt-1">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                  <p className="text-neutral-400">{ord.guestInfo?.email} / {formatPaymentAmount(ord.total, ord.currency)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={paymentUpdating}
                    onClick={() => handleApprovePayment(ord._id)}
                    className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    disabled={paymentUpdating}
                    onClick={() => handleRejectPayment(ord._id)}
                    className="px-3 py-2 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <Loader text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center text-xs text-neutral-500">
          No orders matching criteria.
        </div>
      ) : (
        <>
        <div className="md:hidden space-y-3">
          {orders.map((ord) => (
            <div key={ord._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono font-bold text-ace-pink text-sm truncate">{ord.trackingCode}</p>
                  <p className="font-bold text-white mt-1">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{ord.guestInfo?.email}</p>
                </div>
                <strong className="text-white text-sm flex-shrink-0">{formatPaymentAmount(ord.total, ord.currency)}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <span className="block text-neutral-500 text-[10px] uppercase font-bold">Payment</span>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getPaymentBadge(ord.paymentStatus)}`}>
                    {paymentStatusLabel(ord)}
                  </span>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <span className="block text-neutral-500 text-[10px] uppercase font-bold">Fulfillment</span>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(ord.orderStatus)}`}>
                    {ord.orderStatus}
                  </span>
                </div>
              </div>

              <div className="text-xs text-neutral-400">
                <p>{ord.guestInfo?.shippingAddress?.city}, {ord.guestInfo?.shippingAddress?.country}</p>
                <p>{ord.items?.length} style(s)</p>
              </div>

              {canVerifyBankTransfer(ord) ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={paymentUpdating}
                    onClick={() => handleApprovePayment(ord._id)}
                    className="col-span-1 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paid
                  </button>
                  <button
                    disabled={paymentUpdating}
                    onClick={() => handleRejectPayment(ord._id)}
                    className="col-span-1 px-3 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="col-span-1 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="flex-1 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Order</span>
                  </button>
                  <button
                    onClick={() => setOrderToDelete(ord)}
                    title="Delete Order"
                    className="p-2.5 bg-neutral-800 hover:bg-rose-950/80 text-neutral-400 hover:text-rose-400 rounded-xl text-xs transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-xs">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Tracking Code</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Destination</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total</th>
                  <th className="py-3.5 px-4 font-semibold">Payment</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-neutral-800/40 transition">
                    <td className="py-4 px-6 font-mono font-bold text-ace-pink">
                      {ord.trackingCode}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-white">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                      <p className="text-[11px] text-neutral-500">{ord.guestInfo?.email}</p>
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      {ord.guestInfo?.shippingAddress?.city}, {ord.guestInfo?.shippingAddress?.country}
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {ord.items?.length} style(s)
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {formatPaymentAmount(ord.total, ord.currency)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getPaymentBadge(ord.paymentStatus)}`}>
                        {paymentStatusLabel(ord)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => setOrderToDelete(ord)}
                          title="Delete Order"
                          className="p-1.5 bg-neutral-800 hover:bg-rose-950/80 text-neutral-400 hover:text-rose-400 rounded-xl text-xs transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      {/* Order Inspect & Manage Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 rounded-2xl sm:rounded-3xl border border-neutral-800 shadow-2xl p-4 sm:p-8 max-h-[94vh] sm:max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order Management</span>
                <h3 className="font-mono font-black text-lg sm:text-xl text-ace-pink break-all">
                  {selectedOrder.trackingCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            {canVerifyBankTransfer(selectedOrder) && (
              <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-800 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Bank Transfer Verification
                  </label>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Reference {selectedOrder.paymentRef} / {formatPaymentAmount(selectedOrder.total, selectedOrder.currency)}
                  </p>
                </div>
                {selectedOrder.customerPaymentNote && (
                  <p className="text-xs text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                    {selectedOrder.customerPaymentNote}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                  <button
                    disabled={paymentUpdating}
                    onClick={() => handleApprovePayment(selectedOrder._id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve as Paid
                  </button>
                  <button
                    disabled={paymentUpdating}
                    onClick={() => handleRejectPayment(selectedOrder._id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            )}

            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Update Fulfillment Status
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange(selectedOrder._id, st, selectedOrder.carrier, selectedOrder.trackingCode)}
                    className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                      selectedOrder.orderStatus === st
                        ? 'bg-ace-pink text-white shadow-pink-glow'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-1">
                <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">Customer Details</p>
                <p><span className="text-neutral-500">Name:</span> {selectedOrder.guestInfo?.firstName} {selectedOrder.guestInfo?.lastName}</p>
                <p><span className="text-neutral-500">Email:</span> {selectedOrder.guestInfo?.email}</p>
                <p><span className="text-neutral-500">Phone:</span> {selectedOrder.guestInfo?.phone || 'N/A'}</p>
                <p><span className="text-neutral-500">Payment Ref:</span> <span className="font-mono text-emerald-400">{selectedOrder.paymentRef}</span></p>
                <p><span className="text-neutral-500">Payment:</span> <span className="font-bold capitalize">{paymentStatusLabel(selectedOrder)}</span></p>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-1">
                <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">Delivery Address</p>
                <p>{selectedOrder.guestInfo?.shippingAddress?.street}</p>
                <p>{selectedOrder.guestInfo?.shippingAddress?.city}, {selectedOrder.guestInfo?.shippingAddress?.postalCode}</p>
                <p className="font-bold text-white">{selectedOrder.guestInfo?.shippingAddress?.country}</p>
                <p className="text-neutral-500 pt-1">Carrier: {selectedOrder.carrier}</p>
              </div>
            </div>

            {/* Ordered Items */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Order Items ({selectedOrder.items?.length})</h4>
              <div className="divide-y divide-neutral-800 bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image || '/uploads/IMG_4065.PNG'} alt={item.name} className="w-10 h-12 rounded-lg object-cover border border-neutral-700" />
                      <div className="min-w-0">
                        <p className="font-bold text-white font-heading">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">{item.variant?.label || item.variant?.color}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.qty} × {formatPaymentAmount(item.price, selectedOrder.currency)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">{formatPaymentAmount(item.price * item.qty, selectedOrder.currency)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Action Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setOrderToDelete(selectedOrder)}
                className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition hover:border-rose-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Order</span>
              </button>

              <div className="flex items-baseline justify-between sm:justify-end gap-3 text-sm">
                <span className="font-bold text-neutral-400">Order Total:</span>
                <span className="font-black text-xl text-ace-pink font-heading">{formatPaymentAmount(selectedOrder.total, selectedOrder.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting an Order */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">Permanently Delete Order?</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Are you sure you want to delete order <span className="font-mono font-bold text-ace-pink">{orderToDelete.trackingCode || orderToDelete.paymentRef}</span>?
              </p>
              <div className="text-xs text-neutral-400 mt-3 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1">
                <p className="font-semibold text-neutral-300">Customer: {orderToDelete.guestInfo?.firstName} {orderToDelete.guestInfo?.lastName}</p>
                <p className="text-neutral-500">Amount: {formatPaymentAmount(orderToDelete.total, orderToDelete.currency)}</p>
                <p className="text-amber-400/90 text-[11px] pt-1">
                  ⚠️ Any stock deducted for this order will automatically be returned to physical inventory. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteOrder(orderToDelete._id)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-rose-950"
              >
                {deleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
