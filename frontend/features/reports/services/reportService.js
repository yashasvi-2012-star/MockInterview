import api from '../../../services/api.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';

export const reportService = {
  async getReports() {
    return api.get(`${ENDPOINTS.REPORTS}/analytics`);
  },
};
