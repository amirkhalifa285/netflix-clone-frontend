// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ContentRow from '../components/ContentRow';
import ContentModal from '../components/ContentModal';
import Footer from '../components/Footer';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/HomePage.css';

const HomePage = () => {
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
    // Define fetchData function inside useEffect to avoid dependency issues
    const fetchData = async () => {
      if (!currentProfile) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Use Promise.allSettled to prevent one failure from failing all
        const results = await Promise.allSettled([
          contentService.getFeaturedContent(),
          contentService.getRecommendations(currentProfile._id),
          contentService.getNewestContent(),
          contentService.getMostReviewedContent(),
          contentService.getHighestRatedContent(),
          contentService.getContentByGenre(16), // Animation genre (16)
          contentService.getMyList(currentProfile._id),
          contentService.getContentByGenre(28), // Action genre (28)
          contentService.getUserReviewedContent()
        ]);
        
        // Process results safely
        if (results[0].status === 'fulfilled') {
          setFeaturedContent(results[0].value.data || []);
        }
        
        if (results[1].status === 'fulfilled') {
          setRecommendations(results[1].value.data || []);
        }
        
        if (results[2].status === 'fulfilled') {
          setNewContent(results[2].value.data || []);
        }
        
        if (results[3].status === 'fulfilled') {
          setTopContent(results[3].value.data || []);
        }
        
        if (results[4].status === 'fulfilled') {
          setHighestRated(results[4].value.data || []);
        }
        
        if (results[5].status === 'fulfilled') {
          setAnimationContent(results[5].value.data || []);
        }
        
        if (results[6].status === 'fulfilled') {
          setMyListItems(results[6].value.data || []);
        }
        
        if (results[7].status === 'fulfilled') {
          setActionContent(results[7].value.data || []);
        }
        
        if (results[8].status === 'fulfilled') {
          setReviewedContent(results[8].value.data || []);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch content');
        setLoading(false);
        console.error('Error fetching content:', err);
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
      <Header activePage="home" />
      
      {currentFeatured && 
        <Banner 
          content={currentFeatured} 
          onMoreInfo={handleContentClick} 
        />
      }
      
      <div className="content-rows">
        {recommendations && recommendations.length > 0 &&
          <ContentRow 
            title="Matched to You" 
            content={recommendations} 
            onCardClick={handleContentClick} 
          />
        }
        {newContent && newContent.length > 0 &&
          <ContentRow 
            title="New on Netflix" 
            content={newContent} 
            onCardClick={handleContentClick} 
          />
        }
        {topContent && topContent.length > 0 &&
          <ContentRow 
            title="Top 10 in Country Today" 
            content={topContent} 
            onCardClick={handleContentClick} 
          />
        }
        {reviewedContent && reviewedContent.length > 0 &&
          <ContentRow 
            title="Your Reviews" 
            content={reviewedContent} 
            onCardClick={handleContentClick} 
          />
        }
        {highestRated && highestRated.length > 0 &&
          <ContentRow 
            title="Top Rated" 
            content={highestRated} 
            onCardClick={handleContentClick} 
          />
        }
        {animationContent && animationContent.length > 0 &&
          <ContentRow 
            title="Animation" 
            content={animationContent} 
            onCardClick={handleContentClick} 
          />
        }
        {actionContent && actionContent.length > 0 &&
          <ContentRow 
            title="Action & Adventure" 
            content={actionContent} 
            onCardClick={handleContentClick} 
          />
        }
        {myListItems && myListItems.length > 0 &&
          <ContentRow 
            title="My List" 
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

export default HomePage;