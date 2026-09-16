import apiClient from './apiClient';

export const companyService = {
  getCompanies: async (params = {}) => {
    const { page = 1, limit = 20, sortByRisk = true } = params;
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (sortByRisk) query.append('sortByRisk', sortByRisk);
    return apiClient.get(`/companies?${query.toString()}`);
  },

  getCompanyHistory: async (id, params = {}) => {
    const { page = 1, limit = 20 } = params;
    return apiClient.get(`/companies/${id}/history?page=${page}&limit=${limit}`);
  },
};

export default companyService;
