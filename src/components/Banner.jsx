import React from 'react';

const Banner = ({ content, onMoreInfo }) => {
  if (!content) return null;

  const backdropUrl = content.backdropPath 
    ? `https://image.tmdb.org/t/p/original${content.backdropPath}`
    : null;

  return (
    <div 
      className="banner" 
      style={{ 
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'linear-gradient(to bottom, #111, #000)'
      }}
    >
      <div className="banner-content">
        <h1>{content.title}</h1>
        <p>{content.overview}</p>
        <button className="more-info-btn" onClick={() => onMoreInfo(content)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2"/>
            <path d="M12 7V17" stroke="white" strokeWidth="2"/>
            <path d="M7 12H17" stroke="white" strokeWidth="2"/>
          </svg>
          More Info
        </button>
      </div>
    </div>
  );
};

export default Banner;