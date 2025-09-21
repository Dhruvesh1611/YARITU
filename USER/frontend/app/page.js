import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './home.css';
import MultipleOffers from '../components/MultipleOffers';
import StayClassy from '../components/StayClassy';
import CelebritySection from '../components/CelebritySection';

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
  return (
    <>
      <section id="section-hero" className="hero-section">
        <div className="hero-content">
          <Image src="/images/yaritu_logo_white.png" alt="Yaritu Logo" className="hero-logo" width={96} height={96} />
          <h1 className="hero-title">Where Dreams meet<br />Elegance</h1>
          <p className="hero-subtitle">Discover our exquisite collection of premium attire</p>
          <Link href="/collection" className="hero-button">Explore Collection</Link>
        </div>
        <a href="https://wa.me/" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
          <Image src="/images/whatsapp.png" alt="WhatsApp" width={45} height={45} />
        </a>
      </section>
      <div className="page-content-wrapper">
        <CelebritySection />

        <section id="section-featured" className="section-container">
          <div className="featured-header">
            <h2 className="section-title">Featured <span className="highlight">Collection</span></h2>
            <p className="section-subtitle">Handpicked designs that define luxury and elegance</p>
          </div>
          <div className="featured-gallery">
            <button className="gallery-arrow prev">
              <Image src="/images/1894_913.svg" alt="Previous" width={18} height={18} />
            </button>
            <div className="gallery-items">
              <Image src="/images/Featured1.png" alt="Featured collection item 1" className="gallery-item" width={330} height={453} />
              <Image src="/images/Trending1.png" alt="Featured collection item 2" className="gallery-item large" width={380} height={566} />
              <Image src="/images/Featured3.png" alt="Featured collection item 3" className="gallery-item" width={330} height={453} />
            </div>
            <button className="gallery-arrow next">
              <Image src="/images/1894_918.svg" alt="Next" width={18} height={18} />
            </button>
          </div>
        </section>

        <section id="section-trending" className="section-container">
          <h2 className="section-title">Trending <span className="highlight">Now</span></h2>
          <p className="section-subtitle">Where style meets the spotlight — the moments everyone’s talking about.</p>
          <div className="trending-images-container">
            <Image src="/images/background_shape.png" className="trending-bg" alt="background shape" layout="fill" />
            <Image src="/images/reel2.png" alt="Trending 1" className="trending-img" style={{ left: '96px', top: '145px', width: '204px', height: '363px', zIndex: 2 }} width={204} height={363} />
            <Image src="/images/reel3.png" alt="Trending 2" className="trending-img" style={{ left: '309px', top: '106px', width: '214px', height: '441px', zIndex: 3 }} width={214} height={441} />
            <Image src="/images/reel4.png" alt="Trending 3" className="trending-img" style={{ left: '532px', top: '67px', width: '215px', height: '527px', zIndex: 4 }} width={215} height={527} />
            <Image src="/images/reel5.png" alt="Trending 4" className="trending-img" style={{ left: '756px', top: '106px', width: '214px', height: '441px', zIndex: 3 }} width={214} height={441} />
            <Image src="/images/reel2.png" alt="Trending 5" className="trending-img" style={{ left: '979px', top: '145px', width: '204px', height: '363px', zIndex: 2 }} width={204} height={363} />
          </div>
        </section>

        <MultipleOffers />

        <StayClassy />

        <section id="section-stores" className="section-container">
          <h2 className="section-title">VISIT OUR <span className="highlight">STORES</span></h2>
          <div className="stores-grid">
            {stores.map(store => (
              <div key={store.id} className="store-card">
                <Image src="/images/store.png" alt={store.name} width={200} height={150} />
                <div className="store-name-overlay">
                  <span>{store.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="section-how-it-works" className="how-it-works-section">
          <div className="how-it-works-content">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-number"><span>1</span></div>
                <div className="timeline-connector"></div>
                <div className="timeline-desc">
                  <Image src="/images/HOW YARITU WORKS.png" alt="Select a style icon" width={100} height={100} />
                  <h3>select a style</h3>
                  <p>nec viverra vitae eget placerat commodo dignissim, quam enim. felis, Morbi gravida lacus amet, enim. nisl.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-number"><span>2</span></div>
                <div className="timeline-connector"></div>
                <div className="timeline-desc">
                  <Image src="/images/HOW YARITU WORKS.png" alt="Book your outfit icon" width={100} height={100} />
                  <h3>Book Your Outfit</h3>
                  <p>amet, elementum vitae ipsum non, placerat dui maximus placerat Nam turpis ex nisl. dui. nisi elit est.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-number"><span>3</span></div>
                <div className="timeline-connector"></div>
                <div className="timeline-desc">
                  <Image src="/images/HOW YARITU WORKS.png" alt="Enjoy it icon" width={100} height={100} />
                  <h3>Enjoy it</h3>
                  <p>nec viverra vitae eget placerat commodo dignissim, quam enim. felis, Morbi gravida lacus amet, enim. nisl.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-number"><span>4</span></div>
                <div className="timeline-desc">
                  <Image src="/images/HOW YARITU WORKS.png" alt="Return it icon" width={100} height={100} />
                  <h3>Return it</h3>
                  <p>non, vitae tortor. commodo Ut lobortis, odio Cras porta Ut eget ipsum laoreet cursus elit Nullam Morbi eu In adipiscing ex felis, lacus, sed sollicitudin. Nam</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-testimonials" className="section-container">
          <h2 className="section-title">What Our <span className="highlight">Clients Say</span></h2>
          <p className="section-subtitle">Real experiences from our satisfied customers</p>
          <div className="testimonials-grid">
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 1" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 2" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 3" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 4" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 5" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 6" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 7" width={280} height={400} /></div>
            <div className="testimonial-card"><Image src="/images/Rectangle 4.png" alt="Testimonial 8" width={280} height={400} /></div>
          </div>
        </section>
      </div>
    </>
  );
}