import api from './api';

const taskService = {
  getByProject: async (projectId, assigneeId = null) => {
    let url = `/projects/${projectId}/tasks`;
    if (assigneeId) {
      url += `?assigneeId=${assigneeId}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get('/my-tasks');
    return response.data;
  },

  create: async (projectId, taskData) => {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  },

  update: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  updateStatus: async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  }
};

export default taskService;