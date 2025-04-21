// src/components/ContentGallery.jsx
import React from 'react';

const ContentGallery = ({ content }) => {
  // Generate a list of images for the gallery
  // Using backdrop, poster, and episode stills if available
  const generateGalleryImages = () => {
    const images = [];
    
    // Add backdrop if available
    if (content.backdropPath) {
      images.push({
        path: `https://image.tmdb.org/t/p/w500${content.backdropPath}`,
        alt: `${content.title} backdrop`
      });
    }
    
    // Add poster if available
    if (content.posterPath) {
      images.push({
        path: `https://image.tmdb.org/t/p/w500${content.posterPath}`,
        alt: `${content.title} poster`
      });
    }
    
    // Add episode stills if available (for TV shows)
    if (content.type === 'tv' && content.seasons && content.seasons.length > 0) {
      const mainSeason = content.seasons.find(season => season.name !== 'Specials') || content.seasons[0];
      
      if (mainSeason && mainSeason.episodes) {
        // Get up to 3 episodes with still paths
        const episodesWithStills = mainSeason.episodes
          .filter(episode => episode.stillPath)
          .slice(0, 3);
          
        episodesWithStills.forEach(episode => {
          images.push({
            path: `https://image.tmdb.org/t/p/w500${episode.stillPath}`,
            alt: `${content.title} - ${episode.name}`
          });
        });
      }
    }
    
    // Limit to maximum 3 images
    return images.slice(0, 3);
  };
  
  const galleryImages = generateGalleryImages();
  
  return (
    <div className="content-gallery">
      {galleryImages.map((image, index) => (
        <div key={index} className="gallery-image">
          <img src={image.path} alt={image.alt} />
        </div>
      ))}
    </div>
  );
};

export default ContentGallery;