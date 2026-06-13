import api from '../../../services/api.js';

const demoUser = {
  id: 'user-1',
  name: 'Aarav Mehta',
  email: 'aarav@example.com',
  role: 'Frontend Engineer',
};

export const authService = {
  async login(credentials) {
    if (import.meta.env.DEV) {
      return { user: { ...demoUser, email: credentials.email }, token: 'demo-token' };
    }
    return api.post('/auth/login', credentials);
  },
  async register(payload) {
    if (import.meta.env.DEV) {
      return { user: { ...demoUser, name: payload.name, email: payload.email }, token: 'demo-token' };
    }
    return api.post('/auth/register', payload);
  },
  forgotPassword(payload) {
    if (import.meta.env.DEV) {
      return Promise.resolve({ message: 'Password reset link sent.' });
    }
    return api.post('/auth/forgot-password', payload);
  },
};
