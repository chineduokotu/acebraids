import axiosClient, { AUTH_EXPIRED_EVENT } from './axiosClient';

export const fetchAdminNotifications = async (cursor) => {
  const response = await axiosClient.get('/admin/notifications', { params: { limit: 20, cursor } });
  return response.data;
};

export const markAdminNotificationRead = async (id) => {
  const response = await axiosClient.patch(`/admin/notifications/${encodeURIComponent(id)}/read`);
  return response.data.notification;
};

// Native EventSource reconnects automatically; REST also catches up after an
// outage and supports browsers/proxies that cannot keep a stream open.
export const subscribeAdminNotifications = ({
  onSnapshot, onState, onError,
  fetchSnapshot = fetchAdminNotifications,
  EventSourceImpl = globalThis.EventSource,
  onAuthExpired = () => window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT)),
}) => {
  let stopped = false;
  let live = false;
  let requestRunning = false;
  let snapshotVersion = 0;
  let stream;
  let poller;

  const close = () => {
    stopped = true;
    stream?.close();
    clearInterval(poller);
  };
  const expire = () => {
    close();
    onAuthExpired();
  };
  const refresh = async () => {
    if (stopped || requestRunning) return;
    requestRunning = true;
    const version = snapshotVersion;
    try {
      const data = await fetchSnapshot();
      if (!stopped && version === snapshotVersion) {
        onSnapshot(data);
        onError('');
      }
    } catch (error) {
      if (!stopped) {
        if ([401, 403].includes(error.status)) expire();
        else onError(error.message || 'Unable to load notifications. Retrying automatically.');
      }
    } finally {
      requestRunning = false;
    }
  };

  onState(EventSourceImpl ? 'connecting' : 'polling');
  refresh();
  if (EventSourceImpl) {
    stream = new EventSourceImpl(`${axiosClient.defaults.baseURL}/admin/notifications/stream`, { withCredentials: true });
    stream.addEventListener('open', () => {
      if (stopped) return;
      live = true;
      onState('live');
      refresh();
    });
    stream.addEventListener('notifications', (event) => {
      if (stopped) return;
      try {
        const snapshot = JSON.parse(event.data);
        if (!Array.isArray(snapshot.notifications)) throw new Error('Invalid notification update');
        snapshotVersion += 1;
        onSnapshot(snapshot);
        onError('');
      } catch {
        onError('Unable to read a notification update. Retrieving saved notifications.');
        refresh();
      }
    });
    stream.addEventListener('auth-expired', expire);
    stream.addEventListener('error', () => {
      if (stopped) return;
      live = false;
      onState('reconnecting');
      refresh();
    });
  }
  poller = setInterval(() => { if (!live) refresh(); }, 15000);
  return { close, refresh };
};
