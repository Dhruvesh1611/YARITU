import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="footer-container">
            <div className="footer-about">
                <div className="footer-logo" style={{ position: 'relative', width: '320px', height: '90px' }}>
                    <Image
                        src="/images/yaritu_logo_white.svg"
                        alt="Yaritu Logo"
                        fill
                        sizes="(max-width: 600px) 160px, (max-width: 992px) 200px, 254px"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <p>Step into a world of elegance and grace with Yaritu’s gallery. Explore trending festival looks, celebrity attire, top-rated outfits, and a variety of collection that reflect the pulse of Indian Fashion.</p>
                <div className="social-links">
                    <a href="https://www.facebook.com/yaritu.official/" target="_blank" rel="noopener noreferrer"><Image src="/images/facebook.png" alt="Facebook" width={40} height={40} loading="lazy" /></a>
                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"><Image src="/images/logos_whatsapp-icon.png" alt="WhatsApp" width={40} height={40} loading="lazy" /></a>
                    <a href="https://www.instagram.com/yaritu.official/?hl=en" target="_blank" rel="noopener noreferrer"><Image src="/images/instagram.png" alt="Instagram" width={40} height={40} loading="lazy" /></a>
                    <a href="https://www.youtube.com/channel/UCVF9Z3xxiAKZu8j5D2CjSYQ" target="_blank" rel="noopener noreferrer"><Image src="/images/youtube.png" alt="YouTube" width={40} height={40} loading="lazy" /></a>
                </div>
            </div>
            <div className="footer-links">
                <h3>Quick Links</h3>
                <ul>
                    <li><Link href="/">HOME</Link></li>
                    <li><Link href="/about">ABOUT US</Link></li>
                    <li><Link href="/contact">CONTACT US</Link></li>
                    <li><Link href="/about#about-stores">STORES</Link></li>
                </ul>
            </div>
            <div className="footer-contact">
                <h3>Contact Us</h3>
                <p><a href="mailto:sales@yaritu.com">sales@yaritu.com</a></p>
                <p><a href="tel:+918401721212">+91 84017 21212</a></p>
                <address>Pruvachi Private Limited, 301, 3rd Floor, Shantam Complex, Near Amiras Hotel, Sarthana Jakatnaka, 395013, Surat, Gujarat, India</address>
            </div>
        </div>
                <div className="footer-credits">
                        <span>
                            Website developed by <a href="https://www.instagram.com/shyaradhruvesh?igsh=Njl2OW9zb20yYnFy&utm_source=qr" target="_blank" rel="noopener noreferrer"><strong>Dhruvesh Shyara</strong></a>
                        </span>
                </div>
    </footer>
  );
}
