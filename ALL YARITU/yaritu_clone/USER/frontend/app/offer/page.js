"use client";
import React, { useState } from 'react';
import './offer.css';
import Image from 'next/image';

export default function Offer() {
  const stores = [
    {
      name: "Udaipur, Rajasthan",
      address: "Plot no 8, 100 Feet Rd, Opp Shubh Kesar Garden, Shobhagpura Udaipur, Rajasthan 313001",
      phone: "+91 99090 00616",
      image: "/images/stores/store1.png"
    },
    {
      name: "Indore",
      address: "1st & 2nd Floor, 8 Gumasta Nagar, Opp. Sethi gate, Footi Kothi Road, Indore, Madhya Pradesh 452009",
      phone: "+91 84016 73773",
      image: "/images/stores/store2.png"
    },
    {
      name: "Jaipur, Rajasthan",
      address: "Plot No. 12, Sec.-8, Sarthi Marg, Near SBI Choraha, Vaishali Nagar, Jaipur, Rajasthan 302021",
      phone: "+91 84016 73273",
      image: "/images/stores/store3.png"
    },
    {
      name: "Jamnagar",
      address: "Shop No. FF-107 to 114, Nandanvan Stylus Complex Nandanvan Society, Ranjit Sagar Road, Jamnagar-361 005",
      phone: "+91 72288 72280",
      image: "/images/stores/store4.png"
    },
    {
      name: "Jetpur",
      address: "1st Floor, Jetpur City Mall, Opp. Gurukrupa Ceramics, Amarnagar Road, Jetpur.",
      phone: "+91 88666 40550",
      image: "/images/stores/store5.png"
    },
    {
      name: "Morbi",
      address: "2nd Floor, Shop No.5-8, 3rd, 4th Floor, Balaji Comp., Opp. Canal Chowk, Ravapar Road, Morbi-363 641",
      phone: "+91 75675 14014",
      image: "/images/stores/store6.png"
    },
    {
      name: "Amreli",
      address: "2nd floor, Shivam Plaza, Near Panchanath Mahadev Temple, Old Marketing Yard, Amreli-365601",
      phone: "+91 88496 68776",
      image: "/images/stores/store7.png"
    },
    {
      name: "Navsari",
      address: "1st Floor, Shreenath House, Near. City Tower, Kaliawadi, Navsari-396427",
      phone: "+91 93287 48970",
      image: "/images/stores/store8.png"
    },
    {
      name: "Nikol, Ahmedabad",
      address: "Opp. Sardar Mall, Nikol Road, Approach Ahmedabad-382350",
      phone: "+91 99099 45508",
      image: "/images/stores/store9.png"
    },
    {
      name: "Gota, Ahmedabad",
      address: "Shop No. 211 to 214, Shlok Infinity, Opp. Vishwakarma Mandir, Nr. Gota Railway Bridge, Chandlodiya, Ahmedabad-382481",
      phone: "+91 97122 05000",
      image: "/images/stores/store10.png"
    },
    {
      name: "Bopal, Ahmedabad",
      address: "Shop No. 2013 to 2018, TRP Mall, Ghuma Road, B.R.T.S. Bopal, Ahmedabad-380058",
      phone: "+91 93166 97344",
      image: "/images/stores/store1.png"
    },
    {
      name: "Maruti Chowk, Surat",
      address: "shop no. 1-5, 1floor, panchdev shopping center, Lambe Hanuman Rd, opp. maruti gaushala, Navi Shakti Vijay Society, Mohan Nagar, Varachha, Surat, Gujarat 395006",
      phone: "+91 89806 14403",
      image: "/images/stores/store2.png"
    },
    {
      name: "Katargam, Surat",
      address: "Shop No.1 to 3, 1st floor, Bhavya Complex, Laxminarayan Soc., Dabholi Char Rasta, Ved Road, Surat.",
      phone: "+91 89806 14400",
      image: "/images/stores/store3.png"
    },
    {
      name: "Yogi Chowk, Surat",
      address: "2nd Floor and 3rd Floor, Pragati IT, World, Yogi Chowk Road, near Satyam Clinic, Punagam, Surat, Gujarat 395010",
      phone: "+91 84016 73473",
      image: "/images/stores/store4.png"
    },
    {
      name: "Rajkot",
      address: "Opp. Ambika Park, Before Hanuman Madhi Chowk, Raiya Road, Rajkot 360007",
      phone: "+91 99090 00615",
      image: "/images/stores/store5.png"
    },
    {
      name: "Mehsana",
      address: "BHAGWATI CHAMBER, NEAR BHARAT PETROL PUMP, Radhanpur Rd, Dediyasan, Mehsana, Gujarat 384002",
      phone: "+91 88667 06069",
      image: "/images/stores/store6.png"
    },
  ];
  const [selectedIdx, setSelectedIdx] = useState(9); // Default to Gota, Ahmedabad

  return (
    <>
      <div className="offer-page">
        <div className="container reviews-content">
          <h2 className="reviews-title"><strong>Exclusive</strong> <span className="highlight">Offers</span></h2>
          <p className="reviews-subtitle">Don't miss out on our limited-time deals and special promotions</p>
        </div>
        <section id="store-selector" className="store-selector-section">
          <div className="store-selector-container">
            <div className="store-selector-content">
              <h2 className="store-selector-title">Choose Your Store</h2>

              <select
                value={selectedIdx}
                onChange={e => setSelectedIdx(Number(e.target.value))}
                className="store-dropdown"
              >
                {stores.map((store, idx) => (
                  <option value={idx} key={store.name}>{store.name}</option>
                ))}
              </select>

              {/* Display selected store details */}
              <div className="selected-store-info">
                <h3>{stores[selectedIdx].name}</h3>
                <p className="store-address">{stores[selectedIdx].address}</p>
                <p className="store-phone">📞 {stores[selectedIdx].phone}</p>
              </div>
            </div>
            <div className="store-selector-image">
              <Image
                src={stores[selectedIdx].image}
                alt={`${stores[selectedIdx].name} store interior`}
                width={690}
                height={400}
                className="store-photo"
              />
            </div>
          </div>
        </section>
        <section id="offers" className="offers-section section-padding">
          <div className="page-container">
            <div className="offers-header">
              <Image src="/images/location.png" alt="Location icon" width={50} height={50} />
              <h2>{stores[selectedIdx].name}</h2>
            </div>
            <div className="offers-grid">
              <div className="offer-card">
                <div className="offer-card-image">
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 4' }}>
                    <Image
                      src="/images/shervani.png"
                      alt="Wedding Season Special"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
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
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 4' }}>
                    <Image
                      src="/images/image.png"
                      alt="couple combo deal"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
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
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 4' }}>
                    <Image
                      src="/images/festival.png"
                      alt="festival Collection"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
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
          {/* Global WhatsApp button is provided in app/layout.js */}
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
                <input type="mobile-number" placeholder="Enter your mobile number" />
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
