import apiClient from './apiClient';

export const scanService = {
  // Create scan with multi-image upload (multipart/form-data)
  createScan: async (formData) => {
    return apiClient.post('/scans', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get paginated scans list
  getScans: async (params = {}) => {
    const { page = 1, limit = 20, status, category } = params;
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (status) query.append('status', status);
    if (category) query.append('category', category);
    return apiClient.get(`/scans?${query.toString()}`);
  },

  // Get single scan by ID
  getScanById: async (id) => {
    return apiClient.get(`/scans/${id}`);
  },

  // Get report URL or download (pdf / docx)
  getReportUrl: (scanId, format = 'pdf') => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    return `${API_BASE_URL}/scans/${scanId}/report?format=${format}`;
  },
};

export default scanService;
