import apiClient from './apiClient';

export const authService = {
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  signup: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },

  createStaff: async (staffData) => {
    return apiClient.post('/auth/staff', staffData);
  },
};

export default authService;
