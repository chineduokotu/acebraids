import axiosClient from './axiosClient';

// MOCK PAYMENT — replace with real Stripe/PayPal integration later
export const processMockCheckout = async ({ orderDraft, cardDetails }) => {
  const response = await axiosClient.post('/payments/mock-checkout', {
    orderDraft,
    cardDetails,
  });
  return response.data;
};
