import api from './api';

export const projectService = {
  getAll: (params) => api.get('/projects/', { params }),
  getById: (id) => api.get(`/projects/${id}/`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.patch(`/projects/${id}/`, data),
  updateStatus: (id, status, notes) => api.patch(`/projects/${id}/update_status/`, { status, notes }),
  updatePayment: (id, amount_paid) => api.patch(`/projects/${id}/update_payment/`, { amount_paid }),
  getStats: () => api.get('/projects/stats/'),
};
