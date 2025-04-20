// src/components/ContentRow.jsx
import React from 'react';
import ContentCard from './ContentCard';

const ContentRow = ({ title, content, onCardClick }) => {
  if (!content || content.length === 0) return null;

  return (
    <div className="content-row">
      <h2>{title}</h2>
      <div className="content-slider">
        {content.map((item) => (
          <ContentCard 
            key={item._id} 
            content={item} 
            onClick={onCardClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default ContentRow;