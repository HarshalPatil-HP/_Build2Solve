import apiClient from './apiClient';

export const caseService = {
  createCase: async (payload) => {
    return apiClient.post('/cases', payload);
  },

  getCases: async (params = {}) => {
    const { page = 1, limit = 20, status } = params;
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (status) query.append('status', status);
    return apiClient.get(`/cases?${query.toString()}`);
  },

  getCaseById: async (id) => {
    return apiClient.get(`/cases/${id}`);
  },

  updateCase: async (id, payload) => {
    return apiClient.patch(`/cases/${id}`, payload);
  },

  lockCase: async (id) => {
    return apiClient.post(`/cases/${id}/lock`);
  },

  addAddendum: async (id, payload) => {
    return apiClient.post(`/cases/${id}/addendum`, payload);
  },
};

export default caseService;
