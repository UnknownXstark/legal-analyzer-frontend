import { mockDashboardData } from '../services/mockData';

// Simulate async API calls with delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  getDashboardData: async (role) => {
    await delay(300);
    return mockDashboardData[role] || mockDashboardData.individual;
  },
  
  getUserInfo: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};
