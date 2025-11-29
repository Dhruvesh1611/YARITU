import React from 'react';

export default function SkeletonLoader({ variant = 'video', style = {} }) {
  const base = {
    background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.2s linear infinite',
    borderRadius: 8,
  };

  const videoStyle = {
    width: '220px',
    height: '140px',
    ...base,
    ...style,
  };

  const smallStyle = {
    width: '120px',
    height: '80px',
    ...base,
    ...style,
  };

  return (
    <div
      style={variant === 'video' ? videoStyle : smallStyle}
      aria-busy="true"
      aria-label="loading"
    />
  );
}

// add keyframes via a small style tag so consumers don't need global CSS
if (typeof document !== 'undefined') {
  const id = 'skeleton-shimmer-styles';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `@keyframes shimmer { 0% { background-position: -400px 0 } 100% { background-position: 400px 0 } }`;
    document.head.appendChild(style);
  }
}
