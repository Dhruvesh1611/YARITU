'use client';
import React from 'react';
import './CelebritySection.css';

const CelebritySection = () => {
  return (
    <div className="celebrity-section">
      {/* <h2 className="celebrity-title">Our Celebrity Fans</h2> */}
      <h2 className="section-title">Worn by <span className="highlight">Celebrities</span></h2>
      <p className="section-subtitle">Trusted by the stars for their most important moments</p>
      <div className="video-container">
        <video controls autoPlay muted loop playsInline>
          <source src="/images/celebrity.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default CelebritySection;
