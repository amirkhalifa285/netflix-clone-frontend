import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://netflix-clone-backend-bgis.onrender.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },
  
  // Logout user
  logout: async () => {
    const response = await apiClient.get('/api/auth/logout');
    return response.data;
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
};

export default authService;