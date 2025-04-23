// src/components/admin/ContentBrowser.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const ContentBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('movie');
  const [trendingContent, setTrendingContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [addingContentId, setAddingContentId] = useState(null);

  // Fetch trending content on component mount and when content type changes
  useEffect(() => {
    fetchTrendingContent();
  }, [contentType]);

  const fetchTrendingContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminService.getTrendingContent(contentType);
      
      if (response.success && response.data) {
        setTrendingContent(response.data);
      } else {
        setError('Failed to fetch trending content');
      }
    } catch (err) {
      console.error('Error fetching trending content:', err);
      setError('Error fetching trending content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      setSearching(true);
      setError('');
      
      const response = await adminService.searchContent(searchQuery, contentType);
      
      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        setError('No results found');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching TMDB:', err);
      setError('Error searching for content. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddContent = async (tmdbId) => {
    try {
      setAddingContentId(tmdbId);
      setError('');
      
      const response = await adminService.importContent(tmdbId, contentType);
      
      if (response.success) {
        setSuccessMessage(`Successfully added "${response.data.title}" to the database!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(response.message || 'Failed to add content');
      }
    } catch (err) {
      console.error('Error adding content:', err);
      setError(err.response?.data?.message || 'Failed to add content');
    } finally {
      setAddingContentId(null);
    }
  };

  const getImageUrl = (posterPath) => {
    return posterPath ? `https://image.tmdb.org/t/p/w200${posterPath}` : '/fallback-poster.jpg';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const ContentCard = ({ item }) => (
    <div className="content-card">
      <div className="content-poster">
        <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} />
      </div>
      <div className="content-info">
        <h3>{item.title || item.name}</h3>
        <p className="release-date">
          {formatDate(item.release_date || item.first_air_date)}
        </p>
        <p className="overview">{item.overview?.substring(0, 150)}...</p>
        <button 
          className="add-content-btn"
          onClick={() => handleAddContent(item.id)}
          disabled={addingContentId === item.id}
        >
          {addingContentId === item.id ? 'Adding...' : 'Add Content'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="content-browser">
      <h2>Browse & Add Content</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="content-controls">
        <div className="type-selector">
          <label>Content Type:</label>
          <div className="type-buttons">
            <button 
              className={contentType === 'movie' ? 'active' : ''}
              onClick={() => setContentType('movie')}
            >
              Movies
            </button>
            <button 
              className={contentType === 'tv' ? 'active' : ''}
              onClick={() => setContentType('tv')}
            >
              TV Shows
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
          />
          <button type="submit" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      
      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="content-section">
          <h3>Search Results</h3>
          <div className="content-grid">
            {searchResults.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      
      {/* Trending Content Section */}
      <div className="content-section">
        <h3>{searching ? 'Trending Content' : `Trending ${contentType === 'movie' ? 'Movies' : 'TV Shows'}`}</h3>
        
        {loading ? (
          <div className="loading">Loading trending content...</div>
        ) : trendingContent.length > 0 ? (
          <div className="content-grid">
            {trendingContent.map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="no-content">No trending content available</p>
        )}
      </div>
    </div>
  );
};

export default ContentBrowser;