import api from './api';

export const authService = {
  adminLogin: async (email: string, password: string) => {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  },

  studentLogin: async (identifier: string, password: string) => {
    const response = await api.post('/auth/student/login', { identifier, password });
    return response.data;
  },

  studentLoginByEmail: async (email: string) => {
    const response = await api.post('/auth/student/login-by-email', { email });
    return response.data;
  },

  studentSignup: async (data: any) => {
    const response = await api.post('/auth/student/signup', data);
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },
};
