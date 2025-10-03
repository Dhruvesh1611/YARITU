// components/Header.js

'use client';
import React, { useState, useEffect } from 'react'; // <-- Yahan par mistake theek kar di hai
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
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
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Helper function to create dynamic class names
  const navLinkClass = (path) => {
    return `${styles.navLink} ${pathname === path ? styles.active : ''}`;
  };

  return (
    <>
      <header className={styles.mainHeader}>
          <nav className={styles.mainNav}>
              <div className={styles.navCenter}>
                  <div className={styles.navGroup}>
                      <Link href="/" className={navLinkClass('/')}>Home</Link>
                      <Link href="/collection" className={navLinkClass('/collection')}>Collections</Link>
                  </div>
                  <Link href="/" className={styles.navLogo}>
                      <Image src="/images/yaritu_logo_black.png" alt="Yaritu Logo" width={160} height={75} />
                  </Link>
                  <div className={styles.navGroup}>
                      <Link href="/about" className={navLinkClass('/about')}>About</Link>
                      <Link href="/contact" className={navLinkClass('/contact')}>Contact</Link>
                      <Link href="/review" className={navLinkClass('/review')}>Reviews</Link>
                  </div>
              </div>
              <Link href="/offer" className={styles.navOffers}>
                  <Image src="/images/gift.svg" alt="Hot Sale Icon" className={styles.offerIcon} width={37} height={37} />
                  <span>OFFERS</span>
              </Link>

              <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
                  <div className={`${styles.hamburgerBox} ${menuOpen ? styles.open : ''}`}>
                      <div className={styles.hamburgerInner}></div>
                  </div>
              </button>
          </nav>
      </header>

      <div className={`${styles.mobileNav} ${menuOpen ? styles.open : ''}`}>
         <div className={styles.mobileLogoWrap}>
           <Link href="/">
             <Image src="/images/yaritu_logo_black.png" alt="Yaritu" width={120} height={56} />
           </Link>
         </div>
         <Link href="/" className={styles.mobileNavLink}>Home</Link>
          <Link href="/collection" className={styles.mobileNavLink}>Collections</Link>
          <Link href="/about" className={styles.mobileNavLink}>About</Link>
          <Link href="/contact" className={styles.mobileNavLink}>Contact</Link>
          <Link href="/review" className={styles.mobileNavLink}>Reviews</Link>
          <Link href="/offer" className={styles.mobileNavLink}>Offers</Link>
      </div>
      {menuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </>
  );
}