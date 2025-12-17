import api from './api';

export const metalWorksService = {
  // Get all metal works services
  getAll: () => api.get('/services/'),
  
  // Create new metal works service
  create: (serviceData) => api.post('/services/', serviceData),
  
  // Update existing service
  update: (id, serviceData) => api.put(`/services/${id}/`, serviceData),
  
  // Delete service
  delete: (id) => api.delete(`/services/${id}/`),
  
  // Get service by ID
  getById: (id) => api.get(`/services/${id}/`)
};