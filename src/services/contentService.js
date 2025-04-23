// src/services/contentService.js
import apiClient from './apiClient';

const contentService = {
  // Get featured content for banner
  getFeaturedContent: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/api/content/featured', { params });
    return response.data;
  },
  
  // Get newest content
  getNewestContent: async (type, limit = 50) => {
    const params = type ? { type, limit } : { limit };
    try {
      const response = await apiClient.get('/api/content/newest', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching newest content:', error);
      throw error;
    }
  },
  
  getPopularContent: async (type, limit = 50) => {
    const params = type ? { type, limit } : { limit };
    try {
      const response = await apiClient.get('/api/content/popular', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular content:', error);
      throw error;
    }
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
  getUserReviewedContent: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/api/content/reviewed', { params });
    return response.data;
  },
  
  // Get user's My List content
  getMyList: async (profileId) => {
    const response = await apiClient.get(`/api/mylist/${profileId}`);
    return response.data;
  },
  
  // Get personalized recommendations
  getRecommendations: async (profileId, type) => {
    try {
      const params = type ? { type } : {};
      console.log(`Requesting recommendations for profile: ${profileId}, type: ${type || 'all'}`);
      const response = await apiClient.get(`/api/recommendations/${profileId}`, { params });
      console.log(`Received ${response.data?.count || 0} recommendations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // If recommendations fail, get popular content as fallback
      console.log('Falling back to popular content');
      const fallback = await contentService.getPopularContent(type);
      return fallback;
    }
  },
  
  // Get browse content with available filters
  getBrowseContent: async (limit = 100) => {
    try {
      const response = await apiClient.get('/api/content/browse', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching browse content:', error);
      return {
        success: false,
        data: {
          content: [],
          availableGenres: ['All Genres'],
          availableLanguages: ['All Languages']
        }
      };
    }
  },
  
  // Search content with filters
  searchContent: async (params) => {
    try {
      const response = await apiClient.get('/api/content/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching content:', error);
      return {
        success: false,
        data: []
      };
    }
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
  },

  getAllMovieContent: async (limit = 10) => {
    try {
      const response = await apiClient.get('/api/content/movies', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error in getAllMovieContent:', error);
      return {
        success: false,
        data: {
          newest: [],
          featured: [],
          popular: [],
          mostReviewed: [],
          highestRated: []
        }
      };
    }
  },
  
  getAllTVContent: async (limit = 10) => {
    try {
      const response = await apiClient.get('/api/content/tv', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error in getAllTVContent:', error);
      return {
        success: false,
        data: {
          newest: [],
          featured: [],
          popular: [],
          mostReviewed: [],
          highestRated: []
        }
      };
    }
  }
};

export default contentService;