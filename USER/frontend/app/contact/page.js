import React from 'react';
import './contact.css';
import Image from 'next/image';

export default function Contact() {
  return (
    <>
      <section id="hero-section" className="contact-hero-section">
        <div className="contact-hero-content">
          <h1>Get in <span className="accent-text">Touch</span></h1>
          <p>We'd love to hear from you. Let's create something beautiful together.</p>
        </div>
      </section>
      <section id="contact-section" className="contact-section">
        <div className="contact-container">
          <div className="form-wrapper">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="full-name">Full Name</label>
                  <input type="text" id="full-name" name="full-name" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" />
                </div>
                <div className="form-field">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" rows="5"></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

          <div className="info-wrapper">
            <h2>Contact Information</h2>
            <div className="info-cards-container">
              <div className="info-card">
                <Image src="/images/1927_1922.svg" alt="Location icon" className="info-icon" width={24} height={24} />
                <div className="info-text">
                  <h3>Visit Us</h3>
                  <p>123 Wedding Street</p>
                  <p>Fashion District, Mumbai 400001</p>
                </div>
              </div>
              <div className="info-card">
                <Image src="/images/1927_1920.svg" alt="Call icon" className="info-icon" width={24} height={24} />
                <div className="info-text">
                  <h3>Call Us</h3>
                  <p>+91 98765 43210</p>
                  <p>+91 98765 43211</p>
                </div>
              </div>
              <div className="info-card">
                <Image src="/images/1927_1918.svg" alt="Email icon" className="info-icon" width={24} height={24} />
                <div className="info-text">
                  <h3>Email Us</h3>
                  <p>info@yaritu.com</p>
                  <p>support@yaritu.com</p>
                </div>
              </div>
              <div className="info-card">
                <Image src="/images/1927_1915.svg" alt="Time icon" className="info-icon" width={24} height={24} />
                <div className="info-text">
                  <h3>Business Hours</h3>
                  <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p>Sun: 12:00 PM - 6:00 PM</p>
                </div>
              </div>
              <div className="info-card social-card">
                <h3>Connect With Us</h3>
                <div className="contact-social-links">
                  <a href="#"><Image src="/images/instagram.png" alt="Instagram" width={16} height={16} /></a>
                  <a href="#"><Image src="/images/facebook.png" alt="Facebook" width={16} height={16} /></a>
                  <a href="#"><Image src="/images/gmail.png" alt="Gmail" width={16} height={16} /></a>
                </div>
                <p className="social-caption">Follow us for the latest updates and exclusive offers</p>
              </div>
            </div>
          </div>
        </div>
        <a href="#" className="contact-whatsapp-float">
          <Image src="/images/whatsapp.png" alt="WhatsApp" width={45} height={45} />
        </a>
      </section>
    </>
  );
}
