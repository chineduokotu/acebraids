import axiosClient from './axiosClient';

export const fetchCustomerLooks = async () => {
  const response = await axiosClient.get('/customer-looks');
  return response.data;
};

export const fetchAdminCustomerLooks = async () => {
  const response = await axiosClient.get('/customer-looks/admin');
  return response.data;
};

export const createCustomerLook = async (data) => {
  const response = await axiosClient.post('/customer-looks', data);
  return response.data;
};

export const updateCustomerLook = async (id, data) => {
  const response = await axiosClient.put(`/customer-looks/${id}`, data);
  return response.data;
};

export const deleteCustomerLook = async (id) => {
  const response = await axiosClient.delete(`/customer-looks/${id}`);
  return response.data;
};
