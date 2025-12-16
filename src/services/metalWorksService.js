import api from './api';

export const metalWorksService = {
  // Get all metal works services
  getAll: () => api.get('/metalworks/'),
  
  // Create new metal works service
  create: (serviceData) => api.post('/metalworks/', serviceData),
  
  // Update existing service
  update: (id, serviceData) => api.put(`/metalworks/${id}/`, serviceData),
  
  // Delete service
  delete: (id) => api.delete(`/metalworks/${id}/`),
  
  // Get service by ID
  getById: (id) => api.get(`/metalworks/${id}/`)
};