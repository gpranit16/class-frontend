import api from './api';

export const studentService = {
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/student/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/student/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getMarks: async (params?: any) => {
    const response = await api.get('/student/marks', { params });
    return response.data;
  },

  getResultsSummary: async () => {
    const response = await api.get('/student/results/summary');
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await api.get('/student/announcements');
    return response.data;
  },
};
