import React from 'react';
import { Search } from 'lucide-react';
import './App.css';

const JewelryStore = () => {
  // Hero section images
  const heroImages = [
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&h=400"
  ];

  // Best selling items images
  const bestSellerImages = [
    "https://images.unsplash.com/photo-1586878341440-8640f7f77b5d?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1575863438850-fb1c06ad86d9?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&h=300"
  ];

  // Editorial section images
  const editorialImages = [
    "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1575863438850-fb1c06ad86d9?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1586878341440-8640f7f77b5d?auto=format&fit=crop&w=200&h=200",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&h=200"
  ];

  // Editorial categories
  const categories = ['ELLE', 'VOGUE', 'STYLE', 'ELLE', 'VOGUE', 'STYLE', 'ELLE', 'VOGUE'];

  return (
    <div className="main-container">
      <nav className="nav-container">
        <div className="container nav-content">
          <div className="search-container">
            <div className="search-icon">
              <Search size={16} />
            </div>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Collections</a>
            <a href="#" className="nav-link">About Us</a>
            <a href="#" className="nav-link">Contact Us</a>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to Shyara Gold</h1>
            <p className="hero-subtitle">JEWELLERY WITH MODERN DESIGN</p>
          </div>
          <div className="hero-image-container">
            <img 
              src={heroImages[0]} 
              alt="Jewelry model" 
              className="hero-image" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/600/400";
              }}
            />
            <div className="hero-badge">Shades of Love</div>
          </div>
        </div>
      </section>

      <section className="best-sellers">
        <div className="container">
          <h2 className="section-title">BEST SELLING ITEMS</h2>
          <div className="products-grid">
            {bestSellerImages.map((img, index) => (
              <div key={index} className="product-card">
                <img 
                  src={img} 
                  alt={`Product ${index + 1}`} 
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/300/300";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial">
        <div className="container">
          <h2 className="section-title">EDITORIAL</h2>
          <div className="editorial-grid">
            {editorialImages.map((img, index) => (
              <div key={index} className="editorial-item">
                <img 
                  src={img} 
                  alt={`Editorial ${index + 1}`} 
                  className="editorial-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/200/200";
                  }}
                />
                <div className="editorial-badge">{categories[index]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JewelryStore;