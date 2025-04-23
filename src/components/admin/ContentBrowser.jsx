import React, { useState, useEffect, useCallback } from 'react';
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
  const [statusMessage, setStatusMessage] = useState('');

  const fetchTrendingContent = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setStatusMessage('');
      
      const response = await adminService.getTrendingContent(contentType);
      
      if (response.success) {
        setTrendingContent(response.data || []);
        
        if (response.message) {
          setStatusMessage(response.message);
        } else if (response.total === 0) {
          setStatusMessage('No new content available to add.');
        } else {
          setStatusMessage(`Showing ${response.displayed} of ${response.total} new ${contentType === 'movie' ? 'movies' : 'TV shows'} not in your database.`);
        }
      } else {
        setError('Failed to fetch trending content');
      }
    } catch (err) {
      console.error('Error fetching trending content:', err);
      setError('Error fetching trending content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [contentType]); // Include contentType as dependency

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    fetchTrendingContent();
  }, [fetchTrendingContent]); // fetchTrendingContent is now properly included

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      setSearching(true);
      setError('');
      setStatusMessage('');
      
      const response = await adminService.searchContent(searchQuery, contentType);
      
      if (response.success) {
        setSearchResults(response.data || []);
        
        // Set status message based on results
        if (response.message) {
          setStatusMessage(response.message);
        } else if (response.total === 0) {
          setStatusMessage(`No new results found for "${searchQuery}".`);
        } else {
          setStatusMessage(`Found ${response.displayed} new ${contentType === 'movie' ? 'movies' : 'TV shows'} for "${searchQuery}" that aren't in your database.`);
        }
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
        
        // Remove the added content from the display lists
        setTrendingContent(prevContent => 
          prevContent.filter(item => item.id !== tmdbId)
        );
        setSearchResults(prevResults => 
          prevResults.filter(item => item.id !== tmdbId)
        );
        
        // Update status message if no more content is left
        if (searchResults.length === 1 && searchResults[0].id === tmdbId) {
          setStatusMessage('All search results have been added to your database.');
        } else if (trendingContent.length === 1 && trendingContent[0].id === tmdbId && searchResults.length === 0) {
          setStatusMessage('All trending content has been added to your database.');
        }
        
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

  const AdminContentCard = ({ item }) => (
    <div className="admin-content-card">
      <div className="admin-content-poster">
        <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} />
      </div>
      <div className="admin-content-info">
        <h3 className="admin-content-title">{item.title || item.name}</h3>
        <p className="admin-release-date">
          {formatDate(item.release_date || item.first_air_date)}
        </p>
        <p className="admin-overview">{item.overview?.substring(0, 150)}...</p>
        <button 
          className="admin-add-button"
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
      <h2>Browse & Add New Content</h2>
      
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
            placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV shows'} to add...`}
          />
          <button type="submit" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      
      {statusMessage && (
        <div className="admin-status-message">
          {statusMessage}
        </div>
      )}
      
      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="admin-content-section">
          <h3>Search Results - New Content to Add</h3>
          <div className="admin-content-grid">
            {searchResults.map(item => (
              <AdminContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      
      {/* Trending Content Section */}
      <div className="admin-content-section">
        <h3>
          {searching ? 'Trending Content' : `New Trending ${contentType === 'movie' ? 'Movies' : 'TV Shows'} to Add`}
        </h3>
        
        {loading ? (
          <div className="loading">Loading trending content...</div>
        ) : trendingContent.length > 0 ? (
          <div className="admin-content-grid">
            {trendingContent.map(item => (
              <AdminContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="no-content">
            {statusMessage || 'No new trending content available to add.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentBrowser;