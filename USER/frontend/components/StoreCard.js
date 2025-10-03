// components/StoreCard.js
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function StoreCard({ store, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Jab card screen par dikhe, toh state update karo
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate hone ke baad observer ko hata dein
        }
      },
      { threshold: 0.1 } // 10% dikhne par trigger hoga
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    // Component hatne par cleanup
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      // State ke aadhar par class ko add ya remove karein
      className={`home-store-card ${isVisible ? 'animate-in' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }} // Delay inline style se
    >
      <Image src="/images/store_1.png" alt={store.name} width={200} height={150} />
      <div className="store-name-overlay">
        <span>{store.name}</span>
      </div>
    </div>
  );
}