import { paymentsAPI } from '@/services/paymentsAPI';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get user role
 */
export const getUserRole = (): 'individual' | 'lawyer' | 'admin' | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Check if user has premium subscription
 */
export const isPremiumUser = async (): Promise<boolean> => {
  const { data } = await paymentsAPI.getSubscriptionStatus();
  return data?.plan === 'premium' && data?.status === 'active';
};

/**
 * Check if user has premium - synchronous version using cached data
 */
export const isPremiumUserSync = (): boolean => {
  const user = getCurrentUser();
  return user?.subscription_plan === 'premium' || user?.is_premium === true;
};

/**
 * Check if a feature requires premium and user doesn't have it
 * Returns true if user needs to upgrade
 */
export const requiresPremium = (): boolean => {
  return !isPremiumUserSync();
};

/**
 * Get redirect path based on user role
 */
export const getRoleBasedRedirect = (role?: string): string => {
  const userRole = role || getUserRole();

  switch (userRole) {
    case 'admin':
      return '/admin-dashboard';
    case 'lawyer':
      return '/lawyer-dashboard';
    default:
      return '/individual-dashboard';
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};
