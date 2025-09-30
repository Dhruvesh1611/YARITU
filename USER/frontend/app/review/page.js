
"use client";
"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import './review.css';

// Custom video component for review gallery


function VideoReview({ src, className, width, height, isPlaying, onPlay, thumbnail }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  // Pause video if not playing
  React.useEffect(() => {
    if (!isPlaying && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (overlayRef.current) overlayRef.current.style.display = 'flex';
    }
  }, [isPlaying]);
  const handlePlay = () => {
    if (videoRef.current) {
      onPlay();
      videoRef.current.play();
      if (overlayRef.current) overlayRef.current.style.display = 'none';
    }
  };
  return (
    <div className={className} style={{ position: 'relative', width, height, cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }} onClick={handlePlay}>
      {/* Show thumbnail when not playing */}
      {!isPlaying && thumbnail && (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
        />
      )}
      <video
        ref={videoRef}
        src={src}
        width={width}
        height={height}
        controls={false}
        style={{ display: 'block', width: '100%', height: '100%', background: '#222', zIndex: 2 }}
        controlsList="nodownload noremoteplayback nofullscreen noplaybackrate"
      />
      <div ref={overlayRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.25)',
        display: isPlaying ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        pointerEvents: 'none',
      }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="28" fill="#fff" fillOpacity="0.7"/><polygon points="22,18 40,28 22,38" fill="#25384d"/></svg>
      </div>
    </div>
  );
}


export default function Review() {
  const [playingIdx, setPlayingIdx] = useState(null);
  return (
    <>
      <section id="reviews">
        <div className="reviews-background">
          <div className="container reviews-content">
            <h2 className="reviews-title">Customer <span className="highlight">review</span></h2>
            <p className="reviews-subtitle">Real experiences from our satisfied customers</p>
            <div className="review-gallery">
              {[1,2,3,4,5].map((num, idx) => (
                <VideoReview
                  key={num}
                  src={`/images/review${num}.mp4`}
                  className={`gallery-photo photo-${num}`}
                  width={idx % 2 === 1 ? 244 : 212}
                  height={idx % 2 === 1 ? 387 : 310}
                  isPlaying={playingIdx === idx}
                  onPlay={() => setPlayingIdx(idx)}
                  thumbnail={`/images/review${num}.jpg`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Global WhatsApp button is provided in app/layout.js */}
      </section>
      <section id="testimonials">
        <div className="container">
          <h2 className="testimonials-title">What Our <span className="highlight">Clients Say</span></h2>
          <div className="testimonial-grid">
            {[...Array(8)].map((_, i) => (
              <div className="testimonial-card" key={i}>
                <div className="card-content">
                  {i === 0 && <p className="card-text">text</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
