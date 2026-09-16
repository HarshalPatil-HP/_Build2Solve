import apiClient from './apiClient';

export const complaintService = {
  createComplaint: async (payload) => {
    return apiClient.post('/complaints', payload);
  },

  getComplaints: async (params = {}) => {
    const { page = 1, limit = 20, status } = params;
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (status) query.append('status', status);
    return apiClient.get(`/complaints?${query.toString()}`);
  },

  updateComplaint: async (id, updateData) => {
    return apiClient.patch(`/complaints/${id}`, updateData);
  },
};

export default complaintService;
