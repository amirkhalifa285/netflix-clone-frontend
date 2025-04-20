import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

const profileService = {
  // Get all profiles for current user
  getProfiles: async () => {
    const response = await apiClient.get('/api/profiles');
    return response.data;
  },
  
  // Get single profile by id
  getProfile: async (profileId) => {
    const response = await apiClient.get(`/api/profiles/${profileId}`);
    return response.data;
  },
  
  // Create new profile
  createProfile: async (profileData) => {
    const response = await apiClient.post('/api/profiles', profileData);
    return response.data;
  },
  
  // Update profile
  updateProfile: async (profileId, profileData) => {
    const response = await apiClient.put(`/api/profiles/${profileId}`, profileData);
    return response.data;
  },
  
  // Delete profile
  deleteProfile: async (profileId) => {
    const response = await apiClient.delete(`/api/profiles/${profileId}`);
    return response.data;
  },

  addToMyList: async (profileId, contentId) => {
    const response = await apiClient.post(`/api/mylist/${profileId}`, { contentId });
    return response.data;
  },
  
  removeFromMyList: async (profileId, contentId) => {
    const response = await apiClient.delete(`/api/mylist/${profileId}/${contentId}`);
    return response.data;
  }
};

export default profileService;