// app/about/page.js

import React from 'react';
import styles from './about.module.css'; // Changed the import
import Image from 'next/image';
import Link from 'next/link';

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
            <Link href="#our-work" className={styles.ctaButton}>
              Explore Our Work
              <Image src="/images/right.png" alt="Arrow icon" width={12} height={10} />
            </Link>
          </div>
          <div className={styles.aboutUsImageWrapper}>
            <Image src="/images/Our_story.png" alt="Yaritu traditional attire" className={styles.mainImage} width={548} height={600} />
            <div className={styles.overlayShape1}></div>
            <div className={styles.overlayShape2}></div>
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
        <div className="container">
          <div className={styles.storesHeader}>
            <h2>Visit Our <span className="highlight">Stores</span></h2>
            <p>Experience our collections firsthand at our premium boutiques</p>
          </div>
          <div className={styles.storesGrid}>
            <div className={styles.aboutStoreCard}>
              <div className={styles.storeDetails}>
                <h3>Mumbai</h3>
                <p className={styles.address}>123 Wedding Street, Bandra West</p>
                <p className={styles.phone}>+91 98765 43210</p>
                <a href="#" className={styles.storeButton}>Get Directions</a>
              </div>
              <div className={styles.storeImage}>
                <Image src="/images/store_1.png" alt="Mumbai Store Interior" width={580} height={390} />
              </div>
            </div>
            <div className={`${styles.aboutStoreCard} ${styles.cardReverse}`}>
              <div className={styles.storeDetails}>
                <h3>Jamnagar</h3>
                <p className={styles.address}>789 Style Boulevard, Koramangala</p>
                <p className={styles.phone}>+91 98765 43212</p>
                <a href="#" className={styles.storeButton}>Get Directions</a>
              </div>
              <div className={styles.storeImage}>
                <Image src="/images/5a0deaf6120d1eb05813de08e6d0745c6e4e208e.png" alt="Jamnagar Store Interior" width={580} height={390} />
              </div>
            </div>
            {/* Add other store cards here with the same pattern */}
          </div>
        </div>
      </section>
    </>
  );
}