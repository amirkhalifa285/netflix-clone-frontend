// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer'; // Import the shared Footer component
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
        
        const [
          featuredRes,
          recommendationsRes,
          newestRes,
          mostReviewedRes,
          highestRatedRes,
          animationRes,
          myListRes,
          actionRes,
          reviewedRes
        ] = await Promise.all([
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
        
        setFeaturedContent(featuredRes.data);
        setRecommendations(recommendationsRes.data);
        setNewContent(newestRes.data);
        setTopContent(mostReviewedRes.data);
        setHighestRated(highestRatedRes.data);
        setAnimationContent(animationRes.data);
        setMyListItems(myListRes.data);
        setActionContent(actionRes.data);
        setReviewedContent(reviewedRes.data);
        
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
    if (featuredContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prevIndex) => 
          prevIndex === featuredContent.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Rotate every 8 seconds
      
      return () => clearInterval(interval);
    }
  }, [featuredContent]);
  
  const handleContentClick = (content) => {
    setSelectedContent(content);
    setShowModal(true);
  };
  
  // Current featured content for banner
  const currentFeatured = featuredContent[currentFeaturedIndex];
  
  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="homepage">
      <Header />
      
      <Banner 
        content={currentFeatured} 
        onMoreInfo={handleContentClick} 
      />
      
      <div className="content-rows">
        <ContentRow 
          title="Matched to You" 
          content={recommendations} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="New on Netflix" 
          content={newContent} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="Top 10 in Country Today" 
          content={topContent} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="Your Reviews" 
          content={reviewedContent} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="Top Rated" 
          content={highestRated} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="Animation" 
          content={animationContent} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="Action & Adventure" 
          content={actionContent} 
          onCardClick={handleContentClick} 
        />
        <ContentRow 
          title="My List" 
          content={myListItems} 
          onCardClick={handleContentClick} 
        />
      </div>
      
      {/* Use the shared Footer component */}
      <Footer />
      
      {showModal && selectedContent && (
        <div className="content-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2>{selectedContent.title}</h2>
            {/* Modal content will be implemented separately */}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;