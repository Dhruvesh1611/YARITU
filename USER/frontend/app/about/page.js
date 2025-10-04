// app/about/page.js

import React from 'react';
import styles from './about.module.css';
import Image from 'next/image';
import Link from 'next/link';

const stores = [
  {
    city: 'Udaipur, Rajasthan',
    address: 'Plot no 8, 100 Feet Rd, Opp Shubh Kesar Garden, Shobhagpura Udaipur, Rajasthan 313001',
    phone: '+91 99090 00616',
    image: '/images/store_1.png',
  },
  {
    city: 'Indore',
    address: '1st & 2nd Floor, 8 Gumasta Nagar, Opp. Sethi gate, Footi Kothi Road, Indore, Madhya Pradesh 452009',
    phone: '+91 84016 73773',
    image: '/images/store_1.png',
  },
  {
    city: 'Jaipur, Rajasthan',
    address: 'Plot No. 12, Sec.-8, Sarthi Marg, Near SBI Choraha, Vaishali Nagar, Jaipur, Rajasthan 302021',
    phone: '+91 84016 73273',
    image: '/images/store_1.png',
  },
  {
    city: 'Jamnagar',
    address: 'Shop No. FF-107 to 114, Nandanvan Stylus Complex Nandanvan Society, Ranjit Sagar Road, Jamnagar-361 005',
    phone: '+91 72288 72280',
    image: '/images/store_1.png',
  },
  {
    city: 'Jetpur',
    address: '1st Floor, Jetpur City Mall, Opp. Gurukrupa Ceramics, Amarnagar Road, Jetpur.',
    phone: '+91 88666 40550',
    image: '/images/store_1.png',
  },
  {
    city: 'Morbi',
    address: '2nd Floor, Shop No.5-8, 3rd, 4th Floor, Balaji Comp., Opp. Canal Chowk, Ravapar Road, Morbi-363 641',
    phone: '+91 75675 14014',
    image: '/images/store_1.png',
  },
  {
    city: 'Amreli',
    address: '2nd floor, Shivam Plaza, Near Panchanath Mahadev Temple, Old Marketing Yard, Amreli-365601',
    phone: '+91 88496 68776',
    image: '/images/store_1.png',
  },
  {
    city: 'Navsari',
    address: '1st Floor, Shreenath House, Near. City Tower, Kaliawadi, Navsari-396427',
    phone: '+91 93287 48970',
    image: '/images/store_1.png',
  },
  {
    city: 'Nikol, Ahmedabad',
    address: 'Opp. Sardar Mall, Nikol Road, Approach Ahmedabad-382350',
    phone: '+91 99099 45508',
    image: '/images/store_1.png',
  },
  {
    city: 'Gota, Ahmedabad',
    address: 'Shop No. 211 to 214, Shlok Infinity, Opp. Vishwakarma Mandir, Nr. Gota Railway Bridge, Chandlodiya, Ahmedabad-382481',
    phone: '+91 97122 05000',
    image: '/images/store_1.png',
  },
  {
    city: 'Bopal, Ahmedabad',
    address: 'Shop No. 2013 to 2018, TRP Mall, Ghuma Road, B.R.T.S. Bopal, Ahmedabad-380058',
    phone: '+91 93166 97344',
    image: '/images/store_1.png',
  },
  {
    city: 'Maruti Chowk, Surat',
    address: 'shop no. 1-5, 1floor, panchdev shopping center, Lambe Hanuman Rd, opp. maruti gaushala, Navi Shakti Vijay Society, Mohan Nagar, Varachha, Surat, Gujarat 395006',
    phone: '+91 89806 14403',
    image: '/images/store_1.png',
  },
  {
    city: 'Katargam, Surat',
    address: 'Shop No.1 to 3, 1st floor, Bhavya Complex, Laxminarayan Soc., Dabholi Char Rasta, Ved Road, Surat.',
    phone: '+91 89806 14400',
    image: '/images/store_1.png',
  },
  {
    city: 'Yogi Chowk, Surat',
    address: '2nd Floor and 3rd Floor, Pragati IT, World, Yogi Chowk Road, near Satyam Clinic, Punagam, Surat, Gujarat 395010',
    phone: '+91 84016 73473',
    image: '/images/store_1.png',
  },
  {
    city: 'Rajkot',
    address: 'Opp. Ambika Park, Before Hanuman Madhi Chowk, Raiya Road, Rajkot 360007',
    phone: '+91 99090 00615',
    image: '/images/store_1.png',
  },
  {
    city: 'Mehsana',
    address: 'BHAGWATI CHAMBER, NEAR BHARAT PETROL PUMP, Radhanpur Rd, Dediyasan, Mehsana, Gujarat 384002',
    phone: '+91 88667 06069',
    image: '/images/store_1.png',
  },
  {
    city: 'Botad',
    address: '1st & 2nd Floor, Opp. Surya Garden Restaurant, Paliyad Road, Botad, Gujarat 364710',
    phone: '+91 99090 00627',
    image: '/images/store_1.png',
  },
];

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
            {/* Fixed casing: actual file name is Our_Story.png (capital S) to avoid 404 + hydration mismatch */}
            <Image src="/images/Our_Story.png" alt="Yaritu traditional attire" className={styles.mainImage} width={548} height={600} />
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
            {stores.map((store, index) => (
              <div key={index} className={`${styles.aboutStoreCard} ${index % 2 !== 0 ? styles.cardReverse : ''}`}>
                <div className={styles.storeDetails}>
                  <h3>{store.city}</h3>
                  <p className={styles.address}>{store.address}</p>
                  <p className={styles.phone}>{store.phone}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" className={styles.storeButton}>Get Directions</a>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" className={styles.storeImage}>
                  <Image src={store.image} alt={`${store.city} Store Interior`} width={580} height={390} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
