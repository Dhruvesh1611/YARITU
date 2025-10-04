"use client";
import React, { useRef, useState, useEffect } from 'react';

// Custom video component for review gallery (No changes here)
function VideoReview({ src, className, isPlaying, onPlay, thumbnail }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  
  useEffect(() => {
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
    <div className={className} style={{ position: 'relative', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }} onClick={handlePlay}>
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
        controls={false}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', background: '#222', zIndex: 2 }}
        controlsList="nodownload noremoteplayback nofullscreen noplaybackrate"
        playsInline
        preload="metadata"
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
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="28" fill="#fff" fillOpacity="0.7" /><polygon points="22,18 40,28 22,38" fill="#25384d" /></svg>
      </div>
    </div>
  );
}


export default function Review() {
  const [playingIdx, setPlayingIdx] = useState(null);
  
  const clientReviews = [
    { id: 1, image: 'https://placehold.co/400x560/EAD9C8/4E3629?text=Client+1', alt: 'Client wearing bridal outfit', text: "The craftsmanship and fabric quality exceeded my expectations. The outfit made my pre-wedding shoot truly memorable!", name: 'Aditi Salvi' },
    { id: 2, image: 'https://placehold.co/400x560/D4E2D4/4E3629?text=Client+2', alt: 'Client couple ethnic', text: "We were new to ethnic styling but the staff guided us patiently. Fit was perfect and styling premium.", name: 'David Santucci' },
    { id: 3, image: 'https://placehold.co/400x560/F5DBC1/4E3629?text=Client+3', alt: 'Bridal portrait', text: "Warm hospitality and elite collection. Every outfit felt unique and expressive.", name: 'Shivani Satpute' },
    { id: 4, image: 'https://placehold.co/400x560/C8DCE5/4E3629?text=Client+4', alt: 'Ethnic twirl pose', text: "Loved the vibrant palette and fall of the fabric. Got so many compliments!", name: 'Samruddhi Bora' },
  ];
  
  return (
    <div id="review-page-wrapper">
      <style>{`
        #review-page-wrapper :root {
          --font-heading: 'Garamond', serif;
          --font-body: 'Poppins', sans-serif;
          --color-secondary-text: #666;
          --color-background-light: #fff;
        }
        #review-page-wrapper #reviews {
          position: relative;
          padding-top: 80px;
          padding-bottom: 100px;
          background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 73.85%);
          font-family: var(--font-body);
        }
        
        /* ULTIMATE FIX: Removed the conflicting '.container' class and merged its styles here */
        #review-page-wrapper .reviews-content, 
        #review-page-wrapper .testimonials-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        #review-page-wrapper .reviews-content {
          text-align: center;
        }
        #review-page-wrapper .reviews-title {
          font-family: var(--font-heading);
          font-size: 50px;
          font-weight: 600;
        }
        #review-page-wrapper .reviews-subtitle {
          font-family: var(--font-body);
          font-size: 21px;
          font-weight: 400;
          color: var(--color-secondary-text);
          margin-top: 16px;
        }
        #review-page-wrapper .review-gallery {
          margin-top: 78px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 25px;
          flex-wrap: nowrap;
        }
        #review-page-wrapper .gallery-photo {
          position: relative;
          border-radius: 20px;
          box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.49);
          object-fit: cover;
          transition: transform 0.25s ease, z-index 0.25s ease;
          flex-shrink: 0;
        }
        #review-page-wrapper .gallery-photo:hover {
            transform: translateY(-8px) scale(1.03);
            z-index: 10 !important;
        }
        #review-page-wrapper .photo-1, #review-page-wrapper .photo-5 { width: 212px; height: 310px; }
        #review-page-wrapper .photo-3 { width: 212px; height: 310px; z-index: 5; }
        #review-page-wrapper .photo-2, #review-page-wrapper .photo-4 { width: 244px; height: 387px; }

        #review-page-wrapper #testimonials {
          padding: 80px 0;
          background-color: var(--color-background-light);
          font-family: var(--font-body);
        }
        #review-page-wrapper .testimonials-title {
          text-align: center;
          font-family: var(--font-heading);
          font-size: 48px;
          font-weight: 400;
          margin-bottom: 83px;
        }
        #review-page-wrapper .highlight { color: #b8860b; }
        
        #review-page-wrapper .review-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 29px 20px;
        }

        #review-page-wrapper .testimonial-card {
          border: none;
          border-radius: 20px;
          padding: 0;
          background: transparent;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          overflow: visible;
        }
        #review-page-wrapper .testimonial-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.16);
        }
        #review-page-wrapper .testimonial-card:hover .client-photo { 
            transform: scale(1.04); 
            transition: transform 0.55s ease; 
        }
        #review-page-wrapper .card-content {
          background-color: #fffdf9;
          border: 1px solid #ead9bd;
          border-radius: 18px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        #review-page-wrapper .client-photo-wrap {
          width: 100%;
          overflow: hidden;
          position: relative;
          aspect-ratio: 7 / 10;
          background: #f2f0ed;
        }
        #review-page-wrapper .client-photo {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        #review-page-wrapper .client-review-text {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          color: #222;
          margin: 14px 18px 10px;
          letter-spacing: 0.2px;
        }
        #review-page-wrapper .client-signature {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.4px;
          color: #25384d;
          margin: auto 18px 18px;
          text-transform: uppercase;
        }

        @media (max-width: 1200px) {
          #review-page-wrapper .review-gallery { transform: scale(0.8); transform-origin: top center; }
        }
        @media (max-width: 900px) {
          #review-page-wrapper .review-gallery { transform: scale(0.6); margin-top: -20px; }
        }
        @media (max-width: 600px) {
          #review-page-wrapper .reviews-title { font-size: 36px; }
          #review-page-wrapper .reviews-subtitle { font-size: 18px; }
          #review-page-wrapper .review-gallery {
            flex-wrap: wrap;
            transform: none;
            padding: 0 12px;
            margin-top: 28px;
          }
          #review-page-wrapper .gallery-photo {
            position: relative;
            width: calc(50% - 9px);
            height: auto;
            aspect-ratio: 212 / 310;
          }
          #review-page-wrapper .photo-1, #review-page-wrapper .photo-2, #review-page-wrapper .photo-3, #review-page-wrapper .photo-4, #review-page-wrapper .photo-5 {
            width: calc(50% - 9px);
            height: auto;
          }
        }
        @media (max-width: 1024px) {
          #review-page-wrapper .review-testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          #review-page-wrapper .testimonials-title { font-size: 40px; margin-bottom: 60px; }
        }
        @media (max-width: 768px) {
          #review-page-wrapper #reviews, #review-page-wrapper #testimonials { padding: 60px 0; }
          #review-page-wrapper .review-testimonials-grid { grid-template-columns: 1fr; }
          #review-page-wrapper .testimonials-title { font-size: 32px; margin-bottom: 40px; }
        }
      `}</style>

      <section id="reviews">
        {/* ULTIMATE FIX: Removed the conflicting '.container' class from here */}
        <div className="reviews-content">
          <h2 className="reviews-title">Customer <span className="highlight">Reviews</span></h2>
          <p className="reviews-subtitle">Real experiences from our satisfied customers</p>
          
          <div className="review-gallery">
            {[1, 2, 3, 4, 5].map((num, idx) => (
              <VideoReview
                key={num}
                src={`https://yourdomain.com/images/review${num}.mp4`}
                className={`gallery-photo photo-${num}`}
                isPlaying={playingIdx === idx}
                onPlay={() => setPlayingIdx(idx)}
                thumbnail={`https://placehold.co/244x387/000/fff?text=Video+${num}`}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section id="testimonials">
        {/* ULTIMATE FIX: Replaced '.container' with a new, unique class '.testimonials-container' */}
        <div className="testimonials-container">
          <h2 className="testimonials-title">What Our <span className="highlight">Clients Say</span></h2>
          <div className="review-testimonials-grid">
            {clientReviews.map(review => (
              <div className="testimonial-card" key={review.id}>
                <div className="card-content">
                  <div className="client-photo-wrap">
                    <img 
                      src={review.image} 
                      alt={review.alt} 
                      className="client-photo" 
                    />
                  </div>
                  <p className="client-review-text">{review.text}</p>
                  <p className="client-signature">~ {review.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

