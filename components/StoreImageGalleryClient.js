"use client";
import React, { useEffect, useState } from 'react';

export default function StoreImageGalleryClient({ images = [], alt = 'Store image', className, style, intervalMs = 1000, eager = false }) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (validImages.length <= 1) return; // no rotation if single/empty
    setIdx(0);
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % validImages.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [validImages.length, intervalMs]);

  if (validImages.length === 0) {
    // No placeholder per requirement; render empty container with alt text available to ATs
    return <div className={className} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f6f6', color: '#666' }} aria-label={alt} role="img">{alt}</div>;
  }

  const current = validImages[Math.min(idx, validImages.length - 1)];

  // When source changes, mark not yet loaded to trigger fade-in
  useEffect(() => {
    setLoaded(false);
  }, [current]);

  if (!current) return null;

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      style={{ ...style, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 260ms ease', willChange: 'opacity, transform' }}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
    />
  );
}
