// src/services/contentService.js
import apiClient from './apiClient';

const contentService = {
  // Get featured content for banner
  getFeaturedContent: async () => {
    const response = await apiClient.get('/api/content/featured');
    return response.data;
  },
  
  // Get newest content
  getNewestContent: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/api/content/newest', { params });
    return response.data;
  },
  
  // Get most popular content
  getPopularContent: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/api/content/popular', { params });
    return response.data;
  },
  
  // Get most reviewed content
  getMostReviewedContent: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/api/content/most-reviewed', { params });
    return response.data;
  },
  
  // Get highest rated content
  getHighestRatedContent: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/api/content/highest-rated', { params });
    return response.data;
  },
  
  // Get content by genre
  getContentByGenre: async (genreId, type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get(`/api/content/genre/${genreId}`, { params });
    return response.data;
  },
  
  // Get detailed content info
  getContentById: async (contentId) => {
    const response = await apiClient.get(`/api/content/${contentId}`);
    return response.data;
  },
  
  // Get user's reviewed content
  getUserReviewedContent: async () => {
    const response = await apiClient.get('/api/content/reviewed');
    return response.data;
  },
  
  // Get user's My List content
  getMyList: async (profileId) => {
    const response = await apiClient.get(`/api/mylist/${profileId}`);
    return response.data;
  },
  
  // Get personalized recommendations
  getRecommendations: async (profileId) => {
    const response = await apiClient.get(`/api/recommendations/${profileId}`);
    return response.data;
  },
  
  // Create a review
  createReview: async (data) => {
    const response = await apiClient.post('/api/reviews', data);
    return response.data;
  },
  
  // Update a review
  updateReview: async (reviewId, data) => {
    const response = await apiClient.put(`/api/reviews/${reviewId}`, data);
    return response.data;
  },
  
  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/api/reviews/${reviewId}`);
    return response.data;
  }
};

export default contentService;