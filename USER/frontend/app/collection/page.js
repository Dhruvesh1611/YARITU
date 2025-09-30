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
  { id: 37, name: 'Crimson Red Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 88, name: 'Midnight Blue Gown', category: 'WOMEN', type: 'GOWN', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 39, name: 'Pastel Saree', category: 'WOMEN', type: 'SAREE', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Saree', description: 'women • saree' },
  { id: 40, name: 'Little Prince Suit', category: 'CHILDREN', type: 'BOYS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Suit', description: 'children • boys' },
  { id: 41, name: 'Princess Pink Gown', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Gown', description: 'children • girls' },
  { id: 42, name: 'Floral Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 43, name: 'Velvet Tuxedo Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 44, name: 'Emerald Green Gown', category: 'WOMEN', type: 'GOWN', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 45, name: 'Golden Silk Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 46, name: 'Ivory Indo-Western', category: 'WOMEN', type: 'INDO WESTERN', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'women • indo western' },
  { id: 47, name: 'Festive Kurta Set', category: 'CHILDREN', type: 'BOYS', occasion: 'SANGEET', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Kurta', description: 'children • boys' },
  { id: 48, name: 'Sparkle Party Frock', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Frock', description: 'children • girls' },
  { id: 49, name: 'Royal Gold Sherwani', category: 'MEN', type: 'SHERVANI', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Sherwani', description: 'men • sherwani' },
  { id: 50, name: 'Classic Black Suit', category: 'MEN', type: 'SUIT', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Suit', description: 'men • suit' },
  { id: 51, name: 'Modern Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 52, name: 'Navy Formal Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 53, name: 'Elegant Wedding Sherwani', category: 'MEN', type: 'SHERVANI', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Sherwani', description: 'men • sherwani' },
  { id: 54, name: 'Three-Piece Suit', category: 'MEN', type: 'SUIT', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Suit', description: 'men • suit' },
  { id: 55, name: 'Crimson Red Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 56, name: 'Midnight Blue Gown', category: 'WOMEN', type: 'GOWN', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 57, name: 'Pastel Saree', category: 'WOMEN', type: 'SAREE', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Saree', description: 'women • saree' },
  { id: 58, name: 'Little Prince Suit', category: 'CHILDREN', type: 'BOYS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Suit', description: 'children • boys' },
  { id: 59, name: 'Princess Pink Gown', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Gown', description: 'children • girls' },
  { id: 60, name: 'Floral Indo-Western', category: 'MEN', type: 'INDO WESTERN', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'men • indo western' },
  { id: 61, name: 'Velvet Tuxedo Blazer', category: 'MEN', type: 'BLAZER', occasion: 'COCKTAIL PARTY', image: 'https://placehold.co/300x349/25334d/ffffff?text=Blazer', description: 'men • blazer' },
  { id: 62, name: 'Emerald Green Gown', category: 'WOMEN', type: 'GOWN', occasion: 'PRE WEDDING SHOOT', image: 'https://placehold.co/300x349/25334d/ffffff?text=Gown', description: 'women • gown' },
  { id: 63, name: 'Golden Silk Lehenga', category: 'WOMEN', type: 'LEHENGA', occasion: 'SANGEET', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Lehenga', description: 'women • lehenga' },
  { id: 64, name: 'Ivory Indo-Western', category: 'WOMEN', type: 'INDO WESTERN', occasion: 'WEDDING', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Indo-Western', description: 'women • indo western' },
  { id: 65, name: 'Festive Kurta Set', category: 'CHILDREN', type: 'BOYS', occasion: 'SANGEET', image: 'https://placehold.co/300x349/2a2a2a/ffffff?text=Boys+Kurta', description: 'children • boys' },
  { id: 66, name: 'Sparkle Party Frock', category: 'CHILDREN', type: 'GIRLS', occasion: 'BIRTHDAY', image: 'https://placehold.co/300x349/c5a46d/25334d?text=Girls+Frock', description: 'children • girls' },
  // Add more products as needed
  // Add more products as needed
];

const PRODUCTS_PER_PAGE = 8;

export default function Collection() {
  // Track client mount to avoid reading window during server render
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [activeCategory, setActiveCategory] = useState('MEN');
  const [activeType, setActiveType] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeOccasion, setActiveOccasion] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (2 per row) or 'single' (1 per row)

  useEffect(() => {
    let products = allProducts.filter(p => p.category === activeCategory);

    // If a subcategory is selected (e.g., BOYS or GIRLS under CHILDREN), prefer
    // matching product.type or description for that subcategory when filtering.
    if (activeSubcategory) {
      const sub = activeSubcategory.toUpperCase();
      products = products.filter(p => {
        const desc = (p.description || '').toUpperCase();
        const type = (p.type || '').toUpperCase();
        return type === sub || desc.includes(sub);
      });
    }

    if (activeType) {
      const t = activeType.toUpperCase();
      products = products.filter(p => {
        const type = (p.type || '').toUpperCase();
        const desc = (p.description || '').toUpperCase();
        return type === t || desc.includes(t) || (p.name || '').toUpperCase().includes(t);
      });
    } else if (activeOccasion) {
      products = products.filter(p => p.occasion === activeOccasion);
    }
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeCategory, activeType, activeOccasion, activeSubcategory]);

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
    setActiveSubcategory(null);
    setActiveOccasion(null);
  };

  // Mobile dropdown open state (category key or null)
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (category) => {
    // Guard with isClient so server render remains deterministic
    if (isClient && typeof window !== 'undefined' && window.innerWidth > 768) {
      // Desktop: do NOT change the active category or layout on click.
      // Keep hover behavior for showing the two-column dropdown. Clicking
      // the button should only toggle the 'open' state for accessibility
      // or keyboard users, not change the product layout.
      setOpenDropdown(prev => (prev === category ? null : category));
      return;
    }

    // Mobile behavior: first click opens the dropdown panel.
    // If the same category is clicked again while open, treat as a selection
    // and scroll to the collection title.
    if (openDropdown === category) {
      // Second click: set the category and scroll to results
      setOpenDropdown(null);
      setActiveCategory(category);
      setActiveType(null);
      setActiveOccasion(null);
      // smooth scroll to collection title on client
      if (isClient) {
        const title = document.querySelector('.collection-title');
        if (title) {
          const y = title.getBoundingClientRect().top + window.pageYOffset - 24;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
      return;
    }

    // Otherwise open the dropdown for this category (first click)
    setOpenDropdown(category);
  };

  // When a mobile dropdown is open, add a class to collection-content to push it down
  useEffect(() => {
    const el = document.querySelector('.collection-content');
    if (!el) return;
    if (openDropdown) {
      el.classList.add('dropdown-active');
    } else {
      el.classList.remove('dropdown-active');
    }
    // cleanup on unmount
    return () => el.classList.remove('dropdown-active');
  }, [openDropdown]);

  const handleTypeClick = (category, type, subcategory = null) => {
    setActiveCategory(category);
    setActiveType(type);
    setActiveSubcategory(subcategory);
    setActiveOccasion(null); // Reset occasion filter
    // Close any open mobile dropdown
    setOpenDropdown(null);
    // ensure collection content is in view on selection
    scrollToCollectionTitle();
  };

  const handleOccasionClick = (category, occasion, subcategory = null) => {
    setActiveCategory(category);
    setActiveOccasion(occasion);
    setActiveType(null); // Reset type filter
    setActiveSubcategory(subcategory);
    // Close any open mobile dropdown
    setOpenDropdown(null);
    // ensure collection content is in view on selection
    scrollToCollectionTitle();
  };

  // Client-only scroll helper
  const scrollToCollectionTitle = () => {
    if (!isClient) return;
    setTimeout(() => {
      const title = document.querySelector('.collection-title');
      if (title) {
        const y = title.getBoundingClientRect().top + window.pageYOffset - 24; // small offset
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const getBreadcrumbs = () => {
    // If we have a subcategory (e.g., BOYS / GIRLS under CHILDREN), show that first
      if (activeSubcategory && activeType) {
        return `${activeCategory} > ${activeSubcategory.toUpperCase()} Collection > ${activeType.toUpperCase()}`;
      }
      if (activeSubcategory && activeOccasion) {
        return `${activeCategory} > ${activeSubcategory.toUpperCase()} Collection > ${activeOccasion.toUpperCase()}`;
      }

    // Fallbacks for MEN/WOMEN where we only have a type or occasion
    if (activeType) {
      return `${activeCategory} > ${activeType.toUpperCase()}`;
    }
    if (activeOccasion) {
      return `${activeCategory} > ${activeOccasion.toUpperCase()}`;
    }
    return activeCategory ? activeCategory.toUpperCase() : activeCategory;
  };

  return (
    <main>
      <section id="collection" className="collection-section">
        <div className="container">
          <h1 className="section-title">Our <span className="highlight">Collection</span></h1>
          <hr className="divider" />

          <div className={`category-buttons ${openDropdown ? 'dropdown-open' : ''}`}>
            {/* MEN */}
            <div className={`category-button-container ${openDropdown === 'MEN' ? 'open' : ''}`}>
              <button onClick={() => {
                handleCategoryClick('MEN');
                setOpenDropdown(null);
                // Scroll to collection title
                setTimeout(() => {
                  const title = document.querySelector('.collection-title');
                  if (title) {
                    const y = title.getBoundingClientRect().top + window.pageYOffset - 24;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 60);
              }} className="category-button">
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
            <div className={`category-button-container ${openDropdown === 'WOMEN' ? 'open' : ''}`}>
              <button onClick={() => {
                handleCategoryClick('WOMEN');
                setOpenDropdown(null);
                setTimeout(() => {
                  const title = document.querySelector('.collection-title');
                  if (title) {
                    const y = title.getBoundingClientRect().top + window.pageYOffset - 24;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 60);
              }} className="category-button">
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
            <div className={`category-button-container ${openDropdown === 'CHILDREN' ? 'open' : ''}`}>
              <button onClick={() => {
                handleCategoryClick('CHILDREN');
                setOpenDropdown(null);
                setTimeout(() => {
                  const title = document.querySelector('.collection-title');
                  if (title) {
                    const y = title.getBoundingClientRect().top + window.pageYOffset - 24;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 60);
              }} className="category-button">
                <Image src="/images/2195_89.svg" alt="Children category background glow" className="btn-glow" width={252} height={50} />
                <div className="btn-bg"></div>
                <span className="btn-text">CHILDREN</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-column">
                  <h4>BOYS COLLECTION</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'SUIT', 'BOYS'); }}>SUIT</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'KOTI', 'BOYS'); }}>KOTI</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'SHIRT-PENT', 'BOYS'); }}>SHIRT-PENT</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'DHOTI', 'BOYS'); }}>DHOTI</a></li>
                  </ul>
                </div>
                <div className="dropdown-column">
                  <h4>GIRLS COLLECTION</h4>
                  <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'FROCK', 'GIRLS'); }}>FROCK</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'LEHENGA', 'GIRLS'); }}>LEHENGA</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'GOWN', 'GIRLS'); }}>GOWN</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleTypeClick('CHILDREN', 'SAREE', 'GIRLS'); }}>SAREE</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="collection-content">
            <p className="breadcrumbs">{getBreadcrumbs()}</p>
            <h2 className="collection-title">Royal Collection</h2>
            <p className="collection-subtitle">Explore our finest selection.</p>

            {/* View Toggle Buttons */}
            <div className="view-toggle-container">
              <button 
                className={`view-toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
                onClick={() => setViewMode('single')}
                title="Single column view"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="10" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="17" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <div className={`product-grid ${viewMode === 'single' ? 'single-column' : 'grid-view'}`}>
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
    {/* Global WhatsApp button is provided in app/layout.js */}
      <ProductModal product={selectedProduct} onClose={handleCloseModal} />
    </main>
  );
}
