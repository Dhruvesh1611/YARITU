// app/about/page.js

import React from 'react';
import styles from './about.module.css';
import Image from 'next/image';
import Link from 'next/link';
import AboutStoresClient from '../../components/AboutStoresClient';

export default function About() {
  return (
    <>
      <section id="our-story" className={styles.heroStorySection}>
        <div className="container">
          <h1 className="page-title">Our <span className="highlight">Story</span></h1>
          <p>Crafting timeless elegance since 2010</p>
        </div>
      </section>
      <section id="about-us" className={styles.aboutUsSection}>
        <div className={`container ${styles.aboutUsContainer}`}>
          <div className={styles.aboutUsContent}>
            <h2>Where It All Began</h2>
            <p>Founded in 2010, Yaritu began as a dream to create timeless wedding attire that celebrates love, tradition, and elegance. What started as a small boutique in Mumbai has grown into one of India's most trusted premium wedding clothing brands.</p>
            <p>Our master craftsmen combine traditional techniques with contemporary design, ensuring each piece is a work of art that tells your unique love story.</p>
            <Link href="/collection" className={styles.ctaButton}>
              Explore Our Work
              <span className={styles.ctaIcon} aria-hidden="true" style={{ display: 'inline-block', marginLeft: 10 }}>
                {/* Inline right arrow SVG */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
            <div className={styles.aboutUsImageWrapper} style={{ position: 'relative', width: '100%', maxWidth: 548, aspectRatio: '548/600' }}>
            {/* Fixed casing: actual file name is Our_Story.png (capital S) to avoid 404 + hydration mismatch */}
            <Image src="/images/Our_Story.png" alt="Yaritu traditional attire" fill sizes="(max-width: 600px) 100vw, 548px" style={{ objectFit: 'cover', borderRadius: 10 }} />
          </div>
        </div>
      </section>
      <section id="achievements" className={styles.achievementsSection}>
        <div className="container">
          <div className={styles.achievementsHeader}>
            <h2>Our <span className="highlight">Achievements</span></h2>
            <p>Numbers that reflect our commitment to excellence</p>
          </div>
          <div className={styles.achievementsGrid}>
            <div className={styles.achievementItem}>
              <Image src="/images/happy_clients.png" alt="Happy Clients Icon" width={40} height={40} />
              <h3>10,000+</h3>
              <p>Happy Clients</p>
            </div>
            <div className={styles.achievementItem}>
              <Image src="/images/award.png" alt="Awards Won Icon" width={40} height={40} />
              <h3>25+</h3>
              <p>Awards Won</p>
            </div>
            <div className={styles.achievementItem}>
              <Image src="/images/location.png" alt="Cities Served Icon" width={40} height={40} />
              <h3>15+</h3>
              <p>Cities Served</p>
            </div>
            <div className={styles.achievementItem}>
              <Image src="/images/years_of_excellence.png" alt="Years of Excellence Icon" width={40} height={40} />
              <h3>15+</h3>
              <p>Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>
      <section id="mission" className={styles.missionSection}>
        <div className="container">
          <h2>Our <span className="highlight">Mission</span></h2>
          <p>To craft exceptional wedding attire that embodies the rich heritage of Indian craftsmanship while embracing contemporary elegance. We strive to make every couple's special day unforgettable through our dedication to quality, artistry, and personalised service.</p>
        </div>
      </section>
      <section id="vision" className={styles.visionSection}>
        <div className="container">
          <h2>Our <span className="highlight">Vision</span></h2>
          <p>To become the global leader in luxury wedding fashion, setting new standards of excellence in design, craftsmanship, and customer experience. We envision a world where every celebration is adorned with the finest artistry and timeless beauty.</p>
        </div>
      </section>
      
      <section id="about-stores" className={`${styles.storesSection} ${styles.aboutStores}`}>
        <AboutStoresClient />
      </section>
    </>
  );
}
