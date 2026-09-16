import apiClient from './apiClient';

export const ruleService = {
  getRules: async () => {
    return apiClient.get('/rules');
  },

  createRule: async (ruleData) => {
    return apiClient.post('/rules', ruleData);
  },

  deactivateRule: async (id) => {
    return apiClient.patch(`/rules/${id}/deactivate`);
  },
};

export default ruleService;
