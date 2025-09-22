'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './TestimonialsSlider.css';

const testimonials = [
  { id: 1, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 1' },
  { id: 2, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 2' },
  { id: 3, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 3' },
  { id: 4, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 4' },
  { id: 5, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 5' },
  { id: 6, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 6' },
  { id: 7, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 7' },
  { id: 8, image: '/images/Rectangle 4.png', alt: 'Customer testimonial 8' },
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(testimonials.length / 3));
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const itemsPerSlide = 3;
    const start = currentIndex * itemsPerSlide;
    const end = start + itemsPerSlide;
    return testimonials.slice(start, end);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const totalSlides = Math.ceil(testimonials.length / 3);

  return (
    <div className="testimonials-slider">
      <div className="testimonials-container">
        <div className="testimonials-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="testimonials-slide">
              {testimonials.slice(slideIndex * 3, (slideIndex + 1) * 3).map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.alt} 
                    width={280} 
                    height={400} 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="testimonials-dots">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSlider;
