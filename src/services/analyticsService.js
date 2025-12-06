import api from './api';

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard/'),
  getEvents: () => api.get('/analytics/events/'),
  recordEvent: (data) => api.post('/analytics/events/', data),
  getDailySummaries: () => api.get('/analytics/daily/'),
};
