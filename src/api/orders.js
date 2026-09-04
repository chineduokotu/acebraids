import axiosClient from './axiosClient';

export const fetchOrderById = async (id) => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
};

export const trackOrderByCode = async (code) => {
  const response = await axiosClient.get(`/orders/track/${encodeURIComponent(code)}`);
  return response.data;
};

export const fetchAdminOrders = async (params = {}) => {
  const response = await axiosClient.get('/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
  const response = await axiosClient.put(`/orders/${id}/status`, statusData);
  return response.data;
};

export const fetchOrderPaymentStatus = async (id) => {
  const response = await axiosClient.get(`/orders/${id}/payment-status`);
  return response.data;
};

export const fetchPendingTransfers = async () => {
  const response = await axiosClient.get('/orders/admin/pending-transfers');
  return response.data;
};

export const approveOrderPayment = async (id) => {
  const response = await axiosClient.put(`/orders/${id}/payment/approve`);
  return response.data;
};

export const rejectOrderPayment = async (id, reason) => {
  const response = await axiosClient.put(`/orders/${id}/payment/reject`, { reason });
  return response.data;
};
