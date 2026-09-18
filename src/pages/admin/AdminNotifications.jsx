import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAdminNotifications } from '../../context/AdminNotificationsContext';
import { formatPaymentAmount } from '../../utils/paymentDisplay';
import { Loader } from '../../components/common/Loader';

export const NotificationCard = ({ notification, onMarkRead }) => {
  const [saving, setSaving] = useState(false);
  const markRead = async () => {
    setSaving(true);
    try { await onMarkRead(notification.id); } finally { setSaving(false); }
  };
  return (
    <article className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${notification.read ? 'border-neutral-800 bg-neutral-900' : 'border-pink-900 bg-neutral-900'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold text-emerald-400"><CheckCircle2 className="w-4 h-4" aria-hidden="true" />Paid — confirmed by Stripe</p>
          <h2 className="font-mono font-bold text-lg text-white mt-2 break-all">{notification.orderReference}</h2>
          <p className="text-xs text-neutral-400 mt-1"><time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString()}</time></p>
        </div>
        <strong className="text-xl text-ace-pink">{formatPaymentAmount(notification.amount, notification.currency)}</strong>
      </div>
      <div className="text-sm">
        <p className="font-semibold text-white">{notification.customer?.name}</p>
        <p className="text-neutral-400 break-all">{notification.customer?.email}</p>
      </div>
      <ul className="space-y-2 border-y border-neutral-800 py-4 text-sm">
        {notification.items?.map((item, index) => (
          <li key={index} className="flex justify-between gap-4">
            <span><span className="font-bold text-white">{item.qty} × {item.name}</span><span className="block text-xs text-neutral-400">{[item.variant?.color, item.variant?.length, item.variant?.capSize].filter(Boolean).join(' / ')}</span></span>
            <span className="text-neutral-300 whitespace-nowrap">{formatPaymentAmount(item.price * item.qty, notification.currency)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={`/admin/orders?order=${encodeURIComponent(notification.orderId)}`} className="text-sm font-bold text-ace-pink hover:text-pink-300 underline underline-offset-4">View order</Link>
        {notification.read ? <span className="text-xs text-neutral-500 flex items-center gap-1"><Check className="w-4 h-4" aria-hidden="true" />Read</span> : (
          <button type="button" onClick={markRead} disabled={saving} className="px-3 py-2 rounded-xl bg-neutral-800 text-xs font-bold text-white hover:bg-neutral-700 disabled:opacity-50">{saving ? 'Saving…' : 'Mark as read'}</button>
        )}
      </div>
    </article>
  );
};

export const AdminNotifications = () => {
  const { notifications, unreadCount, loading, loadingMore, hasMore, connection, error, loadMore, markRead, refresh } = useAdminNotifications();
  const connectionText = { connecting: 'Connecting to live updates…', live: 'Live updates connected', reconnecting: 'Reconnecting — saved notifications checked every 15 seconds', polling: 'Checking saved notifications every 15 seconds' }[connection];
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">Payment notifications</h1>
          <p className="text-xs text-neutral-400 mt-2">Confirmed Stripe payments are saved here, including payments received while you are offline.</p>
        </div>
        <button type="button" onClick={refresh} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold"><RefreshCw className="w-4 h-4" aria-hidden="true" />Refresh</button>
      </div>
      <div className="flex flex-wrap gap-3 justify-between text-xs text-neutral-400" role="status"><span>{connectionText}</span><span>{unreadCount} unread</span></div>
      {error && <div role="alert" className="rounded-2xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-300">{error}</div>}
      <p className="text-xs text-neutral-400">Customer-reported bank transfers appear in <Link to="/admin/orders" className="text-ace-pink underline">Orders</Link> and require your verification.</p>
      {loading ? <Loader text="Loading saved notifications…" /> : notifications.length === 0 && !error ? (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-12 text-center"><Bell className="w-8 h-8 text-neutral-500 mx-auto mb-3" aria-hidden="true" /><p className="text-sm text-neutral-400">No confirmed Stripe payments yet.</p></div>
      ) : (
        <div className="space-y-4">{notifications.map((notification) => <NotificationCard key={notification.id} notification={notification} onMarkRead={markRead} />)}</div>
      )}
      {hasMore && <button type="button" onClick={loadMore} disabled={loadingMore} className="w-full rounded-xl border border-neutral-700 p-3 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">{loadingMore ? 'Loading older notifications…' : 'Load older notifications'}</button>}
    </div>
  );
};
