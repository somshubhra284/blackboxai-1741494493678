import axios from 'axios';
import useAuthStore from '../stores/authStore';

// Create axios instance with custom config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh-token', {
          refreshToken: useAuthStore.getState().refreshToken,
        });

        const { token } = response.data;

        // Update the token in the store
        useAuthStore.getState().updateToken(token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, logout user and redirect to login
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Handle other error cases
    if (error.response?.status === 404) {
      console.error('Resource not found:', error);
    } else if (error.response?.status === 500) {
      console.error('Server error:', error);
    } else if (error.response?.data?.message) {
      // If the server provides an error message, use it
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

// Export custom instance
export default api;

// Helper functions for common API operations
export const apiHelpers = {
  get: async <T>(url: string, config = {}) => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data = {}, config = {}) => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data = {}, config = {}) => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data = {}, config = {}) => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config = {}) => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

// Types for API responses
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Error type
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
