import api from './api';

export const materialService = {
  getAll: (params) => api.get('/materials/', { params }),
  getById: (id) => api.get(`/materials/${id}/`),
  create: (data) => api.post('/materials/', data),
  update: (id, data) => api.put(`/materials/${id}/`, data),
  addStock: (id, quantity) => api.patch(`/materials/${id}/add_stock/`, { quantity }),
  getLowStock: () => api.get('/materials/low-stock/'),
  getTransactions: () => api.get('/materials/transactions/'),
};
