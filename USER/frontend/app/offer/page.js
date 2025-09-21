import React from 'react';
import './offer.css';
import Image from 'next/image';

export default function Offer() {
  return (
    <>
      <div className="offer-page">
    <section id="hero" className="offer-hero">
        <div className="page-container">
      <h1 className="offer-hero-title">Exclusive <span className="highlight-text">Offers</span> Near You</h1>
      <p className="offer-hero-subtitle">Select your store to see personalized deals</p>
        </div>
      </section>
      <section id="store-selector" className="store-selector-section">
        <div className="store-selector-container">
          <div className="store-selector-content">
            <h2 className="store-selector-title">Choose Your Store</h2>
            <div className="store-dropdown">
              <span>Yaritu, Ahmedabad</span>
              <Image src="/images/2092_506.svg" alt="Dropdown arrow" width={35} height={35} />
            </div>
          </div>
          <div className="store-selector-image">
            <Image src="/images/5a0deaf6120d1eb05813de08e6d0745c6e4e208e.png" alt="Yaritu store interior" width={690} height={400} />
          </div>
        </div>
      </section>
      <section id="offers" className="offers-section section-padding">
        <div className="page-container">
          <div className="offers-header">
            <Image src="/images/2095_548.svg" alt="Location icon" width={50} height={50} />
            <h2>Yaritu, Ahmedabad</h2>
          </div>
          <div className="offers-grid">
            <div className="offer-card">
              <div className="offer-card-image">
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src="/images/e35001a0317859fbbe86698e4c5deafa9e7c49b0.png" alt="Wedding Season Special" fill style={{ objectFit: 'cover' }} />
                  <Image src="/images/48b5596ddcb845b2425d6d68c4284007c7534a5a.png" alt="Wedding Season Special" fill style={{ objectFit: 'contain', zIndex: 1 }} />
                </div>
                <div className="discount-tag">25% OFF</div>
              </div>
              <div className="offer-card-content">
                <h3>Wedding Season Special</h3>
                <p>On all bridal lehengas and sherwanis</p>
                <span className="validity-date">Valid until March 31, 2025</span>
                <a href="#" className="claim-button">Claim Offer</a>
              </div>
            </div>
            <div className="offer-card">
              <div className="offer-card-image">
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src="/images/0999f3009f8748589e7287a702c2c5d424644430.png" alt="Couple Combo Deal" fill style={{ objectFit: 'cover' }} />
                  <Image src="/images/ded25fb0c9e640a9f2f502903045bbc29d9324d1.png" alt="Couple Combo Deal" fill style={{ objectFit: 'contain', zIndex: 1 }} />
                </div>
                <div className="discount-tag">₹2,000/- OFF</div>
              </div>
              <div className="offer-card-content">
                <h3>Couple Combo Deal</h3>
                <p>When you buy both bride & groom outfits</p>
                <span className="validity-date">Limited time offer</span>
                <a href="#" className="claim-button">Claim Offer</a>
              </div>
            </div>
            <div className="offer-card">
              <div className="offer-card-image">
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <Image src="/images/3e92d1ce86debf6c8da44d85ff7b02f8f8fe57ca.png" alt="Festival Collection" fill style={{ objectFit: 'cover' }} />
                  <Image src="/images/d137416aaed4471817b21b5cbe445f6cccecf907.png" alt="Festival Collection" fill style={{ objectFit: 'contain', zIndex: 1 }} />
                </div>
                <div className="discount-tag">25% OFF</div>
              </div>
              <div className="offer-card-content">
                <h3>Festival Collection</h3>
                <p>On ethnic wear for all occasions</p>
                <span className="validity-date">Ends February 28, 2025</span>
                <a href="#" className="claim-button">Claim Offer</a>
              </div>
            </div>
          </div>
        </div>
        <a href="#" className="whatsapp-float">
          <Image src="/images/2161_456.svg" alt="WhatsApp" width={45} height={45} />
        </a>
      </section>
      <section id="benefits" className="benefits-section section-padding">
        <div className="page-container">
          <div className="benefits-header">
            <h2 className="benefits-title">Exclusive <span className="highlight-text">Benefits</span></h2>
            <p className="benefits-subtitle">Join our premium membership for exclusive perks</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <Image className="benefit-bg-img" src="/images/314cf5c2d333a646384d94a377d3833614dff7ec.png" alt="" fill style={{ objectFit: 'cover' }} />
              <div className="benefit-content">
                <div className="benefit-icon">👑</div>
                <h3>VIP Membership</h3>
                <p>Get 15% extra discount on all purchases</p>
                <a href="#" className="benefit-button">Join Now</a>
              </div>
            </div>
            <div className="benefit-card">
              <Image className="benefit-bg-img" src="/images/a5d65aa6565e478e0dbc85b03e39b4a6504706d9.png" alt="" fill style={{ objectFit: 'cover' }} />
              <div className="benefit-content">
                <div className="benefit-icon">🎁</div>
                <h3>Free Alterations</h3>
                <p>Complimentary alterations with every purchase</p>
                <a href="#" className="benefit-button">Learn More</a>
              </div>
            </div>
            <div className="benefit-card">
              <Image className="benefit-bg-img" src="/images/fdf8fb627ebf45a994eb0d6d2adb4892905c8628.png" alt="" fill style={{ objectFit: 'cover' }} />
              <div className="benefit-content">
                <div className="benefit-icon">⭐</div>
                <h3>Early Bird Access</h3>
                <p>Get first access to new collections</p>
                <a href="#" className="benefit-button">Subscribe</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="newsletter" className="newsletter-section section-padding">
        <div className="page-container">
          <div className="newsletter-content">
            <h2>Never Miss a Deal</h2>
            <p>Subscribe to our newsletter and get exclusive offers delivered to your inbox</p>
            <form className="subscribe-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
            <small>Join 10,000+ happy subscribers and get 10% off your first purchase</small>
          </div>
        </div>
      </section>
  </div>
    </>
  );
}
