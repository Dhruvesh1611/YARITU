"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './StayClassy.css';

const collectionImages = [
  '/images/Featured1.png', '/images/Trending1.png', '/images/Featured3.png', '/images/reel2.png', '/images/reel3.png',
  '/images/reel4.png', '/images/reel5.png', '/images/store.png', '/images/offer1.png', '/images/offer2.png',
  '/images/offer3.png', '/images/offer4.png', '/images/offer5.png', '/images/hero1.png', '/images/hero2.png',
  '/images/Featured1.png', '/images/Trending1.png', '/images/Featured3.png', '/images/reel2.png', '/images/reel3.png',
  '/images/reel4.png', '/images/reel5.png', '/images/store.png', '/images/offer1.png', '/images/offer2.png'
];

const StayClassy = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const gridRef = useRef(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // We'll leave the automatic flipping on scroll for now,
        // but the button gives manual control.
        if (entry.isIntersecting) {
          setIsFlipped(true);
        } else {
          setIsFlipped(false);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  return (
    <section className="stay-classy-section" ref={gridRef}>
      <div className="stay-classy-grid">
        {Array.from({ length: 25 }).map((_, index) => (
          <div key={index} className="flip-card">
            <div
              className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}
              style={{ transitionDelay: `${isFlipped ? index * 0.05 : (24 - index) * 0.05}s` }}
            >
              <div className="flip-card-front">
                {/* The background image will create the logo */}
              </div>
              <div className="flip-card-back">
                <Image
                  src={collectionImages[index]}
                  alt={`Collection item ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleFlip} className="flip-button">
        {isFlipped ? 'View Logo' : 'View Collection'}
      </button>
    </section>
  );
};

export default StayClassy;
