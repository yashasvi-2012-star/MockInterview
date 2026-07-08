import api from '../../../services/api.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';

export const profileService = {
  async getProfile() {
    return api.get(ENDPOINTS.ME);
  },
  async updateProfile(profile) {
    return api.patch(ENDPOINTS.ME, {
      name: profile.name,
      role: profile.role || null,
      location: profile.location || null,
    });
  },
};
