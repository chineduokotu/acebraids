import axiosClient from './axiosClient';

export const fetchCategories = async () => {
  const response = await axiosClient.get('/categories');
  return response.data;
};

export const fetchCategoryBySlug = async (slug) => {
  const response = await axiosClient.get(`/categories/${slug}`);
  return response.data;
};

export const createCategory = async (catData) => {
  const response = await axiosClient.post('/categories', catData);
  return response.data;
};

export const updateCategory = async (id, catData) => {
  const response = await axiosClient.put(`/categories/${id}`, catData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosClient.delete(`/categories/${id}`);
  return response.data;
};
