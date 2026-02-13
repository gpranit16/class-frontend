import api from './api';

export const adminService = {
  // Students
  getStudents: async (params?: any) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  getStudent: async (id: string) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  addStudent: async (data: any) => {
    const response = await api.post('/admin/students', data);
    return response.data;
  },

  updateStudent: async (id: string, data: any) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Marks
  getMarks: async (params?: any) => {
    const response = await api.get('/admin/marks', { params });
    return response.data;
  },

  addMarks: async (data: any) => {
    const response = await api.post('/admin/marks', data);
    return response.data;
  },

  updateMarks: async (id: string, data: any) => {
    const response = await api.put(`/admin/marks/${id}`, data);
    return response.data;
  },

  deleteMarks: async (id: string) => {
    const response = await api.delete(`/admin/marks/${id}`);
    return response.data;
  },

  bulkUploadMarks: async (data: any) => {
    const response = await api.post('/admin/marks/bulk', data);
    return response.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await api.get('/admin/announcements');
    return response.data;
  },

  createAnnouncement: async (data: any) => {
    const response = await api.post('/admin/announcements', data);
    return response.data;
  },

  updateAnnouncement: async (id: string, data: any) => {
    const response = await api.put(`/admin/announcements/${id}`, data);
    return response.data;
  },

  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/admin/announcements/${id}`);
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getPerformanceAnalytics: async (params?: any) => {
    const response = await api.get('/admin/analytics/performance', { params });
    return response.data;
  },
};
