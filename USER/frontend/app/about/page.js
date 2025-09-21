import React from 'react';
import './about.css';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <section id="our-story" className="hero-story-section">
        <div className="container">
          <h1>Our <span className="highlight">Story</span></h1>
          <p>Crafting timeless elegance since 2010</p>
        </div>
      </section>
      <section id="about-us" className="about-us-section">
        <div className="container about-us-container">
          <div className="about-us-content">
            <h2>Where It All Began</h2>
            <p>Founded in 2010, Yaritu began as a dream to create timeless wedding attire that celebrates love, tradition, and elegance. What started as a small boutique in Mumbai has grown into one of India's most trusted premium wedding clothing brands.</p>
            <p>Our master craftsmen combine traditional techniques with contemporary design, ensuring each piece is a work of art that tells your unique love story.</p>
            <Link href="#our-work" className="cta-button">
              Explore Our Work
              <Image src="/images/1930_1950.svg" alt="Arrow icon" width={12} height={10} />
            </Link>
          </div>
          <div className="about-us-image-wrapper">
            <Image src="/images/e4233c8705cd8d900f4c3a2d11a232e4fd0670f5.png" alt="Yaritu traditional attire" className="main-image" width={548} height={600} />
            <div className="overlay-shape-1"></div>
            <div className="overlay-shape-2"></div>
            <a href="#" className="about-whatsapp-float">
              <Image src="/images/1995_4119.svg" alt="WhatsApp" width={45} height={45} />
            </a>
          </div>
        </div>
      </section>
      <section id="achievements" className="achievements-section">
        <div className="container">
          <div className="achievements-header">
            <h2>Our <span className="highlight">Achievements</span></h2>
            <p>Numbers that reflect our commitment to excellence</p>
          </div>
          <div className="achievements-grid">
            <div className="achievement-item">
              <Image src="/images/1931_2093.svg" alt="Happy Clients Icon" width={40} height={40} />
              <h3>10,000+</h3>
              <p>Happy Clients</p>
            </div>
            <div className="achievement-item">
              <Image src="/images/1931_2095.svg" alt="Awards Won Icon" width={40} height={40} />
              <h3>25+</h3>
              <p>Awards Won</p>
            </div>
            <div className="achievement-item">
              <Image src="/images/1931_2097.svg" alt="Cities Served Icon" width={40} height={40} />
              <h3>15+</h3>
              <p>Cities Served</p>
            </div>
            <div className="achievement-item">
              <Image src="/images/1931_2099.svg" alt="Years of Excellence Icon" width={40} height={40} />
              <h3>15+</h3>
              <p>Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>
      <section id="mission" className="mission-section">
        <div className="container">
          <h2>Our <span className="highlight">Mission</span></h2>
          <p>To craft exceptional wedding attire that embodies the rich heritage of Indian craftsmanship while embracing contemporary elegance. We strive to make every couple's special day unforgettable through our dedication to quality, artistry, and personalised service.</p>
        </div>
      </section>
      <section id="vision" className="vision-section">
        <div className="container">
          <h2>Our <span className="highlight">Vision</span></h2>
          <p>To become the global leader in luxury wedding fashion, setting new standards of excellence in design, craftsmanship, and customer experience. We envision a world where every celebration is adorned with the finest artistry and timeless beauty.</p>
        </div>
      </section>
      <section id="stores" className="stores-section">
        <div className="container">
          <div className="stores-header">
            <h2>Visit Our <span className="highlight">Stores</span></h2>
            <p>Experience our collections firsthand at our premium boutiques</p>
          </div>
          <div className="stores-grid">
            <div className="store-card">
              <div className="store-details">
                <h3>Mumbai</h3>
                <p className="address">123 Wedding Street, Bandra West</p>
                <p className="phone">+91 98765 43210</p>
                <a href="#" className="store-button">Get Directions</a>
              </div>
              <div className="store-image">
                <Image src="/images/25b3365bb1696aadec9508d75cf56d4bd5ff8972.png" alt="Mumbai Store Interior" width={580} height={390} />
              </div>
            </div>
            <div className="store-card card-reverse">
              <div className="store-details">
                <h3>Jamnagar</h3>
                <p className="address">789 Style Boulevard, Koramangala</p>
                <p className="phone">+91 98765 43212</p>
                <a href="#" className="store-button">Get Directions</a>
              </div>
              <div className="store-image">
                <Image src="/images/5a0deaf6120d1eb05813de08e6d0745c6e4e208e.png" alt="Jamnagar Store Interior" width={580} height={390} />
              </div>
            </div>
            <div className="store-card">
              <div className="store-details">
                <h3>Jaipur</h3>
                <p className="address">456 Royal Plaza, Pink City</p>
                <p className="phone">+91 98765 43211</p>
                <a href="#" className="store-button">Get Directions</a>
              </div>
              <div className="store-image">
                <Image src="/images/25b3365bb1696aadec9508d75cf56d4bd5ff8972.png" alt="Jaipur Store Interior" width={580} height={390} />
              </div>
            </div>
            <div className="store-card card-reverse">
              <div className="store-details">
                <h3>Delhi</h3>
                <p className="address">101 Heritage Lane, Connaught Place</p>
                <p className="phone">+91 98765 43213</p>
                <a href="#" className="store-button">Get Directions</a>
              </div>
              <div className="store-image">
                <Image src="/images/5a0deaf6120d1eb05813de08e6d0745c6e4e208e.png" alt="Delhi Store Interior" width={580} height={390} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
