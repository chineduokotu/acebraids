import axiosClient from './axiosClient';

export const fetchProducts = async (params = {}) => {
  const response = await axiosClient.get('/products', { params });
  return response.data;
};

export const fetchProductBySlug = async (slug) => {
  const response = await axiosClient.get(`/products/${slug}`);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axiosClient.get(`/products/id/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosClient.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`/products/${id}`);
  return response.data;
};
