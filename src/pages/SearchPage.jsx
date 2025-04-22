import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon, Bell, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('All Genres');
  const [displayLanguage, setDisplayLanguage] = useState('All Languages');
  const [sortBy, setSortBy] = useState('Suggestions For You');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableGenres, setAvailableGenres] = useState(['All Genres']);
  const { currentProfile } = useProfile();

  const languages = ['All Languages', 'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean'];
  const sortOptions = ['Suggestions For You', 'Year', 'Rating', 'Title'];

  useEffect(() => {
    if (!currentProfile) return;
    fetchInitialContent();
  }, [currentProfile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        filterContent();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchInitialContent = async () => {
    try {
      setLoading(true);
      setError('');

      // Get movies
      const moviesResponse = await contentService.getAllMovieContent();
      console.log('Movies response:', moviesResponse);

      // Get TV shows
      const tvResponse = await contentService.getAllTVContent();
      console.log('TV response:', tvResponse);

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content. Please try again later.');
      setLoading(false);
    }
  };

  const filterContent = () => {
    if (!allContent) return [];

    let filtered = [...allContent];

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

    return filtered;
  };

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleOptionSelect = (option, setter) => {
    setter(option);
    setOpenDropdown(null);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="search-page-no-results">Loading...</div>;
    }

    if (error) {
      return <div className="search-page-no-results">{error}</div>;
    }

    const filteredContent = filterContent();

    if (filteredContent.length === 0) {
      return <div className="search-page-no-results">No titles found for the selected filters</div>;
    }

    return (
      <div className="search-page-content-grid">
        {filteredContent.map((content) => (
          <ContentCard 
            key={content._id || content.tmdbId}
            content={content}
            onClick={() => console.log('Clicked:', content)}
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
                <ChevronDown size={16} />
              </button>
              <div className={`search-page-dropdown-menu ${openDropdown === 'genre' ? 'open' : 'closed'}`}>
                {availableGenres.map((g) => (
                  <div 
                    key={g} 
                    className="search-page-dropdown-item"
                    onClick={() => handleOptionSelect(g, setGenre)}
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>

            <div className="search-page-dropdown-container">
              <button className="search-page-dropdown-button" onClick={() => handleDropdownClick('language')}>
                <span>{displayLanguage}</span>
                <ChevronDown size={16} />
              </button>
              <div className={`search-page-dropdown-menu ${openDropdown === 'language' ? 'open' : 'closed'}`}>
                {languages.map((lang) => (
                  <div 
                    key={lang} 
                    className="search-page-dropdown-item"
                    onClick={() => handleOptionSelect(lang, setDisplayLanguage)}
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
                <ChevronDown size={16} />
              </button>
              <div className={`search-page-dropdown-menu ${openDropdown === 'sort' ? 'open' : 'closed'}`}>
                {sortOptions.map((option) => (
                  <div 
                    key={option} 
                    className="search-page-dropdown-item"
                    onClick={() => handleOptionSelect(option, setSortBy)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="search-page-search-input-container">
              <div className="search-page-search-icon-wrapper">
                <SearchIcon size={16} color="#999" />
              </div>
              <input
                className="search-page-search-input"
                type="text"
                placeholder="Search titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </>
  );
};

export default SearchPage;
