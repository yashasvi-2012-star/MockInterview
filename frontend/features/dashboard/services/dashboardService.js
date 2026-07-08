import api from '../../../services/api.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';

export const dashboardService = {
  async getDashboard() {
    return api.get(`${ENDPOINTS.REPORTS}/analytics`);
  },
};
