import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import '../styles/ContentModal.css';

const ContentModal = ({ content, onClose }) => {
  const navigate = useNavigate();
  const { addToMyList, removeFromMyList, currentProfile } = useProfile();
  const [isInMyList, setIsInMyList] = useState(false);
  
  const getTrailerItems = () => {
    if (content.type === 'tv' && content.seasons && content.seasons.length > 0) {
      const mainSeason = content.seasons.find(season => season.name !== 'Specials') || content.seasons[0];
      
      if (mainSeason && mainSeason.episodes && mainSeason.episodes.length >= 3) {
        return mainSeason.episodes.slice(0, 3).map(episode => ({
          title: content.title,
          image: episode.stillPath 
            ? `https://image.tmdb.org/t/p/w300${episode.stillPath}`
            : (content.posterPath 
                ? `https://image.tmdb.org/t/p/w300${content.posterPath}`
                : '/fallback-still.jpg')
        }));
      }
    }
    
    // Fallback to content's own images
    return [
      {
        title: content.title,
        image: content.backdropPath 
          ? `https://image.tmdb.org/t/p/w500${content.backdropPath}`
          : '/fallback-backdrop.jpg'
      },
      {
        title: content.title,
        image: content.posterPath 
          ? `https://image.tmdb.org/t/p/w300${content.posterPath}`
          : '/fallback-poster.jpg'
      },
      {
        title: content.title,
        image: content.backdropPath 
          ? `https://image.tmdb.org/t/p/w780${content.backdropPath}`
          : '/fallback-backdrop.jpg'
      }
    ];
  };

  useEffect(() => {
    if (currentProfile && currentProfile.myList && content) {
      const isInList = currentProfile.myList.some(item => item === content._id);
      console.log('Is content in list?', isInList);
      setIsInMyList(isInList);
    }
  }, [currentProfile, content]);

  if (!content) return null;

  const handleAddRemoveMyList = async () => {
    try {
      if (isInMyList) {
        console.log('Removing from My List:', content._id);
        await removeFromMyList(content._id);
        setIsInMyList(false);
      } else {
        console.log('Adding to My List:', content._id);
        await addToMyList(content._id);
        setIsInMyList(true);
      }
    } catch (error) {
      console.error('Failed to update My List:', error);
    }
  };

  const handleReviewClick = () => {
    navigate(`/review/${content._id}`, {
      state: { content }
    });
  };

  const backdropUrl = content.backdropPath 
    ? `https://image.tmdb.org/t/p/original${content.backdropPath}`
    : '/fallback-backdrop.jpg';

  // Format runtime for episodes
  const formatRuntime = (minutes) => {
    if (!minutes) return '52m'; 
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${remainingMinutes}m`;
  };

  // Get episodes for TV shows
  const getEpisodes = () => {
    if (content.type !== 'tv' || !content.seasons || content.seasons.length === 0) {
      return [];
    }

    const mainSeason = content.seasons.find(season => season.name !== 'Specials') || content.seasons[0];
    
    if (!mainSeason || !mainSeason.episodes) {
      return [];
    }

    // Return first 8 episodes
    return mainSeason.episodes.slice(0, 8);
  };

  const episodes = getEpisodes();
  const trailerItems = getTrailerItems();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* Banner Image */}
        <div className="modal-banner" style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="banner-gradient"></div>
          <div className="banner-content">
            <h1 className="content-title">{content.title}</h1>
            <div className="banner-actions">
              <button className="review-button" onClick={handleReviewClick}>
                <span className="play-icon">▶</span>
                Review
              </button>
              <button 
                className="add-button" 
                onClick={handleAddRemoveMyList}
                title={isInMyList ? "Remove from My List" : "Add to My List"}
              >
                {isInMyList ? '✓' : '+'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Info */}
        <div className="content-info">
          <div className="content-meta">
            <span className="match">Match {Math.floor(content.voteAverage * 10)}%</span>
            <span className="year">{new Date(content.releaseDate).getFullYear()}</span>
            <span className="runtime">{formatRuntime(content.runtime)}</span>
            <span className="quality">HD</span>
          </div>
          <p className="content-overview">{content.overview}</p>
        </div>
        
        {/* Episodes (for TV shows) */}
        {content.type === 'tv' && episodes.length > 0 && (
          <div className="episodes-section">
            <div className="episodes-list">
              {episodes.map((episode, index) => (
                <div key={episode.id || `episode-${index}`} className="episode-item">
                  <div className="episode-number">{episode.episodeNumber}</div>
                  <div className="episode-thumbnail">
                    <img 
                      src={episode.stillPath 
                        ? `https://image.tmdb.org/t/p/w300${episode.stillPath}`
                        : '/fallback-still.jpg'
                      } 
                      alt={episode.name} 
                    />
                    <div className="play-overlay">▶</div>
                  </div>
                  <div className="episode-info">
                    <div className="episode-header">
                      <h3 className="episode-title">{episode.name}</h3>
                      <span className="episode-runtime">{formatRuntime(content.runtime || 45)}</span>
                    </div>
                    <p className="episode-description">{episode.overview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Trailers & More */}
        <div className="trailers-section">
          <h2 className="section-title">Trailers & More</h2>
          <div className="trailers-grid">
            {trailerItems.map((item, index) => (
              <div key={`trailer-${index}`} className="trailer-item">
                <div className="trailer-thumbnail">
                  <img src={item.image} alt={`${item.title} trailer`} />
                </div>
                <p className="trailer-title">Season 1 Trailer 1: {item.title}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* About Section */}
        <div className="about-section">
          <h2 className="section-title">About {content.title}</h2>
          <div className="about-details">
            <div className="detail-item">
              <span className="detail-label">Director:</span>
              <span className="detail-value">
                {content.crew && content.crew.find(person => person.job === 'Director')?.name || 'Dave Boyle'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cast:</span>
              <span className="detail-value">
                {content.cast && content.cast.length > 0
                  ? content.cast.map(person => person.name).join(', ')
                  : 'No cast information available'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Genres:</span>
              <span className="detail-value">
                {content.genres && content.genres.length > 0
                  ? content.genres.map(genre => genre.name).join(', ')
                  : 'No genre information available'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">This show is:</span>
              <span className="detail-value">
                {content.keywords && content.keywords.length > 0
                  ? content.keywords.slice(0, 3).map(keyword => keyword.name).join(', ')
                  : 'Dark, Suspenseful, Exciting'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Maturity rating:</span>
              <span className="detail-value">
                <span className="maturity-badge">TV-MA</span> smoking, violence &nbsp;&nbsp;For Mature Audiences.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;