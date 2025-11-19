import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials) => {
    const { data, error } = await authAPI.login(credentials);
    
    if (error) {
      return { error };
    }

    // Store tokens and user
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);

    // Role-based redirect
    const role = data.user.role || 'individual';
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'lawyer') {
      navigate('/lawyer-dashboard');
    } else {
      navigate('/individual-dashboard');
    }

    return { data };
  };

  const signup = async (userData) => {
    const { data, error } = await authAPI.register(userData);
    
    if (error) {
      return { error };
    }

    // Store tokens and user
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);

    // Role-based redirect
    const role = data.user.role || 'individual';
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'lawyer') {
      navigate('/lawyer-dashboard');
    } else {
      navigate('/individual-dashboard');
    }

    return { data };
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate('/login');
  };

  const refreshProfile = async () => {
    const { data, error } = await authAPI.getProfile();
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    }
    return { data, error };
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshProfile,
  };
};
