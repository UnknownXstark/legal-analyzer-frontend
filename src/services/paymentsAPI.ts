import apiClient from '@/api/axios';

export const paymentsAPI = {
  /**
   * Create a Stripe checkout session for subscription
   * @param plan - 'free' | 'premium' | 'business'
   */
  createCheckoutSession: async (plan: string) => {
    try {
      const response = await apiClient.post('/api/payments/create-checkout-session/', { plan });
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Failed to create checkout session',
      };
    }
  },

  /**
   * Get current subscription status
   */
  getSubscriptionStatus: async () => {
    try {
      const response = await apiClient.get('/api/payments/subscription-status/');
      return { data: response.data, error: null };
    } catch (error: any) {
      // Return default free plan if endpoint fails
      return {
        data: {
          plan: 'free',
          status: 'active',
          usage: {
            analysis_count: 0,
            limit: 3,
          },
        },
        error: null,
      };
    }
  },

  /**
   * Open Stripe billing portal for subscription management
   */
  manageBillingPortal: async () => {
    try {
      const response = await apiClient.post('/api/payments/manage-billing-portal/');
      return { data: response.data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || 'Failed to open billing portal',
      };
    }
  },
};
