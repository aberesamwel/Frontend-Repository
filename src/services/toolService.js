import api from './api';

export const toolService = {
  getAll: (params) => api.get('/tools/', { params }),
  getById: (id) => api.get(`/tools/${id}/`),
  create: (data) => api.post('/tools/', data),
  update: (id, data) => api.put(`/tools/${id}/`, data),
  checkout: (tool_id, user_name, notes) => api.post('/tools/checkout/', { tool_id, user_name, notes }),
  return: (tool_id, user_name, condition, notes) => api.post('/tools/return_tool/', { tool_id, user_name, condition, notes }),
  getCheckedOut: () => api.get('/tools/checked-out/'),
  getOverdue: () => api.get('/tools/overdue/'),
  getHistory: (id) => api.get(`/tools/${id}/history/`),
};
