import api from './api';

const commitService = {
  getByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/commits`);
    return response.data;
  },

  getStats: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/commits/stats`);
    return response.data;
  },

  getMemberCommits: async (projectId, userId) => {
    const response = await api.get(`/projects/${projectId}/commits/member/${userId}`);
    return response.data;
  },

  getMyCommits: async (projectId) => {
    const response = await api.get(`/my-commits?projectId=${projectId}`);
    return response.data;
  },

  getMemberStats: async (projectId, userId) => {
    const response = await api.get(`/projects/${projectId}/members/${userId}/stats`);
    return response.data;
  }
};

export default commitService;