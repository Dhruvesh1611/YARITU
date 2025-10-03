'use client';
import React, { useState, useRef, useEffect } from 'react';
import './CelebritySection.css';

const CelebritySection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef(null);

  // Array of videos (you can replace these with different video files)
  const videos = [
    '/images/celebrity.mp4',
    '/images/celebrity.mp4', // Replace with second video
    '/images/celebrity.mp4'  // Replace with third video
  ];

  // Handle video end event
  const handleVideoEnd = () => {
    setCurrentVideo(prev => (prev + 1) % videos.length);
  };

  // Navigate to specific video
  const goToVideo = (index) => {
    setCurrentVideo(index);
  };

  // Navigate to previous video
  const goToPrevious = () => {
    setCurrentVideo(prev => prev === 0 ? videos.length - 1 : prev - 1);
  };

  // Navigate to next video
  const goToNext = () => {
    setCurrentVideo(prev => (prev + 1) % videos.length);
  };

  // Reset video when currentVideo changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentVideo]);

  return (
    <div className="celebrity-section">
      <h2 className="section-title">Worn by <span className="highlight">Celebrities</span></h2>
      <p className="section-subtitle">Trusted by the stars for their most important moments</p>
      
      <div className="video-carousel-container">
        {/* Navigation Arrow - Previous */}
        <button className="video-nav-arrow video-nav-prev" onClick={goToPrevious}>
          &#8249;
        </button>

        <div className="video-container">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            onEnded={handleVideoEnd}
            key={currentVideo} // Force re-render when video changes
          >
            <source src={videos[currentVideo]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Navigation Arrow - Next */}
        <button className="video-nav-arrow video-nav-next" onClick={goToNext}>
          &#8250;
        </button>
      </div>

      {/* Video Indicator Dots */}
      <div className="video-dots">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`video-dot ${index === currentVideo ? 'active' : ''}`}
            onClick={() => goToVideo(index)}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CelebritySection;
