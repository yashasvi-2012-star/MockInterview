import api from '../../../services/api.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';

async function normalizeSession(response) {
  const token = response.token || response.access_token;
  let user = response.user;

  if (!user && token) {
    user = await api.get(ENDPOINTS.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!user || !token) {
    throw new Error('Authentication response did not include a user and token.');
  }

  return { user, token };
}

export const authService = {
  async login(credentials) {
    return normalizeSession(await api.post(ENDPOINTS.LOGIN, credentials));
  },
  async register(payload) {
    return normalizeSession(await api.post(ENDPOINTS.REGISTER, payload));
  },
  forgotPassword(payload) {
    return api.post(ENDPOINTS.FORGOT_PASSWORD, payload);
  },
};
