import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "./App.css";

const pages = [
  {
    id: 1,
    title: "Modern Elegance",
    subtitle: "Discover our latest collection"
  },
  {
    id: 2,
    title: "Timeless Beauty",
    subtitle: "Handcrafted with passion"
  },
  {
    id: 3,
    title: "Royal Collection",
    subtitle: "For those who deserve the best"
  },
  {
    id: 4,
    title: "Wedding Series",
    subtitle: "Make your special day perfect"
  }
];

// Import your images
import image1 from './assets/img/image1.png';
import image2 from './assets/img/image2.png';
import image3 from './assets/img/image3.png';
import image4 from './assets/img/image4.png';

import b1 from './assets/img/b1.png';
import b2 from './assets/img/b2.png';
import b3 from './assets/img/b3.png';
import b4 from './assets/img/b4.png';
import b5 from './assets/img/b5.png';
import b6 from './assets/img/b6.png';

import e1 from './assets/img/e1.webp';
import e2 from './assets/img/e2.webp';
import e3 from './assets/img/e3.webp';
import e4 from './assets/img/e4.webp';
import e5 from './assets/img/e5.webp';
import e6 from './assets/img/e6.webp';
import e7 from './assets/img/e7.webp';
import e8 from './assets/img/e8.webp';

import logo from './assets/img/logo.png';

const JewelryStore = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 4); // 4 images to cycle through
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, []);

  // Array of images to display in the hero section
  const images = [image1, image2, image3, image4];

  return (
    <div className="store-container">
      {/* Header */}
      <header className="header">
        <nav className="nav-container">
        <div className="logo-container">
            <img src={logo} alt="Shyara Gold Logo" className="logo" />
          </div>
          <div className="search-container">
            <div className="search-icon">
              <Search className="search-icon-svg" />
            </div>
            <input
              type="search"
              placeholder="Search"
              className="search-input"
            />
          </div>
          <ul className="nav-links">
            <li>Home</li>
            <li>Collection</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <img
          src={images[currentImage]} // Display the current image based on the state
          alt="Hero Image"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>{pages[currentImage].title}</h1>
          <p>{pages[currentImage].subtitle}</p>
        </div>
        <div className="page-indicators">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`indicator ${currentImage === index ? "active" : ""}`}
            />
          ))}
        </div>
      </section>

      <main className="main-content">
        <section className="store-description">
          <div className="image-grid">
            <img src={b1} alt="Jewelry piece" />
            <img src={b2} alt="Jewelry piece" />
          </div>
          <div className="description-content">
            <h2>JEWELLERY STORE</h2>
            <p>Offering collector's choice of traditional and contemporary designs in regional fine appearance.</p>
            <p>We offer a wide range of designs both in gold and silver.</p>
          </div>
        </section>

        <section className="best-selling">
          <h2>BEST SELLING ITEMS</h2>
          <div className="items-grid">
            {[b1, b2, b3, b4, b5, b6].map((img, i) => (
              <div key={i} className="item-card">
                <img src={img} alt={`Best selling item ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="editorial">
          <h2>EDITORIAL</h2>
          <div className="editorial-grid">
            {[e1, e2, e3, e4, e5, e6, e7, e8].map((img, i) => (
              <div key={i} className="editorial-card">
                <img src={img} alt={`Editorial image ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="featured">
          <h2>FEATURED COLLECTION</h2>
          <div className="featured-grid">
            {["https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw2e92b445/images/hi-res/501X19FQQAA00_1.jpg?sw=300x300",
              "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw68bbae49/images/hi-res/50D4FFBCKAA02_1.jpg?sw=300x300",
              "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw6affd232/images/hi-res/50D2FFBRUAA09_1.jpg?sw=300x300",
              "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dwcbdedf41/images/hi-res/50D3FFNKRAA02_1.jpg?sw=300x300",
              "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dwea028814/images/Mia/hi-res/3822NTU.jpg?sw=300x300",
              "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw4fb5147a/images/hi-res/50O4M12FJDBA02_1.jpg?sw=300x300",
            ].map((img, i) => (
              <div key={i} className="featured-card">
                <img src={img} alt={`Featured item ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li>Home</li>
                <li>Collection</li>
                <li>About Us</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div className="footer-info">
              <h3>Contact Us</h3>
              <p>Email: support@shyaragold.com</p>
              <p>Phone: +123 456 7890</p>
              <p>Address: 123 Gold Street, City, Country</p>
            </div>
          </div>
          <p className="footer-bottom">&copy; 2025 Shyara Gold. All rights reserved.</p>
        </footer>
      </main >
    </div >
  );
};

export default JewelryStore;
