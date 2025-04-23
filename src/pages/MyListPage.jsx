// src/pages/MyListPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentModal from '../components/ContentModal';
import ContentCard from '../components/ContentCard';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/GridPage.css'; // Use the same CSS file

const MyListPage = () => {
  // State for my list content
  const [myListContent, setMyListContent] = useState([]);
  
  // State for visibility (for scroll loading)
  const [visibleCount, setVisibleCount] = useState(10);
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // States for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reference for scroll detection
  const bottomRef = useRef(null);
  
  // Get current profile from ProfileContext
  const { currentProfile, loading: profileLoading, removeFromMyList } = useProfile();
  
  // Fetch my list content when profile is loaded
  useEffect(() => {
    const fetchMyList = async () => {
      if (!currentProfile) return;
      
      try {
        setLoading(true);
        setError('');
        
          const response = await contentService.getMyList(currentProfile._id);
          // setMyListContent(response.data || []);
          const myListArr = Array.isArray(response.data)
              ? response.data
              : [];
          setMyListContent(myListArr);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your list');
        setLoading(false);
        console.error('Error fetching my list:', err);
      }
    };

    if (currentProfile && !profileLoading) {
      fetchMyList();
    }
  }, [currentProfile, profileLoading]);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Load more content when bottom is visible
          setVisibleCount(prev => Math.min(prev + 10, myListContent.length));
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = bottomRef.current; // Store ref value
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [myListContent.length]);
  
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
  
  const handleRemoveFromList = async (contentId) => {
    try {
      if (!currentProfile) return;
      
      await removeFromMyList(contentId);
      
      // Update UI by filtering out the removed content
      setMyListContent(prevContent => 
        prevContent.filter(item => item._id !== contentId)
      );
    } catch (err) {
      console.error('Error removing from My List:', err);
      setError('Failed to remove from My List');
    }
  };
  
  if (loading && !showModal) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  // Slice the array to the visible count
  const visibleContent = myListContent.slice(0, visibleCount);
  
  return (
    <div className="grid-page">
      <Header activePage="my-list" />
      
      <div className="page-content">
        <div className="section-title">
          <h1>My List</h1>
        </div>
        
        <div className="content-section">
          {visibleContent.length > 0 ? (
            <div className="content-grid">
              {visibleContent.map((item) => (
                <div key={item._id} className="grid-item">
                  <div className="grid-item-content">
                    <ContentCard 
                      content={item} 
                      onClick={handleContentClick} 
                    />
                    <button 
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromList(item._id);
                      }}
                      title="Remove from My List"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">
              <p>You haven't added any titles to your list yet.</p>
            </div>
          )}
        </div>
        
        {/* Reference element for intersection observer */}
        <div ref={bottomRef} className="bottom-ref"></div>
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

export default MyListPage;