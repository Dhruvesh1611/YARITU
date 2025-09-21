'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Header.css';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    // Close menu on route change
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="main-header">
          <nav className="main-nav">
              <div className="nav-center">
                  <div className="nav-group nav-left">
                      <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
                      <Link href="/collection" className={`nav-link ${pathname === '/collection' ? 'active' : ''}`}>Collections</Link>
                  </div>
                  <Link href="/" className="nav-logo">
                      <Image src="/images/yaritu_logo_black.png" alt="Yaritu Logo" width={160} height={75} />
                  </Link>
                  <div className="nav-group nav-right">
                      <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
                      <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                      <Link href="/review" className={`nav-link ${pathname === '/review' ? 'active' : ''}`}>Reviews</Link>
                  </div>
              </div>
              <Link href="/offer" className="nav-offers">
                  <Image src="/gift.svg" alt="Hot Sale Icon" className="offer-icon" width={37} height={37} />
                  <span>OFFERS</span>
              </Link>

              <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                  <div className={`hamburger-box ${menuOpen ? 'open' : ''}`}>
                      <div className="hamburger-inner"></div>
                  </div>
              </button>
          </nav>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
          <Link href="/home" className="mobile-nav-link">Home</Link>
          <Link href="/collection" className="mobile-nav-link">Collections</Link>
          <Link href="/about" className="mobile-nav-link">About</Link>
          <Link href="/contact" className="mobile-nav-link">Contact</Link>
          <Link href="/review" className="mobile-nav-link">Reviews</Link>
          <Link href="/offer" className="mobile-nav-link">Offers</Link>
      </div>
      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
}
