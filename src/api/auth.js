import axiosClient from './axiosClient';

export const loginUser = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

export const adminLoginUser = async (credentials) => {
  const response = await axiosClient.post('/auth/admin/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosClient.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosClient.post('/auth/logout');
  return response.data;
};

export const toggleWishlistItem = async (productId) => {
  const response = await axiosClient.post(`/auth/wishlist/${productId}`);
  return response.data;
};
