// src/pages/NewAndPopularPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentModal from '../components/ContentModal';
import ContentCard from '../components/ContentCard';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/GridPage.css';

const NewAndPopularPage = () => {
  // States for content
  const [newContent, setNewContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  
  // State for visibility (for scroll loading)
  const [visibleNewCount, setVisibleNewCount] = useState(10);
  const [visiblePopularCount, setVisiblePopularCount] = useState(10);
  
  // State to track if all content is loaded
  const [allContentLoaded, setAllContentLoaded] = useState(false);
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // States for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reference for scroll detection
  const loaderRef = useRef(null);
  
  // Get current profile from ProfileContext
  const { currentProfile, loading: profileLoading } = useProfile();
  
  // Fetch all necessary data when profile is loaded
  useEffect(() => {
    const fetchData = async () => {
      if (!currentProfile) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Use Promise.all to fetch both data sets
        const [newContentRes, popularContentRes] = await Promise.all([
          contentService.getNewestContent(),
          contentService.getPopularContent()
        ]);
        
        setNewContent(newContentRes.data || []);
        setPopularContent(popularContentRes.data || []);
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
  
  // Check if we've loaded all content
  useEffect(() => {
    const allNew = visibleNewCount >= newContent.length;
    const allPopular = visiblePopularCount >= popularContent.length;
    
    setAllContentLoaded(allNew && allPopular);
  }, [visibleNewCount, visiblePopularCount, newContent.length, popularContent.length]);
  
  // Handler to load more content
  const loadMoreContent = useCallback(() => {
    if (visibleNewCount < newContent.length) {
      setVisibleNewCount(prev => Math.min(prev + 10, newContent.length));
    }
    
    if (visiblePopularCount < popularContent.length) {
      setVisiblePopularCount(prev => Math.min(prev + 10, popularContent.length));
    }
  }, [visibleNewCount, visiblePopularCount, newContent.length, popularContent.length]);
  
  // Set up scroll event for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        loadMoreContent();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreContent]);
  
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
  
  if (loading && !showModal) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  // Slice the arrays to the visible count
  const visibleNewContent = newContent.slice(0, visibleNewCount);
  const visiblePopularContent = popularContent.slice(0, visiblePopularCount);
  
  return (
    <div className="grid-page">
      <Header activePage="new-popular" />
      
      <div className="page-content">
        <div className="section-title">
          <h1>New & Popular</h1>
        </div>
        
        <div className="content-section">
          <h2 className="section-heading">New on Netflix</h2>
          <div className="content-grid">
            {visibleNewContent.map((item) => (
              <div key={item._id} className="grid-item">
                <ContentCard 
                  content={item} 
                  onClick={handleContentClick} 
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="content-section">
          <h2 className="section-heading">Popular This Week</h2>
          <div className="content-grid">
            {visiblePopularContent.map((item) => (
              <div key={item._id} className="grid-item">
                <ContentCard 
                  content={item} 
                  onClick={handleContentClick} 
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Loader reference element */}
        <div ref={loaderRef} className="content-loader">
          {!allContentLoaded && <div className="loading-spinner-small"></div>}
        </div>
      </div>
      
      {allContentLoaded && <Footer />}
      
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

export default NewAndPopularPage;