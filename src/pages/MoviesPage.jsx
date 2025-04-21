// src/pages/MoviesPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ContentRow from '../components/ContentRow';
import ContentModal from '../components/ContentModal';
import Footer from '../components/Footer';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/HomePage.css'; // Reuse the same styles

const MoviesPage = () => {
  // State for featured content (banner)
  const [featuredContent, setFeaturedContent] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  
  // States for different content rows
  const [recommendations, setRecommendations] = useState([]);
  const [newContent, setNewContent] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [reviewedContent, setReviewedContent] = useState([]);
  const [highestRated, setHighestRated] = useState([]);
  const [animationContent, setAnimationContent] = useState([]);
  const [myListItems, setMyListItems] = useState([]);
  const [actionContent, setActionContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get current profile from ProfileContext
  const { currentProfile, loading: profileLoading } = useProfile();
  
  // Fetch all necessary data when profile is loaded
  useEffect(() => {
    const fetchData = async () => {
      if (!currentProfile) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Use Promise.allSettled to prevent one failure from failing all
        const results = await Promise.allSettled([
          contentService.getFeaturedContent('movie'),
          // Skip recommendations for now
          // contentService.getRecommendations(currentProfile._id, 'movie'),
          contentService.getNewestContent('movie'),
          contentService.getMostReviewedContent('movie'),
          contentService.getHighestRatedContent('movie'),
          contentService.getPopularContent('movie'),
          contentService.getContentByGenre(16, 'movie'), // Animation genre (16)
          contentService.getContentByGenre(28, 'movie'), // Action genre (28)
          contentService.getContentByGenre(35, 'movie'), // Comedy genre (35)
          contentService.getMyList(currentProfile._id),
          contentService.getUserReviewedContent('movie')
        ]);
        
        // Process results safely
        if (results[0].status === 'fulfilled') {
          setFeaturedContent(results[0].value.data || []);
        }
        
        // Use popular content for recommendations
        if (results[4].status === 'fulfilled') {
          setRecommendations(results[4].value.data || []);
          setPopularContent(results[4].value.data || []);
        }
        
        if (results[1].status === 'fulfilled') {
          setNewContent(results[1].value.data || []);
        }
        
        if (results[2].status === 'fulfilled') {
          setTopContent(results[2].value.data || []);
        }
        
        if (results[3].status === 'fulfilled') {
          setHighestRated(results[3].value.data || []);
        }
        
        if (results[5].status === 'fulfilled') {
          setAnimationContent(results[5].value.data || []);
        }
        
        if (results[6].status === 'fulfilled') {
          setActionContent(results[6].value.data || []);
        }
        
        // Filter My List to only show movies
        if (results[8].status === 'fulfilled') {
          const movieMyList = (results[8].value.data || []).filter(item => item.type === 'movie');
          setMyListItems(movieMyList);
        }
        
        // Filter reviewed content to only show movies
        if (results[9].status === 'fulfilled') {
          const movieReviews = (results[9].value.data || []).filter(item => item.type === 'movie');
          setReviewedContent(movieReviews);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movie content');
        setLoading(false);
        console.error('Error fetching movie content:', err);
      }
    };

    if (currentProfile && !profileLoading) {
      fetchData();
    }
  }, [currentProfile, profileLoading]);
  
  // Handle banner rotation
  useEffect(() => {
    if (featuredContent && featuredContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prevIndex) => 
          prevIndex === featuredContent.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Rotate every 8 seconds
      
      return () => clearInterval(interval);
    }
  }, [featuredContent]);
  
  const handleContentClick = (content) => {
    // When a content card is clicked, fetch full content details
    const fetchContentDetails = async (contentId) => {
      try {
        setLoading(true);
        const response = await contentService.getContentById(contentId);
        if (response && response.data) {
          document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
          setSelectedContent(response.data);
          setShowModal(true);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching content details:', err);
        setLoading(false);
      }
    };
    
    // If we have full content details already, use them
    // Otherwise fetch the details first
    if (content && content._id) {
      if (content.seasons || content.cast) {
        // If content already has full details
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        setSelectedContent(content);
        setShowModal(true);
      } else {
        // If we need to fetch full details
        fetchContentDetails(content._id);
      }
    }
  };
  
  const handleCloseModal = () => {
    document.body.style.overflow = ''; // Restore scrolling
    setShowModal(false);
    // Optionally clear selected content after a delay
    setTimeout(() => {
      setSelectedContent(null);
    }, 300);
  };
  
  // Current featured content for banner
  const currentFeatured = featuredContent && featuredContent.length > 0 
    ? featuredContent[currentFeaturedIndex] 
    : null;
  
  if (loading && !showModal) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="homepage">
      <Header activePage="movies" />
      
      {currentFeatured && 
        <Banner 
          content={currentFeatured} 
          onMoreInfo={handleContentClick} 
        />
      }
      
      <div className="content-rows">
        {recommendations && recommendations.length > 0 &&
          <ContentRow 
            title="Movies For You" 
            content={recommendations} 
            onCardClick={handleContentClick} 
          />
        }
        {newContent && newContent.length > 0 &&
          <ContentRow 
            title="New Movies" 
            content={newContent} 
            onCardClick={handleContentClick} 
          />
        }
        {popularContent && popularContent.length > 0 &&
          <ContentRow 
            title="Popular Movies" 
            content={popularContent} 
            onCardClick={handleContentClick} 
          />
        }
        {topContent && topContent.length > 0 &&
          <ContentRow 
            title="Most Reviewed Movies" 
            content={topContent} 
            onCardClick={handleContentClick} 
          />
        }
        {actionContent && actionContent.length > 0 &&
          <ContentRow 
            title="Action Movies" 
            content={actionContent} 
            onCardClick={handleContentClick} 
          />
        }
        {animationContent && animationContent.length > 0 &&
          <ContentRow 
            title="Animated Movies" 
            content={animationContent} 
            onCardClick={handleContentClick} 
          />
        }
        {highestRated && highestRated.length > 0 &&
          <ContentRow 
            title="Top Rated Movies" 
            content={highestRated} 
            onCardClick={handleContentClick} 
          />
        }
        {reviewedContent && reviewedContent.length > 0 &&
          <ContentRow 
            title="Your Movie Reviews" 
            content={reviewedContent} 
            onCardClick={handleContentClick} 
          />
        }
        {myListItems && myListItems.length > 0 &&
          <ContentRow 
            title="My List - Movies" 
            content={myListItems} 
            onCardClick={handleContentClick} 
          />
        }
      </div>
      
      <Footer />
      
      {/* Content Modal */}
      {showModal && selectedContent && (
        <ContentModal 
          content={selectedContent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MoviesPage;