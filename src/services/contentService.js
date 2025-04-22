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
  
  // Get browse content
  getBrowseContent: async () => {
    try {
      const { data } = await apiClient.get('/api/content/browse');
      
      // Validate the response structure
      if (!data || !data.success || !data.data || !Array.isArray(data.data.content)) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure');
      }

      return data;
    } catch (error) {
      console.error('Error in getBrowseContent:', error);
      return {
        success: false,
        data: {
          content: [],
          availableGenres: ['All Genres']
        }
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

  getAllMovieContent: async () => {
    try {
      const { data } = await apiClient.get('/api/content/movies');
      return data;
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

  getAllTVContent: async () => {
    try {
      const { data } = await apiClient.get('/api/content/tv');
      return data;
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