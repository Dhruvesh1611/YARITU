'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../app/collection/collection.module.css';

export default function ProductCard({ product, isAdmin, onProductClick, onEdit, onDelete, showDescription = true }) {
    const [currentImage, setCurrentImage] = useState(product.thumbnail || product.mainImage || product.image);

    useEffect(() => {
        if (product.mainImage2) {
            const interval = setInterval(() => {
                setCurrentImage(prev => {
                    const firstImage = product.mainImage || product.image;
                    return prev === firstImage ? product.mainImage2 : firstImage;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [product.mainImage, product.mainImage2, product.image]);

    // Ensure currentImage follows product prop updates (so edited images show immediately)
    useEffect(() => {
        const firstImage = product.thumbnail || product.mainImage || product.image || '';
        setCurrentImage(firstImage);
    }, [product.thumbnail, product.mainImage, product.image, product._id, product.id]);

    let imageUrl = null;
    if (typeof currentImage === 'string' && currentImage.length > 0) {
        imageUrl = currentImage;
    } else if (typeof currentImage === 'object' && currentImage?.url) {
        imageUrl = currentImage.url;
    }

    // For all images use the provided URL (S3 or remote). Do not perform
    // provider-specific transformations — uploads now go to S3 and remote
    // URLs should be used as-is.
    const displayUrl = imageUrl || null;
    const blurUrl = null;

    const isPending = !!product.isPending;
    const imagePending = !!product.imagePending;

    const title = product.title || product.name;
    // Support multiple possible description keys saved by different flows
    const description = product.description || product.desc || product.shortDescription || product.details || product.about || '';
    const allImages = [product.mainImage, product.mainImage2, ...(product.otherImages || [])].filter(Boolean);

    const wrapperRef = useRef(null);
    const rafRef = useRef(null);
    const supportsHover = useRef(true);

    // Listen for modal-close events so we can reset zoom if the modal closed
    useEffect(() => {
        function onModalClosed(e) {
            try {
                const closedId = e?.detail?.id;
                // If id is provided, only reset when it matches this product; otherwise always reset
                if (!closedId || closedId === (product._id || product.id)) {
                    handleMouseLeave();
                }
            } catch (err) {
                // ignore
            }
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('yaritu:modal-closed', onModalClosed);
        }
        return () => {
            if (typeof window !== 'undefined') window.removeEventListener('yaritu:modal-closed', onModalClosed);
        };
    }, [product._id, product.id]);

    useEffect(() => {
        // Detect if the device supports hover; disable the follow-cursor effect on touch devices
        if (typeof window !== 'undefined' && window.matchMedia) {
            supportsHover.current = window.matchMedia('(hover: hover)').matches;
        }
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const handleMouseMove = (e) => {
        if (!supportsHover.current) return;
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            wrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
            wrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
            wrapperRef.current.style.setProperty('--scale', '1.08');
        });
    };

    const handleMouseLeave = () => {
        if (!wrapperRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        wrapperRef.current.style.setProperty('--scale', '1');
        wrapperRef.current.style.setProperty('--ox', '50%');
        wrapperRef.current.style.setProperty('--oy', '50%');
    };

    const handleMouseEnter = (e) => {
        if (!supportsHover.current) return;
        if (!wrapperRef.current) return;
        // ensure we start with a slightly increased scale
        wrapperRef.current.style.setProperty('--scale', '1.06');
    };

    // Touch handlers: replicate the desktop hover/leave behaviour for touch devices
    const isTouchingRef = useRef(false);

    const handleTouchStart = (e) => {
        if (supportsHover.current) return;
        isTouchingRef.current = true;
        if (!wrapperRef.current) return;
        const touch = e.touches && e.touches[0];
        if (!touch) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            wrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
            wrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
            wrapperRef.current.style.setProperty('--scale', '1.08');
        });
    };

    const handleTouchMove = (e) => {
        if (supportsHover.current) return;
        if (!isTouchingRef.current) return;
        if (!wrapperRef.current) return;
        const touch = e.touches && e.touches[0];
        if (!touch) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            wrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
            wrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
            wrapperRef.current.style.setProperty('--scale', '1.08');
        });
    };

    const handleTouchEnd = () => {
        // Reset to default same as mouse leave
        isTouchingRef.current = false;
        handleMouseLeave();
    };

    // Pointer handlers to cover touch + mouse in one set of events (fixes DevTools emulation)
    const isPointerDownRef = useRef(false);

    const handlePointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isPointerDownRef.current = true;
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            wrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
            wrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
            wrapperRef.current.style.setProperty('--scale', '1.08');
        });
    };

    const handlePointerMove = (e) => {
        // On mobile (touch), only track movement while pointer is down
        if (e.pointerType === 'touch' && !isPointerDownRef.current) return;
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            wrapperRef.current.style.setProperty('--ox', `${Math.min(100, Math.max(0, x))}%`);
            wrapperRef.current.style.setProperty('--oy', `${Math.min(100, Math.max(0, y))}%`);
            wrapperRef.current.style.setProperty('--scale', '1.08');
        });
    };

    const handlePointerUp = () => {
        isPointerDownRef.current = false;
        handleMouseLeave();
    };

    const handlePointerLeave = () => {
        handleMouseLeave();
    };

    const openProduct = () => onProductClick && onProductClick({ ...product, image: imageUrl, name: title, images: allImages });

    return (
        <article className={styles['product-card']}>
            <div
                ref={wrapperRef}
                className={styles['product-image-wrapper']}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onClick={openProduct}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProduct(); } }}
                tabIndex={0}
                role="button"
                aria-label={title ? `Open ${title} details` : 'Open product details'}
            >
                {imageUrl ? (
                    <>
                        {/*
                          We use Next.js Image optimization for S3-hosted assets. Keep `loading="lazy"`
                          because product cards are generally below-the-fold. The surrounding
                          container defines an explicit aspect ratio and background color to
                          reserve layout space and avoid Cumulative Layout Shift (CLS) when
                          the remote S3 image loads.
                        */}
                        <div style={{ width: '100%', height: '100%', background: '#f3f4f6', position: 'relative' }}>
                            <Image
                                src={displayUrl || imageUrl}
                                alt={title || 'Collection item'}
                                className={styles['product-image']}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                placeholder={blurUrl ? 'blur' : undefined}
                                blurDataURL={blurUrl || undefined}
                                loading="lazy"
                            />
                        </div>
                        {imagePending && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.35)' }}>
                                <svg width="40" height="40" viewBox="0 0 50 50" style={{ display: 'block' }}>
                                    <circle cx="25" cy="25" r="20" stroke="#e6e6e6" strokeWidth="4" fill="none" />
                                    <path d="M45 25a20 20 0 0 1-20 20" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none">
                                        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                                    </path>
                                </svg>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles['image-placeholder']}>
                        {/* Placeholder for when there is no image */}
                    </div>
                )}
            </div>
            <div className={styles['card-info']}>
                <p className={styles['card-title']}>{title}</p>
                {/* Price display: show discountedPrice if present and lower than price, otherwise show price */}
                {/* Price display: show current price with 'rent' label and MRP underneath if present */}
                {(() => {
                    // Determine displayed prices
                    const hasDiscount = product.discountedPrice && Number(product.discountedPrice) > 0 && product.price && Number(product.discountedPrice) < Number(product.price);
                    const currentPrice = hasDiscount ? Number(product.discountedPrice) : (product.price ? Number(product.price) : null);

                    // If nothing to show but MRP exists, we'll still render the price container with MRP
                    const shouldRender = currentPrice !== null || product.mrp;
                    if (!shouldRender) return null;

                    return (
                        <div className={styles['price-container']}>
                            <span className={styles['rent-label']}>Rent :</span>
                            {currentPrice !== null ? (
                                <span className={styles['current-price']}>₹{currentPrice.toLocaleString()}</span>
                            ) : (
                                <span className={styles['current-price']}>—</span>
                            )}

                            {/* Original price intentionally hidden on grid; shown only in detailed modal */}

                            {product.mrp ? (
                                <span className={styles['mrp-inline']}>({formatMrp(product.mrp)} MRP)</span>
                            ) : null}
                        </div>
                    );
                })()}
                {showDescription && description ? <p className={styles['card-description']}>{description}</p> : null}
                {isAdmin && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                        <button onClick={() => onEdit(product)} style={{ padding: '6px 8px' }}>Edit</button>
                        <button onClick={() => onDelete(product)} style={{ padding: '6px 8px', background: '#b91c1c', color: '#fff', border: 'none' }}>Delete</button>
                    </div>
                )}
            </div>
        </article>
    );
}

// small helper to format MRP as '39.0K' when large, else show full rupee format
function formatMrp(value) {
    if (!value && value !== 0) return '';
    const n = Number(value);
    if (isNaN(n)) return value;
    if (Math.abs(n) >= 1000) {
        // show one decimal place in thousands (e.g., 39000 => 39.0K)
        const k = (n / 1000);
        return `${k.toFixed(1)}K`;
    }
    return `₹${n.toLocaleString()}`;
}

// No document-side effects: spinner uses inline SVG animation so server-rendering is safe.
