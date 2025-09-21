"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './MultipleOffers.css';

const offers = [
  { id: 1, image: '/images/offer1.png', discount: 'UP TO 50% OFF', category: 'HAUL' },
  { id: 2, image: '/images/offer2.png', discount: 'UP TO 40% OFF', category: 'STYLE' },
  { id: 3, image: '/images/offer3.png', discount: 'UP TO 60% OFF', category: 'LIFE' },
  { id: 4, image: '/images/offer4.png', discount: 'UP TO 30% OFF', category: 'FRESH' },
  { id: 5, image: '/images/offer5.png', discount: 'UP TO 70% OFF', category: 'OOTD' },
];

const MultipleOffers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % offers.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getCardStyle = (index) => {
    const distance = (index - currentIndex + offers.length) % offers.length;
    const isCentered = distance === 2;

    let transform = '';
    let zIndex = 0;
    let filter = 'grayscale(100%)';

    if (isCentered) {
      // Centered card
      transform = 'translateX(0) scale(1.1)';
      zIndex = 5;
      filter = 'grayscale(0%)';
    } else {
      // Side cards
      const side = distance < 2 ? 'left' : 'right';
      const position = side === 'left' ? 2 - distance : distance - 2;
      const xOffset = position * 60; // Adjust spacing
      const scale = 1 - (position * 0.1);
      transform = `translateX(${side === 'left' ? -xOffset : xOffset}%) scale(${scale})`;
      zIndex = 4 - position;
    }

    return {
      transform,
      zIndex,
      filter,
      transition: 'transform 0.5s ease, filter 0.5s ease',
    };
  };

  return (
    <section className="multiple-offers-section">
      <h2 className="section-title">
        Multiple <span className="highlight">Offers</span>
      </h2>
      <div className="offers-container">
        {offers.map((offer, index) => (
          <div key={offer.id} className="offer-card" style={getCardStyle(index)}>
            <Image
              src={offer.image}
              alt={`Offer ${offer.id}`}
              fill
              style={{ objectFit: 'cover' }}
              className="offer-image"
            />
            <div className="offer-details">
              <span className="offer-category">{offer.category}</span>
              <span className="offer-discount">{offer.discount}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MultipleOffers;
