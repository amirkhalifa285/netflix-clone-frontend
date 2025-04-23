// src/services/adminService.js
import apiClient from './apiClient';

const adminService = {
  // Get system logs with optional filtering
  getLogs: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },
  
  // Add a new log entry (if needed)
  addLog: async (logData) => {
    try {
      const response = await apiClient.post('/api/admin/logs', logData);
      return response.data;
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  },
  
  // Get trending content from TMDB that's not in our database
  getTrendingContent: async (type = 'movie') => {
    try {
      const response = await apiClient.get(`/api/admin/tmdb/trending/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw error;
    }
  },
  
  // Search content on TMDB that's not in our database
  searchContent: async (query, type = 'movie') => {
    try {
      const response = await apiClient.get('/api/admin/tmdb/search', {
        params: { query, type }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },
  
  // Import content from TMDB to our database
  importContent: async (tmdbId, type = 'movie') => {
    try {
      const response = await apiClient.post('/api/admin/tmdb/import', {
        tmdbId,
        type
      });
      return response.data;
    } catch (error) {
      console.error('Error importing content:', error);
      throw error;
    }
  }
};

export default adminService;