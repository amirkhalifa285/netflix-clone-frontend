// src/components/ContentCard.jsx
import React from 'react';

const ContentCard = ({ content, onClick }) => {
  const posterUrl = content.posterPath 
    ? `https://image.tmdb.org/t/p/w300${content.posterPath}`
    : '/fallback-poster.jpg';

  return (
    <div className="content-card" onClick={() => onClick(content)}>
      <img src={posterUrl} alt={content.title} />
    </div>
  );
};

export default ContentCard;