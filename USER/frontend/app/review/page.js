import React from 'react';
import Image from 'next/image';
import './review.css';

export default function Review() {
  return (
    <>
      <section id="reviews">
        <div className="reviews-background">
          <div className="container reviews-content">
            <h2 className="reviews-title">Customer <span className="highlight">review</span></h2>
            <p className="reviews-subtitle">Real experiences from our satisfied customers</p>
            
            <div className="review-gallery">
              <Image src="/images/22a525227c4859c899ee207c78c2255c5ee964a2.png" alt="Customer review photo 1" className="gallery-photo photo-1" width={212} height={310} />
              <Image src="/images/0d8b26f69d316ab30e8a87fb58d316f1d938490f.png" alt="Customer review photo 2" className="gallery-photo photo-2" width={244} height={387} />
              <Image src="/images/8160faffe082ec7e2fd5e8a97009a8cd83b2648c.png" alt="Customer review photo 3" className="gallery-photo photo-3" width={212} height={310} />
              <Image src="/images/0d8b26f69d316ab30e8a87fb58d316f1d938490f.png" alt="Customer review photo 4" className="gallery-photo photo-4" width={244} height={387} />
              <Image src="/images/8160faffe082ec7e2fd5e8a97009a8cd83b2648c.png" alt="Customer review photo 5" className="gallery-photo photo-5" width={212} height={310} />
            </div>
          </div>
        </div>
        <a href="#" className="whatsapp-float">
          <Image src="/images/2040_1062.svg" alt="WhatsApp" width={50} height={50} />
        </a>
      </section>
      <section id="testimonials">
        <div className="container">
          <h2 className="testimonials-title">What Our <span className="highlight">Clients Say</span></h2>
          <div className="testimonial-grid">
            {[...Array(8)].map((_, i) => (
              <div className="testimonial-card" key={i}>
                <div className="card-content">
                  {i === 0 && <p className="card-text">text</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
