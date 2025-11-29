// app/contact/page.js
'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // First, try the backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

        // Also post to admin storage so submissions are saved for admins to view
        try {
          fetch('/api/admin/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }).catch(err => console.warn('Admin save failed', err));
        } catch (e) {
          console.warn('Admin save error', e);
        }

      const result = await response.json();

      if (response.ok) {
        console.log('Email processed successfully:', result);
        setSubmitStatus('success');
        
        // Clear form after success
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
          setSubmitStatus(null);
        }, 3000);

      } else {
        console.error('Backend email failed, trying alternative method...');
        
        // Fallback: Create a detailed mailto link
        const emailBody = `
New Contact Form Submission from Yaritu Website

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject || 'No subject'}

Message:
${formData.message}

Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        const mailtoLink = `mailto:dhruveshshyaraog@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact Form Submission from Yaritu Website')}&body=${encodeURIComponent(emailBody)}`;

        // Open mailto link
        window.open(mailtoLink, '_blank');
        
        setSubmitStatus('success');
        
        // Clear form
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
          setSubmitStatus(null);
        }, 3000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <section id="hero-section" className={styles.contactHeroSection}>
        <div className={styles.contactHeroContent}>
          <h1>Get in <span className={styles.accentText}>Touch</span></h1>
          <p>We'd love to hear from you. Let's create something beautiful together.</p>
        </div>
      </section>
      <section id="contact-section" className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.formWrapper}>
            <h2>Send us a Message</h2>
            {submitStatus === 'success' && (
              <div className={styles.successMessage}>
                Your message has been sent successfully! We'll get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className={styles.errorMessage}>
                Failed to send message. Please try again or contact us directly.
              </div>
            )}
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formField}>
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className={styles.infoWrapper}>
            <h2>Contact Information</h2>
            <div className={styles.infoCardsContainer}>
              <div className={styles.infoCard}>
                <Image
                  src="/images/location.png"
                  alt="Location icon"
                  className={styles.infoIcon}
                  width={24}
                  height={24}
                  // style={{ width: 'auto', height: 'auto' }}
                />
                <div className={styles.infoText}>
                  <h3>Visit Us</h3>
                  
                  <p>Pruvachi Private Limited
301, 3rd Floor, Shantam Complex, Near Amiras Hotel, Sarthana Jakatnaka, Surat, Gujarat 395013, India</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <Image
                  src="/images/call.png"
                  alt="Call icon"
                  className={styles.infoIcon}
                  width={24}
                  height={24}
                  // style={{ width: 'auto', height: 'auto' }}
                />
                <div className={styles.infoText}>
                  <h3>Call Us</h3>
                  <p>+91 8401721212</p>
                  
                </div>
              </div>
              <div className={styles.infoCard}>
                <Image
                  src="/images/email.png"
                  alt="Email icon"
                  className={styles.infoIcon}
                  width={24}
                  height={24}
                  // style={{ width: 'auto', height: 'auto' }}
                />
                <div className={styles.infoText}>
                  <h3>Email Us</h3>
                  <p>sales@yaritu.com</p>
                 
                </div>
              </div>
              <div className={styles.infoCard}>
                <Image
                  src="/images/time.png"
                  alt="Time icon"
                  className={styles.infoIcon}
                  width={24}
                  height={24}
                  // style={{ width: 'auto', height: 'auto' }}
                />
                <div className={styles.infoText}>
                  <h3>Business Hours</h3>
                  <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p>Sun: 12:00 PM - 6:00 PM</p>
                </div>
              </div>
              <div className={`${styles.infoCard} ${styles.socialCard}`}>
                <h3>Connect With Us</h3>
                <div className={styles.contactSocialLinks}>
                  <a href="https://www.instagram.com/yaritu.official/?hl=en" target="_blank" rel="noopener noreferrer"><img src="/images/instagram.png" alt="Instagram" width="40" height="40"  decoding="async" /></a>
                  <a href="https://www.facebook.com/yaritu.official/" target="_blank" rel="noopener noreferrer"><img src="/images/facebook.png" alt="Facebook" width="40" height="40"  decoding="async" /></a>
                  {/* Open default mail client when clicking Gmail icon */}
                  <a href="mailto:sales@yaritu.com?subject=Enquiry%20from%20YARITU%20Website">
                    <img src="/images/gmail.png" alt="Gmail" width="40" height="40" decoding="async" />
                  </a>
                </div>
                <p className={styles.socialCaption}>Follow us for the latest updates and exclusive offers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}