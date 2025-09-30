"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './home.css';
import MultipleOffers from '../components/MultipleOffers';
import StayClassy from '../components/StayClassy';
import CelebritySection from '../components/CelebritySection';
import TestimonialsSlider from '../components/TestimonialsSlider';
import ImageSlider from '../components/ImageSlider';
import HowItWorks from '../components/HowItWorks';



const stores = [
  { id: 1, name: 'Yogichowk, Surat' },
  { id: 2, name: 'Varachha, Surat' },
  { id: 3, name: 'Katargam, Surat' },
  { id: 4, name: 'Adajan, Surat' },
  { id: 5, name: 'Piplod, Surat' },
  { id: 6, name: 'Jamnagar Main' },
  { id: 7, name: 'Jaipur Central' },
  { id: 8, name: 'Ahmedabad One' },
  { id: 9, name: 'SG Highway, Ahmedabad' },
  { id: 10, name: 'Navrangpura, Ahmedabad' },
  { id: 11, name: 'Bapunagar, Ahmedabad' },
  { id: 12, name: 'Maninagar, Ahmedabad' },
  { id: 13, name: 'Chandkheda, Ahmedabad' },
  { id: 14, name: 'Satellite, Ahmedabad' },
  { id: 15, name: 'Vastrapur, Ahmedabad' },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);
  const framedImgRef = useRef(null);
  const storeObserverRef = useRef(null);
  const howItObserverRef = useRef(null);

  useEffect(() => {
    // Set initial scroll position for sections to show partial images on both sides
    const initializeScrollPositions = () => {
      // Initialize trending section
      const trendingContainer = document.querySelector('.trending-images-container');
      if (trendingContainer) {
        // If mobile viewport, center the 3rd image initially. Otherwise keep existing position.
        if (window.innerWidth <= 768) {
          const imgs = trendingContainer.querySelectorAll('.trending-img');
          if (imgs && imgs.length >= 3) {
            const third = imgs[2];
            // Compute center position for the third image inside the scroll container
            const containerRect = trendingContainer.getBoundingClientRect();
            const imgRect = third.getBoundingClientRect();
            // scrollLeft needed = current scrollLeft + (imgCenter - containerCenter)
            const imgCenter = imgRect.left + imgRect.width / 2;
            const containerCenter = containerRect.left + containerRect.width / 2;
            const delta = imgCenter - containerCenter;
            trendingContainer.scrollLeft += Math.round(delta);
          } else {
            // fallback to previous static value
            trendingContainer.scrollLeft = 275;
          }
        } else {
          // Desktop/tablet: Scroll to position that shows second image centered
          const scrollPosition = 275; // Adjust this value to get the perfect positioning
          trendingContainer.scrollLeft = scrollPosition;
        }
      }

      // Initialize featured section  
      const featuredContainer = document.querySelector('.featured-gallery');
      if (featuredContainer) {
        // Scroll to position that shows second image centered with partial first and third visible
        const featuredScrollPosition = 300; // Adjust this value for featured section
        featuredContainer.scrollLeft = featuredScrollPosition;
      }
    };

    // Set up scroll animations for store cards and keep observer ref
    const setupStoreAnimations = () => {
      const storeCards = document.querySelectorAll('.home-store-card');
      if (!storeCards || storeCards.length === 0) return;

      // disconnect previous observer if present
      if (storeObserverRef.current) {
        try {
          storeObserverRef.current.disconnect();
        } catch (e) {}
        storeObserverRef.current = null;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('animate-in'), index * 100);
          }
        });
      }, { threshold: 0.1, rootMargin: '50px' });

      storeCards.forEach(card => observer.observe(card));
      storeObserverRef.current = observer;

      return () => {
        try {
          observer.disconnect();
        } catch (e) {}
      };
    };

    // Observe timeline items and update framed image when they enter view
    const setupHowItWorksObserver = () => {
      const items = document.querySelectorAll('.timeline-item');
      if (!items || items.length === 0) return;

      // cleanup previous
      if (howItObserverRef.current) {
        try { howItObserverRef.current.disconnect(); } catch (e) {}
        howItObserverRef.current = null;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(items).indexOf(entry.target);
            setActiveStep(index + 1);
          }
        });
      }, { root: null, threshold: 0.6 });

      items.forEach(i => observer.observe(i));
      howItObserverRef.current = observer;
      return () => { try { observer.disconnect(); } catch (e) {} };
    };

    // Delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
  console.debug('[Home] initializers running');
  initializeScrollPositions();
  setupStoreAnimations();
  setupHowItWorksObserver();
    }, 100);

    // Re-run initializers when app emits route-change (client navigation)
    const onRouteChange = () => {
  console.debug('[Home] received app:routeChange, clearing animate-in and re-running inits');
      // remove any animate-in to allow re-animation
  const storeCards = document.querySelectorAll('.home-store-card');
      if (storeCards && storeCards.length) {
        storeCards.forEach(c => c.classList.remove('animate-in'));
      }
      // small delay to let DOM settle then re-run
      setTimeout(() => {
        initializeScrollPositions();
        setupStoreAnimations();
        setupHowItWorksObserver();
        // dispatch resize just in case
        window.dispatchEvent(new Event('resize'));
      }, 80);
    };

    window.addEventListener('app:routeChange', onRouteChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('app:routeChange', onRouteChange);
      if (storeObserverRef.current) try { storeObserverRef.current.disconnect(); } catch (e) {}
      if (howItObserverRef.current) try { howItObserverRef.current.disconnect(); } catch (e) {}
    };
  }, []);

  // Observe timeline items and update framed image when they enter view
  const setupHowItWorksObserver = () => {
    const items = document.querySelectorAll('.timeline-item');
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(items).indexOf(entry.target);
          setActiveStep(index + 1);
        }
      });
    }, { root: null, threshold: 0.6 });

    items.forEach(i => observer.observe(i));
  };

  return (
    <>
      <section id="section-hero" className="hero-section">
        <div className="hero-content">
          {/* <Image src="/images/yaritu_logo_white.png" alt="Yaritu Logo" className="hero-logo" width={96} height={96} /> */}
          <h1 className="hero-title">Where Dreams meet<br />Elegance</h1>
          <p className="hero-subtitle">Discover our exquisite collection of premium attire</p>
          <Link href="/collection" className="hero-button">Explore Collection</Link>
        </div>
        {/* Global WhatsApp button is provided in app/layout.js */}
      </section>
      <div className="page-content-wrapper">
        <CelebritySection />

        
          
        
        

        <section id="section-featured" className="section-container">
          <div className="featured-header">
            <h2 className="section-title">Featured <span className="highlight">Collection</span></h2>
            <p className="section-subtitle">Handpicked designs that define luxury and elegance</p>
          </div>
          <ImageSlider />
        </section>

        <section id="section-trending" className="section-container">
          <h2 className="section-title">Trending <span className="highlight">Now</span></h2>
          <p className="section-subtitle">Where style meets the spotlight — the moments everyone’s talking about.</p>
          <div className="trending-images-container">
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
          <h2 className="section-title">VISIT OUR <span className="highlight">STORES</span></h2>
          <div className="stores-grid">
            {stores.map(store => (
              <div key={store.id} className="home-store-card">
                <Image src="/images/store_1.png" alt={store.name} width={200} height={150} />
                <div className="store-name-overlay">
                  <span>{store.name}</span>
                </div>
              </div>
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