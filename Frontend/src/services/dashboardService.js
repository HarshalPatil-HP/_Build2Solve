import apiClient from './apiClient';

export const dashboardService = {
  getSummary: async () => {
    return apiClient.get('/dashboard/summary');
  },
};

export default dashboardService;
