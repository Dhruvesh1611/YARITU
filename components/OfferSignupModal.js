"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function OfferSignupModal({ openAfter = 5000 }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const timerRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    // show modal after `openAfter` ms
    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, openAfter);

    return () => clearTimeout(timerRef.current);
  }, [openAfter]);

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    // prevent background scroll
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Send signup to the new offers endpoint
    // Ensure phone starts with +91
    let phoneToSend = (form.phone || '').trim();
    if (phoneToSend && !phoneToSend.startsWith('+')) {
      // strip any leading zeros or non-digit characters then prefix
      phoneToSend = phoneToSend.replace(/^0+/, '').replace(/[^0-9]/g, '');
      phoneToSend = '+91' + phoneToSend;
    } else if (phoneToSend && phoneToSend.startsWith('+') && !phoneToSend.startsWith('+91')) {
      // If user included another country code, keep it as-is
    }

    const payload = { ...form, phone: phoneToSend };

    // Send offer signup and also save phone to subscriptions so admin can see subscribed mobile numbers
    const offerReq = fetch('/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(res => (res.ok ? res.json() : Promise.reject(res)));

    // Save phone to subscriptions (idempotent - route will skip duplicates)
    const subReq = fetch('/api/admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneToSend, name: form.name, email: form.email }),
    }).then(res => (res.ok ? res.json() : Promise.reject(res)));

    Promise.allSettled([offerReq, subReq]).then(results => {
      const ok = results.some(r => r.status === 'fulfilled');
      if (ok) {
        console.log('Signup results', results);
        setSubmitted(true);
      } else {
        console.warn('Both signup and subscription failed', results);
        // show success UX? For now we surface a console warning; keep user on form
        alert('Could not save your details right now. Please try again later.');
      }
    }).catch(err => {
      console.warn('Offer signup save failed', err);
      alert('Could not save your details right now. Please try again later.');
    });
  };

  if (!open) return null;

  return (
    <div className="offer-modal-overlay" role="dialog" aria-modal="true" aria-label="Get special deals form">
      <div className="offer-modal-backdrop" onClick={close} />
      <div className="offer-modal offer-modal-two-col">
        <button className="offer-modal-close" onClick={close} aria-label="Close">✕</button>
        <div className="offer-modal-left">
          {/* Left brand image fills the whole left panel */}
          <div className="offer-modal-brand-img">
            <Image
              src="/images/offer_card.png"
              alt="Yaritu brand"
              fill
              sizes="(max-width: 880px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
  <div className="offer-modal-right" style={{ paddingRight: '36px' }}>
          {/* logo removed from mobile to keep the right column focused on the form */}
          {submitted ? (
            <div className="offer-modal-success">
              <h3>Thank You!</h3>
              <p>Our team will be reaching out to you soon.</p>
              <button onClick={close} className="offer-modal-submit">Close</button>
            </div>
          ) : (
            <>
              <h3 className="offer-modal-title">Unlock Your Exclusive Offers</h3>
              <p className="offer-modal-sub">Fill in your details to receive personalised deals</p>
              <form className="offer-modal-form" onSubmit={onSubmit}>
                <input ref={firstInputRef} name="name" value={form.name} onChange={onChange} placeholder="Your Name" required />
                <input name="email" value={form.email} onChange={onChange} placeholder="Your Email" type="email" required />
                <div className="offer-modal-phone-wrapper">
                  {/* <span className="phone-prefix">🇮🇳</span> */}
                  {/* <span className="phone-code phone-code-left">+91</span> */}
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="Mobile Number" inputMode="tel" className="phone-input" />
                </div>
                <button type="submit" className="offer-modal-submit">GET SPECIAL DEALS</button>
              </form>
              <small className="offer-modal-note">By submitting you agree to our Privacy Policy</small>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
