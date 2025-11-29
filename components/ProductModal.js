"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { WHATSAPP_NUMBER } from '../lib/siteConfig';
import { openWhatsAppWithMessage } from '../utils/whatsapp';
import './ProductModal.css'; // CSS file ko link rehne dein

const ProductModal = ({ product, onClose }) => {
  // --- FINAL, BULLETPROOF IMAGE HANDLING LOGIC ---
  let allImageUrls = [];

  // Sabse pehle check karein ki kya 'images' naam ka array hai
  if (Array.isArray(product?.images) && product.images.length > 0) {
    allImageUrls = product.images;
  } 
  // Agar 'images' array nahi hai, to alag-alag properties se gallery banayein
  else {
    allImageUrls = [
      product?.imageUrl || product?.image,
      product?.mainImage2Url,
      ...(Array.isArray(product?.otherImageUrls) ? product.otherImageUrls : [])
    ];
  }

  // Final gallery array, jismein se sabhi empty/null values hata di gayi hain
  const galleryImages = allImageUrls.filter(Boolean);
  
  // Agar koi bhi image nahi milti to ek fallback image use karein
  const finalGallery = galleryImages.length > 0 ? galleryImages : ['/placeholder.png'];

  const [activeImage, setActiveImage] = useState(finalGallery[0]);

  // Refs and RAF for cursor-follow zoom on the main image
  const mainWrapperRef = useRef(null);
  const rafRef = useRef(null);
  const supportsHover = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      supportsHover.current = window.matchMedia('(hover: hover)').matches;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMainMouseMove = (e) => {
    if (!supportsHover.current) return;
    if (!mainWrapperRef.current) return;
    const rect = mainWrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      mainWrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
      mainWrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
      // stronger magnification for fine detail inspection
      mainWrapperRef.current.style.setProperty('--scale', '3');
    });
  };

  const handleMainMouseLeave = () => {
    if (!mainWrapperRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    mainWrapperRef.current.style.setProperty('--scale', '1');
    mainWrapperRef.current.style.setProperty('--ox', '50%');
    mainWrapperRef.current.style.setProperty('--oy', '50%');
  };

  const handleMainMouseEnter = () => {
    if (!supportsHover.current || !mainWrapperRef.current) return;
    // initial hover scale before pointer movement
    mainWrapperRef.current.style.setProperty('--scale', '2.2');
  };

  // --- Mobile touch handlers: set transform-origin based on touch point ---
  const handleMainTouchPoint = (touch) => {
    if (!mainWrapperRef.current) return;
    const rect = mainWrapperRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      mainWrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
      mainWrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
      mainWrapperRef.current.style.setProperty('--scale', '2.6');
    });
  };

  const handleMainTouchStart = (e) => {
    // Only run touch handlers on non-hover devices
    if (supportsHover.current) return;
    if (!e.touches || e.touches.length === 0) return;
    handleMainTouchPoint(e.touches[0]);
  };

  const handleMainTouchMove = (e) => {
    if (supportsHover.current) return;
    if (!e.touches || e.touches.length === 0) return;
    // prevent the page from scrolling while the user is interacting with the image
    // but keep it natural: only when touch is on the image container
    e.preventDefault();
    handleMainTouchPoint(e.touches[0]);
  };

  const handleMainTouchEnd = () => {
    if (!mainWrapperRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Reset to default after finger lifted
    mainWrapperRef.current.style.setProperty('--scale', '1');
    mainWrapperRef.current.style.setProperty('--ox', '50%');
    mainWrapperRef.current.style.setProperty('--oy', '50%');
  };

  // Effect to set active image and lock body scroll
  useEffect(() => {
    setActiveImage(finalGallery[0]);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [product]); // Sirf product change hone par run hoga

  // Effect for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (finalGallery.length <= 1) return;

      const currentIndex = finalGallery.indexOf(activeImage);
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % finalGallery.length;
        setActiveImage(finalGallery[nextIndex]);
      }
      if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + finalGallery.length) % finalGallery.length;
        setActiveImage(finalGallery[prevIndex]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, finalGallery, onClose]);

  if (!product) return null;

  // Infer jewellery vs collection: jewellery items usually have a 'store' and no category/type/occasion
  const hasOccasion = Array.isArray(product?.occasion) ? product.occasion.length > 0 : Boolean(product?.occasion);
  const isJewellery = Boolean(product?.store) || (!product?.category && !product?.collectionType && !hasOccasion);
  const isAvailable = (product?.status || '').toString().toLowerCase() === 'available';

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="product-modal-content">
            <div className="image-gallery">
            <div
              className="main-image-container"
              ref={mainWrapperRef}
              onMouseMove={handleMainMouseMove}
              onMouseLeave={handleMainMouseLeave}
              onMouseEnter={handleMainMouseEnter}
              onTouchStart={handleMainTouchStart}
              onTouchMove={handleMainTouchMove}
              onTouchEnd={handleMainTouchEnd}
            >
              {activeImage && (
                <Image
                  key={activeImage}
                  src={activeImage}
                  alt={product.title || product.name || "Product Image"}
                  width={500}
                  height={600}
                  className="main-image"
                  unoptimized
                  onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                />
              )}
            </div>

            {/* Thumbnails ab tabhi dikhenge jab ek se zyada image ho */}
            {finalGallery.length > 1 && (
              <div className="thumbnail-container">
                {finalGallery.map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${imgUrl === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${index + 1}`} width={100} height={100} unoptimized loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            {/* ... Product details ka JSX waise hi rahega ... */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 className="product-title" style={{ margin: 20 }}>{product.title || product.name}</h1>
              {/* Status badge: show Available / Not available */}
              <div className={`product-status-badge ${isAvailable ? 'available' : 'unavailable'}`} style={{ fontSize: 14, padding: '6px 10px', borderRadius: 6, fontWeight: 700 }}>
                {isAvailable ? 'Available' : 'Out Of Stock'}
              </div>
            </div>
            {(product.collectionType || product.occasion || (!isJewellery && product.category)) && (
              <div className="product-meta">
                {!isJewellery && product.category && <span><strong>Category:</strong> {product.category}</span>}
                {product.collectionType && <span><strong>Type:</strong> {product.collectionType}</span>}
                {hasOccasion && (
                  <span>
                    <strong>Occasion:</strong>{' '}
                    {Array.isArray(product.occasion) ? product.occasion.join(', ') : product.occasion}
                  </span>
                )}
              </div>
            )}
            {/* Render description from any of several common fields so items saved with different keys still show */}
            {(() => {
              const desc = product.description || product.desc || product.shortDescription || product.details || product.about || '';
              return (
                <p className="product-description">{desc && desc.trim() ? desc : "Elegant and finely crafted attire..."}</p>
              );
            })()}
            <div className="price-container">
              {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.price ? (
                <>
                  <span className="current-price">₹{product.discountedPrice.toLocaleString()}</span>
                  <span className="original-price">₹{product.price.toLocaleString()}</span>
                </>
              ) : (
                // Only show the price when a positive price value exists. If price is undefined, null or 0, render nothing.
                product.price && Number(product.price) > 0 ? (
                  <span className="current-price">₹{Number(product.price).toLocaleString()}</span>
                ) : null
              )}
            </div>
            {/* Show MRP in the detailed modal view */}
            {product.mrp ? (
              <div className="mrp-modal">MRP: ₹{Number(product.mrp).toLocaleString()} {(() => {
                const n = Number(product.mrp);
                if (isNaN(n)) return '';
                if (Math.abs(n) >= 1000) return `(${(n/1000).toFixed(1)}K)`;
                return '';
              })()}</div>
            ) : null}
            <button className="rent-now-button" onClick={() => {
              // Build WhatsApp message without exposing internal product IDs
              const msg = `Hi, I'm interested in renting "${product.title || product.name}"` +
                `${product.collectionType ? ' - Type: ' + product.collectionType : ''}` +
                `${!isJewellery && product.category ? ' - Category: ' + product.category : ''}` +
                `${product.store ? ' - Store: ' + product.store : ''}`;
              openWhatsAppWithMessage({ phone: WHATSAPP_NUMBER, message: msg });
            }}>Rent Now</button>
            <button className="enquire-button" onClick={() => {
              // Build WhatsApp message without internal IDs
              const msg = `Hello, I have a question about "${product.title || product.name}"` +
                `${product.collectionType ? ' - Type: ' + product.collectionType : ''}` +
                `${!isJewellery && product.category ? ' - Category: ' + product.category : ''}` +
                `${product.store ? ' - Store: ' + product.store : ''}`;
              openWhatsAppWithMessage({ phone: WHATSAPP_NUMBER, message: msg });
            }}>Enquire on WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;