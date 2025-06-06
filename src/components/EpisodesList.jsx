import React from 'react';

const EpisodesList = ({ content, limit = 8 }) => {
  if (content.type !== 'tv' || !content.seasons || content.seasons.length === 0) {
    return null;
  }
  
  const mainSeason = content.seasons.find(season => season.name !== 'Specials') || content.seasons[0];
  
  if (!mainSeason || !mainSeason.episodes || mainSeason.episodes.length === 0) {
    return null;
  }
  
  const episodes = mainSeason.episodes.slice(0, limit);
  
  const formatRuntime = (minutes) => {
    if (!minutes) return '30m';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${remainingMinutes}m`;
  };
  
  return (
    <div className="episodes-section">
      <h3>Episodes</h3>
      <div className="episodes-list">
        {episodes.map((episode) => (
          <div key={episode.id || episode._id} className="episode-item">
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
                <h4>{episode.name}</h4>
                <span className="episode-runtime">
                  {formatRuntime(content.runtime || 30)}
                </span>
              </div>
              <p className="episode-overview">{episode.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodesList;