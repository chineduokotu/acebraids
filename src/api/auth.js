import axiosClient from './axiosClient';

export const loginUser = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials, { skipAuthExpiration: true });
  if (response.data?.token) {
    try { sessionStorage.setItem('ace_auth_token', response.data.token); } catch {}
  }
  return response.data;
};

export const adminLoginUser = async (credentials) => {
  const response = await axiosClient.post('/auth/admin/login', credentials, { skipAuthExpiration: true });
  if (response.data?.token) {
    try { sessionStorage.setItem('ace_auth_token', response.data.token); } catch {}
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosClient.post('/auth/register', userData, { skipAuthExpiration: true });
  if (response.data?.token) {
    try { sessionStorage.setItem('ace_auth_token', response.data.token); } catch {}
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};

export const changeAdminPassword = async (passwords) => {
  const response = await axiosClient.post('/auth/admin/change-password', passwords);
  return response.data;
};

export const logoutUser = async () => {
  try { sessionStorage.removeItem('ace_auth_token'); } catch {}
  const response = await axiosClient.post('/auth/logout');
  return response.data;
};

export const toggleWishlistItem = async (productId) => {
  const response = await axiosClient.post(`/auth/wishlist/${productId}`);
  return response.data;
};
