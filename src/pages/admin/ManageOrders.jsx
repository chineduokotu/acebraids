import React, { useEffect, useState } from 'react';
import { Eye, Search, Truck, CheckCircle2, Clock, AlertCircle, X, ExternalLink } from 'lucide-react';
import { fetchAdminOrders, updateOrderStatus } from '../../api/orders';
import { useCurrency } from '../../context/CurrencyContext';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { format } = useCurrency();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
      });
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

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
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center text-xs text-neutral-500">
          No orders matching criteria.
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Tracking Code</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Destination</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Paid</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
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
                      {format(ord.total)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Inspect & Manage Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Order Management</span>
                <h3 className="font-mono font-black text-xl text-ace-pink">
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
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Update Fulfillment Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange(selectedOrder._id, st, selectedOrder.carrier, selectedOrder.trackingCode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
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
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image || '/uploads/IMG_4065.PNG'} alt={item.name} className="w-10 h-12 rounded-lg object-cover border border-neutral-700" />
                      <div>
                        <p className="font-bold text-white font-heading">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">{item.variant?.label || item.variant?.color}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.qty} × {format(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">{format(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Paid */}
            <div className="flex justify-between items-baseline pt-2 text-sm border-t border-neutral-800">
              <span className="font-bold text-neutral-400">Total Collected</span>
              <span className="font-black text-xl text-ace-pink font-heading">{format(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
