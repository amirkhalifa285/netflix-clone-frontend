// src/pages/ReviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/ReviewPage.css';

const ReviewPage = () => {
  const { contentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { currentProfile } = useProfile();
  
  // Initialize content from location state or fetch it
  const [content, setContent] = useState(location.state?.content || null);
  
  // Review form state
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Fetch content if not provided in location state
  useEffect(() => {
    const fetchContent = async () => {
      if (!content && contentId) {
        try {
          setLoading(true);
          const response = await contentService.getContentById(contentId);
          setContent(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching content:', err);
          setError('Failed to load content details');
          setLoading(false);
        }
      }
    };
    
    fetchContent();
  }, [content, contentId]);
  
  // Check if user has already reviewed this content
  useEffect(() => {
    const checkExistingReview = async () => {
      if (content && currentProfile) {
        try {
          setLoading(true);
          const response = await contentService.getUserReviewedContent();
          const existingReview = response.data.find(
            item => item.content?._id === content._id
          );
          
          if (existingReview) {
            setReviewText(existingReview.review);
            setRating(existingReview.rating);
            setIsPublic(existingReview.isPublic);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error checking existing review:', err);
          setLoading(false);
        }
      }
    };
    
    checkExistingReview();
  }, [content, currentProfile]);

  // Ensure body scroll is restored when unmounting
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentProfile) {
      setError('You must be logged in to submit a review');
      return;
    }
    
    if (!content) {
      setError('Content details are missing');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Format the data according to the backend API expectations
      const reviewData = {
        contentId: content._id,  // Backend expects contentId, not content
        profileId: currentProfile._id,  // Backend expects profileId, not profile
        rating,
        review: reviewText,
        isPublic
      };
      
      
      await contentService.createReview(reviewData);
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect back after success
      setTimeout(() => {
        navigate('/browse');
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    document.body.style.overflow = ''; // Restore scrolling
    navigate(-1); // Go back to previous page
  };
  
  if (loading && !content) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error && !content) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!content) {
    return <div className="error-message">Content not found</div>;
  }
  
  const backdropUrl = content.backdropPath 
    ? `https://image.tmdb.org/t/p/original${content.backdropPath}`
    : '/fallback-backdrop.jpg';
    
  return (
    <div className="review-page">
      <div 
        className="review-backdrop" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="review-container">
        <button className="back-button" onClick={handleCancel}>
          ← Back
        </button>
        
        <h1 className="review-title">Review: {content.title}</h1>
        
        {success ? (
          <div className="success-message">
            Your review has been submitted successfully!
          </div>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="rating-container">
              <h3>Rating</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="review-text-container">
              <h3>Your Review</h3>
              <textarea
                className="review-textarea"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your thoughts about this title..."
                required
              ></textarea>
            </div>
            
            <div className="review-visibility">
              <h3>Review Visibility</h3>
              <div className="visibility-options">
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                  />
                  <div className="option-details">
                    <span className="option-title">Public</span>
                    <span className="option-description">
                      Your review will be visible to all users
                    </span>
                  </div>
                </label>
                
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                  />
                  <div className="option-details">
                    <span className="option-title">Private</span>
                    <span className="option-description">
                      Only you and admins can see this review
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="review-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;