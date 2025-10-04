// app/page.js
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './home.css';

// Components
import MultipleOffers from '../components/MultipleOffers';
import StayClassy from '../components/StayClassy';
import CelebritySection from '../components/CelebritySection';
import TestimonialsSlider from '../components/TestimonialsSlider';
import ImageSlider from '../components/ImageSlider';
import HowItWorks from '../components/HowItWorks';
import StoreCard from '../components/StoreCard'; // Naya StoreCard component import karein

const stores = [
  { id: 1, name: 'Yogichowk, Surat' }, { id: 2, name: 'Varachha, Surat' },
  { id: 3, name: 'Katargam, Surat' }, { id: 4, name: 'Adajan, Surat' },
  { id: 5, name: 'Piplod, Surat' }, { id: 6, name: 'Jamnagar Main' },
  { id: 7, name: 'Jaipur Central' }, { id: 8, name: 'Ahmedabad One' },
  { id: 9, name: 'SG Highway, Ahmedabad' }, { id: 10, name: 'Navrangpura, Ahmedabad' },
  { id: 11, name: 'Bapunagar, Ahmedabad' }, { id: 12, name: 'Maninagar, Ahmedabad' },
  { id: 13, name: 'Chandkheda, Ahmedabad' }, { id: 14, name: 'Satellite, Ahmedabad' },
  { id: 15, name: 'Vastrapur, Ahmedabad' },
];

const heroImages = [
  '/images/hero1.png',
  '/images/hero2.png',
  '/images/offer1.png'
];

export default function Home() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  
  // Elements ko access karne ke liye Refs
  const trendingContainerRef = useRef(null);
  const featuredContainerRef = useRef(null);

  // Saare side-effects ke liye ek main useEffect
  useEffect(() => {
    // 1. Hero Image Carousel
    let heroInterval;
    if (!isHeroPaused) {
      heroInterval = setInterval(() => {
        setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
      }, 3000);
    }

    // 2. Scrollable Sections ki Initial Position Set Karna
    const initializeScrollPositions = () => {
      if (trendingContainerRef.current) {
        // Aapki original logic yahan
        const scrollPosition = window.innerWidth <= 768 ? 275 : 275;
        trendingContainerRef.current.scrollLeft = scrollPosition;
      }
      if (featuredContainerRef.current) {
        featuredContainerRef.current.scrollLeft = 300;
      }
    };

    // DOM ready hone ke baad scroll set karein
    const timer = setTimeout(initializeScrollPositions, 100);

    // Cleanup function jab component screen se hatega
    return () => {
      clearInterval(heroInterval);
      clearTimeout(timer);
    };
  }, [isHeroPaused]); // Yeh effect tab re-run hoga jab isHeroPaused change hoga

  return (
    <>
      <section
        id="section-hero"
        className="hero-section"
        style={{ backgroundImage: `url(${heroImages[currentHeroImage]})` }}
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
      >
        {/* <div className="hero-content">
          <h1 className="hero-title">Where Dreams meet<br />Elegance</h1>
          <p className="hero-subtitle">Discover our exquisite collection of premium attire</p>
          <Link href="/collection" className="hero-button">Explore Collection</Link>
        </div> */}
        <div className="hero-dots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentHeroImage ? 'active' : ''}`}
              onClick={() => setCurrentHeroImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="page-content-wrapper">
        <CelebritySection />

        <section id="section-featured" className="section-container">
          <div className="featured-header">
            <h2 className="section-title">Featured <span className="highlight">Collection</span></h2>
            <p className="section-subtitle">Handpicked designs that define luxury and elegance</p>
          </div>
          {/* Featured container ke liye ref yahan add karein */}
          <div ref={featuredContainerRef} className="featured-gallery-wrapper">
             <ImageSlider />
          </div>
        </section>

        <section id="section-trending" className="section-container">
          <h2 className="section-title">Trending <span className="highlight">Now</span></h2>
          <p className="section-subtitle">Where style meets the spotlight — the moments everyone’s talking about.</p>
          {/* Trending container ke liye ref yahan add karein */}
          <div ref={trendingContainerRef} className="trending-images-container">
            <Image src="/images/background_shape.png" className="trending-bg" alt="background shape" fill style={{ objectFit: 'cover' }} />
            <Image src="/images/reel2.png" alt="Trending 1" className="trending-img" style={{ left: '96px', top: '145px', width: '204px', height: '363px', zIndex: 2 }} width={204} height={363} />
            <Image src="/images/reel3.png" alt="Trending 2" className="trending-img" style={{ left: '309px', top: '106px', width: '214px', height: '441px', zIndex: 3 }} width={214} height={441} />
            <Image src="/images/reel4.png" alt="Trending 3" className="trending-img" style={{ left: '532px', top: '67px', width: '215px', height: '527px', zIndex: 4 }} width={215} height={527} />
            <Image src="/images/reel5.png" alt="Trending 4" className="trending-img" style={{ left: '756px', top: '106px', width: '214px', height: '441px', zIndex: 3 }} width={214} height={441} />
            <Image src="/images/reel2.png" alt="Trending 5" className="trending-img" style={{ left: '979px', top: '145px', width: '204px', height: '363px', zIndex: 2 }} width={204} height={363} />
          </div>
        </section>

        <MultipleOffers />
        <StayClassy />

        <section id="home-stores" className="section-container home-stores">
          <h2 className="section-title">Visit Our <span className="highlight">Stores</span></h2>
          <div className="stores-grid">
            {/* Yahan naye StoreCard component ka istemal karein */}
            {stores.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        </section>

        <HowItWorks />

        <section id="section-testimonials" className="section-container">
          <h2 className="section-title">What Our <span className="highlight">Clients Say</span></h2>
          <p className="section-subtitle">Real experiences from our satisfied customers</p>
          <TestimonialsSlider />
        </section>
      </div>
    </>
  );
}