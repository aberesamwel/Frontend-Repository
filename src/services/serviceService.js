import api from './api';

export const serviceService = {
  getAll: (params) => api.get('/services/', { params }),
  getById: (id) => api.get(`/services/${id}/`),
  create: (data) => api.post('/services/', data),
  update: (id, data) => api.put(`/services/${id}/`, data),
  updateStatus: (id, status) => api.patch(`/services/${id}/update_status/`, { status }),
  addPayment: (id, amount, payment_method, notes) => api.post(`/services/${id}/add_payment/`, { amount, payment_method, notes }),
  getStats: () => api.get('/services/stats/'),
};
