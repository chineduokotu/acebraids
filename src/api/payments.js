import axiosClient from './axiosClient';

export const fetchBankTransferDetails = async () => {
  const response = await axiosClient.get('/payments/bank-transfer/details');
  return response.data;
};

export const createBankTransferOrder = async ({ orderDraft, idempotencyKey }) => {
  const response = await axiosClient.post('/payments/bank-transfer/order', {
    orderDraft,
    ...(idempotencyKey ? { idempotencyKey } : {}),
  });
  return response.data;
};

export const createStripeCheckoutSession = async ({ orderDraft, idempotencyKey }) => {
  const response = await axiosClient.post('/payments/stripe/checkout-session', {
    orderDraft,
    ...(idempotencyKey ? { idempotencyKey } : {}),
  });
  return response.data;
};

export const confirmBankTransferPayment = async (orderId, customerPaymentNote = '') => {
  const response = await axiosClient.post(`/payments/bank-transfer/${orderId}/confirm`, {
    customerPaymentNote,
  });
  return response.data;
};
