import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),
  
  logout: () => 
    api.post('/auth/logout'),
};

export interface Cruise {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  availableSpots: number;
  destinations: string[];
  imageUrl: string;
}

export const cruiseApi = {
  getAll: () => 
    api.get<Cruise[]>('/cruises'),
  
  getById: (id: string) => 
    api.get<Cruise>(`/cruises/${id}`),
  
  search: (query: string) => 
    api.get<Cruise[]>(`/cruises/search?q=${query}`),
};

export interface BookingData {
  cruiseId: string;
  passengers: number;
  specialRequests?: string;
}

export interface Booking extends BookingData {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export const bookingApi = {
  create: (data: BookingData) => 
    api.post<Booking>('/bookings', data),
  
  getAll: () => 
    api.get<Booking[]>('/bookings'),
  
  getById: (id: string) => 
    api.get<Booking>(`/bookings/${id}`),
  
  cancel: (id: string) => 
    api.post(`/bookings/${id}/cancel`),
};

export default api;
