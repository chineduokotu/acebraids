// Stored order amounts are already in the order's currency. Never run them
// through the storefront's display-currency conversion a second time.
export const formatPaymentAmount = (amount, currency = 'GBP') => {
  const code = String(currency || 'GBP').toUpperCase();
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: code, currencyDisplay: 'code' }).format(Number(amount) || 0);
};

export const paymentStatusLabel = (order) => {
  if (order.paymentMethod === 'stripe') {
    if (order.paymentStatus === 'paid') return 'Paid — confirmed by Stripe';
    if (order.paymentStatus === 'failed') return 'Stripe payment failed';
    return 'Stripe payment pending confirmation';
  }
  if (order.paymentStatus === 'awaiting_verification') return 'Customer reported transfer — not yet verified';
  if (order.paymentStatus === 'paid') return 'Bank transfer verified by admin';
  if (order.paymentStatus === 'mock_paid') return 'Legacy simulated payment';
  return (order.paymentStatus || 'pending').replace(/_/g, ' ');
};

export const canVerifyBankTransfer = (order) => order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'awaiting_verification';

export const mergeNotifications = (current, incoming) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => byId.set(item.id, item));
  return [...byId.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id.localeCompare(a.id));
};
