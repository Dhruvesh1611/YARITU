import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Shyara Gold</h1>
          <p>Jewellery with Modern Design</p>
        </div>
      </section>
      
      {/* Jewelry Store Info */}
      <section className="store-info">
        <h2>Jewellery Store</h2>
        <p>
          Offering consumers a choice of glittering options for their decoration
          to improve their appearance is a crucial component of Shyara Gold’s company.
        </p>
      </section>

      {/* Best Selling Items */}
      <section className="best-selling">
        <h2>Best Selling Items</h2>
        <div className="grid-container">
          {/* Images will be mapped here */}
        </div>
      </section>

      {/* Editorial Section */}
      <section className="editorial">
        <h2>Editorial</h2>
        <div className="editorial-grid">
          {/* Styled image collage */}
        </div>
      </section>
    </div>
  );
};

export default Home;
