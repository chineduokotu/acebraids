import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { fetchAdminNotifications, markAdminNotificationRead, subscribeAdminNotifications } from '../api/adminNotifications';
import { mergeNotifications } from '../utils/paymentDisplay';

const AdminNotificationsContext = createContext();

export const AdminNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [connection, setConnection] = useState('connecting');
  const [error, setError] = useState('');
  const [paymentRevision, setPaymentRevision] = useState(0);
  const knownIds = useRef(null);
  const subscription = useRef(null);
  const active = useRef(false);
  const readInProgress = useRef(new Set());

  useEffect(() => {
    active.current = true;
    subscription.current = subscribeAdminNotifications({
      onSnapshot: (data) => {
        const incoming = data.notifications || [];
        if (!knownIds.current || incoming.some((item) => !knownIds.current.has(item.id))) {
          setPaymentRevision((value) => value + 1);
        }
        knownIds.current ??= new Set();
        incoming.forEach((item) => knownIds.current.add(item.id));
        setNotifications((current) => mergeNotifications(current, incoming));
        setUnreadCount(data.unreadCount || 0);
        // Restart pagination from the newest page after live catch-up so a large
        // offline backlog cannot leave a gap between newly arrived/loaded rows.
        setNextCursor(data.nextCursor || null);
        setLoading(false);
      },
      onState: setConnection,
      onError: (message) => { setError(message); setLoading(false); },
    });
    return () => { active.current = false; subscription.current?.close(); };
  }, []);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchAdminNotifications(nextCursor);
      if (!active.current) return;
      data.notifications.forEach((item) => knownIds.current?.add(item.id));
      setNotifications((current) => mergeNotifications(current, data.notifications));
      setNextCursor(data.nextCursor || null);
      setUnreadCount(data.unreadCount || 0);
      setError('');
    } catch (err) {
      if (active.current) setError(err.message || 'Unable to load older notifications.');
    } finally {
      if (active.current) setLoadingMore(false);
    }
  };

  const markRead = async (id) => {
    if (readInProgress.current.has(id)) return;
    readInProgress.current.add(id);
    try {
      const notification = await markAdminNotificationRead(id);
      if (!active.current) return;
      setNotifications((current) => mergeNotifications(current, [notification]));
      setError('');
      subscription.current?.refresh();
    } catch (err) {
      if (active.current) setError(err.message || 'Unable to mark this notification as read. Please try again.');
    } finally {
      readInProgress.current.delete(id);
    }
  };

  const refresh = useCallback(() => subscription.current?.refresh(), []);
  return (
    <AdminNotificationsContext.Provider value={{ notifications, unreadCount, loading, loadingMore, hasMore: Boolean(nextCursor), connection, error, paymentRevision, loadMore, markRead, refresh }}>
      {children}
    </AdminNotificationsContext.Provider>
  );
};

export const useAdminNotifications = () => useContext(AdminNotificationsContext);
