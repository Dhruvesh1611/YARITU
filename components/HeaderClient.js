// components/HeaderClient.js

'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { usePathname } from 'next/navigation';
import { useUI } from '../contexts/UIProvider';
import { useSession, signOut } from 'next-auth/react';

export default function HeaderClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isMenuOpen, toggleMenu, closeMenu } = useUI();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);
  
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);
  
  const navLinkClass = (path) => `${styles.navLink} ${pathname === path ? styles.active : ''}`;

  return (
    <>
      <header className={`${styles.mainHeader} ${isScrolled ? styles.scrolled : ''}`}>
          <nav className={styles.mainNav}>
              <div className={styles.navCenter}>
                  <div className={styles.navGroup}>
                      {session && session.user && session.user.role === 'admin' && (
                        <Link href="/admin" className={styles.navLink} style={{ marginRight: 12 }}>Admin</Link>
                      )}
                      <Link href="/" className={navLinkClass('/')}>Home</Link>
                      <Link href="/collection" className={navLinkClass('/collection')}>Collections</Link>
                  </div>

                  <Link href="/" className={styles.navLogo}>
                    <Image
                        src="/images/yaritu_logo_black.svg"
                        alt="Yaritu Logo"
                        fill
                        sizes="(max-width: 480px) 100px, 160px"
                        style={{ objectFit: 'contain' }}
                      />
                  </Link>

                  <div className={styles.navGroup}>
                      <Link href="/about" className={navLinkClass('/about')}>About</Link>
                      <Link href="/contact" className={navLinkClass('/contact')}>Contact</Link>
                      <Link href="/review" className={navLinkClass('/review')}>Reviews</Link>
                      {/* admin quick links removed from right-side navbar - single Admin button moved to left */}
                      {session && (
                        <button onClick={() => signOut({ callbackUrl: '/' })} className={`${styles.navLink} ${styles.logoutButton}`}>
                          Logout
                        </button>
                      )}
                  </div>
              </div>
              <Link href="/offer" className={styles.navOffers}>
                  <Image src="/images/gift.svg" alt="Hot Sale Icon" className={styles.offerIcon} width={30} height={30} />
                  <span>OFFERS</span>
              </Link>
              <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
                  <div className={`${styles.hamburgerBox} ${isMenuOpen ? styles.open : ''}`}>
                      <div className={styles.hamburgerInner}></div>
                  </div>
              </button>
          </nav>
      </header>

      {/* Mobile Nav */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileLogoWrap}>
           <Link href="/" onClick={closeMenu}>
             <Image src="/images/yaritu_logo_black.svg" alt="Yaritu" width={90} height={66} style={{ width: 'auto', height: 'auto' }} />
           </Link>
         </div>
          <Link href="/" className={styles.mobileNavLink} onClick={closeMenu}>Home</Link>
          <Link href="/collection" className={styles.mobileNavLink} onClick={closeMenu}>Collections</Link>
          <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>About</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={closeMenu}>Contact</Link>
          <Link href="/review" className={styles.mobileNavLink} onClick={closeMenu}>Reviews</Link>
          <Link href="/offer" className={styles.mobileNavLink} onClick={closeMenu}>Offers</Link>
          {session && session.user && session.user.role === 'admin' && (
            <Link href="/admin" className={styles.mobileNavLink} onClick={closeMenu}>Admin</Link>
          )}
          {session && (
            <button onClick={() => { signOut({ callbackUrl: '/' }); closeMenu(); }} className={`${styles.mobileNavLink} ${styles.mobileLogoutButton}`}>
              Logout
            </button>
          )}
      </div>
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </>
  );
}