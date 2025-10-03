
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
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="28" fill="#fff" fillOpacity="0.7" /><polygon points="22,18 40,28 22,38" fill="#25384d" /></svg>
      </div>
    </div>
  );
}


export default function Review() {
  const [playingIdx, setPlayingIdx] = useState(null);
  const clientReviews = [
    {
      id: 1,
      image: '/images/Rectangle 4.png',
      alt: 'Client wearing bridal outfit',
      text: "The craftsmanship and fabric quality exceeded my expectations. The outfit made my pre-wedding shoot truly memorable!",
      name: 'Aditi Salvi'
    },
    {
      id: 2,
      image: '/images/Rectangle 4.png',
      alt: 'Client couple ethnic',
      text: "We were new to ethnic styling but the staff guided us patiently. Fit was perfect and styling premium.",
      name: 'David Santucci'
    },
    {
      id: 3,
      image: '/images/Rectangle 4.png',
      alt: 'Bridal portrait',
      text: "Warm hospitality and elite collection. Every outfit felt unique and expressive.",
      name: 'Shivani Satpute'
    },
    {
      id: 4,
      image: '/images/Rectangle 4.png',
      alt: 'Ethnic twirl pose',
      text: "Loved the vibrant palette and fall of the fabric. Got so many compliments!",
      name: 'Samruddhi Bora'
    },
    {
      id: 5,
      image: '/images/Rectangle 4.png',
      alt: 'Outdoor portrait',
      text: "Impressed by finishing and timely delivery. Highly recommended for curated luxury wear.",
      name: 'Rohan Khanna'
    },
    {
      id: 6,
      image: '/images/Rectangle 4.png',
      alt: 'Engagement look',
      text: "Perfect balance of tradition and modern detailing. Styling session was super helpful.",
      name: 'Meera Shah'
    },
    {
      id: 7,
      image: '/images/Rectangle 4.png',
      alt: 'Pastel ensemble',
      text: "Elegant silhouettes and refined embroidery work. The drape was immaculate.",
      name: 'Neha Verma'
    },
    {
      id: 8,
      image: '/images/Rectangle 4.png',
      alt: 'Wedding celebration pose',
      text: "Fabrics felt luxurious and movement was effortless. My go-to brand now.",
      name: 'Arjun Malhotra'
    }
  ];
  return (
    <>
      <section id="reviews">
        <div className="reviews-background">
          <div className="container reviews-content">
            <h2 className="reviews-title">Customer <span className="highlight">Reviews</span></h2>
            <p className="reviews-subtitle">Real experiences from our satisfied customers</p>
            
            <div className="review-gallery">
              {[1, 2, 3, 4, 5].map((num, idx) => (
                <VideoReview
                  key={num}
                  src={`/images/review${num}.mp4`}
                  className={`gallery-photo photo-${num}`}
                  // Width aur Height yahan se hata diya
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
            {clientReviews.map(review => (
              <div className="testimonial-card" key={review.id}>
                <div className="card-content client-review-card">
                  <div className="client-photo-wrap">
                    <Image 
                      src={review.image} 
                      alt={review.alt} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="client-photo" 
                      priority={review.id <= 4}
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
    </>
  );
}
