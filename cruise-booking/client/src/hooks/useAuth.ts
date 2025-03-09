import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore, { User } from '../stores/authStore';
import api from '../config/axios';

interface LoginData {
  phone: string;
  otp: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  gender: string;
}

interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, updateToken, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API errors
  const handleError = (err: any) => {
    console.error('Auth Error:', err);
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
    return null;
  };

  // Helper function to make API calls
  const apiCall = async <T,>(
    method: 'get' | 'post',
    endpoint: string,
    data?: any
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Making ${method.toUpperCase()} request to /auth/${endpoint}`, data);
      const response = await api[method](`/auth/${endpoint}`, data);
      console.log('API Response:', response);
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    const response = await apiCall<AuthResponse>('post', 'login', data);
    if (response) {
      const { user, token, refreshToken } = response.data;
      setAuth(user, token, refreshToken);
      navigate('/cruises');
    }
  };

  const register = async (data: RegisterData) => {
    console.log('Registering with data:', data);
    const response = await apiCall<AuthResponse>('post', 'register', data);
    if (response) {
      console.log('Registration successful:', response);
      const { user, token, refreshToken } = response.data;
      setAuth(user, token, refreshToken);
      navigate('/cruises');
    }
  };

  const requestOtp = async (phone: string) => {
    const response = await apiCall<{ status: string }>('post', 'request-otp', { phone });
    return !!response;
  };

  const refreshToken = useCallback(async () => {
    const response = await apiCall<{ data: { token: string; refreshToken: string } }>('post', 'refresh-token');
    if (response?.data) {
      const { token, refreshToken } = response.data;
      updateToken(token, refreshToken);
      return true;
    }
    return false;
  }, [updateToken]);

  const logout = async () => {
    try {
      await apiCall('post', 'logout');
    } finally {
      clearAuth();
      navigate('/');
    }
  };

  const getProfile = async () => {
    const response = await apiCall<{ data: { user: User } }>('get', 'profile');
    return response?.data.user || null;
  };

  // Set up axios interceptors for token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const success = await refreshToken();
          if (success) {
            const token = useAuthStore.getState().token;
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            }
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  return {
    login,
    register,
    requestOtp,
    logout,
    getProfile,
    loading,
    error,
    clearError: () => setError(null)
  };
};

export default useAuth;
