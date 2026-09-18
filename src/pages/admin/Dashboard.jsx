import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, DollarSign, Film, ArrowUpRight, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { fetchAdminOrders, fetchPendingTransfers } from '../../api/orders';
import { fetchProducts } from '../../api/products';
import { fetchAdminCustomerLooks } from '../../api/customerLooks';
import { useAdminNotifications } from '../../context/AdminNotificationsContext';
import { formatPaymentAmount } from '../../utils/paymentDisplay';
import { Loader } from '../../components/common/Loader';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueByCurrency: {},
    totalOrders: 0,
    totalProducts: 0,
    totalLooks: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { paymentRevision } = useAdminNotifications();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersData, prodData, looksData, pendingData] = await Promise.all([
          fetchAdminOrders({ limit: 5 }),
          fetchProducts({ limit: 1 }),
          fetchAdminCustomerLooks(),
          fetchPendingTransfers(),
        ]);

        setRecentOrders(ordersData.orders || []);
        setPendingTransfers(Array.isArray(pendingData) ? pendingData : []);
        setStats({
          totalRevenue: ordersData.totalRevenue || 0,
          revenueByCurrency: ordersData.revenueByCurrency || { GBP: ordersData.totalRevenue || 0 },
          totalOrders: ordersData.total || 0,
          totalProducts: prodData.total || 0,
          totalLooks: looksData?.length || 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [paymentRevision]);

  if (loading) {
    return <div className="py-20"><Loader text="Loading admin analytics..." /></div>;
  }

  const statCards = [
    { title: 'Verified Revenue', value: Object.entries(stats.revenueByCurrency).map(([currency, total]) => formatPaymentAmount(total, currency)).join(' / ') || formatPaymentAmount(0), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-950/40' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-ace-pink', bg: 'bg-pink-950/40' },
    { title: 'Live Products', value: stats.totalProducts, icon: Package, color: 'text-sky-400', bg: 'bg-sky-950/40' },
    { title: 'Customer Looks', value: stats.totalLooks, icon: Film, color: 'text-amber-400', bg: 'bg-amber-950/40' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Performance Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time orders, catalog count and bank transfer activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-ace-pink hover:bg-ace-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-pink-glow"
          >
            + Add New Hair
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {pendingTransfers.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-white">Pending Bank Transfers</h2>
              <p className="text-xs text-amber-300/80 mt-1">Payments waiting for admin verification.</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-amber-200 hover:text-white">
              Review
            </Link>
          </div>

          <div className="md:hidden space-y-3">
            {pendingTransfers.slice(0, 4).map((ord) => (
              <div key={ord._id} className="bg-neutral-950/70 border border-amber-900/50 rounded-2xl p-4 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-ace-pink truncate">{ord.paymentRef}</p>
                    <p className="font-semibold text-white mt-1">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{ord.guestInfo?.email}</p>
                  </div>
                  <strong className="text-white flex-shrink-0">{formatPaymentAmount(ord.total, ord.currency)}</strong>
                </div>
                <p className="text-neutral-500 mt-2">
                  Submitted: {ord.paymentSubmittedAt ? new Date(ord.paymentSubmittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="text-amber-200/70 uppercase tracking-wider border-b border-amber-900/70">
                <tr>
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/40 text-neutral-300">
                {pendingTransfers.slice(0, 4).map((ord) => (
                  <tr key={ord._id}>
                    <td className="py-3.5 font-mono font-bold text-ace-pink">{ord.paymentRef}</td>
                    <td className="py-3.5">
                      <p className="font-semibold text-white">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                      <p className="text-[11px] text-neutral-500">{ord.guestInfo?.email}</p>
                    </td>
                    <td className="py-3.5 font-bold text-white">{formatPaymentAmount(ord.total, ord.currency)}</td>
                    <td className="py-3.5 text-neutral-500">
                      {ord.paymentSubmittedAt ? new Date(ord.paymentSubmittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-lg text-white">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-ace-pink hover:underline inline-flex items-center gap-1"
          >
            <span>View all orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">No orders recorded yet. Process a checkout to see it appear here!</p>
        ) : (
          <>
          <div className="md:hidden space-y-3">
            {recentOrders.map((ord) => (
              <div key={ord._id} className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-ace-pink truncate">{ord.trackingCode}</p>
                    <p className="font-semibold text-white mt-1">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{ord.guestInfo?.email}</p>
                  </div>
                  <strong className="text-white flex-shrink-0">{formatPaymentAmount(ord.total, ord.currency)}</strong>
                </div>
                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    ord.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    ord.orderStatus === 'shipped' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ord.orderStatus}
                  </span>
                  <span className="text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="pb-3 font-semibold">Tracking Code</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-neutral-800/40 transition">
                    <td className="py-3.5 font-mono font-bold text-ace-pink">{ord.trackingCode}</td>
                    <td className="py-3.5">
                      <p className="font-semibold text-white">{ord.guestInfo?.firstName} {ord.guestInfo?.lastName}</p>
                      <p className="text-[11px] text-neutral-500">{ord.guestInfo?.email}</p>
                    </td>
                    <td className="py-3.5">{ord.items?.length} style(s)</td>
                    <td className="py-3.5 font-bold text-white">{formatPaymentAmount(ord.total, ord.currency)}</td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        ord.orderStatus === 'shipped' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
};
