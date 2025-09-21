'use client';
import React, { useState, useEffect } from 'react';
import './collection.css';
import Image from 'next/image';
import Pagination from '../../components/Pagination';
import ProductModal from '../../components/ProductModal';

// In a real app, this would come from a CMS or API
const allProducts = [
  { id: 1, name: 'Royal Gold Sherwani', category: 'MEN', type: 'SHERVANI', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Sherwani', description: 'men • sherwani' },
  { id: 2, name: 'Classic Black Suit', category: 'MEN', type: 'SUIT', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Suit', description: 'men • suit' },
  { id: 3, name: 'Modern Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 4, name: 'Navy Formal Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 5, name: 'Elegant Wedding Sherwani', category: 'MEN', type: 'SHERVANI', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Sherwani', description: 'men • sherwani' },
  { id: 6, name: 'Three-Piece Suit', category: 'MEN', type: 'SUIT', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Suit', description: 'men • suit' },
  { id: 7, name: 'Crimson Red Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 8, name: 'Midnight Blue Gown', category: 'WOMEN', type: 'GOWN', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 9, name: 'Pastel Saree', category: 'WOMEN', type: 'SAREE', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Saree', description: 'women • saree' },
  { id: 10, name: 'Little Prince Suit', category: 'CHILDREN', type: 'BOYS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Suit', description: 'children • boys' },
  { id: 11, name: 'Princess Pink Gown', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Gown', description: 'children • girls' },
  { id: 12, name: 'Floral Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 13, name: 'Velvet Tuxedo Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 14, name: 'Emerald Green Gown', category: 'WOMEN', type: 'GOWN', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 15, name: 'Golden Silk Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 16, name: 'Ivory Indo-Western', category: 'WOMEN', type: 'INDO WESTERN', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'women • indo western' },
  { id: 17, name: 'Festive Kurta Set', category: 'CHILDREN', type: 'BOYS', occasion: 'SANGEET', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Kurta', description: 'children • boys' },
  { id: 18, name: 'Sparkle Party Frock', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Frock', description: 'children • girls' },
  { id: 19, name: 'Royal Gold Sherwani', category: 'MEN', type: 'SHERVANI', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Sherwani', description: 'men • sherwani' },
  { id: 20, name: 'Classic Black Suit', category: 'MEN', type: 'SUIT', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Suit', description: 'men • suit' },
  { id: 21, name: 'Modern Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 22, name: 'Navy Formal Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 23, name: 'Elegant Wedding Sherwani', category: 'MEN', type: 'SHERVANI', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Sherwani', description: 'men • sherwani' },
  { id: 24, name: 'Three-Piece Suit', category: 'MEN', type: 'SUIT', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Suit', description: 'men • suit' },
  { id: 25, name: 'Crimson Red Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 26, name: 'Midnight Blue Gown', category: 'WOMEN', type: 'GOWN', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 27, name: 'Pastel Saree', category: 'WOMEN', type: 'SAREE', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Saree', description: 'women • saree' },
  { id: 28, name: 'Little Prince Suit', category: 'CHILDREN', type: 'BOYS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Suit', description: 'children • boys' },
  { id: 29, name: 'Princess Pink Gown', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Gown', description: 'children • girls' },
  { id: 30, name: 'Floral Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 31, name: 'Velvet Tuxedo Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 32, name: 'Emerald Green Gown', category: 'WOMEN', type: 'GOWN', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 33, name: 'Golden Silk Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 34, name: 'Ivory Indo-Western', category: 'WOMEN', type: 'INDO WESTERN', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'women • indo western' },
  { id: 35, name: 'Festive Kurta Set', category: 'CHILDREN', type: 'BOYS', occasion: 'SANGEET', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Kurta', description: 'children • boys' },
  { id: 36, name: 'Sparkle Party Frock', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Frock', description: 'children • girls' },
  // Add more products as needed
];

const PRODUCTS_PER_PAGE = 8;

export default function Collection() {
  const [activeCategory, setActiveCategory] = useState('MEN');
  const [activeType, setActiveType] = useState(null);
  const [activeOccasion, setActiveOccasion] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let products = allProducts.filter(p => p.category === activeCategory);
    if (activeType) {
      products = products.filter(p => p.type === activeType);
    } else if (activeOccasion) {
      products = products.filter(p => p.occasion === activeOccasion);
    }
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeCategory, activeType, activeOccasion]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProduct]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveType(null);
    setActiveOccasion(null);
  };

  const handleTypeClick = (category, type) => {
    setActiveCategory(category);
    setActiveType(type);
    setActiveOccasion(null); // Reset occasion filter
  };

  const handleOccasionClick = (category, occasion) => {
    setActiveCategory(category);
    setActiveOccasion(occasion);
    setActiveType(null); // Reset type filter
  };

  const getBreadcrumbs = () => {
    if (activeType) {
      return `${activeCategory} > RENT BY TYPE > ${activeType}`;
    }
    if (activeOccasion) {
      return `${activeCategory} > RENT BY OCATION > ${activeOccasion}`;
    }
    return activeCategory;
  };

  return (
    <main>
      <section id="collection" className="collection-section">
        <div className="container">
          <h1 className="section-title">Our <span className="highlight">Collection</span></h1>
          <hr className="divider" />

          <div className="category-buttons">
            {/* MEN */}
            <div className="category-button-container">
              <button onClick={() => handleCategoryClick('MEN')} className="category-button">
                <Image src="/images/2195_79.svg" alt="Men category background glow" className="btn-glow" width={252} height={50} />
                <div className="btn-bg"></div>
                <span className="btn-text">MEN</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-column">
                  <h4>RENT BY TYPE</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('MEN', 'SHERVANI'); }}>SHERVANI</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('MEN', 'INDO WESTERN'); }}>INDO WESTERN</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('MEN', 'SUIT'); }}>SUIT</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('MEN', 'BLAZER'); }}>BLAZER</a></li>
                  </ul>
                </div>
                <div className="dropdown-column">
                  <h4>RENT BY OCATION</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('MEN', 'WEDDING'); }}>WEDDING</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('MEN', 'PRE WEDDING SHOOT'); }}>PRE WEDDING SHOOT</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('MEN', 'SANGEET'); }}>SANGEET</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('MEN', 'COCKTAIL PARTY'); }}>COCKTAIL PARTY</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* WOMEN */}
            <div className="category-button-container">
              <button onClick={() => handleCategoryClick('WOMEN')} className="category-button">
                <Image src="/images/2195_84.svg" alt="Women category background glow" className="btn-glow" width={252} height={50} />
                <div className="btn-bg"></div>
                <span className="btn-text">WOMEN</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-column">
                  <h4>RENT BY TYPE</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('WOMEN', 'LEHENGA'); }}>LEHENGA</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('WOMEN', 'GOWN'); }}>GOWN</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('WOMEN', 'INDO WESTERN'); }}>INDO WESTERN</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('WOMEN', 'SAREE'); }}>SAREE</a></li>
                  </ul>
                </div>
                <div className="dropdown-column">
                  <h4>RENT BY OCATION</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('WOMEN', 'WEDDING'); }}>WEDDING</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('WOMEN', 'PRE WEDDING SHOOT'); }}>PRE WEDDING SHOOT</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('WOMEN', 'SANGEET'); }}>SANGEET</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleOccasionClick('WOMEN', 'COCKTAIL PARTY'); }}>COCKTAIL PARTY</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CHILDREN */}
            <div className="category-button-container">
              <button onClick={() => handleCategoryClick('CHILDREN')} className="category-button">
                <Image src="/images/2195_89.svg" alt="Children category background glow" className="btn-glow" width={252} height={50} />
                <div className="btn-bg"></div>
                <span className="btn-text">CHILDREN</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-column">
                  <h4>BOYS COLLECTION</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'BOYS'); }}>SUIT</a></li>
                    <li><a href="#">KOTI</a></li>
                    <li><a href="#">SHIRT-PENT</a></li>
                    <li><a href="#">DHOTI</a></li>
                  </ul>
                </div>
                <div className="dropdown-column">
                  <h4>GIRLS COLLECTION</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'GIRLS'); }}>FROCK</a></li>
                    <li><a href="#">LEHENGA</a></li>
                    <li><a href="#">GOWN</a></li>
                    <li><a href="#">SAREE</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="collection-content">
            <p className="breadcrumbs">{getBreadcrumbs()}</p>
            <h2 className="collection-title">Royal Collection</h2>
            <p className="collection-subtitle">Explore our finest selection.</p>

            <div className="product-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <article className="product-card" key={product.id} onClick={() => handleProductClick(product)}>
                    <Image src={product.image} alt={product.name} className="product-image" width={300} height={349} unoptimized={true} />
                    <div className="card-info">
                      <p>{product.name}<br />{product.description}</p>
                    </div>
                  </article>
                ))
              ) : (
                <p>No products found for this selection.</p>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </section>
      <a href="#" className="whatsapp-fab">
        <Image src="/images/2139_1807.svg" alt="WhatsApp" width={45} height={45} />
      </a>
      <ProductModal product={selectedProduct} onClose={handleCloseModal} />
    </main>
  );
}
