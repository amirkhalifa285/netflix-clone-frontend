import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/SearchPage.css';

// SVG Icons as components
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM14.3623 15.8506C12.9006 17.7649 10.5945 19 8 19C3.58172 19 0 15.4183 0 11C0 6.58172 3.58172 3 8 3C12.4183 3 16 6.58172 16 11C16 12.1076 15.7749 13.1626 15.368 14.1218L24.0022 19.1352L22.9979 20.8648L14.3623 15.8506Z" fill="#999"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('All Genres');
  const [displayLanguage, setDisplayLanguage] = useState('All Languages');
  const [sortBy, setSortBy] = useState('Suggestions For You');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [initialContent, setInitialContent] = useState([]); // Store initial content for resets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableGenres, setAvailableGenres] = useState(['All Genres']);
  const [availableLanguages, setAvailableLanguages] = useState(['All Languages']);
  const [isSearching, setIsSearching] = useState(false);
  const { currentProfile } = useProfile();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  
  // Use refs to track previous filter values to prevent infinite loops
  const prevFiltersRef = useRef({ searchTerm, genre, displayLanguage, sortBy });

  const sortOptions = ['Suggestions For You', 'Year', 'Rating', 'Title'];

  // Check if all filters are at default values
  const allFiltersDefault = useCallback(() => {
    return (
      searchTerm === '' && 
      genre === 'All Genres' && 
      displayLanguage === 'All Languages' && 
      sortBy === 'Suggestions For You'
    );
  }, [searchTerm, genre, displayLanguage, sortBy]);

  // Fetch initial browse data - using useCallback to fix dependency warning
  const fetchBrowseData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Get browse data with content and filter options
      const browseResponse = await contentService.getBrowseContent();
      
      if (!browseResponse.success) {
        throw new Error('Failed to fetch content');
      }
      
      // Set filter options from API response
      setAvailableGenres(browseResponse.data.availableGenres || ['All Genres']);
      setAvailableLanguages(browseResponse.data.availableLanguages || ['All Languages']);
      
      // Set initial content and keep a copy for resets
      setAllContent(browseResponse.data.content || []);
      setInitialContent(browseResponse.data.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching browse content:', error);
      setError('Failed to load content. Please try again later.');
      setLoading(false);
      
      // Fallback to existing method if the new API fails
      fallbackToLegacyFetch();
    }
  }, []);

  // Fetch when profile changes
  useEffect(() => {
    if (!currentProfile) return;
    fetchBrowseData();
  }, [currentProfile, fetchBrowseData]);

  // Fallback to the old method of fetching content if the new API fails
  const fallbackToLegacyFetch = async () => {
    try {
      setLoading(true);
      
      // Get movies
      const moviesResponse = await contentService.getAllMovieContent();
      
      // Get TV shows
      const tvResponse = await contentService.getAllTVContent();

      if (!moviesResponse.success || !tvResponse.success) {
        throw new Error('Failed to fetch content');
      }

      // Combine all content
      const allMovies = [
        ...(moviesResponse.data.newest || []),
        ...(moviesResponse.data.featured || []),
        ...(moviesResponse.data.popular || []),
        ...(moviesResponse.data.mostReviewed || []),
        ...(moviesResponse.data.highestRated || [])
      ];

      const allTVShows = [
        ...(tvResponse.data.newest || []),
        ...(tvResponse.data.featured || []),
        ...(tvResponse.data.popular || []),
        ...(tvResponse.data.mostReviewed || []),
        ...(tvResponse.data.highestRated || [])
      ];

      // Remove duplicates based on _id or tmdbId
      const uniqueContent = [...new Map([...allMovies, ...allTVShows].map(item => [item._id || item.tmdbId, item])).values()];

      // Extract unique genres
      const genres = new Set(['All Genres']);
      uniqueContent.forEach(content => {
        if (Array.isArray(content.genres)) {
          content.genres.forEach(genre => {
            if (typeof genre === 'string') {
              genres.add(genre);
            } else if (genre && genre.name) {
              genres.add(genre.name);
            }
          });
        }
      });

      setAvailableGenres([...genres]);
      setAllContent(uniqueContent);
      setInitialContent(uniqueContent); // Store for resets
      setLoading(false);
    } catch (error) {
      console.error('Error in fallback content fetch:', error);
      setError('Failed to load content. Please try again later.');
      setLoading(false);
    }
  };

  // Fallback method that filters content on the client side - Define it before it's used
  const fallbackToClientFiltering = useCallback(() => {
    // If all filters are default, reset to initial content
    if (allFiltersDefault()) {
      setAllContent(initialContent);
      return;
    }
    
    // This method is only used if the server-side search fails
    let filtered = [...initialContent]; // Start from the full set

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchLower) ||
        (content.overview && content.overview.toLowerCase().includes(searchLower))
      );
    }

    // Apply genre filter
    if (genre !== 'All Genres') {
      filtered = filtered.filter(content => {
        if (!content.genres) return false;
        
        // Handle array of strings
        if (Array.isArray(content.genres) && typeof content.genres[0] === 'string') {
          return content.genres.includes(genre);
        }
        
        // Handle array of objects with name property
        if (Array.isArray(content.genres) && typeof content.genres[0] === 'object') {
          return content.genres.some(g => g.name === genre);
        }
        
        return false;
      });
    }

    // Apply language filter
    if (displayLanguage !== 'All Languages') {
      filtered = filtered.filter(content => 
        content.original_language && 
        content.original_language.toLowerCase() === displayLanguage.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'Year':
        filtered.sort((a, b) => {
          const dateA = new Date(a.releaseDate || a.first_air_date);
          const dateB = new Date(b.releaseDate || b.first_air_date);
          return dateB - dateA;
        });
        break;
      case 'Rating':
        filtered.sort((a, b) => b.voteAverage - a.voteAverage);
        break;
      case 'Title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep default order for 'Suggestions For You'
        break;
    }

    setAllContent(filtered);
  }, [searchTerm, genre, displayLanguage, sortBy, initialContent, allFiltersDefault]);

  // Handle search with server-side filtering
  const handleSearch = useCallback(async () => {
    // Skip if we're already searching
    if (isSearching) return;
    
    try {
      setIsSearching(true);
      setLoading(true);
      
      // If all filters are default, reset to initial content
      if (allFiltersDefault()) {
        console.log('All filters default, resetting to initial content');
        setAllContent(initialContent);
        setLoading(false);
        setIsSearching(false);
        prevFiltersRef.current = { searchTerm, genre, displayLanguage, sortBy };
        return;
      }
      
      // Call the search endpoint with all current filters
      const response = await contentService.searchContent({
        searchTerm,
        genre,
        language: displayLanguage,
        sortBy
      });
      
      if (response.success) {
        setAllContent(response.data || []);
      } else {
        // If the API call fails, fall back to client-side filtering
        fallbackToClientFiltering();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      // Fall back to client-side filtering if the API call fails
      fallbackToClientFiltering();
      setLoading(false);
    } finally {
      // Update the ref with current filter values
      prevFiltersRef.current = { searchTerm, genre, displayLanguage, sortBy };
      setIsSearching(false);
    }
  }, [searchTerm, genre, displayLanguage, sortBy, isSearching, initialContent, allFiltersDefault, fallbackToClientFiltering]);

  // Handle search term changes with debounce
  useEffect(() => {
    // Check if filters have actually changed to prevent unnecessary searches
    const prevFilters = prevFiltersRef.current;
    const filtersChanged = 
      prevFilters.searchTerm !== searchTerm ||
      prevFilters.genre !== genre ||
      prevFilters.displayLanguage !== displayLanguage ||
      prevFilters.sortBy !== sortBy;
    
    // Only search if filters have changed and we're not already searching
    if (!filtersChanged || isSearching) return;
    
    const timer = setTimeout(() => {
      // This will trigger for both filter activation and reset
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, genre, displayLanguage, sortBy, isSearching, handleSearch]);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle genre selection
  const handleGenreSelect = (selectedGenre) => {
    setGenre(selectedGenre);
    setOpenDropdown(null);
  };

  // Handle language selection
  const handleLanguageSelect = (selectedLanguage) => {
    setDisplayLanguage(selectedLanguage);
    setOpenDropdown(null);
  };

  // Handle sort option selection
  const handleSortSelect = (selectedSort) => {
    setSortBy(selectedSort);
    setOpenDropdown(null);
  };

  const handleContentClick = async (content) => {
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
        document.body.style.overflow = 'hidden';
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

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const renderContent = () => {
    if (loading && !showModal) {
      return <div className="search-page-no-results">Loading...</div>;
    }

    if (error) {
      return <div className="search-page-no-results">{error}</div>;
    }

    if (allContent.length === 0) {
      return <div className="search-page-no-results">No titles found for the selected filters</div>;
    }

    return (
      <div className="search-page-content-grid">
        {allContent.map((content) => (
          <ContentCard 
            key={content._id || content.tmdbId}
            content={content}
            onClick={handleContentClick}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="search-page-container">
        <div className="search-page-browse-section">
          <h1 className="search-page-browse-title">Browse</h1>
          <div className="search-page-preferences-row">
            <span className="search-page-preference-label">Select Your Preferences</span>
            
            <div className="search-page-dropdown-container">
              <button className="search-page-dropdown-button" onClick={() => handleDropdownClick('genre')}>
                <span>{genre}</span>
                <ChevronDownIcon />
              </button>
              <div className={`search-page-dropdown-menu ${openDropdown === 'genre' ? 'open' : 'closed'}`}>
                {availableGenres.map((g) => (
                  <div 
                    key={g} 
                    className="search-page-dropdown-item"
                    onClick={() => handleGenreSelect(g)}
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>

            <div className="search-page-dropdown-container">
              <button className="search-page-dropdown-button" onClick={() => handleDropdownClick('language')}>
                <span>{displayLanguage}</span>
                <ChevronDownIcon />
              </button>
              <div className={`search-page-dropdown-menu ${openDropdown === 'language' ? 'open' : 'closed'}`}>
                {availableLanguages.map((lang) => (
                  <div 
                    key={lang} 
                    className="search-page-dropdown-item"
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <span className="search-page-preference-label">Sort by</span>
            
            <div className="search-page-dropdown-container">
              <button className="search-page-dropdown-button" onClick={() => handleDropdownClick('sort')}>
                <span>{sortBy}</span>
                <ChevronDownIcon />
              </button>
              <div className={`search-page-dropdown-menu ${openDropdown === 'sort' ? 'open' : 'closed'}`}>
                {sortOptions.map((option) => (
                  <div 
                    key={option} 
                    className="search-page-dropdown-item"
                    onClick={() => handleSortSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="search-page-search-input-container">
              <div className="search-page-search-icon-wrapper">
                <SearchIcon />
              </div>
              <input
                className="search-page-search-input"
                type="text"
                placeholder="Search titles..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Content Modal */}
      {showModal && selectedContent && (
        <ContentModal 
          content={selectedContent}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default SearchPage;