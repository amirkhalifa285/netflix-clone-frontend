import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon, Bell, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { useProfile } from '../contexts/ProfileContext';
import contentService from '../services/contentService';

const SearchContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  background-color: #141414;
`;

const BrowseSection = styled.div`
  margin-top: 60px;
`;

const BrowseTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const PreferencesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const PreferenceLabel = styled.span`
  color: #fff;
  font-size: 1rem;
`;

const DropdownContainer = styled.div`
  position: relative;
  min-width: 150px;
  z-index: 3;
`;

const DropdownButton = styled.button`
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #000;
  border: 1px solid #fff;
  border-top: none;
  z-index: 4;
  display: ${props => props.isopen ? 'block' : 'none'};
  max-height: 300px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 8px 16px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  min-width: 200px;
  flex-grow: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px 8px 40px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.875rem;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: white;
  }

  &::placeholder {
    color: #999;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 32px 48px;
  position: relative;
  z-index: 1;
`;

const NoResults = styled.div`
  color: #fff;
  text-align: center;
  padding: 40px;
  font-size: 18px;
`;

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

      if (moviesResponse.success && tvResponse.success) {
        // Combine all content from different categories
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

        // Remove duplicates by ID
        const uniqueContent = [...allMovies, ...allTVShows].reduce((acc, current) => {
          const id = current._id || current.tmdbId;
          if (!acc.find(item => (item._id || item.tmdbId) === id)) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        console.log('Combined content count:', uniqueContent.length);
        
        if (uniqueContent.length === 0) {
          setError('No content available. Please try again later.');
        } else {
          setAllContent(uniqueContent);
          
          // Extract unique genres
          const genres = new Set(['All Genres']);
          uniqueContent.forEach(item => {
            if (item.genres) {
              item.genres.forEach(g => genres.add(g.name));
            }
          });
          setAvailableGenres(Array.from(genres));
        }
      } else {
        console.error('Invalid response:', { moviesResponse, tvResponse });
        setError('Failed to load content. Please try again later.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    if (!allContent) return [];

    let filtered = [...allContent];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (genre !== 'All Genres') {
      filtered = filtered.filter(item => 
        item.genres && 
        Array.isArray(item.genres) && 
        item.genres.some(g => g.name === genre)
      );
    }

    // Filter by language
    const languageMap = {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Italian': 'it',
      'Japanese': 'ja',
      'Korean': 'ko'
    };
    
    if (displayLanguage !== 'All Languages') {
      filtered = filtered.filter(item => 
        item.original_language === languageMap[displayLanguage]
      );
    }

    // Sort content
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
      return <NoResults>Loading...</NoResults>;
    }

    if (error) {
      return <NoResults>{error}</NoResults>;
    }

    const filteredContent = filterContent();

    if (filteredContent.length === 0) {
      return <NoResults>No titles found for the selected filters</NoResults>;
    }

    return (
      <ContentGrid>
        {filteredContent.map((content) => (
          <ContentCard 
            key={content._id || content.tmdbId}
            content={content}
            onClick={() => console.log('Clicked:', content)}
          />
        ))}
      </ContentGrid>
    );
  };

  return (
    <>
      <Header />
      <SearchContainer>
        <BrowseSection>
          <BrowseTitle>Browse</BrowseTitle>
          <PreferencesRow>
            <PreferenceLabel>Select Your Preferences</PreferenceLabel>
            
            <DropdownContainer>
              <DropdownButton onClick={() => handleDropdownClick('genre')}>
                <span>{genre}</span>
                <ChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu isopen={openDropdown === 'genre' ? 'true' : undefined}>
                {availableGenres.map((g) => (
                  <DropdownItem key={g} onClick={() => handleOptionSelect(g, setGenre)}>
                    {g}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </DropdownContainer>

            <DropdownContainer>
              <DropdownButton onClick={() => handleDropdownClick('language')}>
                <span>{displayLanguage}</span>
                <ChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu isopen={openDropdown === 'language' ? 'true' : undefined}>
                {languages.map((lang) => (
                  <DropdownItem key={lang} onClick={() => handleOptionSelect(lang, setDisplayLanguage)}>
                    {lang}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </DropdownContainer>

            <PreferenceLabel>Sort by</PreferenceLabel>
            
            <DropdownContainer>
              <DropdownButton onClick={() => handleDropdownClick('sort')}>
                <span>{sortBy}</span>
                <ChevronDown size={16} />
              </DropdownButton>
              <DropdownMenu isopen={openDropdown === 'sort' ? 'true' : undefined}>
                {sortOptions.map((option) => (
                  <DropdownItem key={option} onClick={() => handleOptionSelect(option, setSortBy)}>
                    {option}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </DropdownContainer>

            <SearchInputContainer>
              <SearchIconWrapper>
                <SearchIcon size={16} color="#999" />
              </SearchIconWrapper>
              <SearchInput
                type="text"
                placeholder="Search titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInputContainer>
          </PreferencesRow>
        </BrowseSection>

        {renderContent()}
      </SearchContainer>
    </>
  );
};

export default SearchPage;
