import React from 'react';

const ContentGallery = ({ content }) => {
  const generateGalleryImages = () => {
    const images = [];
    
    // Add backdrop if available
    if (content.backdropPath) {
      images.push({
        path: `https://image.tmdb.org/t/p/w500${content.backdropPath}`,
        alt: `${content.title} backdrop`
      });
    }
    
    if (content.posterPath) {
      images.push({
        path: `https://image.tmdb.org/t/p/w500${content.posterPath}`,
        alt: `${content.title} poster`
      });
    }
    
    if (content.type === 'tv' && content.seasons && content.seasons.length > 0) {
      const mainSeason = content.seasons.find(season => season.name !== 'Specials') || content.seasons[0];
      
      if (mainSeason && mainSeason.episodes) {
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